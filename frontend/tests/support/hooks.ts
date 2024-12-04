import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import BrowserManager from './browserManager';

BeforeAll(async () => {
    const browserManager = BrowserManager.getInstance();
    await browserManager.initializeBrowser();
  });
  
  AfterAll(async () => {
    const browserManager = BrowserManager.getInstance();
    await browserManager.closeBrowser();
  });