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
