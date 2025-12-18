import{test,Locator, Page, expect} from '@playwright/test';
import {createauth} from './auth';

export class intakepageedit{

    readonly page: Page;
    readonly demographicdetail:Locator;
    readonly identifieredit:Locator
    readonly medicaid:Locator;
    readonly ssn:Locator;
    readonly identifiersave:Locator;
    readonly dobedit:Locator;
    readonly dobdate:Locator;
    readonly dobsave:Locator;
    readonly homeaddressedit:Locator;
    readonly address1:Locator;
    readonly zip:Locator;
    readonly address1save:Locator;
    readonly payer:Locator;
    readonly payerellipse:Locator;
    readonly payeredit:Locator;
    readonly enterinsurance:Locator;
    readonly payersave:Locator;
    readonly intakedetail:Locator;
    readonly referraledit:Locator;
    readonly intakedate:Locator;
    readonly socdate:Locator;
    readonly referralsave:Locator;
    readonly tododetail:Locator;
    readonly checklistedit:Locator;
    readonly notrequiredcheck:Locator;
    readonly checklistsave:Locator;
    readonly ellipse:Locator;
    readonly clickaccept:Locator;
    readonly divaccept:Locator

    readonly authdetail:Locator;
    readonly authedit:Locator;
    readonly clickcreatemanualauth:Locator;
    
    constructor(page:Page){

         this.page = page;
         this.page.setDefaultTimeout(100000);
         this.demographicdetail=page.getByText('Demographics');
         this.identifieredit=page.locator(`//*[@id="identifiers"]/div/div[1]/div/div/div/button`)
         this.medicaid=page.locator(`//input[@name='medicaid_number']`);
         this.ssn=page.locator(`//input[@name='ssn']`);
         this.identifiersave=page.locator(`//div[@id='identifiers']//button[normalize-space()='Save']`);
         this.dobedit=page.locator(`//*[@id="personal_info"]/div/div[1]/div/div/div/button`)
         this.dobdate=page.getByPlaceholder('mm/dd/yyyy');
         this.dobsave=page.locator(`//div[@id='personal_info']//button[normalize-space()='Save']`)
         this.homeaddressedit=page.locator(`//*[@id="home_address"]/div/div[1]/div/div/div/button`)
         this.address1=page.locator(`//input[@name="address_1"]`)
         this.zip=page.locator(`//input[@name="zip_homeAddress"]`);
         this.address1save=page.locator(`//div[@id='home_address']//button[normalize-space()='Save']`);
         this.payer=page.getByText(`Payer`);
         this.payerellipse=page.locator(`//td[@class='p-2 pr-1 align-top text-left']//*[@class="lucide lucide-ellipsis-vertical w-5 h-5"]`);
         this.payeredit=page.locator("//div[normalize-space()='Edit']");
         this.enterinsurance=page.locator(`//*[@name='insurance_id']`);
         this.payersave=page.getByText('Save');
         this.intakedetail=page.getByText('Referral & Intake');
         this.referraledit=page.locator(`//*[@id="referral"]/div/div[1]/div/div/div/button`)
         this.intakedate=page.getByRole('textbox', { name: 'mm/dd/yyyy' }).nth(2);
         this.socdate=page.getByRole('textbox', { name: 'mm/dd/yyyy' }).first();
         this.referralsave=page.locator(`//div[@id='referral']//button[normalize-space()='Save']`);      
         this.tododetail=page.getByText('To Do')
         this.checklistedit=page.locator(`//*[@id="checklist"]/div/div[1]/div/div/div/button`);
         this.notrequiredcheck=page.locator(`//table[@class='w-full caption-bottom text-sm relative']//tbody//td[7]//button[@role='checkbox']`)
         this.checklistsave=page.locator(`//div[@id='checklist']//button[normalize-space()='Save']`);
         this.ellipse=page.locator("//*[name()='svg'][@class='lucide lucide-ellipsis-vertical']");
         this.clickaccept=page.getByText('Accept Intake');
         this.divaccept=page.locator('button').filter({ hasText: 'Accept Intake' });   
         this.authdetail=page.getByText('Auth');
         this.authedit=page.locator(`(//*[@class="lucide lucide-ellipsis-vertical w-5 h-5"])[1]`);
         this.clickcreatemanualauth=page.getByText('Create Manual Authorization')
         
    }

    async demographicfill(){
        await this.demographicdetail.click();
        await this.identifieredit.click();
        await this.page.waitForTimeout(5000);
        await this.medicaid.fill('124567839439');
        await this.ssn.fill('987-65-1320');
        await this.identifiersave.click();
        await this.dobedit.click();
        await this.page.waitForTimeout(5000);
        await this.dobdate.click();
        await this.dobdate.fill('12/01/2024');
        await this.dobsave.click();     
        await this.homeaddressedit.click();
        await this.page.waitForTimeout(5000);
        await this.address1.fill('dallas');
        await this.zip.fill('12345');
        await this.page.waitForTimeout(5000);
        await this.address1save.click();

    }
    async payerfill(){
           await this.payer.click();
           await this.payerellipse.click();
           await this.payeredit.click();
           await this.page.waitForTimeout(5000);
           await this.enterinsurance.fill('65478274');
           await this.payersave.click();

    }
    async intakefill(){
        await this.intakedetail.click();
        await this.referraledit.click();
        await this.intakedate.click();
        await this.intakedate.fill('12/01/2025');
        await this.socdate.click();
        await this.socdate.fill('12/01/2025');
        await this.referralsave.click();
    }
    async todofill(){
        await this.tododetail.click();
        await this.checklistedit.click();
        await this.page.waitForTimeout(5000);
        const count = await this.notrequiredcheck.count();
        console.log(count);
 for (let i = 1; i < count; i++) {
    const cb = this.notrequiredcheck.nth(i);
    await cb.scrollIntoViewIfNeeded();
    await cb.click({ force: true });
    console.log(i);
}
        await this.page.locator(`//*[@value="checklist_item_not_required-13"]`).click();
        await this.checklistsave.click();
    }
    async acceptintake(){
        await this.ellipse.click();
        await this.clickaccept.click();
    }
    async div(){
        await this.divaccept.click();
        await this.divaccept.click();
    }

    async authfill():Promise<Page>{
        await this.authdetail.click();
        await this.authedit.click()
        await this.clickcreatemanualauth.click();
        const authpopup = await this.page.waitForEvent('popup')
        return authpopup;
    }
}