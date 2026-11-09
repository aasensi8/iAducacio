/* Shared, progressively enhanced reader for current and future news articles. */
(() => {
  const synth = window.speechSynthesis;
  let active = null;
  const copy = {
    ca: ['Escolta la notícia','Reprodueix','Pausa','Continua','Atura','Velocitat','A punt per llegir','Llegint','En pausa','Lectura finalitzada','Aquest navegador no permet la lectura en veu alta.','No s’ha pogut iniciar la veu. Torna-ho a provar.','No hi ha cap veu catalana disponible; la pronunciació dependrà del dispositiu.'],
    es: ['Escucha la noticia','Reproducir','Pausa','Continuar','Detener','Velocidad','Listo para leer','Leyendo','En pausa','Lectura terminada','Este navegador no admite la lectura en voz alta.','No se ha podido iniciar la voz. Vuelve a intentarlo.','No hay una voz española disponible; la pronunciación depende del dispositivo.'],
    en: ['Listen to the article','Play','Pause','Resume','Stop','Speed','Ready to read','Reading','Paused','Reading finished','This browser does not support read aloud.','Could not start speech. Please try again.','No English voice is available; pronunciation depends on the device.']
  };
  function mount(article) {
    if (article.querySelector('.news-speech')) return;
    const lang = article.lang || article.closest('[lang]')?.lang || document.documentElement.lang || 'ca';
    const t = copy[lang.split('-')[0]] || copy.ca;
    const panel = document.createElement('section');
    panel.className = 'news-speech'; panel.setAttribute('aria-label', t[0]);
    const heading = document.createElement('strong'); heading.textContent = t[0]; panel.append(heading);
    const status = document.createElement('p'); status.className = 'speech-status'; status.setAttribute('role','status');
    if (!synth || !window.SpeechSynthesisUtterance) {
      status.textContent=t[10]; panel.append(status); article.querySelector('h1')?.after(panel); return;
    }
    const controls = document.createElement('div'); controls.className='speech-controls'; panel.append(controls);
    const button = text => { const b=document.createElement('button'); b.type='button'; b.textContent=text; controls.append(b); return b; };
    const play=button(t[1]), pause=button(t[2]), stop=button(t[4]);
    const label=document.createElement('label'); label.append(t[5]+' ');
    const rate=document.createElement('select');
    [0.75,1,1.25,1.5,2].forEach(value=>{const o=document.createElement('option');o.value=value;o.textContent=String(value).replace('.',lang.startsWith('en')?'.':',')+'×';o.selected=value===1;rate.append(o);});
    label.append(rate);controls.append(label);panel.append(status);
    const note=document.createElement('p');note.className='speech-note';panel.append(note);
    let state='idle', chunks=[], index=0, generation=0, utterance, resumeChanged=false;
    function render(message) { status.textContent=message;play.disabled=state==='playing';play.textContent=state==='paused'?t[3]:t[1];pause.disabled=state!=='playing';stop.disabled=state==='idle'; }
    function reset(message=t[6]) { generation++;synth.cancel();resumeChanged=false;state='idle';index=0;utterance=null;if(active===controller)active=null;render(message); }
    const controller={reset,article};
    function speak() {
      const token=++generation;
      utterance=new SpeechSynthesisUtterance(chunks[index]);utterance.lang=lang;utterance.rate=Number(rate.value);
      const voices=synth.getVoices();const voice=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase()) || voices.find(v=>v.lang.split('-')[0]===lang.split('-')[0]);
      if(voice)utterance.voice=voice;
      note.textContent=voice?'':t[12];
      utterance.onend=()=>{if(token!==generation)return;if(++index<chunks.length)speak();else reset(t[9]);};
      utterance.onerror=e=>{if(token!==generation)return;reset(e.error==='interrupted'||e.error==='canceled'?t[6]:t[11]);};
      state='playing';render(t[7]);synth.speak(utterance);
    }
    play.addEventListener('click',()=>{
      if(state==='paused'){if(resumeChanged){resumeChanged=false;speak();}else{synth.resume();state='playing';render(t[7]);}return;}
      if(active && active!==controller)active.reset();
      const clone=article.cloneNode(true);
      clone.querySelectorAll('.news-speech,.reading-time,figcaption,script,style,[aria-hidden="true"]').forEach(e=>e.remove());
      // Short utterances avoid browser limits on long articles. Read each block once.
      const blocks=[...clone.querySelectorAll('h1,h2,h3,p,li,blockquote')].filter(e=>!e.parentElement.closest('li,blockquote'));
      chunks=blocks.flatMap(e=>e.textContent.trim().match(/\S[\s\S]{0,179}(?=\s|$)/g)||[]);
      if(!chunks.length)return;
      active=controller;index=0;synth.cancel();speak();
    });
    pause.addEventListener('click',()=>{synth.pause();state='paused';render(t[8]);});
    stop.addEventListener('click',()=>reset());
    rate.addEventListener('change',()=>{if(state==='idle')return;const wasPaused=state==='paused';generation++;synth.cancel();if(wasPaused){resumeChanged=true;}else speak();});
    article.querySelector('h1')?.after(panel);render(t[6]);
  }
  function scan(){if(active&&!active.article.isConnected)active.reset();document.querySelectorAll('.news-article').forEach(mount);}
  scan();
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches?.('.news-article')||n.querySelector?.('.news-article')))))scan();}).observe(document.body,{childList:true,subtree:true});
  document.querySelector('#news-dialog')?.addEventListener('close',()=>active?.reset());
  window.addEventListener('pagehide',()=>active?.reset());
})();
