const legacyAnchors = {"inici": "index.html", "normativa": "normativa.html", "prompts": "prompts.html", "iaducacio-prompts": "prompts.html", "afinament-iteracio": "prompts.html", "metaprompting": "prompts.html", "prompting-iteracio-metaprompting": "prompts.html", "level": "prompts.html", "topic": "prompts.html", "task": "prompts.html", "format": "prompts.html", "source": "prompts.html", "build": "prompts.html", "fp": "prompts.html", "prompt-output": "prompts.html", "copy": "prompts.html", "copy-status": "prompts.html", "revisio": "revisio.html", "verificar-resposta": "revisio.html", "personalitzar": "personalitzar.html", "fonts": "fonts.html", "font-1": "fonts.html", "font-2": "fonts.html", "font-3": "fonts.html", "font-4": "fonts.html", "font-5": "fonts.html", "font-6": "fonts.html", "font-7": "fonts.html", "font-8": "fonts.html", "font-9": "fonts.html", "font-10": "fonts.html", "font-11": "fonts.html", "font-12": "fonts.html", "font-13": "fonts.html", "font-14": "fonts.html", "font-15": "fonts.html"};
function redirectLegacyAnchor() {
 if (!location.pathname.endsWith('/comprendre-ia/') && !location.pathname.endsWith('/comprendre-ia/index.html')) return;
 const target=legacyAnchors[decodeURIComponent(location.hash.slice(1))];
 if(target && target!=='index.html') location.replace(target+location.hash);
}
redirectLegacyAnchor();window.addEventListener('hashchange',redirectLegacyAnchor);
const menu=document.getElementById('menu'),index=document.getElementById('index');
function closeMenu(){index.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));index.classList.toggle('open',open)});
index.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&index.classList.contains('open')){closeMenu();menu.focus()}});
