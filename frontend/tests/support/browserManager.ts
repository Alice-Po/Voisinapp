import { chromium, Browser, Page } from 'playwright';

class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;
  private page: Page | null = null;

  private constructor() {}

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  public async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: false,
        // Vous pouvez ajouter des options supplémentaires ici
      });
      const context = await this.browser.newContext();
      this.page = await context.newPage();
    }
  }

  public getPage(): Page {
    if (!this.page) {
      throw new Error('Page is not initialized. Call initializeBrowser() first.');
    }
    return this.page;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export default BrowserManager;