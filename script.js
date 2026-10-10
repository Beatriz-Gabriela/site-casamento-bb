// Funcionalidades do site do casamento: menu, contagem regressiva, animações e RSVP.
(() => {
  const weddingTime = new Date('2026-12-28T15:30:00-04:00').getTime();
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Menu para celular.
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  // Contagem regressiva.
  function updateCountdown() {
    const remaining = Math.max(0, weddingTime - Date.now());
    const values = [
      Math.floor(remaining / 86400000),
      Math.floor(remaining / 3600000) % 24,
      Math.floor(remaining / 60000) % 60,
      Math.floor(remaining / 1000) % 60
    ];
    ['days', 'hours', 'minutes', 'seconds'].forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(values[index]).padStart(2, '0');
    });
    const complete = $('#count-complete');
    if (complete) complete.classList.toggle('hidden', remaining !== 0);
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Animações de entrada respeitando a preferência de movimento reduzido.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Esconde imagens que ainda não foram adicionadas e preserva o restante do layout.
  $$('img').forEach(img => {
    img.addEventListener('load', () => {
      if (img.classList.contains('route-replacement')) { img.style.display = 'block'; const routeShell = img.closest('.route-section')?.querySelector('.shell'); if (routeShell) routeShell.style.display = 'none'; }
    }, { once: true });
    img.addEventListener('error', () => {
      img.classList.add('asset-missing');
      img.style.display = 'none';
      const routeShell = img.closest('.route-section')?.querySelector('.shell');
      if (routeShell) routeShell.style.display = 'block';
    }, { once: true });
  });

  // Presentes: todos os nomes, valores e links ficam em presentes.js.
  const giftGrid = $('#gift-grid');
  const gifts = Array.isArray(window.WEDDING_GIFTS) ? window.WEDDING_GIFTS : [];
  const giftStatus = $('#gift-status');
  if (giftGrid) {
    gifts.forEach((gift, index) => {
      const card = document.createElement('article');
      card.className = 'canva-card gift-card rounded-xl p-6 flex flex-col visible';
      card.style.background = '#ffffff';
      card.style.opacity = '1';
      card.style.transform = 'none';
      const img = document.createElement('img');
      img.className = 'canva-image w-full h-28 object-cover rounded-lg mb-5';
      img.src = gift.image || '';
      img.alt = gift.title ? `Imagem de ${gift.title}` : '';
      img.loading = 'lazy';
      img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
      card.appendChild(img);
      const title = document.createElement('h3'); title.className = 'mb-3'; title.textContent = gift.title || `Presente ${index + 1}`; card.appendChild(title);
      const description = document.createElement('p'); description.className = 'leading-relaxed mb-6 flex-1'; description.textContent = gift.description || ''; card.appendChild(description);
      const price = document.createElement('p'); price.className = 'font-bold mb-4'; price.textContent = gift.price || ''; card.appendChild(price);
      const link = document.createElement('a'); link.className = 'canva-button pill w-full'; link.textContent = gift.button || 'Presentear'; link.target = '_blank'; link.rel = 'noopener noreferrer';
      if (gift.url && /^https?:\/\//i.test(gift.url)) { link.href = gift.url; }
      else { link.href = '#'; link.setAttribute('aria-disabled', 'true'); link.classList.add('gift-link-pending'); link.addEventListener('click', event => { event.preventDefault(); if (giftStatus) giftStatus.textContent = 'Este link de presente ainda será cadastrado. Volte em breve!'; }); }
      card.appendChild(link); giftGrid.appendChild(card);
    });
  }

  // RSVP via Formspree. Cole o endpoint do seu formulário no campo abaixo.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkjobqwa';
  const form = $('#rsvp-form');
  const status = $('#rsvp-status');
  const submit = $('#rsvp-submit');
  const success = $('#rsvp-success');
  if (form && status && submit) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const nameInput = $('#guest_name');
      const guestName = (nameInput?.value || '').trim().replace(/\s+/g, ' ');
      const attendance = $('input[name="attendance"]:checked', form);
      if (guestName.split(' ').filter(Boolean).length < 2) {
        status.textContent = 'Por favor, informe seu nome e sobrenome.';
        nameInput?.focus(); return;
      }
      if (!attendance) { status.textContent = 'Selecione em quais momentos você estará conosco.'; return; }
      if (!FORMSPREE_ENDPOINT.startsWith('https://formspree.io/f/')) {
        status.textContent = 'O formulário ainda precisa ser conectado ao Formspree. Consulte o README.md para configurar o envio.';
        return;
      }
      submit.disabled = true; status.textContent = 'Enviando sua confirmação…';
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Submission failed');
        form.classList.add('hidden'); success?.classList.remove('hidden'); status.textContent = '';
      } catch {
        status.textContent = 'Não conseguimos enviar agora. Confira sua conexão e tente novamente.';
      } finally { submit.disabled = false; }
    });
  }
  $('#rsvp-again')?.addEventListener('click', () => { form?.reset(); form?.classList.remove('hidden'); success?.classList.add('hidden'); if (status) status.textContent = ''; $('#guest_name')?.focus(); });
})();
