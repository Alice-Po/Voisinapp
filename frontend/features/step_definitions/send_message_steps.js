import { Given, When, Then } from '@cucumber/cucumber';
import { setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setDefaultTimeout(500000);

When('je poste un message avec le texte {string} et une image {string}', async function(message, imageName) {
  await this.page.waitForSelector('textarea[name="content"]');
  await this.page.type('textarea[name="content"]', message);

  const imagePath = path.resolve(__dirname, `../assets/${imageName}`); 
  const fileInput = await this.page.$('input[type="file"]');
  await fileInput.uploadFile(imagePath);

  const submitButton = await this.page.waitForSelector('button[type="submit"]');
  await submitButton.click();

  await this.page.waitForFunction(
    () => {
      const button = document.querySelector('button[type="submit"]');
      return button && !button.disabled; 
    },
    { timeout: 10000 } 
  );
});

Then('le message {string} avec une image doit apparaître dans mon fil d\'actualité', async function (message) {
  await this.page.goto('http://localhost:4004/outbox');
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); 

  // Vérifie que le message texte est présent
  const messageExists = await this.page.evaluate((message) => {
    const elements = document.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(elements).some(el => el.textContent.trim() === message);
  }, message);

  if (!messageExists) {
    throw new Error(`Le message "${message}" n'est pas visible dans la liste des messages.`);
  }

  const imageExists = await this.page.$('img');
  if (!imageExists) {
    throw new Error(`No image is visible for the message "${message}".`);
  }
});

