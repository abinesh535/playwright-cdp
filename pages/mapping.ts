import { Page, test, expect, Locator } from '@playwright/test'
import { kantimepage } from '../pages/menupage';
import { clientreport } from '../pages/clientlist';
import { createauth } from './auth';
import { importauthactivities } from './importauth';

export class map {
    readonly page: Page;
    readonly menupage: kantimepage;
    readonly clientlist: clientreport;
    readonly auth: createauth;
    readonly importauth: importauthactivities;
    readonly mappingerrorfilter: Locator;
    readonly filtererrorlist: Locator;
    readonly clickmappayeroption:Locator;
    readonly clickpayer:Locator;

    constructor(page: Page) {
        this.page = page;
        this.page.setDefaultTimeout(100000);
        this.menupage = new kantimepage(page);
        this.clientlist = new clientreport(page);
        this.auth = new createauth(page);
        this.importauth = new importauthactivities(page);
        this.mappingerrorfilter = page.locator(`//*[@name='mapping_error']`);
        this.filtererrorlist = page.locator(`//*[contains(@class,'h-full w-full rounded-[inherit] max-h-40')]//div//div`);
        this.clickmappayeroption=page.locator(`//*[@role='menuitem' and text()='Map Payer']`);
       // this.clickpayer=page.getByText('Search...')
    }

    async mappayer() {
        await this.menupage.cdsmenu.hover();
        await this.menupage.authmenu.hover();
        await this.importauth.pendingauthpage.click({ force: true });
        await this.page.waitForLoadState('networkidle');
        await this.importauth.pendingauthfilter.click();
        await this.mappingerrorfilter.click();
        await this.page.waitForLoadState('networkidle');
        let errornames = await this.filtererrorlist.allTextContents();
        let errorcount = await this.filtererrorlist.count();
        console.log(`Total mapping error auths: ${errorcount}`);
        for (let name of errornames) {
            if (name.includes('Payer Not Mapped')) {
                await this.filtererrorlist.nth(errornames.indexOf(name)).click();
                console.log('selected Payer not mapped option');
                break; // stop after first match
            }
        }
        await this.importauth.clickapply.click();
        await this.page.waitForTimeout(4000);

        const clientnamelist = (await this.importauth.clientname.allInnerTexts()).map(name => name.trim())
            .filter(name => name.length > 0);
        //clientnamelist.forEach(name => console.log('Client name:', name));
        await this.page.waitForLoadState('networkidle');
        const authnumberlist = (await this.importauth.authnumber.allInnerTexts()).map(a => a.trim())
            .filter(a => a.length > 0);
        authnumberlist.forEach(auth => console.log('Auth number:', auth));
        await this.page.waitForLoadState('networkidle');
        await this.page.locator("//button[contains(@class,'right-0 top-1/2 -translate-y-1/2 bg-[#7a7a76] p-2 shadow-lg rounded-full z-50')]").click();

        const eliipc = await this.importauth.clickauthellipse.count();
        console.log('ellipse count:', + eliipc);
        for (let i = 1; i < eliipc; i++) {

            await this.importauth.clickauthellipse.nth(i).click();
            
            const [payerpopup]=await Promise.all([
                 this.page.waitForEvent('popup', { timeout: 5000 }),
                 this.clickmappayeroption.click()]);       
                  await this.page.waitForTimeout(5000);             
                  await payerpopup.getByText('Search...').click();
                  let payertexts=await payerpopup.locator(`//*[@class='h-full w-full rounded-[inherit] max-h-40']//div//div`).allTextContents();
                  let payercount= await payerpopup.locator(`//*[@class='h-full w-full rounded-[inherit] max-h-40']//div//div`).count();
                  for(let payers of payertexts){
                    if(payers.includes('WI IRIS-IRISW(IRIS-WI)')){
                        await payerpopup.locator(`//*[@class='h-full w-full rounded-[inherit] max-h-40']//div//div`).nth(payertexts.indexOf(payers)).click();
                        console.log('Payer selected:',payers);
                        break; // stop after first match
                    }
                  }
                await payerpopup.locator(`//button[@type='submit']`).click();
                console.log(`Payer mapped for Auth Number: ${authnumberlist[i]}\n---------`);
                await payerpopup.waitForTimeout(3000);
                }
    }
}