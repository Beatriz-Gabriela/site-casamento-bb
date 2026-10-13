
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

    $$('a', mobileNav).forEach(link =>
      link.addEventListener('click', closeMenu)
    );

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
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
      if (element) {
        element.textContent = String(values[index]).padStart(2, '0');
      }
    });

    const complete = $('#count-complete');
    if (complete) {
      complete.classList.toggle('hidden', remaining !== 0);
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Animações de entrada, respeitando movimento reduzido.
  const reveals = $$('.reveal');

  if (
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Tratamento de imagens ausentes.
  $$('img').forEach(img => {
    img.addEventListener('load', () => {
      if (img.classList.contains('route-replacement')) {
        img.style.display = 'block';

        const routeShell = img
          .closest('.route-section')
          ?.querySelector('.shell');

        if (routeShell) routeShell.style.display = 'none';
      }
    }, { once: true });

    img.addEventListener('error', () => {
      img.classList.add('asset-missing');
      img.style.display = 'none';

      const routeShell = img
        .closest('.route-section')
        ?.querySelector('.shell');

      if (routeShell) routeShell.style.display = 'block';
    }, { once: true });
  });

  // Presentes: exibe somente os 10 primeiros cadastrados.
  // Os dados permanecem no arquivo presentes.js.
  const giftGrid = $('#gift-grid');
  const gifts = Array.isArray(window.WEDDING_GIFTS)
    ? window.WEDDING_GIFTS
    : [];
  const giftStatus = $('#gift-status');

  if (giftGrid) {
    giftGrid.replaceChildren();

    gifts.slice(0, 10).forEach((gift, index) => {
      const card = document.createElement('article');
      card.className =
        'canva-card gift-card rounded-xl p-6 flex flex-col visible';

      card.style.background = '#ffffff';
      card.style.opacity = '1';
      card.style.transform = 'none';

      const img = document.createElement('img');
      img.className =
        'canva-image w-full h-40 object-cover rounded-lg mb-5';
      img.src = gift.image || '';
      img.alt = gift.title ? `Imagem de ${gift.title}` : '';
      img.loading = 'lazy';

      img.addEventListener('error', () => {
        img.style.display = 'none';
      }, { once: true });

      card.appendChild(img);

      const title = document.createElement('h3');
      title.className = 'mb-3';
      title.textContent = gift.title || `Presente ${index + 1}`;
      card.appendChild(title);

      const description = document.createElement('p');
      description.className = 'leading-relaxed mb-6 flex-1';
      description.textContent = gift.description || '';
      card.appendChild(description);

      const price = document.createElement('p');
      price.className = 'font-bold mb-4';
      price.textContent = gift.price || '';
      card.appendChild(price);

      const link = document.createElement('a');
      link.className = 'canva-button pill w-full';
      link.textContent = gift.button || 'Presentear';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      if (gift.url && /^https?:\/\//i.test(gift.url)) {
        link.href = gift.url;
      } else {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.classList.add('gift-link-pending');

        link.addEventListener('click', event => {
          event.preventDefault();

          if (giftStatus) {
            giftStatus.textContent =
              'Este link de presente ainda será cadastrado. Volte em breve!';
          }
        });
      }

      card.appendChild(link);
      giftGrid.appendChild(card);
    });
  }

  // Confirmação de presença via Google Sheets + Google Apps Script.
  // Depois de publicar o Apps Script como Aplicativo da Web, cole a URL abaixo.
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5Tj0iob_P0bLbrgnE29_O3IDQ3xUkuK6fb0OaCtwRAr8-h5fz3IBQUwlKuG5tj-aj/exec';
  const form = $('#rsvp-form');
  const status = $('#rsvp-status');
  const submit = $('#rsvp-submit');
  const success = $('#rsvp-success');

  if (form && status && submit) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const nameInput = $('#guest_name');
      const guestName = (nameInput?.value || '')
        .trim()
        .replace(/\s+/g, ' ');
      const attendance = $('input[name="attendance"]:checked', form);

      if (guestName.split(' ').filter(Boolean).length < 2) {
        status.textContent = 'Por favor, informe seu nome e sobrenome.';
        nameInput?.focus();
        return;
      }

      if (!attendance) {
        status.textContent = 'Selecione em quais momentos você estará conosco.';
        return;
      }

      if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(GOOGLE_APPS_SCRIPT_URL)) {
        status.textContent = 'A confirmação ainda está sendo configurada. Tente novamente mais tarde.';
        console.error('Configure GOOGLE_APPS_SCRIPT_URL no arquivo script.js.');
        return;
      }

      submit.disabled = true;
      status.textContent = 'Enviando sua confirmação…';

      // Envia por formulário para um iframe oculto. Isso evita o bloqueio de CORS
      // que pode ocorrer ao chamar um Web App do Apps Script a partir do GitHub Pages.
      const token = (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const frameName = 'rsvp-response-frame';
      let frame = document.getElementById(frameName);
      if (!frame) {
        frame = document.createElement('iframe');
        frame.name = frameName;
        frame.id = frameName;
        frame.title = 'Resposta da confirmação de presença';
        frame.hidden = true;
        document.body.appendChild(frame);
      }

      let finished = false;
      const finish = (ok, message) => {
        if (finished) return;
        finished = true;
        window.removeEventListener('message', onMessage);
        window.clearTimeout(timeoutId);
        submit.disabled = false;

        if (ok) {
          form.classList.add('hidden');
          success?.classList.remove('hidden');
          status.textContent = '';
        } else {
          status.textContent = message || 'Não conseguimos confirmar o envio. Confira sua conexão e tente novamente.';
        }
      };

      const onMessage = messageEvent => {
        const data = messageEvent.data;
        if (!data || data.type !== 'wedding-rsvp-result' || data.token !== token) return;
        finish(data.ok === true, data.message);
      };

      window.addEventListener('message', onMessage);
      const timeoutId = window.setTimeout(() => {
        finish(false, 'O envio demorou mais que o esperado. Verifique sua conexão e tente novamente.');
      }, 30000);

      const postForm = document.createElement('form');
      postForm.method = 'POST';
      postForm.action = GOOGLE_APPS_SCRIPT_URL;
      postForm.target = frameName;
      postForm.hidden = true;

      const values = new FormData(form);
      values.set('guest_name', guestName);
      values.set('request_token', token);
      values.set('website', ''); // campo-isca anti-spam
      for (const [key, value] of values.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        postForm.appendChild(input);
      }

      document.body.appendChild(postForm);
      postForm.submit();
      postForm.remove();
    });
  }

  // Permite enviar outra confirmação.
  $('#rsvp-again')?.addEventListener('click', () => {
    form?.reset();
    form?.classList.remove('hidden');
    success?.classList.add('hidden');

    if (status) status.textContent = '';

    $('#guest_name')?.focus();
  });
})();
