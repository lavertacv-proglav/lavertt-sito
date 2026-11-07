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
