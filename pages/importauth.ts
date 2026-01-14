import { test, Page, Locator, expect } from '@playwright/test';
import path, { join } from 'path';
import { kantimepage } from './menupage';
import { clientreport } from './clientlist';
import { intakepageedit } from './intakeprofile';
import { getCurrentTime } from '../utils/timer';

export class importauthactivities {

  readonly page: Page;                 // MAIN PAGE
  private popupPage!: Page;            // POPUP PAGE
  private fileId!: string;             // STORED FILE ID

  readonly clickellipse: Locator;
  readonly clickimportfile: Locator;
  readonly clickbrowse: Locator;
  readonly proceedimport: Locator;
  readonly summaryfileid: Locator;
  readonly importsummary: Locator;
  readonly clickredirectimportpage: Locator;
  readonly clickfilter: Locator;
  readonly importauthdetail: Locator;
  readonly newstatus: Locator;
  readonly afterimportid: Locator;
  readonly menuPage: kantimepage;
  readonly pendingauthpage: Locator;
  readonly pendingauthfilter: Locator;
  readonly fileidfilter: Locator;
  readonly clickapply: Locator;
  readonly clientname: Locator;
  readonly authnumber: Locator;
  readonly errortext: Locator;
  readonly clickauthellipse: Locator;
  readonly ellipseoptions: Locator;
  readonly clickacceptnignore: Locator;
  readonly clientlist: clientreport;
  readonly intakeprofile: intakepageedit;

  constructor(page: Page) {
    this.page = page;
    this.menuPage = new kantimepage(page);
    this.clientlist = new clientreport(page);
    this.intakeprofile = new intakepageedit(page);
    this.page.setDefaultTimeout(100000);
    this.clickellipse = page.locator(`//*[@class='focus:outline-none flex w-8 h-8 bg-kgray-500 hover:bg-kgray-500 justify-center items-center rounded-sm']`);
    this.clickimportfile = page.getByText('Import New File');
    this.clickbrowse = page.getByText('Browse', { exact: true });
    this.proceedimport = page.getByText('Proceed to Import');
    this.summaryfileid = page.locator(`//button[@class='text-start w-fit font-bold text-[#135cc8]']`);
    this.importsummary = page.locator(`//*[@class='p-4']`);
    this.clickredirectimportpage = page.locator(`//button[normalize-space()='Go to Imported Files List']`);
    this.clickfilter = page.locator(`//*[@class='space-x-2 pt-3 pb-5 flex justify-end items-center']//button[@type='button']`);
    this.importauthdetail = page.locator(`//*[@class='bg-secondary-500 border border-layoutBorder p-3']`);
    this.newstatus = page.locator(`//span[contains(text(),'New')]`);
    this.afterimportid = page.locator(`//*[text()='File ID']/parent::div//div[contains(@class,'font-semibold')]`);
    this.pendingauthpage = page.getByRole('cell', { name: 'Pending Acceptance Records', exact: true });
    this.pendingauthfilter = page.getByRole('button', { name: 'Filter' });
    this.fileidfilter = page.getByPlaceholder('Search By File ID, File Name');
    this.clickapply = page.getByRole('button', { name: 'Apply' });
    this.clientname = page.locator(`//*[@class=' w-fit font-semibold text-blue-800']`);
    this.authnumber = page.locator(`//*[@class='text-sm block leading-relaxed break-words w-full']//div[@class='font-semibold text-[#333333]']`);
    this.errortext = page.locator(`//*[@class='bg-red-50 rounded-md px-3 py-2 w-full']//ul//li`);
    this.clickauthellipse = page.locator(`//*[@class='lucide lucide-ellipsis-vertical  w-5 h-5']`);
    this.ellipseoptions = page.getByRole('menu');
    this.clickacceptnignore = page.locator(`//*[@role='menuitem' and text()='Accept & Ignore Warning(s)']`);
  }

  // ================= POPUP OPEN =================
  async importedauthpage() {
    await this.clickellipse.click();
    try {
      await expect(this.clickellipse).toBeVisible();
      console.log('✅ Ellipse icon is visible');
    } catch {
      console.log('❌ Ellipse icon is NOT visible');
    }

    await this.clickimportfile.click();
    this.popupPage = await this.page.waitForEvent('popup');
    return this.popupPage;
  }

  // ================= IMPORT FILE =================
  async importpop() {
    try {
      await expect(this.clickbrowse).toBeVisible();
      await expect(this.clickbrowse).toBeEnabled();
      console.log('✅ Browse option is visible and enabled');
    } catch {
      console.log('❌ Browse option is NOT visible and not clickable');
    }

    await this.clickbrowse.setInputFiles(path.resolve('data/Authorizations.csv'));
    await this.proceedimport.click();

    const idwhileimport = await this.summaryfileid.innerText();
    console.log('Generated File ID:', idwhileimport);

    const summaryprint = await this.importsummary.allInnerTexts();
    summaryprint.forEach(line => console.log('Import summary:', line));
    try {
      await expect(this.clickredirectimportpage).toBeVisible();
      await expect(this.clickredirectimportpage).toBeEnabled();
      console.log('✅ Redirect to import page button is visible and enabled');
    } catch {
      console.log('❌ Redirect to import page button is not visible');
    }

    await this.clickredirectimportpage.click();
    return idwhileimport;
  }

  // ================= OPEN IMPORTED FILE =================
  async filemanage(idwhileimport: string) {
    await this.page.getByText(idwhileimport, { exact: true }).last().click();
    this.popupPage = await this.page.waitForEvent('popup');
    return this.popupPage;
  }

  // ================= READ POPUP + RETURN FILE ID =================
  async importedlist(): Promise<string> {
    const print = await this.importauthdetail.allInnerTexts();
    print.forEach(line => console.log('Opened File Details:', line));
    await this.page.waitForTimeout(5000);
    const importstatus = await this.newstatus.count();
    console.log(importstatus);
    await this.page.locator(`//*[@class='space-x-2 pt-3 pb-5 flex justify-end items-center']//button[@type='button']`).click();
    if (importstatus <= 1) {
      console.log('No new imports found');
      return 'NO_IMPORTS';
    }

    const idoffile = await this.afterimportid.innerText();
    console.log('Captured File ID:', idoffile);
    return idoffile;
  }

  // ================= MAIN PAGE FLOW =================
  async processImportedAuth(idoffile: string) {
    // Bring main page to focus and ensure it's stable
    await this.page.bringToFront();
    await this.page.waitForLoadState('networkidle');
    await this.page.click('body'); // Force focus by clicking page
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.getByText('CDS').hover();
    await this.page.getByText('IRIS Auth Import').hover();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown'); // Imported Authorization Files
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown'); // Pending Acceptance Records
    await this.page.waitForTimeout(1000);

    // Select
    await this.page.keyboard.press('Enter');
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.getByPlaceholder('Search By File ID, File Name').fill(idoffile);
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(4000);
    const clientnamelist = (await this.clientname.allInnerTexts()).map(name => name.trim())
      .filter(name => name.length > 0);
    clientnamelist.forEach(name => console.log('Client name:', name));
    await this.page.waitForLoadState('networkidle');
    const authnumberlist = (await this.authnumber.allInnerTexts()).map(a => a.trim())
      .filter(a => a.length > 0);
    authnumberlist.forEach(auth => console.log('Auth number:', auth));
    const errorlist = (await this.errortext.allInnerTexts()).map(e => e.trim())
      .filter(e => e.length > 0);
    errorlist.forEach(e => console.log('Error Text:', e));
    await this.page.waitForLoadState('networkidle');
    await this.page.locator("//button[contains(@class,'right-0 top-1/2 -translate-y-1/2 bg-[#7a7a76] p-2 shadow-lg rounded-full z-50')]").click();

    const eliipc = await this.clickauthellipse.count();
    console.log('ellipse count:', + eliipc);
    for (let i = 1; i < eliipc; i++) {

      await this.clickauthellipse.nth(i).click();
      const optionslist = (await this.ellipseoptions.allInnerTexts()).map(o => o.trim()).filter(o => o.length > 0);
      optionslist.forEach(o => console.log('Ellipse options:', o));

      // Take first error & extract first word
      const currentError = errorlist[i - 1];
      console.log('Current Error:', currentError, [i]);

      if (currentError.toLowerCase().includes('no error')) {
        console.log('✅ No Errors found → clicking Accept option');

        const [acceptpopup] = await Promise.all([
          this.page.waitForEvent('popup', { timeout: 5000 }),
          this.clickacceptnignore.click(),
        ]);
        await this.page.waitForLoadState('networkidle');
        const msg = await acceptpopup.locator(
          `//*[@class='rounded-sm bg-background flex flex-col w-full shadow-sm border-body-card-layout-border border']`
        ).allInnerTexts();

        console.log(msg.join('\n'));
        await this.page.waitForLoadState('networkidle');
        await acceptpopup.close();
      } else {

        // Take first error & extract first word
        const keyword = currentError
          .toLowerCase()
          .replace(/not mapped/g, '')
          .trim()
          .split(' ')[0];

        console.log(`🔺 Error keyword detected: ${keyword}`);

        for (let j = 0; j < optionslist.length; j++) {
          if (optionslist[j].toLowerCase().includes(keyword)) {
            console.log(`✅ options found: ${optionslist[j]}`);
            const [errorpopup] = await Promise.all([
              this.page.waitForEvent('popup', { timeout: 5000 }),
              this.ellipseoptions.nth(j).click(),
            ]);

            await errorpopup.waitForLoadState();
            await errorpopup.waitForLoadState('networkidle');
            await errorpopup.locator(`//*[@class='bg-body min-h-dvh pb-5']`).screenshot({ path: 'screenshots/' + 'auth' + '_' + getCurrentTime() + '.png' });
            await errorpopup.close();
            break;
          }
        }
      }
    }

    await this.page.getByRole('button', { name: 'Filter' }).click();
    // CLIENT NAVIGATION
    await this.page.locator(`//span[normalize-space()='Client']`).hover();
    await this.page.locator(`//div[normalize-space()='Client List - All']`).click();
    await this.page.waitForLoadState('networkidle');

    for (const cname of clientnamelist) {
      console.log('Searching client:', cname);
      await this.clientlist.clicksearch.fill(cname);
      await this.page.waitForTimeout(4000);
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(4000);
      const clientLocator = this.page.getByText(cname).last();

      if (await clientLocator.count() > 0) {
        await clientLocator.click();

      } else {
        await this.intakeprofile.authdetail.click();
      }
      await this.page.waitForLoadState('networkidle');

      for (const authno of authnumberlist) {
        const authLocator = this.page.getByText(authno, { exact: true });

        if (await authLocator.count() > 0) {
          await authLocator.click();
          console.log(`✅ Auth exists for ${cname}: ${authno}`);
        } else {
          console.log(`⚠ Auth not available for ${cname}: ${authno}`);

        }
      }
    }
  }
}