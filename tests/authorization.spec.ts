import { test, expect, chromium } from '@playwright/test';
import { kantimepage } from '../pages/menupage';
import { intakepage } from '../pages/addintake';
import { Assert } from '../utils/assertions';
import { intakepageedit } from '../pages/intakeprofile';
import { createauth } from '../pages/auth';
import { clientreport } from '../pages/clientlist';
import { faker } from '@faker-js/faker';
import { importauthactivities } from '../pages/importauth';
import { map } from '../pages/mapping';

test.describe.configure({ mode: 'serial' });

const fakerauth = faker.word.words(1);
const enterauth = `auth${faker.number.int({ min: 100, max: 999 })}`;

let clientiris: clientreport;
test('@publicvendorauth Add public vendor auth from client', async ({ page }) => {
  test.slow();
  test.setTimeout(1 * 60 * 1000);
  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
  //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
  const clientmenuAssert = new Assert(page);
  await clientmenuAssert.assertclientmenu();
  clientiris = new clientreport(page);
  await clientiris.clientlistpage();
  await page.waitForTimeout(7000);

  intakepatient = new intakepageedit(page);
  const popupPage = await intakepatient.authfill();
  const newAuth = new createauth(popupPage);
  await newAuth.saveemptyauth("test");
  let pvendoravailaable = await newAuth.publicvendor(enterauth);
  if (pvendoravailaable === false) {
    console.log('⛔vendor not found, Auth not saved');

    await popupPage.close();
    await page.close();
    return;                    //  stop further execution
  }
  await newAuth.authsave(enterauth);
  await page.waitForTimeout(6000);
  await popupPage.close();

  publicvendorauth = new createauth(page);
  const authPopup = await publicvendorauth.opencreatedauth(enterauth);
  await page.waitForTimeout(6000);

  await authPopup.authurl();
  await authPopup.validateauthdata();
  await authPopup.compareeauthnumber(enterauth); // pass the dynamic value to assertion as expected

})


test('@clientvendorauth Add client vendor auth from client', async ({ page }) => {
  test.slow();
  test.setTimeout(1 * 60 * 1000);
  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
  //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
  const clientmenuAssert = new Assert(page);
  await clientmenuAssert.assertclientmenu();
  clientiris = new clientreport(page);
  await clientiris.clientlistpage();
  await page.waitForTimeout(7000);

  intakepatient = new intakepageedit(page);
  const popupPage = await intakepatient.authfill();
  const newAuth = new createauth(popupPage);
  await newAuth.saveemptyauth("test");
  let vendoravailability = await newAuth.clientvendor(enterauth);

  if (vendoravailability === false) {
    console.log('⛔vendor not found, Auth not saved');

    await popupPage.close();
    await page.close();
    return;                    // stop further execution
  }
  await newAuth.authsave(enterauth);
  await page.waitForTimeout(6000);
  await popupPage.close();

  publicvendorauth = new createauth(page);
  const authPopup = await publicvendorauth.opencreatedauth(enterauth);
  await page.waitForTimeout(6000);

  await authPopup.authurl();
  await authPopup.validateauthdata();
  await authPopup.compareeauthnumber(enterauth); // pass the dynamic value to assertion as expected

})


let duplicateauth = 'testdupauth';
test('@addduplicate Dupliacte auth for client', async ({ page }) => {
  test.slow();
  test.setTimeout(1 * 60 * 1000);
  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
  //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
  clientiris = new clientreport(page);
  await clientiris.clientlistpage();
  await page.waitForTimeout(7000);
  intakepatient = new intakepageedit(page);
  const popupPage = await intakepatient.authfill();
  const newAuth = new createauth(popupPage);
  await newAuth.publicvendor(duplicateauth);
  await newAuth.authsave(enterauth);
  await page.waitForTimeout(7000);
  const authList = new createauth(page);
  await authList.authnumexist(duplicateauth);

})


test('@addfromimport Import auth for client', async ({ page }) => {
  test.slow();
  test.setTimeout(5 * 60 * 1000);

  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx');

  const assertPage = new Assert(page);
  await assertPage.assertcds();

  const menus = new kantimepage(page);
  await menus.cdsauthmenu();

  const mainImport = new importauthactivities(page);
  // ========= POPUP-1 =========
  const popup1 = await mainImport.importedauthpage();

  const popupImport = new importauthactivities(popup1);

  const idwhileimport = await popupImport.importpop();
  await popup1.close();

  // ========= POPUP-2 =========
  const popup2 = await mainImport.filemanage(idwhileimport);

  const popupFile = new importauthactivities(popup2);

  const idoffile = await popupFile.importedlist();
  await popup2.close();

  //  STOP if no imports
  if (idoffile === 'NO_IMPORTS') {
    console.log(' Skipping further steps – no imports available');
    return;
  }
  // ========= MAIN PAGE =========
  // Wait for main page to stabilize after popups close
  await page.waitForLoadState('networkidle');

  await mainImport.processImportedAuth(idoffile);
  await assertPage.assertPendingAuthdata();
})


test('@mappayer Map payer for auth', async ({ page }) => {
  test.slow();
  test.setTimeout(10 * 60 * 1000);
  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx');
  const payer = new map(page);
  await payer.mappayer();
})

let menus: kantimepage; 
let newintake: intakepage;
let validate: Assert
let intakepatient: intakepageedit;
let publicvendorauth: createauth;
test.use({ storageState: 'storage/kanTimeAuth.json' });
test('@createandadd Add intake and add auth', async ({ page }) => {
  test.slow();
  test.setTimeout(10 * 60 * 1000);
  await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
  //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
  menus = new kantimepage(page);
  await menus.menu();
  await menus.submenu();
  newintake = new intakepage(page);
  await newintake.addintake('austin', 'test25');
  validate = new Assert(page);
  await validate.duplicatecheck();
  await page.waitForTimeout(6000);
  await validate.hasurl();
  intakepatient = new intakepageedit(page);
  await intakepatient.demographicfill();
  await intakepatient.payerfill();
  await intakepatient.intakefill();
  await intakepatient.todofill();
  await intakepatient.acceptintake();
  await intakepatient.div();
  await page.waitForTimeout(7000);
  publicvendorauth = new createauth(page);
  const popupPage = await intakepatient.authfill();
  const fillAuth = new createauth(popupPage);
  await fillAuth.publicvendor(enterauth);
  await validate.authurl();
  await fillAuth.authsave(enterauth);
  await validate.validateauthdata();
  await page.waitForTimeout(6000);
})




