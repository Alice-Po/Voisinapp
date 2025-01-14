import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

When('I set the visibility radius to {string} kilometers', async function(radius) {
    await this.page.waitForSelector('#radius');
    
    await this.page.evaluate((selector, value) => {
      const input = document.querySelector(selector);
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true })); 
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, '#radius', radius);
  
    const inputValue = await this.page.$eval('#radius', el => el.value);
    if (!inputValue) {
      throw new Error(`The radius field is empty`);
    }
  });
  
  Then('my note should be visible to users within {int} kilometers', async function(radius) {
    const logs = await this.page.evaluate(() => {
      return console.logs;
    });
    console.log('Browser logs:', logs);
  
    await this.page.goto('http://localhost:4004/home');
    await this.page.waitForSelector('[data-testid="unified-feed"]', { timeout: 30000 });
    
    const noteWithRadius = await this.page.evaluate((expectedRadius) => {
      const feed = document.querySelector('[data-testid="unified-feed"]');
      const notes = feed.querySelectorAll('[data-testid="activity-block"]');
      for (const note of notes) {
        const radiusText = note.textContent.includes(`${expectedRadius} km`);
        if (radiusText) return true;
      }
      return false;
    }, radius);
    
    expect(noteWithRadius).to.be.true;
  });