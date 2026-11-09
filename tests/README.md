# News reader smoke checks

Serve the site with `python3 -m http.server 8765 --directory docs`, install Playwright in your test environment, and run `node tests/news-smoke.cjs` with Chrome installed. `PLAYWRIGHT_MODULE` can point to an existing Playwright module; `NEWS_BASE_URL` overrides the local URL.

Checks the six Catalan articles at 320, 390, 768 and 1440 pixels, date ordering, resource filter, modal overflow, Escape and focus restoration, translated readers, dark mode, fetch-failure fallback and navigation without JavaScript. Screenshots are written to `review/` for visual inspection.

Editorial metadata: set `data-category` on each card to `news`, `reflection` or `resources`. Keep static HTML newest-first for readers without JavaScript. Give the chosen lead story `news-featured` and a localized `featured-label`; the current lead is the latest Catalan article. Original article text and URLs remain unchanged. ES/EN retain their existing article inventories.

## Read-aloud controls
Run `node tests/news-speech.cjs` with the same Playwright setup and `NEWS_BASE_URL`. Checks play, pause, resume, stop, all speeds, speed change while paused, closing and switching articles, stale callbacks, complete long-article traversal and unsupported browsers. Speech lifecycle is simulated for deterministic assertions; audible quality depends on installed browser/device voices.

Every news page loads `assets/news-speech.js`. It automatically adds one player to `.news-article`, including dynamically opened articles. Future standalone news pages should include this shared script and `news.css`. Set the article `lang` when it differs from the page language.
