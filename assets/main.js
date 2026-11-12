/* Haras Terra Brasilis · main.js
   HTML, CSS e JavaScript puros. Os dados dos cavalos ficam em assets/cavalos.js. */
(() => {
  'use strict';

  const DATA = window.HARAS || { contato: {}, cavalos: [] };
  const CAVALOS = DATA.cavalos || [];
  const CONTATO = DATA.contato || {};
  const BY_ID = Object.fromEntries(CAVALOS.map(c => [c.id, c]));

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('js');
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));
  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();

  /* ========== utilidades de cavalo ========== */
  function idade(c) {
    if (!c.nascimento) return '';
    const [y, m, d] = c.nascimento.split('-').map(Number);
    const hoje = new Date();
    let a = hoje.getFullYear() - y;
    if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) a--;
    return a <= 0 ? 'Potro' : a === 1 ? '1 ano' : a + ' anos';
  }
  const dataBR = s => { if (!s) return ''; const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
  const sexoPlural = s => (s === 'Fêmea' ? 'Fêmea' : 'Macho');
  const nomeCurto = c => c.apelido || c.nome.replace(/\s*\(.*?\)\s*/g, '').trim();
  const titleCase = s => String(s || '');

  function waLink(texto) {
    const n = String(CONTATO.whatsapp || '').replace(/\D/g, '');
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(texto)}` : '';
  }
  const interesseTexto = c => `Olá! Vi o ${c.nome} (registro ${c.registro}) no catálogo do Haras Terra Brasilis e quero saber mais.`;

  const ICON = {
    tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 12h5M9 6v12M9 6h5M9 18h5M14 4v4M14 16v4M14 4h6M14 8h6M14 16h6M14 20h6"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.6l1-1.1 1.8.8"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };

  /* ========== divisão do texto do hero (uma vez, com semente) ========== */
  $$('[data-split]').forEach((el, i) => {
    const mode = el.dataset.split;
    const r = rng(17 + i * 31);
    const em = el.querySelector('em') ? el.querySelector('em').textContent.trim() : '';
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text; el.appendChild(sr);
    const vis = document.createElement('span'); vis.className = 'split'; vis.setAttribute('aria-hidden', 'true');
    const words = text.split(' ');
    words.forEach((w, wi) => {
      const ws = document.createElement(em && em.includes(w) ? 'em' : 'span');
      ws.className = 'w';
      if (mode === 'chars') {
        for (const ch of w) {
          const c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
          c.style.setProperty('--th', (r() * 0.55).toFixed(3));
          c.style.setProperty('--jx', ((r() - 0.5) * 120).toFixed(1) + 'px');
          c.style.setProperty('--jy', ((r() - 0.5) * 80).toFixed(1) + 'px');
          ws.appendChild(c);
        }
      } else {
        ws.textContent = w;
        ws.style.setProperty('--th', ((wi / words.length) * 0.5 + r() * 0.05).toFixed(3));
      }
      vis.appendChild(ws);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.appendChild(vis);
  });

  /* ========== HERO: o vídeo toca uma vez sozinho e para na pose final do cavalo ========== */
  const stage = $('.stage');
  const video = $('.hero-video');
  const poster = $('.poster');
  const HERO = {
    larga:   { video: 'assets/hero.mp4',         inicio: 'assets/img/hero-inicio.jpg' },
    retrato: { video: 'assets/hero-retrato.mp4', inicio: 'assets/img/hero-inicio-retrato.jpg' }
  };
  const PORTRAIT = matchMedia('(orientation: portrait)');
  // mostra a pose final parada; o CSS escolhe a versão larga ou em pé
  function heroStill() {
    stage.classList.remove('video-ready');
    stage.classList.add('video-off');
    poster.style.backgroundImage = '';
    try { video.pause(); } catch (e) {}
  }
  const economia = navigator.connection && navigator.connection.saveData;
  if (DATA.videoNoTopo !== false && !RM.matches && !economia) {
    const v = HERO[PORTRAIT.matches ? 'retrato' : 'larga'];
    poster.style.backgroundImage = `url('${v.inicio}')`;
    video.poster = v.inicio;
    video.src = v.video;
    video.addEventListener('playing', () => stage.classList.add('video-ready'), { once: true });
    video.addEventListener('error', heroStill, { once: true });
    const tocar = video.play();
    if (tocar && tocar.catch) tocar.catch(heroStill);      // navegador bloqueou: fica a pose final
    PORTRAIT.addEventListener('change', heroStill, { once: true });  // girou o aparelho: pose final da outra versão
  } else {
    heroStill();
  }
  RM.addEventListener('change', e => { if (e.matches) heroStill(); });

  /* entrada do título ao abrir a página */
  (function entrada() {
    const s = $('.settle');
    if (!s || RM.matches) return;
    const t0 = performance.now();
    const step = () => {
      const k = smoothstep(performance.now() - t0, 150, 1500);
      s.style.setProperty('--k', k.toFixed(3));
      s.style.setProperty('--ks', clamp((k - 0.45) * 2.4, 0, 1).toFixed(3));
      s.style.setProperty('--kb', clamp((k - 0.62) * 2.8, 0, 1).toFixed(3));
      if (k < 1) requestAnimationFrame(step);
      else ['--k', '--ks', '--kb'].forEach(n => s.style.removeProperty(n));
    };
    step();
  })();

  /* ========== navegação ========== */
  const nav = $('#nav');
  let navSolid = null;
  const navCheck = () => { const s = scrollY > 40; if (s !== navSolid) { navSolid = s; nav.classList.toggle('solid', s); } };
  addEventListener('scroll', navCheck, { passive: true }); navCheck();

  /* ========== revelações ========== */
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      // aposenta o atraso de escalonamento depois da entrada, para o hover responder na hora
      setTimeout(() => { el.classList.add('done'); el.style.transitionDelay = ''; }, 1600);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const observe = el => (RM.matches ? el.classList.add('in', 'done') : io.observe(el));
  $$('.reveal').forEach(observe);

  /* ========== YouTube leve (só carrega quando o visitante pede) ========== */
  function ytBlock(id, rotulo, reserva) {
    if (!id) return '';
    return `<div class="yt" data-yt="${esc(id)}">
      <button class="yt-btn" type="button" aria-label="Assistir ao vídeo: ${esc(rotulo)}">
        <img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt="" loading="lazy"${reserva ? ` data-reserva="${esc(reserva)}"` : ''}>
        <span class="yt-play">${ICON.play}</span>
        <span class="yt-label">${esc(rotulo)}</span>
      </button>
    </div>
    <a class="yt-out" href="https://youtu.be/${esc(id)}" target="_blank" rel="noopener">Abrir no YouTube ↗</a>`;
  }
  // se a miniatura do YouTube não carregar, usa a foto do cavalo
  document.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.dataset.reserva && img.src.indexOf(img.dataset.reserva) === -1) img.src = img.dataset.reserva;
  }, true);
  document.addEventListener('click', e => {
    const btn = e.target.closest('.yt-btn');
    if (!btn) return;
    const box = btn.closest('.yt');
    const id = box.dataset.yt;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
    f.title = btn.getAttribute('aria-label');
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });

  /* ========== catálogo ========== */
  const grid = $('#grid');
  const busca = $('#busca');
  const empty = $('#empty');
  let filtro = 'todos';

  function cardHTML(c, i) {
    const g = c.genealogia || {};
    const disp = c.disponivel !== false;
    return `<li class="card" style="transition-delay:${(i % 3) * 0.09}s">
      <a class="card-link" href="#cavalo/${esc(c.id)}" aria-label="Ver a ficha de ${esc(c.nome)}"></a>
      <div class="card-media">
        <img src="${esc(c.fotoCard || c.foto)}" alt="${esc(c.nome)}, ${esc(c.pelagem)}" loading="lazy" width="1000" height="666">
        <span class="badge ${disp ? 'ok' : 'res'}">${disp ? 'Disponível' : 'Reservado'}</span>
        <span class="card-reg">Reg. ${esc(c.registro)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${esc(c.nome)}</h3>
        <span class="card-rail" aria-hidden="true"></span>
        <p class="card-meta">${esc(idade(c))} · ${esc(c.pelagem)} · ${esc(c.sexo)}</p>
        ${g.pai ? `<p class="card-cross">${esc(titleCase(g.pai))}<span aria-label="cruzado com">×</span>${esc(titleCase(g.mae))}</p>` : ''}
        <div class="card-actions">
          <a class="btn btn-green" href="#cavalo/${esc(c.id)}">Ver ficha</a>
          ${g.pai ? `<a class="btn btn-ghost" href="#arvore/${esc(c.id)}" aria-label="Genealogia de ${esc(c.nome)}">${ICON.tree}Genealogia</a>` : ''}
        </div>
      </div>
    </li>`;
  }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function renderGrid() {
    const q = norm(busca.value.trim());
    const list = CAVALOS.filter(c => {
      if (filtro === 'disponivel' && c.disponivel === false) return false;
      if ((filtro === 'Macho' || filtro === 'Fêmea') && sexoPlural(c.sexo) !== filtro) return false;
      if (!q) return true;
      const g = c.genealogia || {};
      return norm([c.nome, c.apelido, c.registro, c.pelagem, g.pai, g.mae].join(' ')).includes(q);
    });
    grid.innerHTML = list.map(cardHTML).join('');
    $('#count').textContent = list.length;
    empty.hidden = list.length > 0;
    $$('.card', grid).forEach(observe);
  }
  $$('.chip-btn').forEach(b => b.addEventListener('click', () => {
    filtro = b.dataset.filter;
    $$('.chip-btn').forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    renderGrid();
  }));
  let t; busca.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderGrid, 120); });
  $('#limpar').addEventListener('click', () => { busca.value = ''; $('.chip-btn[data-filter="todos"]').click(); });
  renderGrid();


  /* ========== modais (abrir, fechar, rotas #cavalo/id e #arvore/id) ========== */
  const ficha = $('#ficha');
  const arvore = $('#arvore');
  let fichaId = null, arvoreId = null;

  function openDialog(d) {
    if (d.open) return;
    d.classList.remove('closing');
    d.showModal();
    root.style.overflow = 'hidden';
  }
  function closeDialog(d) {
    if (!d.open) return Promise.resolve();
    return new Promise(res => {
      const done = () => { d.classList.remove('closing'); d.close(); if (!ficha.open && !arvore.open) root.style.overflow = ''; res(); };
      if (RM.matches) return done();
      d.classList.add('closing');
      setTimeout(done, 280);
    });
  }
  function route() {
    const m = location.hash.match(/^#(cavalo|arvore)\/([\w-]+)$/);
    if (!m || !BY_ID[m[2]]) {
      closeDialog(arvore); closeDialog(ficha); fichaId = arvoreId = null;
      return;
    }
    const c = BY_ID[m[2]];
    if (m[1] === 'cavalo') {
      if (arvore.open) { closeDialog(arvore); arvoreId = null; }
      if (fichaId !== c.id) { renderFicha(c); fichaId = c.id; }
      openDialog(ficha);
      ficha.querySelector('.close')?.focus({ preventScroll: true });
    } else {
      if (arvoreId !== c.id) { renderTree(c); arvoreId = c.id; }
      openDialog(arvore);
      requestAnimationFrame(() => requestAnimationFrame(drawTree));
      arvore.querySelector('.close').focus({ preventScroll: true });
    }
  }
  function go(hash) {
    if (location.hash === hash) return route();
    history.pushState(null, '', hash);
    route();
  }
  function clearHash(to) {
    history.replaceState(null, '', to || (location.pathname + location.search));
    route();
  }
  // links internos de rota
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#cavalo/"],a[href^="#arvore/"]');
    if (!a) return;
    e.preventDefault();
    go(a.getAttribute('href'));
  });
  addEventListener('popstate', route);
  addEventListener('hashchange', route);

  [ficha, arvore].forEach(d => {
    d.addEventListener('cancel', e => { e.preventDefault(); closeFrom(d); });
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) closeFrom(d); });
  });
  function closeFrom(d) {
    if (d === arvore && ficha.open && fichaId) clearHash('#cavalo/' + fichaId);
    else clearHash();
  }

  /* ---------- ficha ---------- */
  function renderFicha(c) {
    const g = c.genealogia || {};
    const disp = c.disponivel !== false;
    const wa = waLink(interesseTexto(c));
    const rows = [
      ['Registro', c.registro], ['Status', c.status], ['UELN', c.ueln], ['Microchip', c.microchip],
      ['Nascimento', dataBR(c.nascimento)], ['Idade', idade(c)], ['Sexo', c.sexo], ['Pelagem', c.pelagem],
      ['Raça', c.raca], ['Método reprodutivo', c.metodo], ['DNA', c.dna], ['Criador', c.criador],
      ['Proprietário', c.proprietario], ['Local de nascimento', c.localNascimento]
    ].filter(r => r[1]);
    $('#ficha-body').innerHTML = `
      <div class="ficha-grid">
        <div class="ficha-media">
          <img src="${esc(c.foto)}" alt="${esc(c.nome)} saltando">
          ${c.fotoCredito ? `<span class="credit">Foto ${esc(c.fotoCredito)}</span>` : ''}
        </div>
        <div class="ficha-body">
          <div class="ficha-top">
            <span class="badge ${disp ? 'ok' : 'res'}">${disp ? 'Disponível' : 'Reservado'}</span>
            <span class="kicker mono" style="margin:0">${esc(c.raca)}</span>
          </div>
          <h2 class="ficha-name" id="ficha-nome">${esc(c.nome)}</h2>
          ${g.pai ? `<p class="ficha-cross">${esc(titleCase(g.pai))}<span aria-label="cruzado com">×</span>${esc(titleCase(g.mae))}</p>` : ''}
          ${c.resumo ? `<p class="ficha-resumo">${esc(c.resumo)}</p>` : ''}
          <div class="ficha-actions">
            ${c.youtube ? `<button class="btn btn-green" type="button" data-ver-video>${ICON.play}Ver vídeo</button>` : ''}
            ${g.pai ? `<a class="btn ${c.youtube ? 'btn-ghost' : 'btn-green'}" href="#arvore/${esc(c.id)}">${ICON.tree}Árvore genealógica</a>` : ''}
            ${wa ? `<a class="btn btn-red" href="${esc(wa)}" target="_blank" rel="noopener">${ICON.wa}Tenho interesse</a>`
                 : `<button class="btn btn-red" type="button" data-interesse="${esc(c.id)}">Tenho interesse</button>`}
            ${c.abcch ? `<a class="btn btn-ghost" href="${esc(c.abcch)}" target="_blank" rel="noopener">Ficha na ABCCH ${ICON.out}</a>` : ''}
          </div>
          <dl class="spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd${/UELN|Microchip|Registro|DNA/.test(k) ? ' class="mono"' : ''}>${esc(v)}</dd></div>`).join('')}</dl>
        </div>
      </div>
      ${c.youtube ? `<div class="ficha-video" id="ficha-video"><h3>Vídeo em pista</h3>${ytBlock(c.youtube, nomeCurto(c) + ' em pista', c.foto)}</div>` : ''}`;
    $('#ficha-body').scrollTop = 0;
  }
  // "Ver vídeo": desce a ficha até o vídeo e dá o play
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-ver-video]')) return;
    const box = $('#ficha-video');
    if (!box) return;
    box.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => box.querySelector('.yt-btn')?.click(), RM.matches ? 0 : 550);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-interesse]');
    if (!b) return;
    const c = BY_ID[b.dataset.interesse];
    clearHash();
    const sel = $('#form-cavalo');
    if (sel && c) sel.value = c.nome;
    setTimeout(() => { $('#contato').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' }); $('#form input[name="nome"]').focus({ preventScroll: true }); }, 320);
  });

  /* ---------- árvore genealógica ---------- */
  const tree = $('#tree');
  const lines = $('#tree-lines');
  const COLS = ['Cavalo', 'Pais', 'Avós', 'Bisavós', 'Trisavós'];

  function ancestors(c) {
    const g = c.genealogia || {};
    const arr = [];                                   // índice 1 = o cavalo, 2n = pai de n, 2n+1 = mãe de n
    arr[1] = c.nome; arr[2] = g.pai; arr[3] = g.mae;
    (g.avos || []).forEach((n, i) => (arr[4 + i] = n));
    (g.bisavos || []).forEach((n, i) => (arr[8 + i] = n));
    (g.trisavos || []).forEach((n, i) => (arr[16 + i] = n));
    return arr;
  }
  function renderTree(c) {
    $('#arvore-titulo').textContent = c.nome;
    tree.querySelectorAll('.node,.tree-col-h').forEach(n => n.remove());
    lines.innerHTML = '';
    tree.classList.remove('drawn');
    COLS.forEach((t, i) => {
      const h = document.createElement('div');
      h.className = 'tree-col-h'; h.style.gridColumn = i + 1; h.textContent = t;
      tree.appendChild(h);
    });
    const a = ancestors(c);
    for (let i = 1; i < 32; i++) {
      if (!a[i]) continue;
      const gen = Math.floor(Math.log2(i));
      const span = 16 >> gen;
      const male = i === 1 ? c.sexo !== 'Fêmea' : i % 2 === 0;
      const n = document.createElement('button');
      n.type = 'button';
      n.className = `node ${male ? 'm' : 'f'}${i === 1 ? ' root' : ''}${gen === 1 ? ' gen1' : ''}`;
      n.dataset.i = i;
      n.style.gridColumn = gen + 1;
      n.style.gridRow = `${2 + (i - (1 << gen)) * span} / span ${span}`;
      n.style.alignSelf = 'center';
      if (gen === 0) n.style.minHeight = innerWidth <= 720 ? '100px' : '140px';
      if (gen === 1) n.style.minHeight = innerWidth <= 720 ? '56px' : '72px';
      n.style.transitionDelay = (gen * 0.14) + 's';
      n.innerHTML = `${esc(a[i])}<span class="sx" aria-hidden="true">${male ? '♂' : '♀'}</span>`;
      n.setAttribute('aria-label', `${a[i]}, ${COLS[gen] === 'Cavalo' ? 'o cavalo' : (male ? 'macho' : 'fêmea')}, ${COLS[gen]}`);
      tree.appendChild(n);
    }
  }
  function layoutLines() {
    const W = tree.scrollWidth, H = tree.scrollHeight;
    lines.setAttribute('viewBox', `0 0 ${W} ${H}`);
    lines.style.width = W + 'px'; lines.style.height = H + 'px';
    const pos = {};
    tree.querySelectorAll('.node').forEach(n => {
      pos[n.dataset.i] = { l: n.offsetLeft, r: n.offsetLeft + n.offsetWidth, y: n.offsetTop + n.offsetHeight / 2 };
    });
    let html = '';
    for (let c = 2; c < 32; c++) {
      const p = pos[c >> 1], k = pos[c];
      if (!p || !k) continue;
      const xm = p.r + (k.l - p.r) / 2;
      html += `<path data-c="${c}" d="M${p.r} ${p.y}H${xm}V${k.y}H${k.l}"/>`;
    }
    lines.innerHTML = html;
    lines.querySelectorAll('path').forEach(pa => {
      const len = Math.ceil(pa.getTotalLength());
      const gen = Math.floor(Math.log2(+pa.dataset.c));
      pa.style.setProperty('--len', len);
      pa.style.transitionDelay = tree.classList.contains('drawn') ? '0s' : (gen * 0.14) + 's';
    });
  }
  function drawTree() {
    layoutLines();
    tree.getBoundingClientRect();
    tree.classList.add('drawn');
    setTimeout(() => {
      tree.querySelectorAll('.node,.tree-lines path').forEach(n => (n.style.transitionDelay = '0s'));
    }, 1400);
  }
  new ResizeObserver(() => { if (arvore.open) layoutLines(); }).observe(tree);

  let litFrom = null;
  function light(i) {
    tree.querySelectorAll('.lit').forEach(n => n.classList.remove('lit'));
    if (!i) return;
    for (let k = i; k >= 1; k >>= 1) {
      tree.querySelector(`.node[data-i="${k}"]`)?.classList.add('lit');
      if (k > 1) lines.querySelector(`path[data-c="${k}"]`)?.classList.add('lit');
    }
  }
  tree.addEventListener('click', e => {
    const n = e.target.closest('.node'); if (!n) return;
    const i = +n.dataset.i;
    litFrom = litFrom === i ? null : i;
    light(litFrom);
  });
  tree.addEventListener('pointerover', e => {
    const n = e.target.closest('.node');
    if (e.pointerType === 'mouse' && n) light(+n.dataset.i);
  });
  tree.addEventListener('pointerleave', () => light(litFrom));

  /* ========== contato ========== */
  const list = $('#contato-list');
  const items = [];
  const waN = String(CONTATO.whatsapp || '').replace(/\D/g, '');
  if (waN) items.push(`<li><a href="https://wa.me/${waN}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a></li>`);
  if (CONTATO.telefone) items.push(`<li><a href="tel:+55${esc(String(CONTATO.telefone).replace(/\D/g, ''))}">${ICON.tel}${esc(CONTATO.telefone)}</a></li>`);
  if (CONTATO.instagram) items.push(`<li><a href="https://instagram.com/${esc(CONTATO.instagram)}" target="_blank" rel="noopener">${ICON.ig}@${esc(CONTATO.instagram)}</a></li>`);
  if (CONTATO.email) items.push(`<li><a href="mailto:${esc(CONTATO.email)}">${ICON.mail}${esc(CONTATO.email)}</a></li>`);
  if (CONTATO.cidade) items.push(`<li><a href="${esc(CONTATO.mapa || 'https://www.google.com/maps/search/' + encodeURIComponent('Haras Terra Brasilis ' + CONTATO.cidade))}" target="_blank" rel="noopener">${ICON.pin}${esc([CONTATO.endereco, CONTATO.cidade].filter(Boolean).join(' · '))}</a></li>`);
  if (CONTATO.site) items.push(`<li><a href="${esc(CONTATO.site)}" target="_blank" rel="noopener">${ICON.web}${esc(CONTATO.site.replace(/^https?:\/\//, ''))}</a></li>`);
  list.innerHTML = items.join('');

  const sel = $('#form-cavalo');
  const nomes = [...new Set(CAVALOS.map(c => c.nome))];
  sel.innerHTML = '<option value="">Ainda não sei, quero indicações</option>' + nomes.map(n => `<option>${esc(n)}</option>`).join('');

  const form = $('#form');
  const note = $('#form-note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    form.nome.setAttribute('aria-invalid', String(!nome));
    note.classList.remove('warn');
    if (!nome) { note.textContent = 'Escreva seu nome para a gente saber com quem fala.'; note.classList.add('warn'); form.nome.focus(); return; }
    const cav = sel.value;
    const texto = `Olá, sou ${nome}.` + (cav ? ` Tenho interesse no ${cav}.` : ' Quero indicações de cavalos do catálogo.') + (form.msg.value.trim() ? `\n\n${form.msg.value.trim()}` : '');
    const wa = waLink(texto);
    if (wa) {
      window.open(wa, '_blank', 'noopener');
      note.textContent = 'Abrimos o WhatsApp com a sua mensagem pronta. É só enviar.';
    } else if (CONTATO.email) {
      location.href = `mailto:${CONTATO.email}?subject=${encodeURIComponent('Catálogo: ' + (cav || 'indicações'))}&body=${encodeURIComponent(texto)}`;
      note.textContent = 'Abrimos o seu e-mail com a mensagem pronta. É só enviar.';
    } else {
      note.classList.add('warn');
      note.textContent = 'O contato do Haras ainda não foi configurado. Preencha o WhatsApp em assets/cavalos.js.';
    }
  });

  /* ========== movimento reduzido ao vivo ========== */
  RM.addEventListener('change', e => {
    if (e.matches) { $$('.reveal,.card').forEach(el => el.classList.add('in', 'done')); if (arvore.open) tree.classList.add('drawn'); }
    applyHeroMode();
  });

  /* abre a ficha se o link já chegou com #cavalo/id */
  route();
  document.fonts && document.fonts.ready.then(() => { if (arvore.open) layoutLines(); });
})();
