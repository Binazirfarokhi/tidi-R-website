(() => {
  'use strict';

  let audioContext;
  document.addEventListener('click', (event) => {
    const cover = event.target.closest('.book-showcase__cover-link, .bookstore-card__cover-link, .footer-book__cover, .wsite-image img[alt*="book" i]');
    if (!cover || event.defaultPrevented) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      audioContext ||= new AudioContext();
      const beep = () => {
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, now);
        volume.gain.setValueAtTime(0, now);
        volume.gain.linearRampToValueAtTime(0.06, now + 0.008);
        volume.gain.linearRampToValueAtTime(0, now + 0.085);
        oscillator.connect(volume);
        volume.connect(audioContext.destination);
        oscillator.onended = () => {
          oscillator.disconnect();
          volume.disconnect();
        };
        oscillator.start(now);
        oscillator.stop(now + 0.09);
      };

      if (audioContext.state === 'suspended') {
        audioContext.resume().then(beep).catch(() => {});
      } else {
        beep();
      }

      // Allow the brief tone to finish before following a same-tab cover link.
      const link = cover.closest('a[href]');
      if (link && !link.hasAttribute('download') &&
          (!link.target || link.target === '_self') && event.button === 0 &&
          !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        window.setTimeout(() => window.location.assign(link.href), 120);
      }
    } catch {
      // Sound support must never prevent visitors from opening a book.
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Content stays visible even if JavaScript or observation is unavailable.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reducedMotion.matches) entry.target.classList.add('book-section-enter');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.book-showcase__item, .bookstore-card, .footer-book')
      .forEach((element) => observer.observe(element));
  }

  const banner = document.querySelector('.banner-wrap:has(.book-showcase)');
  if (!banner) return;

  const layer = document.createElement('div');
  layer.className = 'book-letter-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const letters = 'AMBIVALENT CROSSROADS'.replaceAll(' ', '');
  let lastTime = -Infinity;
  let index = 0;

  banner.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - lastTime < 85 || layer.childElementCount >= 14) return;
    lastTime = now;

    const letter = document.createElement('span');
    letter.className = 'book-letter';
    letter.textContent = letters[index++ % letters.length];
    letter.style.left = `${event.clientX}px`;
    letter.style.top = `${event.clientY}px`;
    letter.style.setProperty('--drift', `${Math.random() * 64 - 32}px`);
    letter.style.setProperty('--turn', `${Math.random() * 40 - 20}deg`);
    layer.appendChild(letter);
    window.setTimeout(() => letter.remove(), 1150);
  }, { passive: true });

  const clearLetters = () => layer.replaceChildren();
  banner.addEventListener('pointerleave', clearLetters);
  window.addEventListener('scroll', clearLetters, { passive: true });
  reducedMotion.addEventListener('change', clearLetters);
  finePointer.addEventListener('change', clearLetters);
})();
