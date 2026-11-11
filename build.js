// Genera il sito statico LAVERTT in dist/ partendo da src/
// Uso: node build.js  (poi fai commit anche della cartella docs/)
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------
// IMPOSTAZIONI DA MODIFICARE
// Numero WhatsApp Business (formato internazionale senza + e spazi, es. 393331234567)
const WHATSAPP_NUMBER = '393780950535';
// Link del questionario
const QUIZ_URL = 'https://www.lavertt.app/';
// Email per le richieste sulla privacy (pagina Privacy Policy)
const PRIVACY_EMAIL = 'privacy@lavertt.com';
// Data dell'ultimo aggiornamento dei Termini e Condizioni
const POLICY_DATE = '2 novembre 2026';
// Data dell'ultimo aggiornamento della Privacy e Cookie Policy (pagina unica)
const PRIVACY_DATE = '11 novembre 2026';
// ---------------------------------------------------------------

const SITE = 'https://lavertt.com';
const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'docs'); // GitHub Pages pubblica la cartella docs/
const NL = String.fromCharCode(10);

// Nome file del canvas -> [percorso pubblico, file in uscita, titolo, descrizione]
const PAGES = {
  'Main': ['/', 'index.html', 'LAVERTT — Inizia il tuo percorso verso il lavoro', 'CV, LinkedIn, lettere e colloqui: prima capiamo di cosa hai bisogno, poi ti proponiamo solo quello. Valutazione iniziale gratuita, tutto online.'],
  'Come-funziona': ['/come-funziona', 'come-funziona.html', 'Come funziona e prezzi — LAVERTT', 'Come funziona LAVERTT e quanto costa: valutazione gratuita del CV, servizi singoli senza pacchetti, paghi solo quello che scegli.'],
  'Chi-siamo': ['/chi-siamo', 'chi-siamo.html', 'Chi siamo — LAVERTT', 'Chi c’è dietro LAVERTT: persone vere che leggono e scrivono il tuo materiale e ti seguono su WhatsApp.'],
  'Creazione-CV': ['/creazione-cv', 'creazione-cv.html', 'Creazione CV — LAVERTT', 'Il tuo CV scritto o rifatto da capo da una persona, in italiano o in inglese. 39€, consegna in 5 giorni lavorativi.'],
  'Ottimizzazione-LinkedIn': ['/ottimizzazione-linkedin', 'ottimizzazione-linkedin.html', 'Ottimizzazione LinkedIn — LAVERTT', 'Ottimizzazione del profilo LinkedIn: titolo, informazioni, esperienze e competenze riscritti perché i recruiter ti trovino.'],
  'Lettera-presentazione': ['/lettera-presentazione', 'lettera-presentazione.html', 'Lettera di presentazione — LAVERTT', 'Lettera di presentazione su misura per il ruolo e l’azienda, con la versione breve per email e LinkedIn.'],
  'Messaggi-recruiter': ['/messaggi-recruiter', 'messaggi-recruiter.html', 'Messaggi per recruiter — LAVERTT', 'Messaggi scritti sul tuo profilo per contattare direttamente chi seleziona, con la strategia per usarli.'],
  'Preparazione-colloquio': ['/preparazione-colloquio', 'preparazione-colloquio.html', 'Preparazione colloquio — LAVERTT', 'Simulazione di colloquio in videochiamata con feedback su risposte, tono e linguaggio del corpo.'],
  'Mappatura-aziende': ['/mappatura-aziende', 'mappatura-aziende.html', 'Mappatura aziende — LAVERTT', '20 aziende adatte al tuo profilo nelle zone che scegli, con dove e come candidarti a ognuna. Consegna in 7 giorni lavorativi.'],
  'Privacy-policy': ['/privacy-policy', 'privacy-policy.html', 'Privacy e Cookie Policy — LAVERTT', 'Quali dati personali tratta LAVERTT, perché, per quanto tempo, quali cookie usa il sito e quali sono i tuoi diritti.'],
  'Termini-e-condizioni': ['/termini-e-condizioni', 'termini-e-condizioni.html', 'Termini e Condizioni — LAVERTT', 'Le condizioni per acquistare i servizi LAVERTT: acquisto, pagamento, tempi di consegna, modifiche e diritto di recesso.'],
};

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const swap = (text, from, to) => text.split(from).join(to);

// Logo: public/logo.svg (vettoriale, preferito) oppure public/logo.png
const LOGO_FILE = ['logo.svg', 'logo.png'].find((f) => fs.existsSync(path.join(__dirname, 'public', f)));
const LOGO_BLOB = '/_blob/bb16287e8bc3c9f7eab98e379d6c6cb8';
const wordmark = (size) => `<span style="display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${size}; font-weight: 700; letter-spacing: 0.04em; line-height: 1.15; color: #2444B0;">LAVERTT</span>`;

function transform(html) {
  // Header e Footer condivisi
  html = swap(html, '<dc-import name="Header" hint-size="100%,84px"></dc-import>', read('partials/header.html'));
  html = swap(html, '<dc-import name="Footer" hint-size="100%,470px"></dc-import>', read('partials/footer.html'));

  // Logo: usa public/logo.svg o logo.png se presente, altrimenti la scritta LAVERTT
  const logos = [
    [`<img src="${LOGO_BLOB}" alt="LAVERTT" style="height: 28px; width: auto; display: block;">`, '24px'],
    [`<img src="${LOGO_BLOB}" alt="LAVERTT" style="height: 30px; width: auto; display: block;">`, '26px'],
    [`<img src="${LOGO_BLOB}" alt="" style="width: 62%; height: auto; display: block;">`, 'clamp(34px, 5vw, 52px)'],
  ];
  for (const [tag, size] of logos) {
    html = swap(html, tag, LOGO_FILE ? swap(tag, LOGO_BLOB, '/' + LOGO_FILE) : wordmark(size));
  }

  // Link tra le pagine del canvas -> indirizzi puliti (es. /chi-siamo)
  for (const [name, [url]] of Object.entries(PAGES)) {
    html = swap(html, `href="${name}.dc.html`, `href="${url}`);
  }

  // WhatsApp e questionario
  html = swap(html, 'https://wa.me/390000000000', 'https://wa.me/' + WHATSAPP_NUMBER);
  html = swap(html, 'https://recruitment-platform-sable.vercel.app/', QUIZ_URL);

  // Dati delle pagine Privacy e Cookie
  html = swap(html, '{{PRIVACY_EMAIL}}', PRIVACY_EMAIL);
  html = swap(html, '{{PRIVACY_DATE}}', PRIVACY_DATE);
  html = swap(html, '{{POLICY_DATE}}', POLICY_DATE);
  if (html.includes('{{')) throw new Error('Segnaposto non sostituito nella pagina');

  for (const leftover of ['/_blob/', '.dc.html', '<dc-import', '<x-dc', '<helmet', '<sc-']) {
    if (html.includes(leftover)) throw new Error('Elemento del canvas non convertito: ' + leftover);
  }
  return html;
}

const BASE_CSS = read('partials/base.css');
const SCRIPT = read('partials/site.js');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const [name, [url, file, title, desc]] of Object.entries(PAGES)) {
  const srcFile = `pages/${name}.html`;
  if (!fs.existsSync(path.join(SRC, srcFile))) { console.warn('Manca ' + srcFile + ', salto'); continue; }
  const raw = read(srcFile);
  if (raw.includes('{{PRIVACY_EMAIL}}') && !PRIVACY_EMAIL) throw new Error('Manca PRIVACY_EMAIL in cima a build.js');
  const body = transform(raw);
  const canonical = SITE + url;
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
<link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/plus-jakarta-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<style>
${BASE_CSS}</style>
</head>
<body>
${body.trim()}
<script>
${SCRIPT}</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, file), page);
  console.log('ok  ' + file);
}

// Vecchi indirizzi che rimandano a una nuova posizione (GitHub Pages non fa redirect lato server)
const REDIRECTS = {
  'cookie-policy.html': '/privacy-policy#cookies', // la Cookie Policy ora è la sezione 10 della Privacy Policy
};
for (const [file, target] of Object.entries(REDIRECTS)) {
  fs.writeFileSync(path.join(OUT, file), `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>Cookie Policy — LAVERTT</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${SITE}${target}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p>La Cookie Policy ora si trova nella <a href="${target}">Privacy e Cookie Policy</a>.</p>
<script>location.replace('${target}');</script>
</body>
</html>
`);
  console.log('ok  ' + file + ' -> ' + target);
}

// File statici (favicon, logo, caratteri, robots...)
fs.cpSync(path.join(__dirname, 'public'), OUT, { recursive: true });

// Sitemap
const urls = Object.values(PAGES)
  .filter(([, file]) => fs.existsSync(path.join(OUT, file)))
  .map(([u]) => `  <url><loc>${SITE}${u}</loc></url>`)
  .join(NL);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
// GitHub Pages: dominio personalizzato e nessuna elaborazione Jekyll
fs.writeFileSync(path.join(OUT, 'CNAME'), 'lavertt.com');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('Fatto.');
