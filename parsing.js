require ('dotenv').config ()
const {Telegraf} = require ("telegraf")
const puppeteer = require('puppeteer');

const URL = 'https://www.wildberries.ru/catalog/zhenshchinam/odezhda/bluzki-i-rubashki';

const bot = new Telegraf(process.env.BOT_TOKEN)
let i = 0;
bot.on ("message", async (ctx) =>{
const msg = ctx.message.text.toLowerCase ()

if (msg.includes ("t-shirt")) {
  ctx.reply ('Best t-shirts for a woman on Wildberries...Please Hold on...')
   puppeteer.launch({ headless: false}).then(async browser => {
    const page = await browser.newPage();
     await page.goto(URL, {waitUntil: 'networkidle0'});
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
    const result = await page.evaluate(() => {
        try {
            var data = [];
            $('div.product-card__wrapper').each(function() {
                const url = $(this).find('a').attr('href')
                 data.push({
                     'url'   : url
                });
            });
            return data; 
        } catch(err) {
            reject(err.toString());
        }
    });
    await browser.close();
       do {
      ctx.reply ( `${result[i].url}`);
      i++;
    } while (i < 3);

    })}
})
bot.launch ()