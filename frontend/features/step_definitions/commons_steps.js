import { Given, When, Then } from '@cucumber/cucumber';
import { setDefaultTimeout } from '@cucumber/cucumber';
import { fileURLToPath } from 'url';

setDefaultTimeout(500000);


Given('I am on the homepage', async function() {
  await this.page.goto('http://localhost:4004'); // Page d'accueil de Mastopod
});

When('I submit the form', async function() {
  const loginButton = await this.page.waitForSelector('button[type="submit"]');
  await loginButton.click()
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' })
  // await this.page.waitForFunction(
  //   async () => {
  //     await this.page.waitForNavigation({ waitUntil: 'networkidle0' })
  //   },
  //   { timeout: 6000000 } 
  // );
   // Attente que la navigation soit terminée
 })



Then('I should be redirected to my inbox', async function() {
 // Vérifie que l'utilisateur est bien redirigé vers "/inbox"
 if (!this.page.url().includes('/inbox')) {
    throw new Error(`Redirection échouée. URL actuelle : ${this.page.url()}`);
  }
})