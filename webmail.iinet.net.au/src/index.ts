import puppeteer from 'puppeteer';
import { createCursor, installMouseHelper } from 'ghost-cursor'
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
import * as dotenv from 'dotenv';
import { getEmails } from './emails';
dotenv.config();

(async () => {

	puppeteerExtra.use(pluginStealth());
	const browser = await puppeteerExtra.launch({ headless: false });

	// Normal browser from normal puppeteer
	// const browser = await puppeteer.launch({ headless: false });

	const url = process.env.url;//'https://www.zillow.com/homes/%0913905--ROYAL-BOULEVARD-cleveland-ohio_rb/33601155_zpid/';


    const page = await browser.newPage();
		// const page = await browser.newPage();
    
    await installMouseHelper(page)

    const cursor = createCursor(page)

    for (const email of getEmails()) {
      await page.goto(url);
      await Login(page,cursor,email.email,email.password);
      await click_tabs(page,cursor,"a[title='Address Book']"); //Click Contact Tab
      await click_left_tab(page,cursor,"#group_All");
      await click_left_tab(page,cursor,"#group_Remembered");
      await click_left_tab(page,cursor,"#group_Favourites");
      await click_tabs(page,cursor,"#signOut");
      
      
  
      await page.waitForSelector('#email', {timeout: 0})
  
    }

		await page.close();

	await browser.close();
})();

async function Login(page,cursor,var_email,var_password) {
  await page.waitForSelector('#email', {timeout: 0})
  await cursor.move("#email");  
  await cursor.click();  
  await page.waitForTimeout(randomIntFromInterval(2000,3000));

    await page.$eval("#email",(el, email) => {
      return el.value = email;
   }, var_email,{timeout: 0});

   await page.waitForTimeout(randomIntFromInterval(2000,3000));
  await cursor.move("#password");  
  await cursor.click();  
   await page.$eval("#password",(el, password) => {
    return el.value = password;
 }, var_password,{timeout: 0});

   


 await page.waitForSelector('.loginbtn', {timeout: 0})
 await cursor.move(".loginbtn");  
 await cursor.click();  
		
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
  await page.waitForSelector(selector, {timeout: 0});
  await cursor.move(selector);  
  await cursor.click(); 
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}