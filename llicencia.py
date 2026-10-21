"""Shared, localized licensing notice for the static site."""
import re, posixpath
TEXTS = {'ca': ['Llicència dels continguts', 'Els continguts educatius originals d’iAducació, llevat que s’hi indiqui una altra llicència, es publiquen sota', 'Reconeixement-CompartirIgual 4.0 Internacional', 'Podeu compartir-los i adaptar-los, també amb finalitats comercials, citant iAducació, enllaçant la llicència, indicant els canvis i compartint les adaptacions amb la mateixa llicència.', 'En queden exclosos els continguts, les marques i els logotips de tercers, que mantenen els drets i les llicències dels seus titulars. Aquesta llicència no s’aplica al codi font.'], 'es': ['Licencia de los contenidos', 'Los contenidos educativos originales de iAducació, salvo que se indique otra licencia, se publican bajo', 'Atribución-CompartirIgual 4.0 Internacional', 'Podéis compartirlos y adaptarlos, también con fines comerciales, citando iAducació, enlazando la licencia, indicando los cambios y compartiendo las adaptaciones con la misma licencia.', 'Quedan excluidos los contenidos, las marcas y los logotipos de terceros, que conservan los derechos y las licencias de sus titulares. Esta licencia no se aplica al código fuente.'], 'en': ['Content licence', 'Original educational content by iAducació, unless otherwise stated, is licensed under', 'Attribution-ShareAlike 4.0 International', 'You may share and adapt it, including commercially, by crediting iAducació, linking to the licence, indicating changes and sharing adaptations under the same licence.', 'Third-party content, trademarks and logos are excluded and remain subject to their owners’ rights and licences. This licence does not apply to the source code.']}

def add_license_footer(page, lang, rel):
    page = re.sub(r'<footer class="site-license".*?</footer>', '', page, flags=re.S)
    title, intro, name, terms, exclusions = TEXTS[lang]
    route = (lang + "/" if lang != "ca" else "") + rel
    badge = posixpath.relpath("assets/cc-by-sa.svg", posixpath.dirname(route) or ".")
    footer = (f'<footer class="site-license" aria-label="{title}">'
              f'<a class="site-license-badge" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/"><img src="{badge}" alt="Creative Commons — CC BY-SA 4.0" width="88" height="31"></a>'
              f'<p>{intro} <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0 — {name}</a>.</p>'
              f'<p>{terms}</p><p>{exclusions}</p></footer>')
    return page.replace('</body>', footer + '</body>')
