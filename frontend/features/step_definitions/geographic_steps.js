import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('I have a location defined in my profile', async function() {
  // La location est déjà définie dans les fixtures
  await this.page.waitForTimeout(1000); // Attendre que le profil soit chargé
});

Given('I am on the note creation page', async function() {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="post-block"]');
});

When('I set the broadcast radius to {int} kilometers', async function(radius) {
  await this.page.waitForSelector('[data-testid="radius-input"]');
  const input = await this.page.$('[data-testid="radius-input"]');
  await input.click();
  await input.focus();
  await input.type(radius.toString());
});

Then('I should see my note {string} with the name of my city and a default radius at {int} kilometers', async function(content, radius) {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await this.page.waitForFunction(
      (expectedText, expectedRadius) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) return false;
        
        const notes = feed.querySelectorAll('[data-testid="activity-block"]');
        return Array.from(notes).some(note => {
          const hasText = note.querySelector('[data-testid="noteContent"]')?.textContent.includes(expectedText);
          const hasCity = note.querySelector('[data-testid="note-city"]')?.textContent.length > 0;
          const radiusText = note.querySelector('[data-testid="note-radius"]')?.textContent;
          const hasRadius = radiusText && radiusText.includes(`${expectedRadius} km`);
          return hasText && hasCity && hasRadius;
        });
      },
      { timeout: 30000 },
      messageWithTimestamp,
      radius
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent),
        cities: Array.from(feed.querySelectorAll('[data-testid="note-city"]')).map(c => c.textContent),
        radiuses: Array.from(feed.querySelectorAll('[data-testid="note-radius"]')).map(r => r.textContent)
      };
    });
    console.log("Final content:", finalContent);
    throw error;
  }
});

Then('I should see my note {string} with the name of my city and the custom radius', async function(content) {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) return false;
        
        const notes = feed.querySelectorAll('[data-testid="activity-block"]');
        return Array.from(notes).some(note => {
          const hasText = note.querySelector('[data-testid="noteContent"]')?.textContent.includes(expectedText);
          const hasCity = note.querySelector('[data-testid="note-city"]')?.textContent.length > 0;
          const hasRadius = note.querySelector('[data-testid="note-radius"]')?.textContent.includes('km');
          return hasText && hasCity && hasRadius;
        });
      },
      { timeout: 30000 },
      messageWithTimestamp
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent),
        cities: Array.from(feed.querySelectorAll('[data-testid="note-city"]')).map(c => c.textContent),
        radiuses: Array.from(feed.querySelectorAll('[data-testid="note-radius"]')).map(r => r.textContent)
      };
    });
    console.log("Final content:", finalContent);
    throw error;
  }
});

Then('I should see {string} from {string} in my feed', async function(content, username) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  try {
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) return false;
        
        const notes = feed.querySelectorAll('[data-testid="noteContent"]');
        return Array.from(notes).some(note => note.textContent.includes(expectedText));
      },
      { timeout: 30000 },
      content
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent);
    });
    console.log("Final content:", finalContent);
    throw error;
  }
});

Then('I should cannot see {string} from {string} in my feed', async function(content, username) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const noteExists = await this.page.evaluate(
    (expectedText) => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      if (!feed) return false;
      
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).some(note => note.textContent.includes(expectedText));
    },
    content
  );
  
  expect(noteExists).to.be.false;
});
