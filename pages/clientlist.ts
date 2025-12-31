import {test, Page, Locator} from '@playwright/test'

export class clientreport{

    readonly page: Page;
    readonly clientmenu:Locator;
    readonly clientsubmenu:Locator;
    readonly clicksearch:Locator;
    readonly selectclient:Locator;
    readonly clickclienthyperlink:Locator

     constructor (page:Page) {
        this.page = page;
        this.clientmenu=page.locator(`//*[@id="2"]`);
        this.clientsubmenu=page.getByText('Client List - IRIS');
        this.clicksearch=page.getByPlaceholder('Search Client');
       this.selectclient=page.locator(':text("Test1, Austin (WIE4375)")');
       this.clickclienthyperlink=page.getByText('Test1, Austin (WIE4375)', { exact: true }).last()
       
 }

 async clientlistpage(){
    await this.clientmenu.hover();
    await this.clientsubmenu.click();
     await this.page.waitForTimeout(5000);
     await this.clicksearch.fill('WIE4375');
     await this.page.keyboard.press('Enter');
     await this.page.waitForTimeout(6000);
    await this.selectclient.click();
    await this.clickclienthyperlink.click();
 }
}