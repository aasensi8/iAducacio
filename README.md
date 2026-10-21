# iAducació · GitHub Pages

Còpia independent preparada el 13/10/2026. Encara no publicada.

## Publicació
Puja el contingut d’aquesta carpeta al repositori que vulguis utilitzar. A Settings → Pages, selecciona Deploy from a branch, la branca que conté els fitxers i la carpeta /docs. La URL concreta dependrà del compte i del nom del repositori. Els enllaços són relatius i funcionen en una ruta de projecte.

## Organització
- docs/index.html: portada.
- docs/ia-general/index.html: primer bloc.
- docs/comprendre-ia/index.html: segon bloc.
- docs/ia-educacio/: tercer bloc i subpàgines.
- docs/fonts.html: entrada als reculls de fonts.
- docs/assets/: imatges i estils compartits.

Edita els HTML dins de docs per actualitzar el lloc. No cal instal·lar dependències ni compilar. Conserva les citacions i actualitza la data de consulta només després de verificar les fonts. Les dates de revisió dels continguts no s’han canviat durant aquesta migració.

preparar.py és un importador dels fitxers previs de la carpeta output del projecte local. Tornar-lo a executar sobreescriu els HTML de docs; no cal executar-lo per publicar ni després d’editar-los directament.

La migració conserva els continguts i les interaccions existents; no constitueix una revisió factual nova. No s’ha modificat el Google Site. Els logotips de Google pertanyen al seu titular; es conserven els crèdits i les llicències indicades a les pàgines de fonts.

GitHub Pages serveix fitxers estàtics. Les activitats actuals funcionen al navegador. Desar dades d’usuaris o connectar una clau privada d’IA requeriria un servei addicional; no incloguis secrets als fitxers del lloc.


## Cercador intern
Després de modificar els continguts HTML, executa `python3 actualitzar-cercador.py` i publica també `docs/assets/search-index.json`. El cercador funciona al navegador i no envia les consultes a serveis externs.


## Idiomes i tema
El català continua a `docs/`; les versions castellana i anglesa són a `docs/es/` i `docs/en/`. Els diccionaris revisables són a `i18n/es.json` i `i18n/en.json`, amb decisions terminològiques a `i18n/revisio.json`. `generar-idiomes.py` conserva el català, regenera les dues versions i els controls. Després cal executar `actualitzar-cercador.py`. No tradueix frases noves automàticament: cal incorporar-les i revisar-les als diccionaris abans de publicar. Els documents originals es mantenen en la llengua de publicació. El mode de color es desa localment amb la clau `iaducacio-theme`.

## Llicències

Els continguts educatius originals d’iAducació es publiquen sota [CC BY-SA 4.0 — Reconeixement-CompartirIgual](https://creativecommons.org/licenses/by-sa/4.0/), llevat que s’hi indiqui una altra llicència. Cal reconèixer l’autoria, enllaçar la llicència, indicar els canvis i compartir les adaptacions amb la mateixa llicència.

Aquesta declaració exclou els continguts, documents, marques i logotips de tercers: conserven els drets, crèdits i llicències dels seus titulars. No estén la llicència d’iAducació als recursos externs enllaçats o reproduïts.

La CC BY-SA 4.0 no s’aplica al codi font. Aquest repositori no ha adoptat una llicència MIT ni cap altra llicència general per al codi font.

El peu de llicència en català, castellà i anglès es defineix a `llicencia.py`; `generar-idiomes.py` l’afegeix sense duplicar-lo en regenerar les pàgines.
