import { Given, When, Then } from '@cucumber/cucumber';
import { setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import { fileURLToPath } from 'url';
import users from '../fixtures/users.json' assert { type: 'json' };

// Fonction pour générer un nom d'utilisateur unique
function generateUniqueUsername(baseUsername) {
  const timestamp = new Date().getTime();
  return `${baseUsername}_${timestamp}`;
}

// Créer une copie modifiée de newUser avec un nom d'utilisateur unique
const newUser = {
  ...users.newUser,
  username: generateUniqueUsername('newuser'),
  email: `${generateUniqueUsername('newuser')}@test.com`
};

const registredUser = users.registredUser;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setDefaultTimeout(500000);

// Generic auth function
async function choosePodProvider(page, podproviderName) {
  await page.waitForSelector('.MuiListItemText-root'); 

  const success = await page.evaluate((podproviderName) => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
      if (item.textContent.includes(podproviderName)) {
          item.parentElement.click();
          return true;
      }
    }
    return false; 
  }, podproviderName);

  if (!success) {
      throw new Error(`Impossible de trouver et de sélectionner ${podproviderName}`);
  }
}

async function enterIdentifiers(page, username, password) {
  await page.waitForSelector('#username'); 
  await page.type('#username', username);

  await page.waitForSelector('#password'); 
  await page.type('#password', password);

  // Attendre que le bouton soit cliquable
  const submitButton = await page.waitForSelector('button[type="submit"]');
  await submitButton.click();
}

// Registration steps
Given('I am on the registration page', async function() {
  await this.page.goto('http://localhost:4004');
  const connexionButton = await this.page.waitForSelector('a[href="/login?signup"]');
  await connexionButton.click();
});

When('I select "localhost:3000"', async function() {
  await choosePodProvider(this.page, "localhost:3000");
});

When('I enter my unique identifier, my email and my password', async function() {
  await this.page.waitForSelector('#username');
  await this.page.type('#username', newUser.username);

  await this.page.waitForSelector('#email'); 
  await this.page.type('#email', newUser.email);

  await this.page.waitForSelector('#password'); 
  await this.page.type('#password', newUser.password);

  // Configurer un timeout plus long pour la navigation
  await this.page.setDefaultNavigationTimeout(60000);

  // Attendre que le bouton soit cliquable
  const submitButton = await this.page.waitForSelector('button[type="submit"]', {
    visible: true,
    timeout: 10000
  });

  // Créer une promesse pour la navigation
  const navigationPromise = this.page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Cliquer sur le bouton
  await submitButton.click();

  // Attendre la fin de la navigation
  await navigationPromise;
});

When('I should be able to create my profil with my pronoun, my bio, and a avatar', async function() {
  // Attendre que les champs soient visibles
  await this.page.waitForSelector('#vcard\\:given-name');
  await this.page.type('#vcard\\:given-name', newUser["vcard:given-name"]);

  await this.page.waitForSelector('#vcard\\:note');
  await this.page.type('#vcard\\:note', newUser["vcard:note"]);

  // Upload de l'image
  const imagePath = path.resolve(__dirname, `../assets/${newUser["vcard:photo"]}`);
  console.log('Chemin complet de l\'image:', imagePath);
  
  // Vérifier si le fichier existe
  const fs = await import('fs');
  if (fs.existsSync(imagePath)) {
    console.log('Le fichier existe');
  } else {
    console.log('Le fichier n\'existe pas');
  }

  const fileInput = await this.page.$('input[type="file"]');
  if (fileInput) {
    console.log('Input file trouvé');
  } else {
    console.log('Input file non trouvé');
  }

  await fileInput.uploadFile(imagePath);
  console.log('Upload terminé');

  // Soumettre le formulaire
  const submitButton = await this.page.waitForSelector('button[type="submit"]');
  await submitButton.click();
});

// Login steps
Given('I am on the login page', async function() {
  await this.page.goto('http://localhost:4004');
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();
});

Given(`I'm logged with a valid user and I'm on homepage`, async function() {
  await this.page.setDefaultNavigationTimeout(1000000);
  await this.page.goto('http://localhost:4004'); 
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();

  await choosePodProvider(this.page, "localhost:3000");
  await enterIdentifiers(this.page, registredUser.username, registredUser.password);

  const loginButton = await this.page.waitForSelector('button[type="submit"]');
  await loginButton.click();
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
});

When('I enter my username and password', async function() {
  // Configurer un timeout plus long pour la navigation
  await this.page.setDefaultNavigationTimeout(60000);

  // Entrer les identifiants et soumettre le formulaire
  await enterIdentifiers(this.page, registredUser.username, registredUser.password);

  // Attendre que la page soit chargée
  await this.page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: 60000
  });
});

// Authorization steps
Then('I am redirected of "Authorisation required" prompt', async function() {
  // Augmenter le timeout pour la vérification de redirection
  await this.page.waitForFunction(
    () => window.location.href.includes('initialize') || window.location.href.includes('authorize'),
    { timeout: 30000 }
  );
  
  const currentUrl = this.page.url();
  if (!currentUrl.includes('initialize') && !currentUrl.includes('authorize')) {
    throw new Error(`Redirection échouée. URL actuelle : ${currentUrl}`);
  }
});

Then('I click on the button "Accepter"', async function() {
  this.page.setDefaultNavigationTimeout(600000);
  try {
    await this.page.waitForSelector('button');

    const buttonClicked = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(btn => btn.textContent.trim().includes('Accepter'));
      
      if (button) {
        button.click();
        return true;
      }
      return false;
    });

    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });

  } catch (error) {
    console.error("Erreur lors de la recherche ou du clic sur le bouton :", error);
  }
});

Then('I should be redirected to my inbox', async function() {
  // Vérifier que nous sommes connectés en cherchant un élément qui n'existe que pour les utilisateurs connectés
  await this.page.waitForSelector('[data-testid="post-block"]', {
    timeout: 30000
  });

  // Vérifier l'URL
  const currentUrl = this.page.url();
  if (!currentUrl.includes('/inbox')) {
    throw new Error(`Redirection vers l'inbox échouée. URL actuelle : ${currentUrl}`);
  }

  // Vérifier que la page inbox est chargée
  await this.page.waitForSelector('[data-testid="inbox-page"]', {
    timeout: 30000
  });
}); 