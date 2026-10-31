// Genera il sito statico LAVERTT in dist/ partendo da src/
// Uso: node build.js
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------
// IMPOSTAZIONI DA MODIFICARE
// Numero WhatsApp Business (formato internazionale senza + e spazi, es. 393331234567)
const WHATSAPP_NUMBER = '390000000000';
// Link del questionario
const QUIZ_URL = 'https://recruitment-platform-sable.vercel.app/';
// ---------------------------------------------------------------

const SITE = 'https://lavertt.com';
const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'dist');

// Nome file del canvas -> [percorso pubblico, file in uscita, titolo, descrizione]
const PAGES = {
  'Main': ['/', 'index.html', 'LAVERTT — Inizia il tuo percorso verso il lavoro', 'CV, LinkedIn, lettere e colloqui: prima capiamo di cosa hai bisogno, poi ti proponiamo solo quello. Valutazione iniziale gratuita, tutto online.'],
  'Come-funziona': ['/come-funziona', 'come-funziona.html', 'Come funziona e prezzi — LAVERTT', 'Come funziona LAVERTT e quanto costa: valutazione gratuita del CV, servizi singoli senza pacchetti, paghi solo quello che scegli.'],
  'Chi-siamo': ['/chi-siamo', 'chi-siamo.html', 'Chi siamo — LAVERTT', 'Chi c’è dietro LAVERTT: persone vere che leggono e scrivono il tuo materiale e ti seguono su WhatsApp.'],
  'Revisione-CV': ['/revisione-cv', 'revisione-cv.html', 'Revisione CV — LAVERTT', 'Revisione del CV: ti diciamo cosa funziona e cosa no, punto per punto. Valutazione gratuita entro 48 ore.'],
  'Creazione-CV': ['/creazione-cv', 'creazione-cv.html', 'Creazione CV — LAVERTT', 'Creazione del CV da zero, su misura per te, dopo un’intervista su WhatsApp. Consegna entro 48 ore.'],
  'Ottimizzazione-LinkedIn': ['/ottimizzazione-linkedin', 'ottimizzazione-linkedin.html', 'Ottimizzazione LinkedIn — LAVERTT', 'Ottimizzazione del profilo LinkedIn: titolo, informazioni, esperienze e competenze riscritti perché i recruiter ti trovino.'],
  'Lettera-presentazione': ['/lettera-presentazione', 'lettera-presentazione.html', 'Lettera di presentazione — LAVERTT', 'Lettera di presentazione su misura per il ruolo e l’azienda, con la versione breve per email e LinkedIn.'],
  'Messaggi-recruiter': ['/messaggi-recruiter', 'messaggi-recruiter.html', 'Messaggi per recruiter — LAVERTT', 'Messaggi scritti sul tuo profilo per contattare direttamente chi seleziona, con la strategia per usarli.'],
  'Preparazione-colloquio': ['/preparazione-colloquio', 'preparazione-colloquio.html', 'Preparazione colloquio — LAVERTT', 'Simulazione di colloquio in videochiamata con feedback su risposte, tono e linguaggio del corpo.'],
};

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

const hasLogoPng = fs.existsSync(path.join(__dirname, 'public', 'logo.png'));
const WORDMARK = (h) => `<span style="display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${Math.round(h * 0.86)}px; line-height: ${h}px; font-weight: 700; letter-spacing: 0.04em; color: #2444B0;">LAVERTT</span>`;

function transform(html) {
  // Header e Footer condivisi
  html = html.replace(/<dc-import name="Header"[^>]*><\/dc-import>/g, read('partials/header.html'));
  html = html.replace(/<dc-import name="Footer"[^>]*><\/dc-import>/g, read('partials/footer.html'));

  // Logo: usa public/logo.png se presente, altrimenti la scritta LAVERTT
  html = html.replace(/<img src="\/_blob\/[0-9a-f]+" alt="LAVERTT" style="height: (\d+)px;[^"]*">/g, (m, h) =>
    hasLogoPng
      ? `<img src="/logo.png" alt="LAVERTT" style="height: ${h}px; width: auto; display: block;">`
      : WORDMARK(Number(h)));
  // Logo grande decorativo (es. pagina Chi siamo)
  html = html.replace(/<img src="\/_blob\/[0-9a-f]+" alt="" style="width: (\d+)%;[^"]*">/g, (m, w) =>
    hasLogoPng
      ? `<img src="/logo.png" alt="" style="width: ${w}%; height: auto; display: block;">`
      : `<span style="display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(34px, 5vw, 52px); font-weight: 700; letter-spacing: 0.04em; color: #2444B0;">LAVERTT</span>`);

  // Link tra le pagine del canvas -> URL puliti
  html = html.replace(/href="([A-Za-z0-9-]+)\.dc\.html(#[^"]*)?"/g, (m, name, hash) => {
    const page = PAGES[name];
    if (!page) throw new Error('Pagina sconosciuta nel link: ' + name);
    return `href="${page[0]}${hash || ''}"`;
  });

  // WhatsApp e questionario
  html = html.replace(/https:\/\/wa\.me\/390000000000/g, `https://wa.me/${WHATSAPP_NUMBER}`);
  html = html.replace(/https:\/\/recruitment-platform-sable\.vercel\.app\//g, QUIZ_URL);

  if (/\/_blob\//.test(html)) throw new Error('Immagine del canvas non convertita');
  if (/<(dc-import|sc-for|sc-if|x-dc|helmet)\b/.test(html)) throw new Error('Tag del canvas rimasto nella pagina');
  return html;
}

const BASE_CSS = read('partials/base.css');
const SCRIPT = read('partials/site.js');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const [name, [url, file, title, desc]] of Object.entries(PAGES)) {
  const srcFile = `pages/${name}.html`;
  if (!fs.existsSync(path.join(SRC, srcFile))) { console.warn('Manca ' + srcFile + ', salto'); continue; }
  let body = read(srcFile);
  // CSS specifico della pagina (facoltativo): src/pages/<Nome>.css
  const extraCssPath = path.join(SRC, 'pages', name + '.css');
  const extraCss = fs.existsSync(extraCssPath) ? fs.readFileSync(extraCssPath, 'utf8') : '';
  body = transform(body);
  const canonical = SITE + (url === '/' ? '/' : url);
  const page = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="LAVERTT">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="it_IT">
<meta name="theme-color" content="#D9E0FF">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Plus+Jakarta+Sans:wght@500;600;700&amp;display=swap" rel="stylesheet">
${/'Caveat'/.test(body) ? '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&amp;display=swap" rel="stylesheet">\n' : ''}<style>
${BASE_CSS}${extraCss}
</style>
</head>
<body>
${body.trim()}
<script>
${SCRIPT}
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, file), page);
  console.log('ok  ' + file);
}

// File statici (favicon, logo, robots...)
const pub = path.join(__dirname, 'public');
for (const f of fs.readdirSync(pub)) fs.copyFileSync(path.join(pub, f), path.join(OUT, f));

// Sitemap
const urls = Object.values(PAGES).filter(([, file]) => fs.existsSync(path.join(OUT, file))).map(([u]) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log('Fatto.');
