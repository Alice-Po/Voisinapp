import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import users from '../fixtures/users.json' assert { type: 'json' };
import path from 'path';
import { fileURLToPath } from 'url';
import MockDate from 'mockdate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Given('I am logged in as {string}', async function(userType) {
  const user = users[userType];
  if (!user) {
    throw new Error(`User type "${userType}" not found in fixtures`);
  }

  await this.page.goto('http://localhost:4004');
  const connexionButton = await this.page.waitForSelector('a[href="/login"]');
  await connexionButton.click();

  await this.page.waitForSelector('.MuiListItemText-root');
  await this.page.evaluate(() => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
      if (item.textContent.includes('localhost:3000')) {
        item.parentElement.click();
        return true;
      }
    }
  });

  await this.page.waitForSelector('#username');
  await this.page.type('#username', user.username);
  await this.page.waitForSelector('#password');
  await this.page.type('#password', user.password);

  const submitButton = await this.page.waitForSelector('button[type="submit"]');
  await submitButton.click();

  // Attendre que la redirection soit terminée
  await this.page.waitForSelector('[data-testid="post-block"]', { timeout: 30000 });
});

When('I click on {string}', async function(buttonText) {
  if (buttonText === 'New Note') {
    // Le bloc de création de note est déjà visible, pas besoin de cliquer
    await this.page.waitForSelector('[data-testid="post-block"]');
  } else if (buttonText === 'Send') {
    const sendButton = await this.page.waitForSelector('button[type="submit"]');
    await sendButton.click();
  }
});

When('I fill in {string} with {string}', async function(field, value) {
  if (field === 'Content') {
    await this.page.waitForSelector('textarea[name="content"]');
    // Ajouter un timestamp au message
    const timestamp = new Date().toISOString();
    this.testTimestamp = timestamp; // Sauvegarder le timestamp pour la vérification
    const messageWithTimestamp = `${value} [${timestamp}]`;
    await this.page.type('textarea[name="content"]', messageWithTimestamp);
  }
});

When('I attach the file {string} to {string}', async function(filename, fieldName) {
  // Attendre que le bouton d'upload soit visible
  const uploadButton = await this.page.waitForSelector('input[type="file"]');
  
  // Construire le chemin complet vers l'image
  const imagePath = path.resolve(__dirname, `../assets/${filename}`);
  
  // Upload du fichier
  await uploadButton.uploadFile(imagePath);
  
  // Attendre que l'aperçu de l'image soit visible
  await this.page.waitForSelector('img[alt="Preview"]', { timeout: 10000 });
});

When('I choose an expiration date a week later', async function() {
  await this.page.waitForSelector('#endTime');
  const today = new Date();
  const futureDate = new Date(today); 
  futureDate.setDate(today.getDate() + 7);

  const formattedDate = futureDate.toISOString().slice(0, 16);

  await this.page.evaluate((selector, value) => {
    const input = document.querySelector(selector);
    // Trick to make it work with React
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true })); 
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, '#endTime', formattedDate);

  const inputValue = await this.page.$eval('#endTime', el => el.value);

  if (!inputValue) {
    throw new Error(`The end time field is empty`);
  }
});

When('I set the expiration date to {string}', async function(dateString) {
  await this.page.waitForSelector('#endTime');
  
  await this.page.evaluate((selector, value) => {
    const input = document.querySelector(selector);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true })); 
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, '#endTime', dateString);

  const inputValue = await this.page.$eval('#endTime', el => el.value);
  if (!inputValue) {
    throw new Error(`The end time field is empty`);
  }
});

// When('the date is {string}', async function(dateString) {
//   MockDate.set(dateString);
//   await this.page.reload();
//   // Attendre que le feed soit rechargé
//   await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
// });

When('the date is one week and one second later', async function() {
  // Récupérer la date actuelle
  const currentDate = new Date();
  
  // Ajouter une semaine et une seconde
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  futureDate.setSeconds(currentDate.getSeconds() + 1);
  
  // Définir la nouvelle date avec MockDate
  MockDate.set(futureDate);
  
  // Recharger la page pour voir les changements
  await this.page.reload();
  
  // Attendre que le feed soit rechargé
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
});

Then('I should see {string}', async function(message) {
  if (message === 'Note sent successfully') {
    // Attendre le message de succès
    await this.page.waitForSelector('.MuiSnackbar-root', {
      timeout: 10000
    });
    
    const snackbarText = await this.page.evaluate(() => {
      const snackbar = document.querySelector('.MuiSnackbar-root');
      return snackbar ? snackbar.textContent : '';
    });
    
    expect(snackbarText).to.include('Votre message a été envoyé');
  }
});

Then('I should see my note {string} in the feed', async function(content) {
  console.log('Checking for note in outbox feed:', content);
  
  // Cliquer sur l'onglet outbox en utilisant le texte français
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  // Attendre que le feed soit visible
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  // Construire le message attendu avec le timestamp
  const messageWithTimestamp = `${content} [${this.testTimestamp}]`;
  console.log('Waiting for message:', messageWithTimestamp);
  
  // Vérifier le contenu actuel du feed
  const initialContent = await this.page.evaluate(() => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(notes).map(note => note.textContent);
  });
  console.log('Initial feed content:', initialContent);
  
  // Attendre que le message apparaisse dans le feed
  try {
    await this.page.reload();
    await this.page.waitForFunction(
      (expectedText) => {
        const feed = document.querySelector('[data-testid="outbox-feed"]');
        if (!feed) {
          console.log('Feed not found');
          return false;
        }
        const notes = feed.querySelectorAll('[data-testid="noteContent"]');
        const noteTexts = Array.from(notes).map(note => note.textContent);
        console.log('Current notes:', noteTexts);
        return noteTexts.includes(expectedText);
      },
      { timeout: 30000 },
      messageWithTimestamp
    );
  } catch (error) {
    // En cas d'échec, afficher le contenu final du feed
    const finalContent = await this.page.evaluate(() => {
      const feed = document.querySelector('[data-testid="outbox-feed"]');
      const notes = feed.querySelectorAll('[data-testid="noteContent"]');
      return Array.from(notes).map(note => note.textContent);
    });
    console.log('Final feed content:', finalContent);
    throw error;
  }
});

Then('I should see my note with the image in the feed', async function() {
  // Cliquer sur l'onglet outbox en utilisant le texte français
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  // Attendre que le feed soit visible
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  // Vérifier la présence de l'image dans le feed
  await this.page.waitForSelector('[data-testid="outbox-feed"] [data-testid="note-image"]', {
    timeout: 30000
  });
});

Then('I should see my note with expiration date in the feed', async function() {
  // Attendre que le message de succès disparaisse
  await this.page.waitForFunction(() => {
    const snackbar = document.querySelector('.MuiSnackbar-root');
    return !snackbar || !snackbar.textContent.includes('Votre message a été envoyé');
  }, { timeout: 5000 });
  
  // Cliquer sur l'onglet outbox en utilisant le texte français
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  // Attendre que le feed soit visible
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  // Log du contenu du feed pour débogage
  const feedContent = await this.page.evaluate(() => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    return feed.innerHTML;
  });
  console.log('Feed content:', feedContent);
  
  // Vérifier la présence de la date d'expiration dans le feed en cherchant le texte "Expires:"
  const hasExpirationDate = await this.page.evaluate(() => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    return feed.textContent.includes('Expires:');
  });
  
  expect(hasExpirationDate).to.be.true;
});

Then('I should not see my note in the feed', async function() {
  // Cliquer sur l'onglet outbox
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });

  // Attendre que le feed soit visible
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });

  // Vérifier que la note n'est plus présente
  const noteContent = await this.page.evaluate(() => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(notes).map(note => note.textContent);
  });

  const noteExists = noteContent.some(text => text.includes('Temporary note!'));
  expect(noteExists).to.be.false;

  // Reset MockDate
  MockDate.reset();
});

When('I set the visibility radius to {string} kilometers', async function(radius) {
  // Attendre que le champ de rayon soit visible
  await this.page.waitForSelector('#radius');
  
  // Remplir le champ de rayon
  await this.page.evaluate((selector, value) => {
    const input = document.querySelector(selector);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true })); 
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, '#radius', radius);

  // Vérifier que la valeur a bien été définie
  const inputValue = await this.page.$eval('#radius', el => el.value);
  if (!inputValue) {
    throw new Error(`The radius field is empty`);
  }
});

Then('my note should be visible to users within {int} kilometers', async function(radius) {
  // Récupérer les logs du navigateur
  const logs = await this.page.evaluate(() => {
    return console.logs;
  });
  console.log('Browser logs:', logs);

  // Cliquer sur l'onglet outbox
  await this.page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const outboxTab = tabs.find(tab => tab.textContent.includes('Boîte d\'envoi'));
    if (outboxTab) {
      outboxTab.click();
    } else {
      throw new Error('Onglet Mes publications non trouvé');
    }
  });
  
  // Attendre que le feed soit visible
  await this.page.waitForSelector('[data-testid="outbox-feed"]', { timeout: 30000 });
  
  // Vérifier que la note contient l'indicateur de rayon
  const noteWithRadius = await this.page.evaluate((expectedRadius) => {
    const feed = document.querySelector('[data-testid="outbox-feed"]');
    const notes = feed.querySelectorAll('[data-testid="activity-block"]');
    for (const note of notes) {

      const radiusText = note.textContent.includes(`${expectedRadius} km`);
      if (radiusText) return true;
    }
    return false;
  }, radius);
  
  expect(noteWithRadius).to.be.true;
}); 