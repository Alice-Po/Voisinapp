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

When('I click on the button "Connexion"', async function() {
  const connexionButton = await this.page.waitForSelector('a[href="/login"]'); // Bouton "Connexion"
  await connexionButton.click();
});

When('I select "localhost:3000"', async function() {
  // Attends que l'élément "localhost:3000" soit rendu dans le DOM
  await this.page.waitForSelector('.MuiListItemText-root'); // Classe parent de l'élément

  // Recherche et clic sur l'élément avec le texte "localhost:3000"
  const success = await this.page.evaluate(() => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
      if (item.textContent.includes('localhost:3000')) {
        item.parentElement.click(); // Clic sur l'élément parent qui est le bouton
        return true;
      }
    }
    return false; // Aucun élément trouvé
  });

  if (!success) {
    throw new Error('Impossible de trouver et de sélectionner "localhost:3000"');
  }
});

When('I enter my username and password', async function() {
  await this.page.waitForSelector('#username'); // Champ utilisateur
  await this.page.type('#username', registredUser.username);

  await this.page.waitForSelector('#password'); // Champ mot de passe
  await this.page.type('#password', registredUser.password);
});

When('I click on the button "Se connecter"', async function() {
  const loginButton = await this.page.waitForSelector('button[type="submit"]');
  await loginButton.click()
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' }) // Attente que la navigation soit terminée
});

