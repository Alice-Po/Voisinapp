import { Before, Given, When, Then } from '@cucumber/cucumber';
import { Page } from 'playwright';
import { expect } from '@playwright/test';
import users from '../fixtures/users.json';
import {loginUser, checkAuthentificationCookie, fillForm, clickOnButton } from './../support/utilities';
import BrowserManager from '../support/browserManager';
import path from 'path';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(20000); 

let currentPage;

// Basculer dans hook en le rattachant avec des tags
Before(function() {
    currentPage = BrowserManager.getInstance().getPage();
    console.log("this", this)
    this.page = currentPage;
  });

When('I post a message with text {string} and an image {string}', async function(message, imageName) {
  await this.page.getByRole('textarea', { name: "content" }).fill(message)
  // console.log("contentAreaField", contentAreaField)
  // await contentAreaField.waitFor()
  // await contentAreaField.fill(message)
  // await this.page.waitForSelector('textarea[name="content"]');
  // await this.page.type('textarea[name="content"]', message);

  const imagePath = path.resolve(__dirname, `../assets/${imageName}`); 
  const fileInput = await this.page.getByTestId('InsertPhotoIcon');
  await fileInput.locator.setInputFiles()

  const submitButton = await this.page.getByRole('button', { name: "submit" }).click();
  await submitButton.click();

  await this.page.waitForFunction(
    async () => {
      
      const button = await this.page.getByRole('button', { name: "submit" })
      console.log("button", button)
      // return button //&& !button.disabled; // Vérifie que le bouton est réactivé
    },
    { timeout: 10000 } // Augmente le délai d'attente si nécessaire
  );
});

Then('the message {string} with the image should appear in my feed', async function (message) {
  // Va sur la page des messages (outbox)
  await this.page.goto('http://localhost:4004/outbox');
  await this.page.waitForLoadState('networkidle');

  // Vérifie que le message texte est présent
  const messageElement = this.page.getByText(message, { exact: true });
  await expect(messageElement).toBeVisible();

  const imageLocator = this.page.locator('img');
  await expect(imageLocator).toBeVisible();
});
  
  