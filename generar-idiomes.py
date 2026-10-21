"""Build static ES/EN editions from reviewed phrase dictionaries and Catalan source snapshots."""
from pathlib import Path
from llicencia import add_license_footer
from html.parser import HTMLParser
import json,re,html,posixpath,sys
BASE=Path(__file__).parent; ROOT=BASE/'docs'; SOURCE=ROOT
ATTRS={'alt','title','placeholder','aria-label','aria-description'}
TRANSLATED_SVG={'image-6437890f63d28e2e.svg','image-72cbd8e927beece5.svg'}
class Localize(HTMLParser):
 def __init__(self,mapping,lang,rel):super().__init__(convert_charrefs=False);self.mapping=mapping;self.lang=lang;self.rel=rel;self.stack=[];self.out=[]
 def text(self,s):
  core=s.strip();t=self.mapping.get(core,core);return s[:len(s)-len(s.lstrip())]+html.escape(t,quote=False)+s[len(s.rstrip()):] if core else s
 def url(self,value):
  if value.startswith(('#','https:','http:','mailto:','data:','javascript:')):return value
  path,sep,hash_=value.partition('#');path,querysep,query=path.partition('?')
  full=posixpath.normpath(posixpath.join(posixpath.dirname(self.rel),path))
  if full.endswith('.html'):target=posixpath.join(self.lang,full)
  elif posixpath.basename(full) in TRANSLATED_SVG:target=posixpath.join(self.lang,'assets',posixpath.basename(full))
  elif full=='assets/search.js':target=posixpath.join(self.lang,full)
  else:target=full
  return posixpath.relpath(target,posixpath.dirname(posixpath.join(self.lang,self.rel)) or '.')+(querysep+query if querysep else '')+(sep+hash_ if sep else '')
 def handle_starttag(self,t,a):
  raw=self.get_starttag_text();original=re.match(r'<([^\s/>]+)',raw)[1]; attrs=dict(a)
  def attr(m):
   key=m[1].lower();value=html.unescape(m[3]);new=value
   if key in ATTRS or (key=='value' and t in ('input','option') and value in self.mapping) or (t=='meta' and attrs.get('name')=='description' and key=='content'):new=self.mapping.get(value,value)
   if key in ('href','src','action'):new=self.url(new)
   if t=='html' and key=='lang':new=self.lang
   return m[1]+'='+m[2]+html.escape(new,quote=True)+m[2]
  raw=re.sub(r'([\w:-]+)\s*=\s*([\"\'])(.*?)\2',attr,raw,flags=re.S);self.out.append(raw)
  if t not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.stack.append((t,original))
 def handle_startendtag(self,t,a):
  before=len(self.stack);self.handle_starttag(t,a)
  if len(self.stack)>before:self.stack.pop()
 def handle_endtag(self,t):
  orig=t
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==t:orig=self.stack[i][1];self.stack=self.stack[:i];break
  self.out.append('</'+orig+'>')
 def handle_data(self,s):
  if any(t=='style' for t,_ in self.stack):self.out.append(s)
  elif any(t=='script' for t,_ in self.stack):self.out.append(localize_script(s,self.mapping,self.lang))
  else:self.out.append(self.text(s))
 def handle_entityref(self,n):self.out.append('&'+n+';')
 def handle_charref(self,n):self.out.append('&#'+n+';')
 def handle_comment(self,s):self.out.append('<!--'+s+'-->')
 def handle_decl(self,s):self.out.append('<!'+s+'>')
def localize_script(s,mapping,lang):
 def literal(m):
  value=m[2]; translated=mapping.get(value)
  return json.dumps(translated,ensure_ascii=False) if translated else m[0]
 s=re.sub(r"(['\"])((?:\\.|(?!\1).)*?)\1",literal,s,flags=re.S)
 replacements={
 'es':{'Destinataris:':'Destinatarios:','Context:':'Contexto:','Tasca:':'Tarea:','Format:':'Formato:','Fonts:':'Fuentes:','Criteris: adapta el vocabulari al nivell, identifica el fragment o la pàgina de suport i assenyala allò que les fonts no permeten concloure. No inventis dades ni referències. Si falta informació essencial, pregunta abans de completar-la.':'Criterios: adapta el vocabulario al nivel, identifica el fragmento o la página de apoyo y señala lo que las fuentes no permiten concluir. No inventes datos ni referencias. Si falta información esencial, pregunta antes de completarla.','Presenta el resultat com una proposta que revisarà el docent.':'Presenta el resultado como una propuesta que revisará el docente.'},
 'en':{'Destinataris:':'Audience:','Context:':'Context:','Tasca:':'Task:','Format:':'Format:','Fonts:':'Sources:','Criteris: adapta el vocabulari al nivell, identifica el fragment o la pàgina de suport i assenyala allò que les fonts no permeten concloure. No inventis dades ni referències. Si falta informació essencial, pregunta abans de completar-la.':'Criteria: adapt vocabulary to the level, identify the supporting passage or page, and state what cannot be concluded from the sources. Do not invent data or references. If essential information is missing, ask before completing it.','Presenta el resultat com una proposta que revisarà el docent.':'Present the result as a draft for the teacher to review.'}}
 for a,b in replacements[lang].items():s=s.replace(a,b)
 return s

def controls(lang,rel):
 current=posixpath.dirname((lang+'/' if lang!='ca' else '')+rel) or '.'
 labels={'ca':['Idioma','Activa el mode fosc','Fosc'],'es':['Idioma','Activar el modo oscuro','Oscuro'],'en':['Language','Switch to dark mode','Dark']}[lang]
 links=''.join(f'<a data-language="{l}" href="{posixpath.relpath((l+"/" if l!="ca" else "")+rel,current)}" lang="{l}" hreflang="{l}"'+(' aria-current="page"' if l==lang else '')+f'>{l.upper()}</a>' for l in ['ca','es','en'])
 return f'<div class="site-controls"><div class="site-languages" role="group" aria-label="{labels[0]}">{links}</div><button type="button" data-theme-toggle aria-label="{labels[1]}" aria-pressed="false">☾ {labels[2]}</button></div>'
def decorate(s,lang,rel):
 route=(lang+'/' if lang!='ca' else '')+rel;prefix=posixpath.relpath('assets',posixpath.dirname(route) or '.')+'/'
 s=s.replace('</head>',f'<link rel="stylesheet" href="{prefix}preferences.css"><script src="{prefix}preferences.js"></script></head>')
 s=re.sub(r'(<nav class="site-nav".*?)(</nav>)',lambda m:m[1]+controls(lang,rel)+m[2],s,count=1,flags=re.S)
 alternates=''.join(f'<link rel="alternate" hreflang="{l}" href="https://aasensi8.github.io/iAducacio/{l+"/" if l!="ca" else ""}{rel}">' for l in ['ca','es','en'])
 s=s.replace('</head>',alternates+'</head>')
 if lang!='ca':
  note={'es':'Versión traducida con asistencia automática. El catalán es la versión de referencia; los documentos originales y algunas infografías conservan su idioma.','en':'Machine-assisted translation. Catalan is the reference version; original documents and some infographics retain their original language.'}[lang]
  original=posixpath.relpath(rel,posixpath.dirname(route) or '.')
  s=s.replace('</body>',f'<footer class="translation-note">{note} <a href="{original}" lang="ca">Original en català</a></footer></body>')
 return add_license_footer(s,lang,rel)
maps={lang:json.loads((BASE/'i18n'/f'{lang}.json').read_text()) for lang in ['es','en']}
for p in list(SOURCE.rglob('*.html')):
 if p.relative_to(SOURCE).parts[0] in ('es','en'):continue
 rel=p.relative_to(SOURCE).as_posix();s=p.read_text()
 s=re.sub(r'<div class="site-controls">.*?</button></div>','',s,flags=re.S)
 s=re.sub(r'<link[^>]+(?:preferences\.css|rel="alternate")[^>]*>','',s)
 s=re.sub(r'<script[^>]+preferences\.js[^>]*></script>','',s)
 s=s.replace("document.querySelectorAll('nav a')","document.querySelectorAll('#index nav a[href^=\"#\"]')")
 (ROOT/rel).write_text(decorate(s,'ca',rel))
 for lang in ['es','en']:
  x=Localize(maps[lang],lang,rel);x.feed(s);out=ROOT/lang/rel;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(decorate(''.join(x.out),lang,rel))
for lang in ['es','en']:
 for name in TRANSLATED_SVG:
  x=Localize(maps[lang],lang,'assets/'+name);x.feed((ROOT/'assets'/name).read_text());p=ROOT/lang/'assets'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(''.join(x.out))
print('66 HTML pages generated; Catalan retained as the default.')
