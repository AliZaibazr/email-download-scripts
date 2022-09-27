import puppeteer from 'puppeteer';
import { createCursor, installMouseHelper } from 'ghost-cursor'
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
import * as dotenv from 'dotenv';

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
    
		await page.goto(url);
    
    const cursor = createCursor(page)
    await Login(page,cursor);
    await click_tabs(page,cursor,"a[title='Address Book']"); //Click Contact Tab
    await click_left_tab(page,cursor,"#group_All");
    await click_left_tab(page,cursor,"#group_Remembered");
    await click_left_tab(page,cursor,"#group_Favourites");
    await click_tabs(page,cursor,"#signOut");
    
    

		await page.waitFor(1500);

		await page.close();

	await browser.close();
})();

async function Login(page,cursor) {
  await page.waitForSelector('#email', {timeout: 0})
  await cursor.move("#email");  
  await cursor.click();  
  await page.waitForTimeout(randomIntFromInterval(2000,3000));

    await page.$eval("#email",(el, email) => {
      return el.value = email;
   }, process.env.email,{timeout: 0});

   await page.waitForTimeout(randomIntFromInterval(2000,3000));
  await cursor.move("#password");  
  await cursor.click();  
   await page.$eval("#password",(el, password) => {
    return el.value = password;
 }, process.env.password,{timeout: 0});

   


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

/*
import puppeteer from 'puppeteer';

const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
import * as dotenv from 'dotenv';
var fs = require('fs');
dotenv.config();

(async () => {

	// Use the reCaptcha plugin
	puppeteerExtra.use(
		RecaptchaPlugin({
			provider: { id: '2captcha', token: process.env.captchaToken },
			visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
		})
	);

	puppeteerExtra.use(pluginStealth());
	const browser = await puppeteerExtra.launch({ headless: false });

	// Normal browser from normal puppeteer
	// const browser = await puppeteer.launch({ headless: false });

	const url = 'https://www.g2.com/categories?view_hierarchy=true';//'https://www.zillow.com/homes/%0913905--ROYAL-BOULEVARD-cleveland-ohio_rb/33601155_zpid/';


		console.log('starting attempt:');
		const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setDefaultTimeout (0);
        await page.waitFor(randomIntFromInterval(2000,3000));


    await page.goto(url, { timeout: 0 });
    await page.waitForSelector('.newspaper-columns__list-item', {timeout: 0})
        await page.waitFor(randomIntFromInterval(2000,3000));
        await initial_set_up(page);
        await page.waitForSelector('.newspaper-columns__list-item', {timeout: 0});

        await page.waitFor(randomIntFromInterval(2000,3000));

        console.log('kaki');
        await generate_category_data_and_store_it_local_storage(page);
        await page.waitFor(randomIntFromInterval(2000,3000));
        let categories = await get_category_data(page);
        let i = 0;
        while(i<803)
        {
          categories.shift();
          i = i + 1;
        }
        
    
        console.log("here goes",categories);
        let object = '';
        while(categories.length>0)
        {     
          object = categories.shift()
        await page.waitFor(randomIntFromInterval(2000,3000));
        await page.goto(object['url'], { timeout: 0 });
        let cet = await page.evaluate(()=> document.querySelector('.ellipsis--2-lines') )
    if(cet)
    {
      continue;
    }
        await page.waitForSelector('.show-for-xlarge', {timeout: 0});
        await page.waitFor(randomIntFromInterval(2000,3000));
        let response = await generate_software_data(page);
        if(response == undefined || response == null )
        {  
            await page.waitFor(randomIntFromInterval(2000,3000));
            let softwares = await get_software_data(page);
            // let soft_index = 0;
            // while(soft_index<222)
            // {
            //   console.log(softwares.shift());
            //   soft_index = soft_index + 1;
            // }
            console.log('software',softwares);
            let software_page_url;
            while(softwares.length>0)
            {
               software_page_url = softwares.shift();
                console.log('software remaining->',softwares.length);
                await page.waitFor(randomIntFromInterval(2000,3000));
                await page.goto(software_page_url, { timeout: 0 });
                await page.waitFor(randomIntFromInterval(2000,3000));
                

                await store_software_data_in_local_storage(page,object);
                console.log('data saved');
                let data = await page.evaluate( () => localStorage.getItem('datas') );
                fs.appendFile('second_col_2.txt', data , function (err) {
                  if (err) throw err;
                  console.log('File is created successfully.');
                }); 
                await page.evaluate( () => localStorage.removeItem('datas') );
            }
            await page.evaluate( () => localStorage.removeItem('softwares') );
        }
        
        }
		try {
			await page.waitForSelector('.error-content-block', { timeout: 0 });
			console.log('we found a recaptcha on attempt:');

			await (<any>page).solveRecaptchas();
			await Promise.all([
				page.waitForNavigation(),
				page.click('[type="submit"]')
			]);
		}
		catch (e) {
			console.log('no recaptcha found on attempt:');
		}

		await page.waitFor(50000);

		//await page.close();


	//await browser.close();
})();


async function initial_set_up(page)
{
     await page.evaluate( () => { localStorage.removeItem('data');localStorage.removeItem('softwares');localStorage.removeItem('datas');  } );
}

async function store_software_data_in_local_storage(page,object)
{
    await page.waitForSelector('.c-midnight-100', {timeout: 0});
    await page.waitFor(randomIntFromInterval(2000,3000));
    await page.evaluate( (object) => { 
var data = {};
var datas = localStorage.getItem('datas') ? JSON.parse(localStorage.getItem('datas')) : [];
var aTags = document.getElementsByTagName("div");
var year_founded = "Year Founded";
var company_website = "Company Website";
var hq_loc = "HQ Location";
var des = "Description";
var twiiter = "Twitter";
var linkedin = "LinkedIn® Page";
var revenue = "Total Revenue (USD mm)";
var found;
let element = document.querySelector('.c-midnight-100') as HTMLElement;
data['title'] = element.innerText;
for (var i = 0; i < aTags.length; i++) {
  if (aTags[i].textContent == year_founded) {
    data['year_founded'] = aTags[i].parentElement.innerText.split(year_founded)[1].trim();
  }
  else if (aTags[i].textContent == company_website) {
    data['company_website'] = aTags[i].parentElement.innerText.split(company_website)[1].trim();
  }
  else if (aTags[i].textContent == hq_loc) {
    data['hqLoc'] = aTags[i].parentElement.innerText.split(hq_loc)[1].trim();
  }
  else if (aTags[i].textContent == des) {
    data['des'] = aTags[i].parentElement.innerText.split(des)[1].trim();
  }
  else if (aTags[i].textContent == twiiter) {
     if(aTags[i].parentElement.innerHTML.indexOf('<br>') != -1 )
        data['twitter'] = aTags[i].parentElement.innerHTML.match(/<\/div>(.*?)<br>/)[1];
    else
        data['twitter'] = aTags[i].parentElement.innerHTML.split('</div>')[1];
  }
  else if (aTags[i].textContent == linkedin) {
    data['linkedIn'] = aTags[i].parentElement.lastElementChild.previousElementSibling.getAttribute('href');
    data['employee'] = aTags[i].parentElement.innerText.split("\n")[aTags[i].parentElement.innerText.split("\n").length - 1];
  }
  else if (aTags[i].textContent == revenue) {
    data['revenue'] = aTags[i].parentElement.innerHTML.replace(new RegExp('.*' + "</div>"), '');
  }
 
}

data['category'] = object['category'];
data['sub_cat'] = object['sub_cat'];
let data_keys = Object.keys(data);
data_keys.includes('title') == false ? data['title']= 'n/a' : '' ;
data_keys.includes('year_founded') == false ? data['year_founded']= 'n/a' : '' ;
data_keys.includes('company_website') == false ? data['company_website']= 'n/a' : '' ;
data_keys.includes('hqLoc') == false ? data['hqLoc']= 'n/a' : '' ;
data_keys.includes('des') == false ? data['des']= 'n/a' : '' ;
data_keys.includes('twitter') == false ? data['twitter']= 'n/a' : '' ;
data_keys.includes('employee') == false ? data['employee']= 'n/a' : '' ;
data_keys.includes('revenue') == false ? data['revenue']= 'n/a' : '' ;;


datas.push(data);

localStorage.setItem('datas',JSON.stringify(datas));},object);
}

async function generate_software_data(page)
{

    let count_number = await page.evaluate(()=>document.querySelector('.show-for-xlarge'));
    if(count_number == null)
    {
        return false;
    }

await page.waitFor(randomIntFromInterval(2000,3000));
await page.waitForSelector('.product-listing__title', {timeout: 0});
await page.waitForSelector('a.d-ib.c-midnight-100.js-log-click', {timeout: 0});
await page.evaluate( () => {

                let softwares = localStorage.getItem('softwares') == null ? [] :  JSON.parse(localStorage.getItem('softwares')); document.querySelectorAll('.product-listing__title a.d-ib.c-midnight-100.js-log-click').forEach((i,e)=>{softwares.push(i.getAttribute('href'))});
                localStorage.setItem('softwares',JSON.stringify(softwares))
} );
await page.waitFor(randomIntFromInterval(2000,3000));
       // await page.waitForSelector('.pagination__page-number--current', {timeout: 0});
       let pagination = await page.evaluate( ()=> document.querySelector('.pagination__page-number--current') && document.querySelector('.pagination__page-number--current').nextElementSibling )
        console.log("pagination",pagination);
        if(pagination)
        {
         let pagi_url =  await page.evaluate( ()=> document.querySelector('.pagination__page-number--current').nextElementSibling.firstElementChild.getAttribute('href') );
         await page.goto(pagi_url, { timeout: 0 });
await generate_software_data(page)
        }

}

async function get_software_data(page)
{
return await page.evaluate( () => JSON.parse(localStorage.getItem('softwares')) );
}

async function get_category_data(page)
{
return await page.evaluate( () => JSON.parse(localStorage.getItem('data')) );
}

async function generate_category_data_and_store_it_local_storage(page)
{
        await page.waitForSelector('.newspaper-columns__list-item', {timeout: 0});
await page.evaluate( () => { 
                    let data = []; document.querySelectorAll('.newspaper-columns__list-item a').forEach((e,i)=>{let d = {}; d['category'] = (e.closest(".newspaper-columns__list-item").firstElementChild as HTMLElement).innerText; d['sub_cat'] = (e as HTMLElement).innerText;d['url'] = 'https://www.g2.com'+e.getAttribute('href'); data.push(d)});localStorage.setItem('data',JSON.stringify(data));
});
}


*/
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}