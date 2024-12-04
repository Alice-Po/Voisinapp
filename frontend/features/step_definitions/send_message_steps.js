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
  // Clique sur le bouton "Se connecter"
  const loginButton = await this.page.waitForSelector('button[type="submit"]');

  // Attente de la redirection vers l'URL finale après l'authentification
  await Promise.all([
    this.page.waitForNavigation({ waitUntil: 'networkidle0' }), // Attente que la navigation soit terminée
    loginButton.click() // Clic sur le bouton de connexion
  ]);

  // Vérifie que l'utilisateur est bien redirigé vers "/inbox"
  if (!this.page.url().includes('/inbox')) {
    throw new Error(`Redirection échouée. URL actuelle : ${this.page.url()}`);
  }
});

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

