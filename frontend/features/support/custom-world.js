import { World } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';

class CustomWorld extends World {
  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async cleanup() {
    await this.browser?.close();
  }
}

export default CustomWorld; 