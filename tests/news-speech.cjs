const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage();
 await page.addInitScript(()=>{
  window.speechCalls=[];window.speechCanceled=0;
  window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'ca-ES',name:'Català'}],speak:u=>{window.lastUtterance=u;window.speechCalls.push({text:u.text,rate:u.rate,lang:u.lang,voice:u.voice})},cancel:()=>window.speechCanceled++,pause:()=>window.wasPaused=true,resume:()=>window.wasResumed=true}});
 });
 const base=process.env.NEWS_BASE_URL || 'http://127.0.0.1:8787/';
 await page.goto(base+'noticies.html');await page.locator('.news-card').first().click();
 const panel=page.locator('.news-speech');await panel.waitFor();
 await panel.getByRole('button',{name:'Reprodueix',exact:true}).click();
 let first=await page.evaluate(()=>speechCalls[0]);assert(first.text.startsWith('Google posa'));assert.equal(first.voice.lang,'ca-ES');assert.equal(first.rate,1);
 await panel.getByRole('button',{name:'Pausa',exact:true}).click();assert(await page.evaluate(()=>wasPaused));
 await panel.getByRole('button',{name:'Continua',exact:true}).click();assert(await page.evaluate(()=>wasResumed));
 for(const rate of ['0.75','1','1.25','1.5','2']){await panel.getByLabel('Velocitat').selectOption(rate);assert.equal(await page.evaluate(()=>speechCalls.at(-1).rate),Number(rate));}
 await panel.getByRole('button',{name:'Pausa',exact:true}).click();await panel.getByLabel('Velocitat').selectOption('1.25');await panel.getByRole('button',{name:'Continua',exact:true}).click();assert.equal(await page.evaluate(()=>speechCalls.at(-1).rate),1.25);
 await panel.getByRole('button',{name:'Atura',exact:true}).click();assert(await panel.getByRole('button',{name:'Pausa',exact:true}).isDisabled());
 await panel.getByRole('button',{name:'Reprodueix',exact:true}).click();
 const old=await page.evaluate(()=>{window.stale=lastUtterance;return speechCalls.length});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('.speech-status').textContent==='A punt per llegir');await page.evaluate(()=>stale.onend());assert.equal(await page.evaluate(()=>speechCalls.length),old);
 await page.locator('.news-card').nth(1).click();await panel.getByRole('button',{name:'Reprodueix',exact:true}).click();assert(!(await page.evaluate(()=>speechCalls.at(-1).text)).includes('Google posa'));
 await page.keyboard.press('Escape');
 await page.goto(base+'noticia-google-search-ia-centres-educatius.html');await panel.getByRole('button',{name:'Reprodueix',exact:true}).click();
 await page.evaluate(()=>{let safety=0;while(lastUtterance&&safety++<1000){const u=lastUtterance;lastUtterance=null;u.onend();}});
 assert.equal(await page.locator('.speech-status').textContent(),'Lectura finalitzada');
 const spoken=await page.evaluate(()=>speechCalls.map(c=>c.text).join(' '));assert(spoken.includes('La resposta a aquesta pregunta'));assert(!spoken.includes('Imatge il·lustrativa'));
 await page.screenshot({path:'review/article-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'review/article-mobile.png',fullPage:true});
 const unsupported=await browser.newPage();await unsupported.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{value:undefined}));await unsupported.goto(base+'noticia-google-search-ia-centres-educatius.html');assert((await unsupported.locator('.speech-status').textContent()).includes('no permet'));
 const real=await browser.newPage();await real.goto(base+'noticia-google-search-ia-centres-educatius.html');await real.waitForTimeout(500);console.log('Real browser speech support:',await real.evaluate(()=>({supported:!!speechSynthesis,voices:speechSynthesis.getVoices().map(v=>v.lang).filter(x=>x.startsWith('ca'))})));
 console.log('PASS: shared and standalone reader, play/pause/resume/stop, 5 speeds, rate while paused, stale callback protection, close cancellation, article switching, full article completion, unsupported browser fallback.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
