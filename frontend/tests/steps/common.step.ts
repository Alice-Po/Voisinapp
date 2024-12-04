import { When } from '@cucumber/cucumber';
import BrowserManager from '../support/browserManager';

When('I click on the button {string}', async function (string) {
  const page = BrowserManager.getInstance().getPage();
  await page.getByRole('button', { name: string }).click();
});

