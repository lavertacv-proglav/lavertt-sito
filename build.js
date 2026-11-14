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
const PRIVACY_DATE = '14 novembre 2026';
// Banner cookie: true = compare al primo accesso anche se il Pixel Meta è spento.
// false = compare solo quando il Pixel è attivo (con il Pixel attivo compare sempre).
const MOSTRA_BANNER_COOKIE = true;
// Pixel Meta: incolla qui l'ID del Pixel (solo numeri) quando attivi le pubblicità.
// Vuoto = Pixel spento. Con l'ID il Pixel parte solo dopo "Accetta", e il banner
// viene richiesto di nuovo a tutti (anche a chi aveva già scelto).
// Prima di attivarlo aggiorna la sezione 10 della Privacy Policy (oggi dice "non attivo").
const META_PIXEL_ID = '';
// Versione delle scelte sui cookie: aumentala di 1 quando aggiungi o cambi uno strumento,
// così il banner viene richiesto di nuovo a tutti.
const COOKIE_VERSION = 1;
// ---------------------------------------------------------------

const SITE = 'https://lavertt.com';
const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'docs'); // GitHub Pages pubblica la cartella docs/
const NL = String.fromCharCode(10);

// Nome file del canvas -> [percorso pubblico, file in uscita, titolo, descrizione]
const PAGES = {
  'Main': ['/', 'index.html', 'LAVERTT: CV, LinkedIn e colloqui per chi cerca lavoro', 'Una persona legge il tuo CV e in 2 giorni lavorativi ti dice su WhatsApp di cosa hai bisogno. Valutazione gratuita, poi paghi solo i servizi che scegli.'],
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

// Accessibilità: l'header resta fuori, tutto il contenuto della pagina va dentro <main id="contenuto">
// (serve al link "Salta al contenuto" e ai lettori di schermo). Lo sfondo lilla viene diviso in due
// blocchi uguali (header + inizio pagina), quindi l'aspetto non cambia.
const HEADER_TAG = '<dc-import name="Header" hint-size="100%,84px"></dc-import>';
const FOOTER_TAG = '<dc-import name="Footer" hint-size="100%,470px"></dc-import>';
const HERO_OPEN = '<div style="background: #D9E0FF; border-radius: 0 0 34.5px 34.5px;">';
const count = (text, part) => text.split(part).length - 1;

function addMain(html) {
  const start = HERO_OPEN + NL + HEADER_TAG;
  if (count(html, start) !== 1 || count(html, FOOTER_TAG) !== 1 || html.includes('<main')) {
    throw new Error('Struttura della pagina diversa dal solito: impossibile aggiungere <main>');
  }
  html = swap(html, start, '<div style="background: #D9E0FF;">' + NL + HEADER_TAG + NL + '</div>' + NL
    + '<main id="contenuto" tabindex="-1">' + NL + HERO_OPEN);
  return swap(html, FOOTER_TAG, '</main>' + NL + NL + FOOTER_TAG);
}

// Pagine con la grafica nuova (v2): iniziano con <!-- v2 --> e usano {{HEADER}} e {{FOOTER}}
const V2_MARK = '<!-- v2 -->';
const isV2 = (html) => html.startsWith(V2_MARK);

function transform(html) {
  if (isV2(html)) {
    html = html.slice(V2_MARK.length);
    if (count(html, '{{HEADER}}') !== 1 || count(html, '{{FOOTER}}') !== 1 || count(html, '<main id="top">') !== 1) {
      throw new Error('Pagina v2: servono {{HEADER}}, {{FOOTER}} e <main id="top"> una volta sola');
    }
    html = swap(html, '{{HEADER}}', read('partials/v2/header.html'));
    html = swap(html, '{{FOOTER}}', read('partials/v2/footer.html'));
  } else {
    html = addMain(html);
    // Header e Footer condivisi
    html = swap(html, HEADER_TAG, read('partials/header.html'));
    html = swap(html, FOOTER_TAG, read('partials/footer.html'));
  }

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

if (!/^\d*$/.test(META_PIXEL_ID)) throw new Error('META_PIXEL_ID deve contenere solo numeri');
const BASE_CSS = read('partials/base.css');
const COOKIE_CONFIG = 'window.LV_COOKIE = ' + JSON.stringify({
  pixel: META_PIXEL_ID,
  show: MOSTRA_BANNER_COOKIE || !!META_PIXEL_ID,
  version: String(COOKIE_VERSION) + (META_PIXEL_ID ? '-pixel' : ''),
}) + ';' + NL;
const SCRIPT = read('partials/site.js') + COOKIE_CONFIG + read('partials/cookie.js');
if (META_PIXEL_ID && read('pages/Privacy-policy.html').includes('Non attivo')) {
  console.warn('ATTENZIONE: Pixel Meta attivo ma la Privacy Policy (sezione 10) dice ancora "Non attivo". Aggiornala.');
}

// Grafica nuova (v2): kit tasteskill in public/assets, stili LAVERTT in src/partials/v2/site.css.
// Del vecchio base.css prende solo le regole del banner cookie.
const COOKIE_CSS = BASE_CSS.split(NL).filter((l) => l.includes('.lv-ck')).join(NL);
const V2_CSS = read('partials/v2/site.css');
function pageV2({ title, desc, canonical, body }) {
  return `<!doctype html>
<html lang="it" data-type="service" data-radius="soft" data-buttons="arrow" data-motion>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="LAVERTT">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/share.jpg">
<meta property="og:locale" content="it_IT">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<meta name="site-kind" content="other">
<meta name="page-type" content="service">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/plus-jakarta-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/system.css">
<link rel="stylesheet" href="/assets/ui/cards.css">
<link rel="stylesheet" href="/assets/motion/motion.css">
<link rel="stylesheet" href="/assets/layout/layout.css">
<link rel="stylesheet" href="/assets/icons/icon.css">
<style>
${V2_CSS}
${COOKIE_CSS}
</style>
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
<script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>
<link rel="modulepreload" href="/assets/moments/moments.js">
<link rel="modulepreload" href="/assets/moments/lib.js">
<link rel="modulepreload" href="/assets/moments/word-highlight/moment.js">
<link rel="modulepreload" href="/assets/moments/pinned-chapters/moment.js">
</head>
<body>
${body.trim()}
<script type="module" src="/assets/system.js"></script>
<script type="module" src="/assets/motion/motion.js"></script>
<script type="module" src="/assets/layout/layout.js"></script>
<script>
${COOKIE_CONFIG}${read('partials/cookie.js')}</script>
</body>
</html>
`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const [name, [url, file, title, desc]] of Object.entries(PAGES)) {
  const srcFile = `pages/${name}.html`;
  if (!fs.existsSync(path.join(SRC, srcFile))) { console.warn('Manca ' + srcFile + ', salto'); continue; }
  const raw = read(srcFile);
  if (raw.includes('{{PRIVACY_EMAIL}}') && !PRIVACY_EMAIL) throw new Error('Manca PRIVACY_EMAIL in cima a build.js');
  const body = transform(raw);
  const canonical = SITE + url;
  if (isV2(raw)) {
    fs.writeFileSync(path.join(OUT, file), pageV2({ title, desc, canonical, body }));
    console.log('ok  ' + file + ' (v2)');
    continue;
  }
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
<a class="lv-skip" href="#contenuto">Salta al contenuto</a>
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
