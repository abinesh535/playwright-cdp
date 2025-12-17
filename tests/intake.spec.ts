import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { kantimepage } from '../pages/menupage';
import { intakepage } from '../pages/addintake';
import{Assert} from '../utils/assertions';
import{intakepageedit} from '../pages/intakeprofile';
import{createauth} from '../pages/auth';

let menus:kantimepage;
let newintake:intakepage;
let validate:Assert;
let intakepatient:intakepageedit;
let publicvendorauth:createauth;
test.use({ storageState: 'storage/kanTimeAuth.json' });

test('Add intake', async ({page}) => {
    test.slow();              
    test.setTimeout(10 *60 * 1000);
    await page.goto('https://staging.kantimehealth.net/HH/Z1/UI/Common/NewCustomUser.aspx')
    //await page.goto(`https://working.kantimehealth.net/HH/Z1/UI/Common/DashboardMaster.aspx`);
    menus=new kantimepage(page);
    await menus.menu();
    await menus.submenu();
    newintake=new intakepage(page);
    await newintake.addintake('austin','test20');
    validate=new Assert(page);
    await validate.duplicatecheck();
    await page.waitForTimeout(6000);
    await validate.hasurl();
    intakepatient=new intakepageedit(page);
    await intakepatient.demographicfill();
    await intakepatient.payerfill();
    await intakepatient.intakefill();
    await intakepatient.todofill();
    await intakepatient.acceptintake();
    await intakepatient.div();  
    await page.waitForTimeout(7000);
    publicvendorauth=new createauth(page);
    const popupPage = await intakepatient.authfill(); 
    await popupPage.publicvendor();
    await page.waitForTimeout(7000);
})

