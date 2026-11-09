/* Progressive enhancement: every article remains a normal link without JavaScript. */
(() => {
  const lang = document.documentElement.lang.split('-')[0];
  const labels = {
    ca: {all:'Totes', news:'Actualitat', reflection:'Reflexions', resources:'Recursos', filter:'Filtra per categoria', count:'publicacions', reading:'min de lectura'},
    es: {all:'Todas', news:'Actualidad', reflection:'Reflexiones', resources:'Recursos', filter:'Filtrar por categoría', count:'publicaciones', reading:'min de lectura'},
    en: {all:'All', news:'News', reflection:'Reflections', resources:'Resources', filter:'Filter by category', count:'articles', reading:'min read'}
  }[lang] || {all:'All', news:'News', reflection:'Reflections', resources:'Resources', filter:'Filter by category', count:'articles', reading:'min read'};
  const grid = document.querySelector('.news-grid');
  const cards = [...document.querySelectorAll('.news-card')];
  const categoryFor = card => card.dataset.category || 'news';
  // Stable sort preserves the editorial order for publications on the same day.
  cards.sort((a,b) => (b.querySelector('time')?.dateTime || '').localeCompare(a.querySelector('time')?.dateTime || ''));
  cards.forEach(card => grid.append(card));
  const filters = document.querySelector('#news-filters');
  const status = document.querySelector('#news-status');
  if (filters && cards.length) {
    filters.setAttribute('role','group');
    filters.setAttribute('aria-label',labels.filter);
    ['all','news','reflection','resources'].forEach(category => {
      if (category !== 'all' && !cards.some(card => categoryFor(card) === category)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = labels[category];
      button.setAttribute('aria-controls','news-grid');
      button.setAttribute('aria-pressed',String(category === 'all'));
      button.addEventListener('click', () => {
        filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
        cards.forEach(card => { card.hidden = category !== 'all' && categoryFor(card) !== category; });
        status.textContent = `${cards.filter(card => !card.hidden).length} ${labels.count}`;
      });
      filters.append(button);
    });
    status.textContent = `${cards.length} ${labels.count}`;
  }
  const dialog = document.querySelector('#news-dialog');
  const content = document.querySelector('#article-content');
  if (!dialog || !content || typeof dialog.showModal !== 'function') return;
  let opening = false;
  let opener;
  cards.forEach(link => {
    link.addEventListener('click', async event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (opening) return;
      opening = true;
      link.setAttribute('aria-busy','true');
      try {
        const response = await fetch(link.href);
        if (!response.ok) throw new Error('Article unavailable');
        const page = new DOMParser().parseFromString(await response.text(), 'text/html');
        const article = page.querySelector('.news-article');
        const heading = article?.querySelector('h1');
        if (!article || !heading) throw new Error('Article missing');
        // Resolve resources against the article, including links to its own anchors.
        article.querySelectorAll('[src],[href]').forEach(element => {
          ['src','href'].forEach(attr => {
            if (element.hasAttribute(attr)) element.setAttribute(attr,new URL(element.getAttribute(attr),response.url).href);
          });
        });
        heading.id = 'article-title';
        heading.tabIndex = -1;
        const reading = document.createElement('p');
        reading.className = 'meta reading-time';
        reading.textContent = `${Math.max(1,Math.ceil(article.textContent.trim().split(/\s+/).length / 220))} ${labels.reading}`;
        heading.after(reading);
        content.replaceChildren(article);
        document.querySelector('#article-permalink').href = link.href;
        opener = link;
        dialog.showModal();
        content.scrollTop = 0;
        heading.focus({preventScroll:true});
      } catch {
        window.location.assign(link.href);
      } finally {
        opening = false;
        link.removeAttribute('aria-busy');
      }
    });
  });
  document.querySelector('#close-article').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus({preventScroll:true}));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
})();
