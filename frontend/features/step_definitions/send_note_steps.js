import { When, Then } from '@cucumber/cucumber';
import { setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import { fileURLToPath } from 'url';
import users from '../fixtures/users.json' assert { type: 'json' };
import MockDate from 'mockdate'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registredUser = users.registredUser;
const weeklyNote = registredUser.weeklyNote;
const favoriteTag = registredUser.favoriteTag;


setDefaultTimeout(500000);

async function weelkyNoteExists(page) {

  await page.evaluate(async (weeklyNote) => {  
    // chech browser current date
    let browserDate = new Date();
    console.log("The browser date in the evaluate environnement is : ", browserDate.toDateString());
    
    // TODO : get posted note by unique key/id
    const elements = document.querySelectorAll('[data-testid="noteContent"]');
    return Array.from(elements).some(el => el.textContent.trim() === weeklyNote);
  }, weeklyNote);
}

// Manual method which doesn't work
async function forwardTimeForAWeek(page) {
  await page.evaluate(() => {
   
  });
}

async function submitForm(page){
  const submitButton = await page.waitForSelector('button[type="submit"]');
  await submitButton.click();
}

//make generic function with choosePodProvider()
async function chooseATag(page, tag) {
  await page.waitForSelector('.MuiListItemText-root'); 

  const success = await page.evaluate((tag) => {
    const items = document.querySelectorAll('.MuiListItemText-root');
    for (const item of items) {
      if (item.textContent.includes(tag)) {
          item.parentElement.click();
          return true;
      }
    }
    return false; 
  }, tag);

  if (!success) {
      throw new Error('Impossible de trouver et de sélectionner `${tag}`');
  }
}


When('I write a weekly note and an image {string}', async function(imageName) {
  await this.page.waitForSelector('textarea[name="content"]');
  await this.page.type('textarea[name="content"]', registredUser.weeklyNote);

  const imagePath = path.resolve(__dirname, `../assets/${imageName}`); 
  const fileInput = await this.page.$('input[type="file"]');
  await fileInput.uploadFile(imagePath);
});

Then("I post my note", async function() {
  await submitForm(this.page)

  await this.page.waitForFunction(
    () => {
      const button = document.querySelector('button[type="submit"]');
      return button && !button.disabled; 
    },
    { timeout: 10000 } 
  );
})

When("I choose an expiration date a week later", async function () {

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

When("I choose no expiration option", async function () {
  await this.page.click('#noEndTime');
});

Then('the weekly note with an image should appear in my News Feed immediatly.', async function () {
  await this.page.goto('http://localhost:4004/outbox');
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); 


  const messageExists = weelkyNoteExists(this.page)

  if (!messageExists) {
    throw new Error(`The note "${weeklyNote}" is not visible in the note feed.`);
  }

  const imageExists = await this.page.$('img');
  if (!imageExists) {
    throw new Error(`No image is visible for the message "${weeklyNote}".`);
  }
});


Then("years after the weekly note should no longer be visible", async function () {
  MockDate.set('2026-11-22');

  await this.page.evaluate(() => {

    const originalDate = Date;
    self.Date = class extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          return new originalDate('2026-11-22');
        }
        return new originalDate(...args);
      }
      static now() {
        return new Date('2026-11-22').getTime();
      }
    };
    console.log("what time is it in evaluate statement ? ",new Date().toString())
  });


  console.log("Mock : new Date().toString()", new Date().toString());
    //Give Sun Nov 22 2026 01:00:00 GMT+0100 (heure normale d’Europe centrale)

  await this.page.goto('http://localhost:4004/outbox');
  await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); 

  console.log("Mock : new Date().toString()", new Date().toString());
    //Give Sun Nov 22 2026 01:00:00 GMT+0100 (heure normale d’Europe centrale)

});

Then("the message {string} remains visible", async function (message) {
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

When('I create a tag', async function () {
  const addTagButton = await this.page.waitForSelector('[data-testid="addTag"]');
  await addTagButton.click();

  const createTagButton = await this.page.waitForSelector('[data-testid="createTag"]');
  await addTagButton.click();

  const createTagField = await this.page.waitForSelector('[data-testid="createTagField"]');
  await createTagField.type(favoriteTag)
  await submitForm(this.page)


});

Then('the tag is available', async function () {
    //How to wait for creation propertly ?
    //It will be better to retreive an id at the submission

    const tagExists = setTimeout(async function(favoriteTag) {
      // function synergie with note existence checking
      await this.page.evaluate((favoriteTag) => {
        const elements = document.querySelectorAll('[data-testid="tag"]');
        return Array.from(elements).some(el => el.textContent.trim() === favoriteTag);
      }, favoriteTag);
    }, 60);

  if (!tagExists){
    throw Error ("Tag is not available")
  }
});

When('I select the tag', async function () {
  chooseATag(this.page, favoriteTag)
});

Then('the weekly note with an image should appear in my News Feed with a the visible tag', async function () {

  const tagExists = await this.page.evaluate((favoriteTag) => {
    const elements = document.querySelectorAll('[data-testid="tag"]');
    return Array.from(elements).some(el => el.textContent.trim() === favoriteTag);
  }, tafavoriteTagg);

  if (!tagExists) {
    throw new Error(`Le message "${favoriteTag}" n'est pas visible dans la liste des messages.`);
  }
});
