import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { klogin } from '../pages/userlogin';

//load .env.staging file that has url and credentials
dotenv.config({ path: '.env.staging' });
//dotenv.config({ path: '.env.working' });

let rolelogin: klogin;

test('Login page', async ({ page }) => {

  test.setTimeout(90000)
  await page.goto(`${process.env.BASE_URL}${process.env.PRODUCT_URL}`); //get url from env
  rolelogin = new klogin(page);
  await rolelogin.signin(process.env.loginUSERNAME!, process.env.loginPASSWORD!);
   await page.waitForTimeout(4000);
  // await page.getByText('Home Health', { exact: true }).click();
  await page.context().storageState({ path: 'storage/kanTimeAuth.json' })
  await page.waitForTimeout(7000);
})
