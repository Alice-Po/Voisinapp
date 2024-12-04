import { Page } from 'playwright';


async function loginUser(page: Page, username: string, password: string){
    await page.goto('http://localhost:4004');
    await page.getByRole('link', {name: "connexion"}).click();
    await page.waitForSelector('.MuiListItemText-root')
    const success = await page.evaluate(() => {
      const items = document.querySelectorAll('.MuiListItemText-root');
      for (const item of items) {
          if (item.textContent && item.textContent.includes('localhost:3000')) {
            item.parentElement?.click(); // Clic sur l'élément parent qui est le bouton
            return true;
        }   
      }
      fillForm(page, { username, password });submitForm(page, '/inbox')
      return true
  })
  }
  
  async function checkAuthentificationCookie(page: Page){
  
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(cookie => cookie.name === 'auth_token');
    if (!authCookie) {
      console.log("No user logged")
      return false
    } else return true
    
  }

  async function fillForm(page: Page, fields: Object) {
    // Parcours de chaque champ dans l'objet 'fields' et remplissage du formulaire
    for (const [selector, value] of Object.entries(fields)) {
      let element = await page.locator(`#${selector}`)
      element.waitFor();  // Attendre que le champ soit prêt
      await element.fill(value);  // Remplir le champ avec la valeur
    }
  }

  async function submitForm(page: Page, redirection: string) {
    const submitButton = page.getByRole('button', { name:'sumbit'});
    await submitButton.click();
    await page.waitForURL(redirection);

    if (!page.url().includes(redirection)) {
        throw new Error(`Redirection échouée. URL actuelle : ${page.url()}`);
      }
  }

  //Maybe useless
  async function clickOnButton(page: Page, textButton: string) {
    await page.getByRole('link', { name: textButton }).click();
  }
  
  export  {loginUser, checkAuthentificationCookie, fillForm, submitForm, clickOnButton }