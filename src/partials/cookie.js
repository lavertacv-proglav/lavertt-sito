// Banner cookie LAVERTT
// - Si accende da build.js: MOSTRA_BANNER_COOKIE e/o META_PIXEL_ID.
// - "Rifiuta tutti", la X o il tasto Esc = solo cookie tecnici. Il Pixel non viene caricato finché non accetti.
// - La scelta vale 6 mesi; cambiando COOKIE_VERSION in build.js il banner viene richiesto di nuovo a tutti.
// - Anteprima senza effetti: aggiungi ?cookie-preview all'indirizzo (es. lavertt.com/?cookie-preview).
(function () {
  var C = window.LV_COOKIE || {};
  var KEY = 'lv-cookie';
  var SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
  var preview = /[?&]cookie-preview(=|&|$)/.test(location.search);
  var active = !!C.show;
  if (!active && !preview) return;

  function stored() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === C.version && Date.now() - s.t < SIX_MONTHS) return s;
      if (s) localStorage.removeItem(KEY); // scelta scaduta o fatta con strumenti diversi
    } catch (e) {}
    return null;
  }

  function store(marketing) {
    if (preview) return;
    try { localStorage.setItem(KEY, JSON.stringify({ v: C.version, t: Date.now(), marketing: !!marketing })); } catch (e) {}
  }

  function startPixel() {
    if (preview || !C.pixel || window.fbq) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', C.pixel);
    window.fbq('track', 'PageView');
  }

  function removeMarketingCookies() {
    ['_fbp', '_fbc'].forEach(function (name) {
      [location.hostname, '.' + location.hostname.replace(/^www\./, '')].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + domain;
      });
      document.cookie = name + '=; Max-Age=0; path=/';
    });
  }

  var X_ICON = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  var POLICY = '<a href="/privacy-policy#cookies">Privacy e Cookie Policy</a>';
  var PIXEL_TEXT = C.pixel
    ? 'Con il tuo consenso, il <strong>Pixel Meta</strong> misura i risultati delle nostre pubblicità su Instagram e Facebook.'
    : 'Con il tuo consenso potremo usare il <strong>Pixel Meta</strong>, che misura i risultati delle nostre pubblicità su Instagram e Facebook. Oggi non è attivo: quando lo attiveremo ti chiederemo di nuovo di scegliere.';
  var PIXEL_NOTE = C.pixel ? '' : ' Oggi non è attivo.';

  var root = document.createElement('div');
  root.className = 'lv-ck';
  root.hidden = true;
  root.innerHTML =
    '<div class="lv-ck-backdrop"></div>' +
    '<div class="lv-ck-box" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="lv-ck-title" aria-describedby="lv-ck-desc">' +
      '<button type="button" class="lv-ck-x" data-ck="reject" aria-label="Chiudi: continua solo con i cookie tecnici">' + X_ICON + '</button>' +
      (preview ? '<p class="lv-ck-preview">Anteprima: le scelte non vengono salvate</p>' : '') +
      '<h2 id="lv-ck-title">Le tue preferenze cookie</h2>' +
      '<p id="lv-ck-desc">Usiamo strumenti tecnici necessari. ' + PIXEL_TEXT +
        ' Puoi rifiutare o scegliere e cambiare idea quando vuoi dal link «Preferenze cookie», in fondo a ogni pagina. ' + POLICY + '</p>' +
      '<div class="lv-ck-opts">' +
        '<div class="lv-ck-opt">' +
          '<label class="lv-ck-check lv-ck-check-fixed"><input type="checkbox" checked disabled>' +
            '<span>Strumenti tecnici</span><span class="lv-ck-always">Sempre attivi</span></label>' +
          '<p class="lv-ck-detail" hidden>Servono a far funzionare il sito e a ricordare la tua scelta sui cookie. Non richiedono consenso.</p>' +
        '</div>' +
        '<div class="lv-ck-opt">' +
          '<label class="lv-ck-check" for="lv-ck-marketing"><input type="checkbox" id="lv-ck-marketing">' +
            '<span>Misurazione pubblicitaria Meta</span></label>' +
          '<p class="lv-ck-detail" hidden>Misura i risultati delle nostre pubblicità su Instagram e Facebook. Fornitore: Meta Platforms Ireland Ltd. Durata: 3 mesi.' + PIXEL_NOTE + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="lv-ck-actions">' +
        '<button type="button" class="lv-ck-btn" data-ck="reject">Rifiuta tutti</button>' +
        '<button type="button" class="lv-ck-btn" data-ck="custom" aria-expanded="false">Personalizza</button>' +
        '<button type="button" class="lv-ck-btn" data-ck="accept">Accetta tutti</button>' +
        '<button type="button" class="lv-ck-btn" data-ck="save">Salva preferenze</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var box = root.querySelector('.lv-ck-box');
  var details = root.querySelectorAll('.lv-ck-detail');
  var customBtn = root.querySelector('[data-ck="custom"]');
  var toggle = root.querySelector('#lv-ck-marketing');
  var lastFocus = null;

  // "Personalizza" mostra o nasconde la spiegazione di ogni categoria
  function showDetails(on) {
    details.forEach(function (d) { d.hidden = !on; });
    customBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  function open(withDetails) {
    lastFocus = document.activeElement;
    var s = stored();
    toggle.checked = !!(s && s.marketing);
    showDetails(!!withDetails);
    root.hidden = false;
    document.documentElement.classList.add('lv-ck-lock');
    box.scrollTop = 0;
    box.focus();
  }

  function close() {
    root.hidden = true;
    document.documentElement.classList.remove('lv-ck-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function decide(marketing) {
    var before = stored();
    store(marketing);
    close();
    if (marketing) { startPixel(); return; }
    if (!preview && before && before.marketing) {
      // Consenso revocato: togliamo i cookie del Pixel e ricarichiamo la pagina senza Pixel
      removeMarketingCookies();
      location.reload();
    }
  }

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-ck]');
    if (!btn) return;
    var act = btn.getAttribute('data-ck');
    if (act === 'accept') { toggle.checked = true; decide(true); }
    else if (act === 'reject') { toggle.checked = false; decide(false); }
    else if (act === 'custom') showDetails(customBtn.getAttribute('aria-expanded') !== 'true');
    else if (act === 'save') decide(toggle.checked);
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); decide(false); return; }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(
      box.querySelectorAll('button, a[href], input:not([disabled])'),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === box)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Link "Preferenze cookie" nel footer
  document.querySelectorAll('.lv-ck-open').forEach(function (link) {
    link.hidden = false;
    link.addEventListener('click', function () { open(true); });
  });

  var choice = stored();
  if (preview || !choice) open(false);
  else if (choice.marketing) startPixel();
})();
