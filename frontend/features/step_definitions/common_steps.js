import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import users from '../fixtures/users.json' assert { type: 'json' };

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

When('I fill in {string} with {string}', async function(field, value) {
  if (field === 'Content') {
    await this.page.waitForSelector('[data-testid="message-input"]');
    if (!this.testTimestamp) {
      this.testTimestamp = new Date().toISOString();
    }
    const messageWithTimestamp = `${value} [${this.testTimestamp}]`;
    
    const input = await this.page.$('[data-testid="message-input"]');
    await input.click();
    await input.focus();
    await input.type(messageWithTimestamp);
  }
});

When('I submit the note', async function() {
  const sendButton = await this.page.waitForSelector('button[type="submit"]');
  await sendButton.click();
});

Then('I should see {string}', async function(message) {
  if (message === 'Note sent successfully') {
    try {
      await this.page.waitForFunction(
        (expectedText) => {
          const elements = document.querySelectorAll('*');
          return Array.from(elements).some(el => 
            el.textContent.includes('Votre message a été envoyé') || 
            el.textContent.includes('Note sent successfully')
          );
        },
        { timeout: 30000 }
      );
    } catch (error) {
      console.error('Erreur lors de la recherche du message de succès:', error);
      throw error;
    }
  }
});

Then('I should see my note {string} in the feed', async function(content) {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
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
      const feed = document.querySelector('[data-testid="unified-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log("Final content : ", finalContent)
    throw error;
  }
});

Then('I should not see the note {string} in the feed', async function(content) {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const noteExists = await this.page.evaluate(
    (expectedText) => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      if (!feed) return false;
      
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).some(note => note.textContent.includes(expectedText));
    },
    messageWithTimestamp
  );
  
  if (noteExists) {
    const allNotes = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log('Notes trouvées alors que la note ne devrait pas être visible:', allNotes);
  }
  
  expect(noteExists).to.be.false;
});

Given('I am on the homepage', async function() {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
}); 