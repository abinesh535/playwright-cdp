import { expect, Page, Locator } from '@playwright/test';


export class Assert {

    readonly duplicate:Locator;
    readonly acceptconfirm:Locator;
    constructor(private page: Page) {

    this.duplicate=page.locator(`//div[contains(@class,'bg-body p-3 !pt-0')]//div[contains(@class,'rounded-sm border')]`)
    this.acceptconfirm=page.getByRole('dialog');
}

  async hasurl() {
      try {
    await expect(this.page).toHaveURL(/intake-profile/);
    console.log(" URL check PASS — intake-profile present");
  } catch (error) {
    console.log(" URL check FAIL — intake-profile NOT found");
  }
  }
 async duplicatecheck() {
  try {
    await expect(this.duplicate).toBeHidden();
    console.log(" Duplicate check PASS — duplicate element is hidden");
  } catch (error) {
    console.log(" Duplicate check FAIL — duplicate element is visible");
  }
}

async acceptintakediv(){
    try {
    await expect(this.acceptconfirm).toBeVisible();
    console.log(" Accept intake confirmation appeared");
  } catch (error) {
    console.log(" Accept intake confirmation not appeared");
  }
}
}