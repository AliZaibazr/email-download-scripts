import puppeteer from 'puppeteer';
import { createCursor, installMouseHelper } from 'ghost-cursor'
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
import * as dotenv from 'dotenv';
import { getEmails } from './emails';

dotenv.config();

(async () => {

  
  puppeteerExtra.use(pluginStealth());
  for (const email of getEmails()) {
      const browser = await puppeteerExtra.launch({ headless: false });
    
      // Normal browser from normal puppeteer
      // const browser = await puppeteer.launch({ headless: false });
    
      const url = process.env.url;//'https://www.zillow.com/homes/%0913905--ROYAL-BOULEVARD-cleveland-ohio_rb/33601155_zpid/';
    
    
        const page = await browser.newPage();
        // const page = await browser.newPage();
        
        await installMouseHelper(page)
        
        
        const cursor = createCursor(page)
      await page.goto(url);
      try {
        await Login(page,cursor,email.email,email.password);
      } catch (error) {
        console.log(error);
        
      }
      try {
        await page.waitForTimeout(randomIntFromInterval(3000,5000));
        await page.waitForNavigation({ waitUntil: 'networkidle0' ,timeout:15000});
      } catch (error) {
        console.log(error);
        
      }
      
      if( await page.$("#email") == null)
      {
        await click_tabs(page,cursor,"a[title='Address Book']"); //Click Contact Tab
        await page.waitForTimeout(randomIntFromInterval(3000,6000));
        let tabs_ids ;
        tabs_ids = await page.$eval("#Address_Book",function(liList){
          let it = [];document.querySelectorAll("#Address_Book #nav_secondary li").forEach((e)=>{it.push(e.getAttribute("id"))});
          console.log("TERRA KYA HO GA AHB");
          console.log(document.querySelectorAll("#Address_Book #nav_secondary li"));
          return it;
        });
        if(tabs_ids != undefined)
        {
          for (const tab of tabs_ids) {
            console.log(tab);
            await click_left_tab(page,cursor,"#"+tab);
            
          }
  
        }
      await click_tabs(page,cursor,"#signOut");
      await page.waitForSelector('#email', {timeout: 10000})
    }
    else
    {
      console.log("BAND KER DO YEAH CRENDENTIAALS");
    }

      await page.waitForTimeout(randomIntFromInterval(5000,8000));
  
      await page.close();
  
    await browser.close();
    }
    

})();

async function Login(page,cursor,var_email,var_password) {
  await page.waitForSelector('#email', {timeout: 10000})
  await page.click("#email");  
  // await cursor.click();  
  await page.waitForTimeout(randomIntFromInterval(2000,3000));

    await page.$eval("#email",(el, email) => {
      return el.value = email;
   }, var_email,{timeout: 10000});

   await page.waitForTimeout(randomIntFromInterval(2000,3000));
  await page.click("#password");  
  // await cursor.click();  
   await page.$eval("#password",(el, password) => {
    return el.value = password;
 }, var_password,{timeout: 10000});

   


 await page.waitForSelector('.loginbtn', {timeout: 10000})
 await page.click(".loginbtn");  
//  await cursor.click();  
		
}

async function click_tabs(page,cursor,selector)
{
  await wait_and_move_and_click(page,cursor,2000,3000,selector);
}

async function click_left_tab(page,cursor,selector)
{
  await wait_and_move_and_click(page,cursor,2000,3000,selector);

  await select_all_contacts(page,cursor);
  await export_contant_all(page,cursor);
}

async function select_all_contacts(page,cursor)
{
  await wait_and_move_and_click(page,cursor,2000,3000,"#action_more_contacts");
}

async function export_contant_all(page,cursor) {
  console.log("export cont5acct");
  await wait_and_move_and_click(page,cursor,2000,3000,"#action_more_exportall");
  console.log("ended export cont5acct");

}

async function wait_and_move_and_click(page,cursor,toTime,fromTime,selector) {
  await await page.waitForTimeout(randomIntFromInterval(toTime,fromTime));
  await page.waitForSelector(selector, {timeout: 10000});
  await page.click(selector);  
  // await cursor.click(); 
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
