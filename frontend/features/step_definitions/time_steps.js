import { When, Then } from '@cucumber/cucumber';
import MockDate from 'mockdate'

When("few years has been passed", async function() {
    MockDate.set('2030-11-22');

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
        return new Date('2030-11-22').getTime();
      }
    };
  });

  console.log("Mock : new Date().toString()", new Date().toString());
});

When('I fake time I can see it on the main page', async function () {
    MockDate.set('2030-11-22');

  await this.page.evaluate(() => {

    const originalDate = Date;
    self.Date = class extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          return new originalDate('2030-11-22');
        }
        return new originalDate(...args);
      }
      static now() {
        return new Date('2030-11-22').getTime();
      }
    };
  });

  console.log("Mock : new Date().toString()", new Date().toString());
  });