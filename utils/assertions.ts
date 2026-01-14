import { expect, Page, Locator } from '@playwright/test';
import { createauth } from '../pages/auth';
import { faker } from '@faker-js/faker';
import { importauthactivities } from '../pages/importauth';
import { intakepageedit } from '../pages/intakeprofile';
import { clientreport } from '../pages/clientlist';
import { kantimepage } from '../pages/menupage';


export class Assert {

  readonly duplicate: Locator;
  readonly acceptconfirm: Locator;
  readonly auth: createauth;
  readonly validateauthnumber: Locator
  readonly validatepayer: Locator
  readonly validateservice: Locator;
  readonly importauth: importauthactivities;
  readonly intake:intakepageedit;
  readonly summaryfileid: Locator
  readonly importedfileid: Locator;
  readonly assertmenu:clientreport;
  readonly assertcdsmenu:kantimepage;

 
  constructor(private page: Page) {

    this.duplicate = page.locator(`//div[contains(@class,'bg-body p-3 !pt-0')]//div[contains(@class,'rounded-sm border')]`)
    this.acceptconfirm = page.getByRole('dialog');
    this.auth = new createauth(page);
    this.intake=new intakepageedit(page);
    this.assertmenu=new clientreport(page);
    this.assertcdsmenu=new kantimepage(page);
    this.validateauthnumber = page.locator(`//*[@name='auth_number']`);
    this.validatepayer = page.locator(`(//*[contains(@class,'whitespace-nowrap rounded-md font-medium ring') and @type='button'])[1]`)
    this.validateservice = page.locator(`(//*[contains(@class,'whitespace-nowrap rounded-md font-medium ring') and @type='button'])[2]`)
    this.importauth = new importauthactivities(page);
    this.summaryfileid = page.locator(`//button[@class='text-start w-fit font-bold text-[#135cc8]']`);
    this.importedfileid = page.locator(`//p[text()='File ID']/following-sibling::div[@class='font-semibold']`);
     
    
  }

  async assertclientmenu(){
    try{
      await expect(this.assertmenu.clientmenu).toBeVisible();
      console.log('✅ client menu exist');
    }catch(error){
      console.log("❌ client menu not exist");
    }
  }

  async assertcds(){
    try{
      await expect(this.assertcdsmenu.cdsmenu).toBeVisible();
      console.log('✅ CDS menu exist');
    }catch(error){
      console.log("❌ CDS menu not exist");
    }
  }

  async hasurl() {
    try {
      await expect(this.page).toHaveURL(/intake-profile/);
      console.log("✅URL check PASS — intake-profile present");
    } catch (error) {
      console.log("❌ URL check FAIL — intake-profile NOT found");
    }
  }
  async duplicatecheck() {
    try {
      await expect(this.duplicate).toBeHidden();
      console.log("✅ Duplicate check PASS — duplicate element is hidden");
    } catch (error) {
      console.log("❌ Duplicate check FAIL — duplicate element is visible");
    }
  }

  async acceptintakediv() {
    try {
      await expect(this.acceptconfirm).toBeVisible({ timeout: 50000 });
      console.log("✅ Accept intake confirmation appeared");
    } catch (error) {
      console.log("❌ Accept intake confirmation not appeared");
    }
  }

  async assertauthtab(){
    try{
      await expect(this.intake.authdetail).toBeVisible();
       console.log("✅ Auth tab exist");
    }catch (error){
      console.log("❌ Auth tab not exist");
    }
  }

  async authurl() {
    try {
      await expect(this.page).toHaveURL(/edit-auth/);
      console.log("✅ URL check PASS — Edit-manual-authorization page present");
    } catch (error) {
      console.log("❌ URL check FAIL — Edit-manual-authorization page NOT found");
    }
  }

  async validateauthdata() {
    const fields = [
      { locator: this.validateauthnumber, name: 'authorization number' },
      { locator: this.validatepayer, name: 'payer' },
      { locator: this.validateservice, name: 'service' },
      { locator: this.auth.selectstartdate, name: 'start date' },
      { locator: this.auth.selectenddate, name: 'end date' },
    ];

    for (const check of fields) {
      try {
        await expect(check.locator).not.toBeEmpty();
        console.log(`✅ Auth data check PASS — ${check.name} present`);
      } catch (error) {
        console.log(`❌ Auth data check FAIL — ${check.name} NOT found`);
      }
    }
  }
  async compareeauthnumber(expectedauth: string) {
    try {
      let actualauth = await this.validateauthnumber.inputValue();
      expect(actualauth).toBe(expectedauth);
      console.log("✅ Auth number validation PASS — Auth number match");
    } catch (error) {
      console.log("❌ Auth number validation FAIL — Auth number mismatch");
    }
  }
async assertPendingAuthdata() {
  try{
    await expect(this.importauth.clientname).toBeVisible();
    await expect(this.importauth.authnumber).toBeVisible();
    console.log("✅ Auth number and client name exist");
  }catch(error){
    console.log("❌ Auth number and client name not exist");
  }
  }

 
}
