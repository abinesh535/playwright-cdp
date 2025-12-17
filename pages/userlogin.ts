import { test, expect, Locator, Page } from '@playwright/test';

export class klogin{

    readonly page: Page;
    readonly user:Locator;
    readonly pwd:Locator;
    readonly proceed:Locator

    constructor(page:Page){

         this.page = page;
         this.user = page.getByPlaceholder('User Name');
         this.pwd=page.getByPlaceholder('Password');
         this.proceed=page.locator("//button[@id='btn_login']");
    }

    async signin(id:string, pd:string){

        await this.user.fill(id);
        await this.pwd.fill(pd);
        await this.proceed.click();
    }
}

