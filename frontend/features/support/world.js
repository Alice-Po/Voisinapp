import { setWorldConstructor, World } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';

class CustomWorld extends World {
  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: ['--window-size=1920,1080']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld); 