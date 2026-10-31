# Sito LAVERTT (lavertt.com)

Sito statico pubblicato con GitHub Pages dalla cartella `docs/`.

- `src/pages/` — una pagina per file (Home = `Main.html`)
- `src/partials/` — header, footer, stile e script condivisi
- `public/` — file copiati così come sono (favicon, robots.txt; mettere qui `logo.png` per usare il logo vero)
- `build.js` — genera il sito in `docs/`. In cima al file: numero WhatsApp e link del questionario.

Per aggiornare: modifica i file in `src/`, esegui `node build.js`, poi fai commit e push (compresa la cartella `docs/`).
