import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import MockDate from 'mockdate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
});

Then('I should see my note {string} with the image in the feed', async function(content) {
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
      const feed = document.querySelector('[data-testid="unified-feed"]');
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
    
  await this.page.reload();
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  await this.page.waitForFunction(() => {
    const feed = document.querySelector('[data-testid="unified-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return notes.length > 0;
  }, { timeout: 30000 });
  
  const noteFound = await this.page.evaluate((timestamp) => {
    const feed = document.querySelector('[data-testid="unified-feed"]');
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
      const feed = document.querySelector('[data-testid="unified-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log('Timestamp recherché:', this.testTimestamp);
    console.log('Toutes les notes disponibles:', allNotes);
    throw new Error(`Note avec timestamp ${this.testTimestamp} non trouvée dans le feed`);
  }
  
  expect(noteFound.hasExpiration).to.be.true;
}); 