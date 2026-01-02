import { test, expect, Page, Locator } from '@playwright/test'
import { getCurrentTime } from '../utils/timer';

export class intakepage {

    readonly page: Page;
    readonly location: Locator;
    readonly selectlocation: Locator;
    readonly patienttype: Locator;
    readonly payer: Locator;
    readonly selectpayer: Locator;
    readonly caretype: Locator;
    readonly firstname: Locator;
    readonly lastname: Locator;
    readonly ssn: Locator;
    readonly proceed: Locator;

    constructor(page: Page) {
        this.page = page;
        this.page.setDefaultTimeout(100000);
        this.location = page.locator(`//*[@name='location_platform_id']`);
        this.selectlocation = page.getByText('WI-IRIS');
        this.patienttype = page.getByRole('checkbox');
        this.payer = page.locator(`//button[@name='payer_id']`);
        this.selectpayer = page.getByText(`WI IRIS-IRISW(IRIS-WI)`);
        this.caretype = page.getByRole('checkbox');
        this.firstname = page.locator(`//input[@name='first_name']`);
        this.lastname = page.locator(`//input[@name='last_name']`);
        this.ssn = page.locator(`//input[@name='ssn']`);
        this.proceed = page.locator(`//button[@type='submit']`)
    }
    async addintake(enterfname: string, enterlname: string) {
        await this.location.click();
        await this.selectlocation.click();
        await this.patienttype.first().click();
        await this.payer.click();
        await this.selectpayer.click();
        await this.caretype.nth(2).click();
        await this.firstname.fill(enterfname);
        await this.lastname.fill(enterlname);
        await this.ssn.fill('834541239');
        await this.proceed.click();
        await this.proceed.screenshot({ path: 'screenshots/' + 'intake' + getCurrentTime() + '.png' })
    }

}