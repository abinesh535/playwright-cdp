import { expect, Page, Locator } from '@playwright/test';
import { createauth } from '../pages/auth';
import { faker } from '@faker-js/faker';
import { importauthactivities } from '../pages/importauth';


export class Assert {

  readonly duplicate: Locator;
  readonly acceptconfirm: Locator;
  readonly auth: createauth;
  readonly validateauthnumber: Locator
  readonly validatepayer: Locator
  readonly validateservice: Locator;
  readonly importauth:importauthactivities;
  readonly summaryfileid:Locator
  readonly importedfileid:Locator;


  constructor(private page: Page) {

    this.duplicate = page.locator(`//div[contains(@class,'bg-body p-3 !pt-0')]//div[contains(@class,'rounded-sm border')]`)
    this.acceptconfirm = page.getByRole('dialog');
    this.auth = new createauth(page);
    this.validateauthnumber = page.locator(`//*[@name='auth_number']`);
    this.validatepayer = page.locator(`(//*[contains(@class,'whitespace-nowrap rounded-md font-medium ring') and @type='button'])[1]`)
    this.validateservice = page.locator(`(//*[contains(@class,'whitespace-nowrap rounded-md font-medium ring') and @type='button'])[2]`)
    this.importauth=new importauthactivities(page);
    this.summaryfileid=page.locator(`//button[@class='text-start w-fit font-bold text-[#135cc8]']`);   
    this.importedfileid=page.locator(`//p[text()='File ID']/following-sibling::div[@class='font-semibold']`);
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
      try{
        let actualauth=await this.validateauthnumber.inputValue();
         expect(actualauth).toBe(expectedauth);
        console.log("✅ Auth number validation PASS — Auth number match");
      }catch(error){
        console.log("❌ Auth number validation FAIL — Auth number mismatch");   

    }
  }
      
  // async validatefileid(){
  //     try {
  //    expect().toBe();
  //     console.log("✅File id matches");
  //   } catch (error) {
  //     console.log("❌ File id not matches");
  //   }

  // }
}

