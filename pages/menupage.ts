import { test, expect, Locator, Page } from '@playwright/test';

export class kantimepage {

    readonly page: Page;
    readonly clickmenu: Locator;
    readonly clicksubmenu: Locator;
    readonly cdsmenu: Locator;
    readonly authmenu: Locator;
    readonly importedpage: Locator;

    constructor(page: Page) {

        this.page = page;
        this.clickmenu = page.locator(`//*[@id="1"]`);
        this.clicksubmenu = page.getByText('Add Intake');
        this.cdsmenu = page.locator(`//*[@id="2190"]`);
        this.authmenu = page.getByText('IRIS Auth Import');
        this.importedpage = page.getByRole('cell', { name: 'Imported Authorization Files', exact: true });
    }

    async menu() {
        await this.clickmenu.hover();
    }
    async submenu() {
        await this.clicksubmenu.click();
    }

    async cdsauthmenu() {
        await this.cdsmenu.hover();
        await this.authmenu.hover();
        await this.importedpage.click({ force: true });
        await this.page.waitForTimeout(5000);
    }
}