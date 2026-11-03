(() => {
  const script = document.currentScript;
  const root = new URL('../', script.src);
  const language = ['es','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'ca';
  if (location.pathname.endsWith('/glossari.html')) return;
  const glossary = new URL((language === 'ca' ? '' : language + '/') + 'glossari.html', root);
  const extra = {
    ca: {'hallucination':['al·lucinacions'],'llm':['LLMs'],'prompt':['prompts'],'neural-network':['xarxes neuronals']},
    es: {'hallucination':['alucinaciones'],'llm':['LLMs'],'prompt':['prompts'],'neural-network':['redes neuronales']},
    en: {'hallucination':['hallucinations'],'llm':['LLMs'],'prompt':['prompts'],'neural-network':['neural networks'],'deep-learning':['deep learning']}
  };
  function start() {
    fetch(glossary).then(r => { if (!r.ok) throw Error('Glossary unavailable'); return r.text(); }).then(source => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      const lookup = new Map();
      doc.querySelectorAll('article.entry').forEach(entry => {
        const name=entry.querySelector('h2')?.textContent.trim(), definition=entry.querySelector('p')?.textContent.trim();
        if (!name || !definition) return;
        [name, ...(extra[language][entry.id] || [])].forEach(term => lookup.set(term.toLocaleLowerCase(language), definition));
      });
      if (!lookup.size) return;
      const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const alternatives = [...lookup.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|');
      const pattern = new RegExp('(?<![\\p{L}\\p{N}_])(' + alternatives + ')(?![\\p{L}\\p{N}_])', 'giu');
      const style = document.createElement('style');
      style.textContent = '.glossary-term{font-weight:700;font-style:italic;text-decoration:underline dotted;text-underline-offset:3px;cursor:help}.glossary-term:focus-visible{outline:3px solid #d08b20;outline-offset:3px;border-radius:3px}#iad-glossary-tip{position:fixed;z-index:2147483647;max-width:min(340px,calc(100vw - 24px));padding:13px 16px;border:1px solid #b7d1e2;border-radius:11px;background:#fff;color:#102f48;box-shadow:0 8px 28px #001c3555;font:normal 15px/1.5 system-ui,sans-serif;pointer-events:none;overflow-wrap:anywhere}#iad-glossary-tip[hidden]{display:none}[data-theme=dark] #iad-glossary-tip{background:#eaf4fb;color:#102f48}';
      document.head.append(style);
      const tip=document.createElement('div');tip.id='iad-glossary-tip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);
      function decorate(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const parent=node.parentElement;
          if (!parent || parent.closest('script,style,code,pre,textarea,input,button,select,svg,[contenteditable],.glossary-term,#iad-glossary-tip')) return;
          const text=node.nodeValue; pattern.lastIndex=0; let match, last=0, frag=document.createDocumentFragment(), found=false;
          while ((match=pattern.exec(text))) {
            found=true; frag.append(document.createTextNode(text.slice(last,match.index)));
            const span=document.createElement('span');span.className='glossary-term';span.textContent=match[0];
            span.dataset.definition=lookup.get(match[0].toLocaleLowerCase(language));
            const link=parent.closest('a,summary,[role=button]');
            if(link) link.setAttribute('aria-describedby',tip.id); else {span.tabIndex=0;span.setAttribute('aria-describedby',tip.id);}
            frag.append(span);last=match.index+match[0].length;
          }
          if(found){frag.append(document.createTextNode(text.slice(last)));node.replaceWith(frag);}
        } else if(node.nodeType===Node.ELEMENT_NODE && !node.closest('script,style,code,pre,textarea,input,button,select,svg,[contenteditable],.glossary-term,#iad-glossary-tip')) {
          const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let texts=[],item;
          while((item=walker.nextNode())) texts.push(item);
          texts.forEach(decorate);
        }
      }
      decorate(document.body);
      let active=null;
      function show(el){if(!el)return;active=el;tip.textContent=el.dataset.definition;tip.hidden=false;
        const box=el.getBoundingClientRect(), width=tip.offsetWidth, height=tip.offsetHeight;
        tip.style.left=Math.max(12,Math.min(innerWidth-width-12,box.left))+'px';
        tip.style.top=(box.bottom+height+12<innerHeight ? box.bottom+8 : Math.max(12,box.top-height-8))+'px';
      }
      function find(el){return el?.closest?.('.glossary-term') || (el?.matches?.('a,summary,[role=button]') ? el.querySelector('.glossary-term') : null);}
      document.addEventListener('pointerover',e=>{const el=find(e.target);if(el)show(el);});
      document.addEventListener('pointerout',e=>{if(active && !active.contains(e.relatedTarget) && document.activeElement!==active && !active.closest('a:focus,summary:focus,[role=button]:focus')) {tip.hidden=true;active=null;}});
      document.addEventListener('focusin',e=>{const el=find(e.target);if(el)show(el);else if(active){tip.hidden=true;active=null;}});
      document.addEventListener('focusout',e=>{if(active && !active.contains(e.relatedTarget)){tip.hidden=true;active=null;}});
      document.addEventListener('pointerdown',e=>{const el=find(e.target);if(el && !el.closest('a')){el.focus();show(el);}});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){tip.hidden=true;active=null;}});
      window.addEventListener('scroll',()=>{if(active&&!tip.hidden)show(active);},{passive:true});
      new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(decorate))).observe(document.body,{childList:true,subtree:true});
    }).catch(()=>{});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();