import {test, Locator, Page} from '@playwright/test'
import { assert, time } from 'console';
import { getCurrentTime } from '../utils/timer';
import { Assert } from '../utils/assertions';
import { faker } from '@faker-js/faker';


export class createauth{

    readonly page: Page;
    readonly authnumber:Locator;
    readonly clickpvendorcheckbox:Locator;
    readonly clickvendorlist:Locator;
    readonly selectvendor:Locator;
    readonly clickutilization:Locator;
    readonly clickpayer:Locator;
    readonly selectpayer:Locator
    readonly clickservice:Locator;
    readonly selectservice:Locator;
    readonly selectstartdate:Locator;
    readonly selectenddate:Locator;
    readonly clickfrequency:Locator;
    readonly selectfrequency:Locator;
    readonly selectunitsbyfre:Locator;
    readonly clickunittype:Locator;
    readonly selectunittype:Locator;
    readonly unitrate:Locator;
    readonly totoalunits:Locator;
    readonly authrule:Locator;
    readonly clicksave:Locator;
    readonly authpagess:Locator;
    //readonly openauth:Locator;

    

    constructor(page:Page){

        this.page=page;
        this.page.setDefaultTimeout(100000);
        this.authnumber=page.locator(`//*[@name='authorization_number']`);
        this.clickpvendorcheckbox=page.locator(`//span[normalize-space()='Vendor']/ancestor::label//button[@role='checkbox']`);
        this.clickvendorlist=  page.getByPlaceholder('Search Vendor');
        this.selectvendor=page.getByText('Alpha Vendor (119119119)');
        this.clickutilization=page.locator(`//span[normalize-space()='Miles']/ancestor::label//button[@role='checkbox']`);
        this.clickpayer=page.getByText('Select Payer');
        this.selectpayer=page.getByText('WI IRIS-IRISW(IRIS-WI)')
        this.clickservice=page.getByText('Select Service');
        this.selectservice=page.getByText('00240 Residential Services AFH 1-2 Beds');
        this.selectstartdate=page.locator(`//*[@for='start_date']/following-sibling::div[@class='flex relative align-center text-sm h-9 w-[150px]']//input`);
        this.selectenddate=page.locator("//*[@for='end_date']/following-sibling::div[@class='flex relative align-center text-sm h-9 w-[150px]']//input");
        this.clickfrequency=page.getByText('Select', { exact: true }).first();
        this.selectfrequency=page.getByText('Monthly');
        this.selectunitsbyfre=page.locator('//input[@id="units_by_frequency"]');
        this.clickunittype=page.getByText('Select', { exact: true }).last();
        this.selectunittype=page.getByText('Day');
        this.unitrate=page.locator('#unit_rate');
        this.totoalunits=page.locator('#total_units');
        this.authrule=page.locator(`//span[normalize-space()='Soft Warning']/ancestor::label//button[@role='checkbox']`);
        this.clicksave=page.getByText('Save as Active');
        this.authpagess=page.locator(`//*[@class='bg-body font-lato text-[#333]']`);
        //this.openauth=page.getByText('auth19', { exact: true });

    }
        
    async publicvendor(enterauth: string){
        await this.authnumber.click();
        await this.authnumber.fill(enterauth);
        await this.clickpvendorcheckbox.check();
        await this.clickvendorlist.click();
        await this.selectvendor.click();
        await this.clickutilization.check();
        await this.clickpayer.click();
        await this.selectpayer.click();     
        await this.clickservice.click();
        await this.selectservice.click();
        await this.selectstartdate.fill('12/01/2025');
        await this.selectenddate.fill('01/01/2026')
        await this.clickfrequency.click();
        await this.selectfrequency.click();
        await this.selectunitsbyfre.fill('10');
        await this.clickunittype.click();
        await this.selectunittype.click();
        await this.unitrate.fill(`10`)
        await this.totoalunits.fill(`10`)
        await this.authrule.click();
    }
    async authsave(){
        await this.clicksave.click();
        await this.authpagess.screenshot({ path: 'screenshots/' + 'auth' + getCurrentTime() +'.png' })
    }
    async opencreatedauth(enterauth: string):Promise<Assert>{
        await this.page.getByText(enterauth, { exact: true }).click();
        const addedauth = await this.page.waitForEvent('popup')
        return new Assert(addedauth);
    }
}