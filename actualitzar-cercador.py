"""Regenera l'índex del cercador després d'editar els HTML de docs."""
from pathlib import Path
from html.parser import HTMLParser
import json,re
ROOT=Path(__file__).parent/'docs'
class Extract(HTMLParser):
 def __init__(self):
  super().__init__(); self.stack=[]; self.title=[]; self.heading=[]; self.body=[]; self.records=[]; self.anchor='';self.label=''
 def flush(self):
  text=re.sub(r'\s+',' ',' '.join(self.body)).strip()
  if len(text)>25:self.records.append({'heading':self.label,'anchor':self.anchor,'text':text})
  self.body=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('h1','h2','h3') and any(t=='main' for t,_ in self.stack):
   self.flush();self.heading=[]
   self.anchor=a.get('id') or next((x.get('id') for t,x in reversed(self.stack) if x.get('id') and t in ('section','article')), '')
  if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.stack.append((tag,a))
 def handle_endtag(self,tag):
  if tag in ('h1','h2','h3') and self.heading:self.label=' '.join(self.heading).strip()
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
 def handle_data(self,s):
  tags=[t for t,_ in self.stack]
  if 'title' in tags:self.title.append(s)
  if 'main' not in tags or any(t in tags for t in ['script','style','svg','nav','button','noscript']):return
  if any(t in tags for t in ['h1','h2','h3']):self.heading.append(s)
  self.body.append(s)
for locale in ['', 'es', 'en']:
 base=ROOT/locale
 if not base.exists():continue
 records=[]
 for p in sorted(base.rglob('*.html')):
  if p.name=='cerca.html' or (not locale and p.relative_to(base).parts[0] in ('es','en')):continue
  x=Extract();x.feed(p.read_text());x.flush(); title=''.join(x.title).split(' · ')[0]
  for r in x.records:
   records.append({'page':title,'title':r['heading'] or title,'url':p.relative_to(base).as_posix()+('#'+r['anchor'] if r['anchor'] else ''),'text':r['text']})
 (base/'assets').mkdir(exist_ok=True)
 (base/'assets/search-index.json').write_text(json.dumps(records,ensure_ascii=False,separators=(',',':')))
 print(f'{locale or "ca"}: {len(records)} apartats indexats.')
