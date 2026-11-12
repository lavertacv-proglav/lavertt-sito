// Banner cookie LAVERTT
// - Si accende da build.js: MOSTRA_BANNER_COOKIE e/o META_PIXEL_ID.
// - "Rifiuta", la X o il tasto Esc = solo cookie tecnici. Il Pixel non viene caricato finché non accetti.
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
  var INTRO = C.pixel
    ? 'Usiamo cookie tecnici, necessari per far funzionare il sito. Solo con il tuo consenso usiamo anche il <strong>Pixel Meta</strong>, un cookie di marketing che misura i risultati delle nostre pubblicità su Instagram e Facebook.'
    : 'Usiamo cookie tecnici, necessari per far funzionare il sito. Con il tuo consenso potremo usare anche il <strong>Pixel Meta</strong>, un cookie di marketing che misura i risultati delle nostre pubblicità su Instagram e Facebook. Oggi non è attivo: quando lo attiveremo ti chiederemo di nuovo di scegliere.';
  var PIXEL_NOTE = C.pixel ? '' : ' Oggi non è attivo.';

  var root = document.createElement('div');
  root.className = 'lv-ck';
  root.hidden = true;
  root.innerHTML =
    '<div class="lv-ck-backdrop"></div>' +
    '<div class="lv-ck-box" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="lv-ck-title" aria-describedby="lv-ck-desc">' +
      '<button type="button" class="lv-ck-x" data-ck="reject" aria-label="Chiudi: continua solo con i cookie tecnici">' + X_ICON + '</button>' +
      (preview ? '<p class="lv-ck-preview">Anteprima: le scelte non vengono salvate</p>' : '') +
      '<h2 id="lv-ck-title">Informativa sui cookie</h2>' +
      '<div class="lv-ck-view" data-view="main">' +
        '<div id="lv-ck-desc">' +
          '<p>' + INTRO + '</p>' +
          '<p>Se premi «Rifiuta» o la X, usiamo solo i cookie tecnici. Puoi cambiare idea quando vuoi da «Preferenze cookie», in fondo a ogni pagina. Tutti i dettagli nella ' + POLICY + '.</p>' +
        '</div>' +
        '<div class="lv-ck-actions">' +
          '<button type="button" class="lv-ck-btn" data-ck="reject">Rifiuta</button>' +
          '<button type="button" class="lv-ck-btn" data-ck="accept">Accetta</button>' +
        '</div>' +
        '<button type="button" class="lv-ck-link" data-ck="custom">Personalizza</button>' +
      '</div>' +
      '<div class="lv-ck-view" data-view="prefs" hidden>' +
        '<p class="lv-ck-intro">Scegli quali cookie attivare. Puoi cambiare idea quando vuoi.</p>' +
        '<div class="lv-ck-cat">' +
          '<div class="lv-ck-cat-head"><span>Cookie tecnici</span><span class="lv-ck-always">Sempre attivi</span></div>' +
          '<p>Servono a far funzionare il sito e a ricordare le tue scelte sui cookie. Non richiedono consenso.</p>' +
        '</div>' +
        '<div class="lv-ck-cat">' +
          '<label class="lv-ck-cat-head" for="lv-ck-marketing"><span>Marketing (Pixel Meta)</span>' +
            '<input type="checkbox" id="lv-ck-marketing" class="lv-ck-switch" role="switch"></label>' +
          '<p>Misura i risultati delle nostre pubblicità su Instagram e Facebook. Fornitore: Meta Platforms Ireland Ltd. Durata: 3 mesi.' + PIXEL_NOTE + '</p>' +
        '</div>' +
        '<div class="lv-ck-actions lv-ck-actions-one">' +
          '<button type="button" class="lv-ck-btn" data-ck="save">Salva le mie scelte</button>' +
        '</div>' +
        '<p class="lv-ck-small">Dettagli nella ' + POLICY + '.</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var box = root.querySelector('.lv-ck-box');
  var views = root.querySelectorAll('.lv-ck-view');
  var toggle = root.querySelector('#lv-ck-marketing');
  var lastFocus = null;

  function showView(name) {
    views.forEach(function (v) { v.hidden = v.getAttribute('data-view') !== name; });
    box.scrollTop = 0;
    box.focus();
  }

  function open(view) {
    lastFocus = document.activeElement;
    var s = stored();
    toggle.checked = !!(s && s.marketing);
    root.hidden = false;
    document.documentElement.classList.add('lv-ck-lock');
    showView(view || 'main');
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
    if (act === 'accept') decide(true);
    else if (act === 'reject') decide(false);
    else if (act === 'custom') showView('prefs');
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
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Link "Preferenze cookie" nel footer
  document.querySelectorAll('.lv-ck-open').forEach(function (link) {
    link.hidden = false;
    link.addEventListener('click', function () { open('prefs'); });
  });

  var choice = stored();
  if (preview || !choice) open('main');
  else if (choice.marketing) startPixel();
})();
