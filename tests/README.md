# News reader smoke checks

Serve the site with `python3 -m http.server 8765 --directory docs`, install Playwright in your test environment, and run `node tests/news-smoke.cjs` with Chrome installed. `PLAYWRIGHT_MODULE` can point to an existing Playwright module; `NEWS_BASE_URL` overrides the local URL.

Checks the five Catalan articles at 320, 390, 768 and 1440 pixels, date ordering, resource filter, modal overflow, Escape and focus restoration, translated readers, dark mode, fetch-failure fallback and navigation without JavaScript. Screenshots are written to `review/` for visual inspection.

Editorial metadata: set `data-category` on each card to `news`, `reflection` or `resources`. Keep static HTML newest-first for readers without JavaScript. Give the chosen lead story `news-featured` and a localized `featured-label`; the current lead is the latest Catalan article. Original article text and URLs remain unchanged. ES/EN retain their existing article inventories.
