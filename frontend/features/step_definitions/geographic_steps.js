import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('I have a location defined in my profile', async function() {
  try {
    await this.page.goto('http://localhost:4004/home');
    
    await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
    await this.page.waitForSelector('[data-testid="profile-card"]', { timeout: 30000 });
    
    await this.page.waitForFunction(() => {
      const loadingElement = document.querySelector('[data-testid="profile-loading"]');
      return !loadingElement;
    });

    const locationExists = await this.page.evaluate(() => {
      const locationElement = document.querySelector('[data-testid="profile-location"]');
      return locationElement && locationElement.textContent.length > 0;
    });

    if (!locationExists) {
      const pageContent = await this.page.evaluate(() => document.body.innerHTML);
      console.log('Page content:', pageContent);
      throw new Error('Location is not defined in profile');
    }

    console.log('Location found in profile');
  } catch (error) {
    console.error('Error checking location:', error);
    await this.page.screenshot({ path: 'error-screenshot.png' });
    throw new Error('Failed to verify location in profile: ' + error.message);
  }
});

When('I set the broadcast radius to {int} kilometers', async function(radius) {
  await this.page.waitForSelector('[data-testid="post-block"]', { timeout: 30000 });
  
  await this.page.waitForSelector('[data-testid="radius-input"]', { timeout: 30000 });
  
  await this.page.evaluate((newRadius) => {
    const input = document.querySelector('[data-testid="radius-input"]');
    if (input) {
      input.value = newRadius.toString();
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, radius);

  const value = await this.page.evaluate(() => {
    const input = document.querySelector('[data-testid="radius-input"]');
    return input ? input.value : null;
  });

  const actualValue = String(value).trim();
  const expectedValue = String(radius).trim();
  
  if (actualValue !== expectedValue) {
    throw new Error(`Failed to set radius: expected ${expectedValue}, got ${actualValue}`);
  }
});

Then('I should see my note {string} with the name of my city and a radius at {int} kilometers', async function(content, radius) {
  await this.page.goto('http://localhost:4004/home');
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await this.page.waitForFunction(
      (expectedText, expectedRadius) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        
        const notes = Array.from(feed.children);
        
        return notes.some(note => {
          const content = note.querySelector('[data-testid="noteContent"]');
          const hasText = content && content.textContent.includes(expectedText);
          
          const locationText = Array.from(note.querySelectorAll('p, span'))
            .map(el => el.textContent)
            .find(text => text && text.includes('km'));
          
          const hasLocation = locationText && locationText.includes(`${expectedRadius} km`);
          
          return hasText && hasLocation;
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
        locations: Array.from(feed.querySelectorAll('p, span'))
          .map(el => el.textContent)
          .filter(text => text && text.includes('km'))
      };
    });
    throw error;
  }
});

Then('I should see {string} from {string} in my feed', async function(content, username) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  try {
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        
        const notes = Array.from(feed.querySelectorAll('[data-testid="noteContent"]'));
        const found = notes.some(note => note.textContent.includes(expectedText));
        
        
        return found;
      },
      { timeout: 30000 },
      content
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent),
        authors: Array.from(feed.querySelectorAll('[data-testid="note-author"]')).map(a => a.textContent)
      };
    });
    throw error;
  }
});

Then('I should cannot see {string} from {string} in my feed', async function(content, username) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const noteExists = await this.page.evaluate(
    (expectedText) => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      if (!feed) {
        console.log('Feed not found');
        return false;
      }
      
      const notes = Array.from(feed.querySelectorAll('[data-testid="noteContent"]'));
      const found = notes.some(note => note.textContent.includes(expectedText));
      

      
      return found;
    },
    content
  );
  
  if (noteExists) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent),
        authors: Array.from(feed.querySelectorAll('[data-testid="note-author"]')).map(a => a.textContent)
      };
    });
    console.log("Notes found when they should not be visible:", finalContent);
  }
  
  expect(noteExists).to.be.false;
});

Then('I should see {string} from nearby in my feed', async function(content) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  try {
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="unified-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        
        const notes = Array.from(feed.querySelectorAll('[data-testid="noteContent"]'));
        const found = notes.some(note => note.textContent.includes(expectedText));
        
        
        return found;
      },
      { timeout: 30000 },
      content
    );
  } catch (error) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent),
        locations: Array.from(feed.querySelectorAll('p, span'))
          .map(el => el.textContent)
          .filter(text => text && text.includes('km'))
      };
    });
    console.log("Final content for nearby note:", finalContent);
    throw error;
  }
});

Then('I should cannot see {string} from far in my feed', async function(content) {
  await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const noteExists = await this.page.evaluate(
    (expectedText) => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      if (!feed) {
        console.log('Feed not found');
        return false;
      }
      
      const notes = Array.from(feed.querySelectorAll('[data-testid="noteContent"]'));
      const found = notes.some(note => note.textContent.includes(expectedText));
      
      return found;
    },
    content
  );
  
  if (noteExists) {
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      return {
        notes: Array.from(feed.querySelectorAll('[data-testid="noteContent"]')).map(n => n.textContent)
      };
    });
    console.log("Notes found when they should not be visible:", finalContent);
  }
  
  expect(noteExists).to.be.false;
});
