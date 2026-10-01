// Swipeable photo slideshow for walk cards. No autoplay.
document.querySelectorAll('[data-slides]').forEach(function (root) {
  var track = root.querySelector('.slides__track');
  var slides = Array.prototype.slice.call(track.children);
  var prev = root.querySelector('.slides__btn--prev');
  var next = root.querySelector('.slides__btn--next');
  var dotsWrap = root.querySelector('.slides__dots');
  var current = 0;

  var dots = slides.map(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'slides__dot';
    b.setAttribute('aria-label', 'Photo ' + (i + 1) + ' of ' + slides.length);
    b.addEventListener('click', function () { go(i); });
    dotsWrap.appendChild(b);
    return b;
  });

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: i * track.clientWidth });
  }

  function update() {
    current = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === current ? 'true' : 'false'); });
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }

  prev.addEventListener('click', function () { go(current - 1); });
  next.addEventListener('click', function () { go(current + 1); });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });
  window.addEventListener('resize', function () { go(current); });
  update();
});
