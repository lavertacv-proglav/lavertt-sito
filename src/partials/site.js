(function () {
  document.querySelectorAll('.lv-dd').forEach(function (dd) {
    var btn = dd.querySelector('.lv-dd-btn');
    function set(open) { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(!dd.classList.contains('open')); });
    dd.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) set(false); });
  });
})();
(function () {
  document.documentElement.classList.add('js');
  var els = document.querySelectorAll('section, footer');
  els.forEach(function (el) { el.classList.add('lv-reveal'); });
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('lv-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('lv-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
(function () {
  var box = document.getElementById('lv-calc');
  if (!box) return;
  var inputs = box.querySelectorAll('input[data-price]');
  var list = document.getElementById('lv-sum-list');
  var empty = document.getElementById('lv-sum-empty');
  var total = document.getElementById('lv-sum-total');
  var wa = document.getElementById('lv-sum-wa');
  var waHref = wa.getAttribute('href');
  var waBase = waHref.split('?')[0];
  var waDefault = new URL(waHref, location.href).searchParams.get('text') || '';
  function render() {
    var chosen = [], sum = 0;
    inputs.forEach(function (i) { if (i.checked) { chosen.push(i); sum += Number(i.getAttribute('data-price')); } });
    list.querySelectorAll('[data-scelto]').forEach(function (li) { li.remove(); });
    chosen.forEach(function (i) {
      var li = document.createElement('li');
      li.className = 'lv-sum-row';
      li.setAttribute('data-scelto', '');
      var name = document.createElement('span'); name.textContent = i.getAttribute('data-name');
      var price = document.createElement('span'); price.textContent = i.getAttribute('data-price') + '€';
      li.appendChild(name); li.appendChild(price); list.appendChild(li);
    });
    empty.hidden = chosen.length > 0;
    total.textContent = sum + '€';
    var bar = document.getElementById('lv-bar-total'); if (bar) bar.textContent = sum + '€';
    var text = chosen.length
      ? 'Ciao! Mi interessano questi servizi: ' + chosen.map(function (i) { return i.getAttribute('data-name'); }).join(', ') + ' (totale ' + sum + '€).'
      : waDefault;
    wa.setAttribute('href', text ? waBase + '?text=' + encodeURIComponent(text) : waBase);
  }
  inputs.forEach(function (i) { i.addEventListener('change', render); });
  render();
})();
