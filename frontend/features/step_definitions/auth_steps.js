import { Given, When, Then } from '@cucumber/cucumber';
import { setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import { fileURLToPath } from 'url';
import users from '../fixtures/users.json' assert { type: 'json' };

const newUser = users.newUser;
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
      throw new Error('Impossible de trouver et de sélectionner `${podproviderName}`');
  }
}

async function enterIdentifiers(page, username, password) {
  await page.waitForSelector('#username'); 
  await page.type('#username', username);

  await page.waitForSelector('#password'); 
  await page.type('#password', password);
}

// ACCOUNT CREATION

When('I click on the sign up button', async function() {
    const connexionButton = await this.page.waitForSelector('a[href="/login?signup"]');
    await connexionButton.click();
  });

When('I select "localhost:3000"', async function() {
  await choosePodProvider(this.page, "localhost:3000")
});


When('I enter my unique identifier, my email and my password', async function() {
  await this.page.waitForSelector('#username');
  await this.page.type('#username', newUser.username);

  await this.page.waitForSelector('#email'); 
  await this.page.type('#email', newUser.email);

  await this.page.waitForSelector('#password'); 
  await this.page.type('#password', newUser.password);
});

When('I should be able to create my profil with my pronoun, my bio, and a avatar', async function() {
  await this.page.waitForSelector('#vcard\\:given-name');
  await this.page.type('#vcard\\:given-name', newUser["vcard:given-name"]);

  await this.page.waitForSelector('#vcard\\:note');
  await this.page.type('#vcard\\:note', newUser["vcard:note"]);

  const imagePath = path.resolve(__dirname, `../assets/${newUser["vcard:photo"]}`);
  const fileInput = await this.page.$('input[type="file"]');
  await fileInput.uploadFile(imagePath);
});

Then('I am redirected of "Authorisation required" prompt', async function() {
    if (!this.page.url().includes('/authorize')) {
       throw new Error(`Redirection échouée. URL actuelle : ${this.page.url()}`);
     }
   })

Then('I click on the button "Accepter"', async function() {
  page.setDefaultNavigationTimeout(600000)
  try {
    await this.page.waitForSelector('button'); // Attendre que des boutons soient présents sur la page

    // Rechercher et cliquer sur le bouton contenant "Accepter"
    const buttonClicked = await this.page.evaluate(() => {
      // Trouver tous les boutons sur la page
      const buttons = Array.from(document.querySelectorAll('button'));
      console.log("buttons", buttons)
      
      // Trouver le bouton avec le texte "Accepter"
      const button = buttons.find(btn => btn.textContent.trim().includes('Accepter'));
      console.log("button", button)

      if (button) {
        button.click(); // Clique sur le bouton
        console.log("ndiquer que le clic a réussi")
        return true; // Indiquer que le clic a réussi
      }
      console.log("Si aucun bouton trouvé")
      return false; // Si aucun bouton trouvé
    });

    await this.page.waitForNavigation({ waitUntil: 'networkidle0' })

  } catch (error) {
    console.error("Erreur lors de la recherche ou du clic sur le bouton :", error);
  }
})

// LOGIN
// Could be cool to create a login function
Given(`I'm logged with a valid user and I'm on homepage`, async function() {
  await this.page.setDefaultNavigationTimeout(1000000);
  await this.page.goto('http://localhost:4004'); 
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();

  await choosePodProvider(this.page, "localhost:3000")

  await enterIdentifiers(this.page, registredUser.username, registredUser.password)

  const loginButton = await this.page.waitForSelector('button[type="submit"]');
  await loginButton.click()
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' })
  // if (!this.page.url().includes('/inbox')) {
  //   throw new Error(`Redirection échouée. URL actuelle : ${this.page.url()}`);
  // }
});

When('I click on the button "Connexion"', async function() {
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();

});

When('I enter my username and password', async function() {
  await enterIdentifiers(this.page, registredUser.username, registredUser.password)
});



// When('I click on the button "Se connecter"', async function() {
//   const loginButton = await this.page.waitForSelector('button[type="submit"]');
//   await loginButton.click()
//   await this.page.waitForNavigation({ waitUntil: 'networkidle0' }) 
// });

