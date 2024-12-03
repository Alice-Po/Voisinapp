// import { Before, Given, When, Then } from '@cucumber/cucumber';
// import { Page } from 'playwright';
// import { expect } from '@playwright/test';
// import users from '../fixtures/users.json';
// import {loginUser, checkAuthentificationCookie, fillForm, clickOnButton } from './../support/utilities';
// import BrowserManager from '../support/browserManager';
// import path from 'path';
// import { setDefaultTimeout } from '@cucumber/cucumber';

// When('je poste un message avec le texte {string} et une image {string}', async function(message, imageName) {
//     // Remplit le champ texte
//     await page.waitForSelector('textarea[name="content"]');
//     await page.type('textarea[name="content"]', message);
  
//     // Télécharge l'image
//     const imagePath = path.resolve(__dirname, `../assets/${imageName}`); // Utilisation de __dirname recréé
//     const fileInput = await page.$('input[type="file"]');
//     await fileInput.uploadFile(imagePath);
  
//     // Soumet le formulaire
//     const submitButton = await page.waitForSelector('button[type="submit"]');
//     await submitButton.click();
  
//     // Vérifie que le bouton devient "disabled" puis redevient "enabled"
//     await page.waitForFunction(
//       () => {
//         const button = document.querySelector('button[type="submit"]');
//         return button && !button.disabled; // Vérifie que le bouton est réactivé
//       },
//       { timeout: 10000 } // Augmente le délai d'attente si nécessaire
//     );
//   });
  
//   Then('le message {string} avec une image doit apparaître dans mon fil d\'actualité', async function (message) {
//     // Va sur la page des messages (outbox)
//     await page.goto('http://localhost:4004/outbox');
//     await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Attente que la navigation soit terminée
  
//     // Vérifie que le message texte est présent
//     const messageExists = await page.evaluate((message) => {
//       const elements = document.querySelectorAll('p.MuiTypography-root');
//       return Array.from(elements).some(el => el.textContent.trim() === message);
//     }, message);
  
//     if (!messageExists) {
//       throw new Error(`Le message "${message}" n'est pas visible dans la liste des messages.`);
//     }
  
//     // Vérifie qu'au moins une image est présente
//     const imageExists = await page.$('img');
//     if (!imageExists) {
//       throw new Error(`Aucune image n'est visible pour le message "${message}".`);
//     }
//   // Ferme le navigateur
//   //   await browser.close();
//   });
  
  