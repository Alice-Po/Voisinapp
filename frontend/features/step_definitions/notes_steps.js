import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import users from '../fixtures/users.json' assert { type: 'json' };
import path from 'path';
import { fileURLToPath } from 'url';
import MockDate from 'mockdate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Given('I am logged in as {string}', async function(userType) {
  const user = users[userType];
  if (!user) {
    throw new Error(`User type "${userType}" not found in fixtures`);
  }

  await this.page.goto('http://localhost:4004');
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();

  await this.page.waitForSelector('.MuiListItemText-root');
  await this.page.evaluate(() => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
      if (item.textContent.includes('localhost:3000')) {
        item.parentElement.click();
        return true;
      }
    }
  });

  await this.page.waitForSelector('#username');
  await this.page.type('#username', user.username);
  await this.page.waitForSelector('#password');
  await this.page.type('#password', user.password);

  const submitButton = await this.page.waitForSelector('button[type="submit"]');
  await submitButton.click();

  await this.page.waitForSelector('[data-testid="post-block"]', { timeout: 30000 });
});

When('I submit the note', async function() {
  const sendButton = await this.page.waitForSelector('button[type="submit"]');
  await sendButton.click();
});

When('I fill in {string} with {string}', async function(field, value) {
  if (field === 'Content') {
    await this.page.waitForSelector('textarea[name="content"]');
    if (!this.testTimestamp) {
      this.testTimestamp = new Date().toISOString();
    }
    const messageWithTimestamp = `${value} [${this.testTimestamp}]`;
    await this.page.type('textarea[name="content"]', messageWithTimestamp);
  }
});

When('I attach the file {string}', async function(filename) {
  const uploadButton = await this.page.waitForSelector('input[type="file"]');
  const imagePath = path.resolve(__dirname, `../assets/${filename}`);
  
  await uploadButton.uploadFile(imagePath);
  await this.page.waitForSelector('img[alt="Preview"]', { timeout: 10000 });
});

When('I choose an expiration date a week later', async function() {
  await this.page.waitForSelector('#endTime');
  const today = new Date();
  const futureDate = new Date(today); 
  futureDate.setDate(today.getDate() + 7);

  const formattedDate = futureDate.toISOString().slice(0, 16);

  await this.page.evaluate((selector, value) => {
    const input = document.querySelector(selector);
    // Trick to make it work with React
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true })); 
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, '#endTime', formattedDate);

  const inputValue = await this.page.$eval('#endTime', el => el.value);

  if (!inputValue) {
    throw new Error(`The end time field is empty`);
  }
});


When('the date is one week and one second later', async function() {
  const currentDate = new Date();
  
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  futureDate.setSeconds(currentDate.getSeconds() + 1);
  
  MockDate.set(futureDate);
  
  await this.page.reload();
  
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
});

Then('I should see {string}', async function(message) {
  if (message === 'Note sent successfully') {
    await this.page.waitForSelector('.MuiSnackbar-root', {
      timeout: 10000
    });
    
    const snackbarText = await this.page.evaluate(() => {
      const snackbar = document.querySelector('.MuiSnackbar-root');
      return snackbar ? snackbar.textContent : '';
    });

    expect(snackbarText).to.satisfy((text) => 
      text.includes('Votre message a été envoyé') || 
      text.includes('Note sent successfully')
    );
  }
});

Then('I should see my note {string} in the feed', async function(content) {
  
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await this.page.reload();
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="outbox-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        const notes = feed.querySelectorAll('[data-testid="noteContent"]');
        const noteTexts = Array.from(notes).map(note => note.textContent);
        return noteTexts.includes(expectedText);
      },
      { timeout: 30000 },
      messageWithTimestamp
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="outbox-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log("Final content : ", finalContent)
    throw error;
  }
});

Then('I should see my note {string} with the image in the feed', async function(content) {
  
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await this.page.reload();
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="outbox-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        const notes = feed.querySelectorAll('[data-testid="noteContent"]');
        const noteWithImage = Array.from(notes).find(note => {
          const hasText = note.textContent.includes(expectedText);
          const parentBlock = note.closest('[data-testid="activity-block"]');
          const hasImage = parentBlock && parentBlock.querySelector('[data-testid="note-image"]');
          return hasText && hasImage;
        });
        return !!noteWithImage;
      },
      { timeout: 30000 },
      messageWithTimestamp
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="outbox-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      const images = feed.querySelectorAll('[data-testid="note-image"]');
      return {
        texts: Array.from(notes).map(note => note.textContent),
        hasImages: images.length > 0
      };
    });
    console.log("Final content : ", finalContent)
    throw error;
  }
});

Then('I should see my note with expiration date in the feed', async function() {
  await this.page.waitForFunction(() => {
    const snackbar = document.querySelector('.MuiSnackbar-root');
    return !snackbar || !snackbar.textContent.includes('Votre message a été envoyé');
  }, { timeout: 5000 });
  
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  await this.page.reload();
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  await this.page.waitForFunction(() => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return notes.length > 0;
  }, { timeout: 30000 });
  
  const noteFound = await this.page.evaluate((timestamp) => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    const notesList = Array.from(notes).map(note => note.textContent);
    console.log('Notes trouvées:', notesList);
    
    const targetNote = Array.from(notes).find(note => note.textContent.includes(timestamp));
    if (!targetNote) return null;
    
    const noteBlock = targetNote.closest('[data-testid="activity-block"]');
    const expirationDate = noteBlock.querySelector('[data-testid="expiration-date"]');
    
    return {
      found: true,
      hasExpiration: !!expirationDate,
      expirationText: expirationDate ? expirationDate.textContent : null,
      noteContent: targetNote.textContent
    };
  }, this.testTimestamp);
  
  if (!noteFound) {
    const allNotes = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="outbox-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log('Timestamp recherché:', this.testTimestamp);
    console.log('Toutes les notes disponibles:', allNotes);
    throw new Error(`Note avec timestamp ${this.testTimestamp} non trouvée dans le feed`);
  }
  
  expect(noteFound.hasExpiration).to.be.true;
});

Then('I should see the note {string} in my feed', async function(content) {
  await this.page.waitForSelector('[data-testid="inbox-feed"]', { timeout: 30000 });
  
  const noteExists = await this.page.evaluate((expectedContent) => {
    const feed = document.querySelector('[data-testid="inbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(notes).some(note => note.textContent.includes(expectedContent));
  }, content);
  
  expect(noteExists).to.be.true;
});

Then('I should see {string} as the note location', async function(location) {
  await this.page.waitForSelector('[data-testid="inbox-feed"]', { timeout: 30000 });
  
  const locationExists = await this.page.evaluate((expectedLocation) => {
    const feed = document.querySelector('[data-testid="inbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="activity-block"]');
    return Array.from(notes).some(note => note.textContent.includes(expectedLocation));
  }, location);
  
  expect(locationExists).to.be.true;
});

Then('I should not see the note {string} in the feed', async function(content) {
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  const noteExists = await this.page.evaluate((expectedContent) => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(notes).some(note => note.textContent.includes(expectedContent));
  }, content);
  
  expect(noteExists).to.be.false;
}); 