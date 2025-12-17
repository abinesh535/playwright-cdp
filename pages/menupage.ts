import { test, expect, Locator, Page } from '@playwright/test';

export class kantimepage {

    readonly page: Page;
    readonly clickmenu: Locator;
    readonly clicksubmenu:Locator;
   
    constructor(page: Page) {

        this.page = page;
        this.clickmenu = page.locator(`//*[@id="1"]`);
        this.clicksubmenu=page.getByText('Add Intake');
    }

    async menu() {
        await this.clickmenu.hover();    
    }
   async submenu(){
    await this.clicksubmenu.click();
   }
}