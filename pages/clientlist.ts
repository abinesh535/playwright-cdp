import {test, Page, Locator} from '@playwright/test'

export class clientreport{

    readonly page: Page;
    readonly clientmenu:Locator;
    readonly clientsubmenu:Locator;
    readonly clickclient:Locator;


     constructor (page:Page) {
        this.page = page;
        this.clientmenu=page.locator(`//*[@id="2"]`);
        this.clientsubmenu=page.getByText('Client List - IRIS');
        this.clickclient=page.getByText('Test1, Austin (WIE4375)');
 }

 async clientlistpage(){
    await this.clientmenu.hover();
    await this.clientsubmenu.click();
     await this.page.waitForTimeout(5000);
    await this.clickclient.click();
 }
}