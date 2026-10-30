// Keep bookmarked section and source links working after the page split.
const legacyAnchors = {"definicio": "index.html", "net-title": "index.html", "net-desc": "index.html", "nodefill": "index.html", "tipus": "tipus.html", "ia-especialitzada": "tipus.html", "ia-proposit-general": "tipus.html", "ia-agi": "tipus.html", "funciona": "funciona.html", "demo-button": "funciona.html", "demo-result": "funciona.html", "entrenament": "entrenament.html", "models": "models.html", "perplexity": "models.html", "gemini-comptes": "models.html", "gemini-comptes-title": "models.html", "comparativa": "comparativa.html", "fonts": "fonts.html", "font-1": "fonts.html", "font-2": "fonts.html", "font-3": "fonts.html", "font-4": "fonts.html", "font-5": "fonts.html", "font-6": "fonts.html", "font-7": "fonts.html", "font-8": "fonts.html", "font-9": "fonts.html", "font-10": "fonts.html", "font-11": "fonts.html", "font-12": "fonts.html", "font-13": "fonts.html", "font-14": "fonts.html", "font-15": "fonts.html", "font-16": "fonts.html", "font-17": "fonts.html", "font-18": "fonts.html", "font-19": "fonts.html", "font-20": "fonts.html", "credit-perplexity": "fonts.html", "credit-openai": "fonts.html", "credit-claude": "fonts.html", "credit-gemini": "fonts.html", "credit-mistral": "fonts.html", "credit-meta": "fonts.html", "credit-deepseek": "fonts.html", "credit-copilot": "fonts.html"};
function redirectLegacyAnchor() {
  if (!location.pathname.endsWith('/ia-general/') && !location.pathname.endsWith('/ia-general/index.html')) return;
  const target = legacyAnchors[decodeURIComponent(location.hash.slice(1))];
  if (target && target !== 'index.html') location.replace(target + location.hash);
}
redirectLegacyAnchor();
window.addEventListener('hashchange', redirectLegacyAnchor);
const menu = document.getElementById('menu');
const index = document.getElementById('index');
function closeMenu() {
  index.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  index.classList.toggle('open', open);
});
index.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && index.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
const example = document.getElementById('demo-button');
if (example) example.addEventListener('click', () => {
  const open = example.getAttribute('aria-expanded') !== 'true';
  example.setAttribute('aria-expanded', String(open));
  document.getElementById('demo-result').hidden = !open;
  const labels = {ca:['Amaga l’exemple','Mostra una continuació possible'],es:['Oculta el ejemplo','Muestra una continuación posible'],en:['Hide the example','Show a possible continuation']};
  example.textContent = (labels[document.documentElement.lang] || labels.ca)[open ? 0 : 1];
});
const dialog = document.getElementById('gemini-dialog');
const trigger = document.querySelector('.image-zoom');
if (dialog && trigger && typeof dialog.showModal === 'function') {
  trigger.addEventListener('click', event => {
    event.preventDefault();
    dialog.showModal();
    document.documentElement.classList.add('image-dialog-open');
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-dialog-open');
    trigger.focus();
  });
}
