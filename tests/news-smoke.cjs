const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
require('node:fs').mkdirSync('review',{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.NEWS_BASE_URL || 'http://127.0.0.1:8765/';
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:960});
  await page.goto(base+'noticies.html');
  await page.waitForSelector('#news-filters button');
  assert.equal(await page.locator('.news-card').count(),5);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${width}`);
  const dates=await page.locator('.news-card time').evaluateAll(es=>es.map(e=>e.dateTime));
  assert.deepEqual(dates,[...dates].sort().reverse());
  await page.getByRole('button',{name:'Recursos',exact:true}).click();
  assert.equal(await page.locator('.news-card:visible').count(),1);
  await page.getByRole('button',{name:'Totes',exact:true}).click();
  for(let i=0;i<5;i++){
   await page.locator('.news-card').nth(i).click();
   await page.waitForSelector('#news-dialog[open]');
   await page.locator('#article-content img').evaluateAll(async images=>Promise.all(images.map(i=>i.decode().catch(()=>{}))));
   assert(await page.locator('#article-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`article overflow ${width}/${i}`);
   assert(await page.locator('#article-content').evaluate(e=>e.querySelectorAll('h1').length===1));
   assert(await page.locator('#close-article').isVisible());
   if(width===390 && i===2) await page.screenshot({path:'review/reader-mobile.png'});
   await page.keyboard.press('Escape');
   assert(await page.locator('.news-card').nth(i).evaluate(e=>document.activeElement===e));
  }
  if(width===1440 || width===390) {
   await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});
   await page.screenshot({path:`review/news-${width}.png`,fullPage:true});
  }
 }
 for(const lang of ['es','en']){
  await page.goto(base+lang+'/noticies.html');
  await page.locator('.news-card').first().click();
  await page.waitForSelector('#news-dialog[open]');
  assert(await page.locator('#article-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await page.keyboard.press('Escape');
 }
 await page.goto(base+'noticies.html');
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 await page.locator('.news-card').nth(3).click();
 await page.waitForSelector('#news-dialog[open]');
 await page.screenshot({path:'review/reader-dark.png',fullPage:true});
 await page.keyboard.press('Escape');
 // Network failure must fall back to the article's normal URL.
 await page.route('**/noticia-mit-ia-educacio.html',route=>route.request().resourceType()==='fetch'?route.abort():route.continue());
 await page.locator('a.news-card[href="noticia-mit-ia-educacio.html"]').click();
 await page.waitForURL('**/noticia-mit-ia-educacio.html');
 assert.equal(errors.length,0,errors.join('\n'));
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.goto(base+'noticies.html');
 await nojs.locator('.news-card').first().click();
 await nojs.waitForURL('**/noticia-entrevista-miquel-angel-prats.html');
 console.log('PASS: responsive 1440/768/390/320, all 5 readers, filters, dates, focus return, Escape, ES/EN, dark mode, fetch fallback and no-JS navigation. No JS errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
