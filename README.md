# Sito LAVERTT (lavertt.com)

Sito statico pubblicato con GitHub Pages dalla cartella `docs/`.

- `src/pages/` — una pagina per file (Home = `Main.html`)
- `src/partials/` — header, footer, stile e script condivisi
- `public/` — file copiati così come sono (favicon, robots.txt; il logo vero è `logo.svg`, vettoriale; in alternativa si può usare `logo.png`)
- `build.js` — genera il sito in `docs/`. In cima al file: numero WhatsApp, link del questionario, email privacy e data delle policy.

Accessibilità: `build.js` aggiunge a ogni pagina il link "Salta al contenuto" e mette il contenuto dentro `<main id="contenuto">`. Per questo ogni pagina deve iniziare con il blocco lilla che contiene l'Header (come le pagine attuali) e non deve avere un suo `<main>`: se la struttura è diversa, il build si ferma con un errore.

Per aggiornare: modifica i file in `src/`, esegui `node build.js`, poi fai commit e push (compresa la cartella `docs/`).
