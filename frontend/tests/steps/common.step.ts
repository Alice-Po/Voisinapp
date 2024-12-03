import { When } from '@cucumber/cucumber';
import BrowserManager from '../support/browserManager';

When('I click on the button {string}', async function (string) {
  const page = BrowserManager.getInstance().getPage();
  console.log("string", string)
  await page.getByRole('button', { name: string }).click();
  console.log("page.getByRole('button', { name: string })", page.getByRole('button', { name: string }))
});

