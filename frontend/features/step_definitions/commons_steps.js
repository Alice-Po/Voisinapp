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

Given('I am on the homepage', async function() {
  await this.page.goto('http://localhost:4004'); // Page d'accueil de Mastopod
});

Then('I should be redirected to my inbox', async function() {
 // Vérifie que l'utilisateur est bien redirigé vers "/inbox"
 if (!this.page.url().includes('/inbox')) {
    throw new Error(`Redirection échouée. URL actuelle : ${this.page.url()}`);
  }
})