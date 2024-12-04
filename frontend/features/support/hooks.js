// import { Before, After } from '@cucumber/cucumber';
// import CustomWorld from './world.js';  // Importer le World personnalisé

// let world;

// Before(async function() {
//   world = new CustomWorld();
//   await world.init();  // Initialiser le navigateur et la page
//   this.world = world;  // Attacher le World à `this`
// });

// After(async function() {
//   await world.close();  // Fermer le navigateur après chaque scénario
// });

import { Before, After } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';

let browser;
let page;

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
  // Attachez la page à `this.page` pour qu'elle soit accessible dans vos steps
  this.page = page;
});

// After(async function() => {
//   await browser.close();
// });
