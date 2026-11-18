(() => {
  const root = document.documentElement;
  const siteRoot = new URL('../', document.currentScript.src);
  const glossaryScript = document.createElement('script');
  glossaryScript.src = new URL('assets/glossary-tooltips.js', siteRoot).href;
  glossaryScript.defer = true;
  document.head.append(glossaryScript);
  let stored;
  try { stored = localStorage.getItem('iaducacio-theme'); } catch {}
  root.dataset.theme = stored === 'dark' || stored === 'light' ? stored : 'light';
  const lang = root.lang || 'ca';
  const labels = {ca:['Activa el mode fosc','Activa el mode clar','Fosc','Clar'],es:['Activar el modo oscuro','Activar el modo claro','Oscuro','Claro'],en:['Switch to dark mode','Switch to light mode','Dark','Light']}[lang] || [];
  function ready(){
    const brand = document.querySelector('.site-nav .site-brand');
    if (brand && !brand.querySelector('.brand-copy')) {
      const nameNode = Array.from(brand.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (nameNode) {
        const copy = document.createElement('span');
        copy.className = 'brand-copy';
        const name = document.createElement('span');
        name.className = 'brand-name';
        name.textContent = nameNode.textContent.trim();
        const subtitle = document.createElement('span');
        subtitle.className = 'brand-subtitle';
        subtitle.textContent = {ca:'Intel·ligència artificial i educació',es:'Inteligencia artificial y educación',en:'Artificial intelligence and education'}[lang.split('-')[0]] || 'Intel·ligència artificial i educació';
        copy.append(name, subtitle);
        nameNode.replaceWith(copy);
      }
    }
    const menu = document.querySelector('.site-nav .site-links');
    if (menu && !menu.querySelector('[data-glossary-link]') && !Array.from(menu.querySelectorAll('a')).some(a => new URL(a.href).pathname.endsWith('/glossari.html'))) {
      const link=document.createElement('a'); const language=['es','en'].includes(lang)?lang:'ca';
      link.href=new URL((language==='ca'?'':language+'/')+'glossari.html',siteRoot).href;
      link.textContent={ca:'Glossari',es:'Glosario',en:'Glossary'}[language]; link.dataset.glossaryLink=''; menu.append(link);
    }
    const button = document.querySelector('[data-theme-toggle]');
    const refresh = () => {if (!button) return; const dark=root.dataset.theme==='dark';button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',labels[dark?1:0]);button.title=labels[dark?1:0];button.textContent=(dark?'☀ ':'☾ ')+labels[dark?3:2];};
    refresh();
    button?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('iaducacio-theme',root.dataset.theme);}catch{}refresh();});
    window.addEventListener('storage',event=>{if(event.key==='iaducacio-theme'){root.dataset.theme=event.newValue==='dark'?'dark':'light';refresh();}});
    document.querySelectorAll('[data-language]').forEach(link=>{const url=new URL(link.href);url.hash=location.hash;if(location.search)url.search=location.search;link.href=url.href;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
