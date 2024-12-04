import { Given, When, Then } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';
import { setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import { fileURLToPath } from 'url';
import users from '../fixtures/users.json' assert { type: 'json' };

const newUser = users.newUser;
const registredUser = users.registredUser;

// Recréer __dirname dans un environnement ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setDefaultTimeout(30000); // Augmente le timeout global à 30 secondes

let browser, page;

When('je poste un message avec le texte {string} et une image {string}', async function(message, imageName) {
  // Remplit le champ texte
  await this.page.waitForSelector('textarea[name="content"]');
  await this.page.type('textarea[name="content"]', message);

  // Télécharge l'image
  const imagePath = path.resolve(__dirname, `../assets/${imageName}`); // Utilisation de __dirname recréé
  const fileInput = await this.page.$('input[type="file"]');
  await fileInput.uploadFile(imagePath);

  // Soumet le formulaire
  const submitButton = await this.page.waitForSelector('button[type="submit"]');
  await submitButton.click();

  // Vérifie que le bouton devient "disabled" puis redevient "enabled"
  await this.page.waitForFunction(
    () => {
      const button = document.querySelector('button[type="submit"]');
      return button && !button.disabled; // Vérifie que le bouton est réactivé
    },
    { timeout: 10000 } // Augmente le délai d'attente si nécessaire
  );
});

Then('le message {string} avec une image doit apparaître dans mon fil d\'actualité', async function (message) {
  // Va sur la page des messages (outbox)
  await this.page.goto('http://localhost:4004/outbox');
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); // Attente que la navigation soit terminée

  // Vérifie que le message texte est présent
  const messageExists = await this.page.evaluate((message) => {
    const elements = document.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(elements).some(el => el.textContent.trim() === message);
  }, message);

  if (!messageExists) {
    throw new Error(`Le message "${message}" n'est pas visible dans la liste des messages.`);
  }

  // Vérifie qu'au moins une image est présente
  const imageExists = await this.page.$('img');
  if (!imageExists) {
    throw new Error(`Aucune image n'est visible pour le message "${message}".`);
  }
// Ferme le navigateur
//   await browser.close();
});

