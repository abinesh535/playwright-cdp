import { test, Page, Locator, expect } from '@playwright/test'
import path from 'path';

export class importauthactivities {

  readonly page: Page;
  readonly clickellipse: Locator;
  readonly clickimportfile: Locator;
  readonly clickbrowse: Locator;
  readonly proceedimport: Locator;
  readonly summaryfileid: Locator;
  readonly importsummary: Locator;
  readonly clickredirectimportpage: Locator;
  readonly openfile: Locator;
  readonly clickfilter: Locator;
  readonly importauthdetail: Locator;

  constructor(page: Page) {
    this.page = page;
    this.page.setDefaultTimeout(100000);
    this.clickellipse = page.locator(`//*[@class='focus:outline-none flex w-8 h-8 bg-kgray-500 hover:bg-kgray-500 justify-center items-center rounded-sm']`)
    this.clickimportfile = page.getByText('Import New File');
    this.clickbrowse = page.getByText('Browse', { exact: true });
    this.proceedimport = page.getByText('Proceed to Import');
    this.summaryfileid = page.locator(`//button[@class='text-start w-fit font-bold text-[#135cc8]']`);
    this.importsummary = page.locator(`//*[@class='p-4']`);
    this.clickredirectimportpage = page.locator(`//*[@class="flex space-x-2"]//button[normalize-space()='Go to Imported Files List']`)
    this.clickfilter = page.locator(`//*[@class='space-x-2 pt-3 pb-5 flex justify-end items-center']//button[@type='button']`)
    this.importauthdetail = page.locator(`//*[@class='bg-secondary-500 border border-layoutBorder p-3']`);
  }
  async importedauthpage() {
    await this.clickellipse.click();
    await this.clickimportfile.click();
    try {
      await expect(this.clickellipse).toBeVisible();
      await expect(this.clickimportfile).toBeVisible();
      console.log('✅ Import auth page buttons are visible');
    } catch (err) {
      console.error('❌ Import auth page buttons are not visible');
    }
    const importpopup = await this.page.waitForEvent('popup')
    return importpopup;
  }
  async importpop() {
    try {
      await expect(this.clickbrowse).toBeVisible();
      await expect(this.clickbrowse).toBeEnabled();
      await expect(this.proceedimport).toBeVisible();
      console.log('✅ Import popup opened and buttons are visible');
    } catch (err) {
      console.error('❌ Import popup opened and buttons are not visible');
    }
    await this.clickbrowse.setInputFiles(path.resolve('data/Authorizations.csv'));
    await this.proceedimport.click();
    const idwhileimport = await this.summaryfileid.innerText();
    try {
      expect(idwhileimport).toBeTruthy();
      console.log(`✅ File ID generated: ${idwhileimport}`);
    } catch (err) {
      console.error('❌ File ID not generated');
    }
    let summaryprint = await this.importsummary.allInnerTexts();
    let summaryfieldid = summaryprint.join('\n').replace(/\n+/g, '\n').replace(/:\n/g, ': ').split('\n').map(n => n.trim());
    summaryfieldid.forEach(line => console.log('Import summary details:' + line));
    try {
      await expect(this.clickredirectimportpage).toBeVisible();
      await expect(this.clickredirectimportpage).toBeEnabled();
      console.log('✅ Redirect to Imported Files List button is visible and enabled');
    } catch (err) {
      console.error('❌ Redirect button not visible and not enabled');
    }
    await this.clickredirectimportpage.click();
    return idwhileimport;
  }

  async filemanage(idwhileimport: string) {
    await this.page.getByText(idwhileimport, { exact: true }).last().click();
    const openfilepopup = await this.page.waitForEvent('popup')
    await this.page.waitForTimeout(8000);
    return openfilepopup;
  }
  async importedlist() {
    await this.clickfilter.click();
    // await this.page.waitForTimeout(4000);
    let print = await this.importauthdetail.allInnerTexts();
    let getfileid: string[] = print.join('\n').replace(/\n+/g, '\n').replace(/:\n/g, ': ').split('\n').map(n => n.trim());
    getfileid.forEach(line => console.log('opened Filedetails:' + line));
  }
}


