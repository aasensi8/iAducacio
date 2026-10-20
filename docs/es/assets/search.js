(() => {
  const query = (new URLSearchParams(location.search).get('q') || '').trim().slice(0,150);
  const input = document.querySelector('#site-query');
  const status = document.querySelector('#search-status');
  const results = document.querySelector('#search-results');
  input.value = query;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  const tokens = [...new Set(normalize(query).match(/[a-z0-9]+/g) || [])];
  if (!tokens.length) return;
  status.textContent = 'Buscando…';
  // Text is always inserted as text nodes, including queries and result excerpts.
  function excerpt(text) {
    const normalized = normalize(text);
    const hit = Math.max(0, normalized.indexOf(tokens[0]));
    let start = Math.max(0,hit-75);
    if (start) { const space = text.indexOf(' ',start); if(space>=0) start=space+1; }
    return (start?'…':'')+text.slice(start,start+260)+(start+260<text.length?'…':'');
  }
  function highlight(element,text) {
    const words=text.split(/([\p{L}\p{N}]+)/u);
    for(const word of words){
      if(tokens.some(t=>normalize(word).includes(t)) && /[\p{L}\p{N}]/u.test(word)){
        const mark=document.createElement('mark');mark.textContent=word;element.append(mark);
      }else element.append(document.createTextNode(word));
    }
  }
  fetch('assets/search-index.json').then(response => {
    if(!response.ok) throw new Error('Index unavailable');
    return response.json();
  }).then(index => {
    const found=index.map(item=>{
      const heading=normalize(item.title),page=normalize(item.page),text=normalize(item.text);
      const all=heading+' '+page+' '+text;
      if(!tokens.every(t=>all.includes(t)))return null;
      const score=tokens.reduce((n,t)=>n+(heading.includes(t)?12:0)+(page.includes(t)?4:0)+(text.includes(t)?1:0),0)+(heading.includes(normalize(query))?20:0);
      return {...item,score};
    }).filter(Boolean).sort((a,b)=>b.score-a.score);
    // Keep the most relevant excerpt for each destination.
    const seen=new Set();const unique=found.filter(item=>{if(seen.has(item.url))return false;seen.add(item.url);return true;});
    status.textContent=unique.length ? `${unique.length} ${unique.length===1?'resultado':'resultados'} para «${query}».` : `No se han encontrado resultados para «${query}». Prueba palabras más generales, como «evaluación», «Gemini» o «protección de datos».`;
    for(const item of unique){
      const li=document.createElement('li'),label=document.createElement('p'),h=document.createElement('h2'),link=document.createElement('a'),p=document.createElement('p');
      label.className='result-page';label.textContent=item.page;
      link.href=item.url;link.textContent=item.title;h.append(link);highlight(p,excerpt(item.text));
      li.append(label,h,p);results.append(li);
    }
  }).catch(()=>{status.textContent='No se ha podido cargar el buscador. Inténtalo de nuevo o accede a las secciones desde el menú superior.';});
})();
