import { Before, Given, When, Then } from '@cucumber/cucumber';
import { Page } from 'playwright';
import { expect } from '@playwright/test';
import users from '../fixtures/users.json';
import {loginUser, checkAuthentificationCookie, fillForm, clickOnButton } from './../support/utilities';
import BrowserManager from '../support/browserManager';
import path from 'path';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(20000); 

//NewUser should be changes for each test
const newUser = users.newUser;
const registredUser = users.registredUser;
let currentPage: Page;


Before(function() {
  currentPage = BrowserManager.getInstance().getPage();
  this.page = currentPage;
});

Given('I am logged in as a valid user', async function() {
  const userLogged =  checkAuthentificationCookie(this.page)
  if (!userLogged) {
    loginUser(this.page, registredUser.username, registredUser.password);
  }
});

Given('I am on the homepage', async function() {
  await this.page.goto('http://localhost:4004');
});

When('I select "localhost:3000"', async function () {
  const page: Page = BrowserManager.getInstance().getPage();
  await page.waitForSelector('.MuiListItemText-root')

   const success = await page.evaluate(() => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
        if (item.textContent && item.textContent.includes('localhost:3000')) {
          item.parentElement?.click();
          return true;
      }   
    }
    return false; 
  });

  if (!success) {
    throw new Error('Cannot find "localhost:3000"');
  }
});

When('I enter my username and password', async function() {
  console.log("registredUser ", registredUser)
  fillForm(this.page, { username: registredUser.username, password: registredUser.password })  
});

When('I enter my unique identifier, my email and my password', async function() {
  console.log("newUser ", newUser)
  await fillForm(this.page, { username: newUser.username, email: newUser.email, password: newUser.password })  
});

Then('I should be redirected to my inbox', async function () {
  // It doesn't look to work each time for a delay reason. How to improve ?
  await this.page.waitForURL("**/inbox");
  expect(this.page.url()).toContain('/inbox');
});

Then('I should be able to create my profil with my pronoun, my bio, and a avatar', async function() {
  await fillForm(this.page, { "vcard\\:given-name": newUser["vcard:given-name"], "vcard\\:note": newUser["vcard:note"]})  
  const imagePath = path.resolve(__dirname, `../assets/${newUser["vcard:photo"]}`); 
  const fileInput = await this.page.$('input[type="file"]');
  await fileInput.setInputFiles(imagePath);
});

Then('I am redirected of "Authorisation required" prompt', async function () {
  await this.page.waitForURL("**/authorize/**");
  setTimeout(() => {
    expect(this.page.url()).toContain('/authorize/');
  }, 20000);
});

// Do we make a generale fonction in common.step.ts ?
// Then('I am redirected of {string} prompt', async function (string) {
//   const baseUrl = 'http://localhost:5000/authorize';
//   const regex = new RegExp(baseUrl + '.*');
//   await this.page.goto(baseUrl);
//   await this.page.waitForURL(regex);  // Attendre que l'URL corresponde à l'expression régulière
// });

Then('And I click on the button "Accepter"', async function() {
  await clickOnButton(this.page, "Accepter")
});

Then('I am redirected to my single feed', async function () {
  await this.page.waitForURL('http://localhost:4004/inbox');
});

export default {};
