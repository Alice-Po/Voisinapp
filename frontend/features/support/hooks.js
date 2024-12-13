import { Before, After } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';

let browser;
let page;

/*
before all with persona
reset database
*/

Before(async function()  {
 browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
    ],
  });
  page = await browser.newPage();
  page.setDefaultNavigationTimeout(400000); // Timeout navigation augmenté à 120 secondes
  this.page = page;
});

// After(async function() => {
//   await browser.close();
// });
