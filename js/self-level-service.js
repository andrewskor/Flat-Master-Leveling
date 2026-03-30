
  // Services
  const descs = [
    "Prepared subfloor surface and applied a high-performance self-leveling compound to create a smooth, flat, and durable finish. Work included cleaning, priming, pouring, and finishing in accordance with product specifications and site requirements.",
    "Repaired damaged concrete areas by cleaning, preparing, and patching cracks, holes, and surface spalls using appropriate bonding agents and patching compounds. Work ensures improved surface integrity and prepares area for final finishes.",
    "Performed precision grinding to smooth uneven concrete surfaces, remove surface coatings, and prepare subfloor for finishing. Work completed using industrial-grade grinders with dust-control systems for safety and cleanliness.",
    "Provided mechanical scarifying (surface milling) to roughen and remove layers of concrete, coatings, or adhesives in preparation for resurfacing or leveling. Work completed using heavy-duty scarifier machines with dust extraction systems.",
    "Performed controlled concrete chipping and surface preparation for structural reinforcement and leveling. Includes removal of loose or deteriorated concrete using electric/pneumatic chipping tools and disposal of debris per site safety standards."
  ];

  const N = 5;
  let cur = 0, startX = 0, dragging = false, dragMoved = false, zoomed = false;

  const cards = [...document.querySelectorAll('.vcard')];
  const bgs = [...document.querySelectorAll('.vslider-bg')];
  const dots = [...document.querySelectorAll('.vdot')];
  const desc = document.getElementById('vdesc');
  const cardWrap = document.getElementById('vcards');

  function getState(i, cur, N) {
    const diff = ((i - cur) % N + N) % N;
    if (diff === 0) return 'current';
    if (diff === 1) return 'next';
    if (diff === N - 1) return 'prev';
    if (diff === 2) return 'hidden-next';
    return 'hidden-prev';
  }

  function update() {
    zoomed = false;
    cards.forEach(c => {
      c.dataset.state = getState(+c.dataset.i, cur, N);
      c.classList.remove('zoomed');
    });
    bgs.forEach((b, i) => {
      const diff = ((i - cur) % N + N) % N;
      b.className = 'vslider-bg';
      if (diff === 0) b.classList.add('active');
      else if (diff === 1) b.classList.add('next-bg');
      else if (diff === N - 1) b.classList.add('prev-bg');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    desc.style.opacity = 0;
    setTimeout(() => { desc.textContent = descs[cur]; desc.style.opacity = 1; }, 200);
  }

  function toggleZoom() {
    zoomed = !zoomed;
    const currentCard = cards[cur];
    currentCard.classList.toggle('zoomed', zoomed);
    cardWrap.classList.toggle('zoomed-mode', zoomed);
  }

  const vnext = document.getElementById('vnext');
  const vprev = document.getElementById('vprev');

  vnext.onclick = () => { cur = (cur + 1) % N; update(); };
  vprev.onclick = () => { cur = (cur - 1 + N) % N; update(); };
  vnext.addEventListener('mousedown', e => e.stopPropagation());
  vnext.addEventListener('mouseup', e => e.stopPropagation());
  vprev.addEventListener('mousedown', e => e.stopPropagation());
  vprev.addEventListener('mouseup', e => e.stopPropagation());

  dots.forEach(d => d.onclick = () => { cur = +d.dataset.i; update(); });
  cards.forEach(c => c.onclick = () => {
    if (dragMoved) return;
    const i = +c.dataset.i;
    if (i === cur) { toggleZoom(); }
    else { cur = i; update(); }
  });

  cardWrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; dragMoved = false; }, { passive: true });
  cardWrap.addEventListener('touchend', e => {
    if (!dragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? (cur = (cur + 1) % N) : (cur = (cur - 1 + N) % N); update(); }
    dragging = false;
  });
  cardWrap.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; dragMoved = false; });
  cardWrap.addEventListener('mousemove', e => { if (dragging && Math.abs(e.clientX - startX) > 10) dragMoved = true; });
  cardWrap.addEventListener('mouseup', e => {
    if (!dragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? (cur = (cur + 1) % N) : (cur = (cur - 1 + N) % N); update(); }
    dragging = false;
  });

  // Projects
  let allAfter = false;
  const toggleBtn = document.getElementById('ba-toggle-all');
  const pairs = document.querySelectorAll('.ba-pair');

  toggleBtn.addEventListener('click', () => {
    allAfter = !allAfter;
    pairs.forEach(p => p.classList.toggle('show-after', allAfter));
    toggleBtn.textContent = allAfter ? 'Show Befores' : 'Show Afters';
  });

