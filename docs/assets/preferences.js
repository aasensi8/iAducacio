(() => {
  const root = document.documentElement;
  let stored;
  try { stored = localStorage.getItem('iaducacio-theme'); } catch {}
  root.dataset.theme = stored === 'dark' || stored === 'light' ? stored : 'light';
  const lang = root.lang || 'ca';
  const labels = {ca:['Activa el mode fosc','Activa el mode clar','Fosc','Clar'],es:['Activar el modo oscuro','Activar el modo claro','Oscuro','Claro'],en:['Switch to dark mode','Switch to light mode','Dark','Light']}[lang] || [];
  function ready(){
    const button = document.querySelector('[data-theme-toggle]');
    const refresh = () => {if (!button) return; const dark=root.dataset.theme==='dark';button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',labels[dark?1:0]);button.title=labels[dark?1:0];button.textContent=(dark?'☀ ':'☾ ')+labels[dark?3:2];};
    refresh();
    button?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('iaducacio-theme',root.dataset.theme);}catch{}refresh();});
    window.addEventListener('storage',event=>{if(event.key==='iaducacio-theme'){root.dataset.theme=event.newValue==='dark'?'dark':'light';refresh();}});
    document.querySelectorAll('[data-language]').forEach(link=>{const url=new URL(link.href);url.hash=location.hash;if(location.search)url.search=location.search;link.href=url.href;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
