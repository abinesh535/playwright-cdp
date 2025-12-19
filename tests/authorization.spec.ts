import { test, expect, chromium } from '@playwright/test';
import { kantimepage } from '../pages/menupage';
import { intakepage } from '../pages/addintake';
import { Assert } from '../utils/assertions';
import { intakepageedit } from '../pages/intakeprofile';
import { createauth } from '../pages/auth';
import { clientreport } from '../pages/clientlist';
import { faker } from '@faker-js/faker';

 const fakerauth = faker.word.words(1);
       const enterauth=`auth${faker.number.int({ min: 100, max: 999 })}`;
       //console.log(enterauth);


let menus: kantimepage;
let newintake: intakepage;
let validate: Assert;
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
    await newintake.addintake('austin', 'test20');
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
    await popupPage.publicvendor();
    await validate.authurl();
    await popupPage.authsave();
    await validate.validateauthdata();
    await page.waitForTimeout(6000);
})

let clientiris: clientreport;
test('@addfromexist Add auth from client', async ({ page }) => {
    test.slow();
    test.setTimeout(1 * 60 * 1000);
    await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
    //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
    clientiris = new clientreport(page);
    await clientiris.clientlistpage();
    await page.waitForTimeout(7000);

    intakepatient=new intakepageedit(page);
    const popupPage = await intakepatient.authfill();
    const newAuth = new createauth(popupPage);
    await newAuth.saveemptyauth("test");
    await newAuth.publicvendor( enterauth);
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


