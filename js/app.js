/* =====================================================================
   CloudSupply Co — Application Logic
   js/app.js
   Depends on: js/data.js  (WA, products, categories)
   ===================================================================== */

'use strict';

/* ── State ────────────────────────────────────────────────────────── */
let currentMode  = 'single';   // 'single' | 'bulk'
let activeFilter = 'All';      // category filter on the products page
let isDark       = true;       // current theme

/* =====================================================================
   DELIVERY POPUP
   - Shows automatically once per session (sessionStorage flag)
   - Fires 1.8 s after the page loader clears so it feels intentional
   - Closes on: ✕ button | "Got it" link | backdrop click | ESC key
   ===================================================================== */

function openDeliveryPopup() {
  const popup = document.getElementById('delivery-popup');
  popup.classList.add('dp-show');
  document.body.style.overflow = 'hidden';
}

function closeDeliveryPopup() {
  const popup = document.getElementById('delivery-popup');
  popup.classList.remove('dp-show');
  document.body.style.overflow = '';
  sessionStorage.setItem('dp-seen', '1');
}

/* Close on backdrop click (outside the card) */
document.getElementById('delivery-popup').addEventListener('click', function (e) {
  if (e.target === this) closeDeliveryPopup();
});

/* Close button wired up */
document.getElementById('dp-close-btn').addEventListener('click', closeDeliveryPopup);

/* ESC key also closes the delivery popup */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDeliveryPopup();
    closeModal(); // existing product modal
  }
});


/* =====================================================================
   UTILITY HELPERS
   ===================================================================== */

/** Format a number as "Rs. 3,200" */
function fmt(n) {
  return 'Rs. ' + n.toLocaleString();
}

/** Build badge HTML string from a badge-key array */
function badgeHTML(badges) {
  const classMap  = { new: 'badge-new', hot: 'badge-hot', best: 'badge-best', sale: 'badge-sale' };
  const labelMap  = { new: 'NEW', hot: '🔥HOT', best: '⭐BEST', sale: 'SALE' };
  return badges
    .map(key => `<span class="badge ${classMap[key] || ''}">${labelMap[key] || key}</span>`)
    .join('');
}

/* =====================================================================
   RENDER : PRODUCT CARD
   ===================================================================== */

/**
 * Returns the full HTML string for a single product card.
 * @param {Object}  p        — product object from data.js
 * @param {boolean} showBulk — render bulk-mode variant if true
 */
function prodCardHTML(p, showBulk = false) {
  const price    = showBulk ? fmt(p.bulkPrice) : fmt(p.price);
  const waText   = showBulk
    ? `Hi, I want bulk pricing details for ${p.name} from CloudSupply Co. Please share the wholesale rate and minimum order quantity.`
    : `Hi, I want to order ${p.name} from CloudSupply Co!`;
  const waMsg    = encodeURIComponent(waText);
  const btnLabel = showBulk ? '📦 Bulk Order' : '🛒 Order Now';
  const btnClass = showBulk ? 'btn-bulk'      : 'btn-wa';

  return `
    <div class="prod-card">
      <div class="prod-badges">${badgeHTML(p.badges)}</div>
      <div class="prod-card-img" onclick="openModal(${p.id})">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : p.emoji}
      </div>
      <div class="prod-info">
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-name" onclick="openModal(${p.id})">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        ${showBulk ? `<span class="bulk-tag">Bulk Rate</span><div class="moq">Min. ${p.moq} units</div>` : ''}
        <div class="prod-foot">
          <div>
            <div class="prod-price">${price}</div>
            ${!showBulk && p.bulkPrice ? `<div class="prod-price-bulk">Bulk: ${fmt(p.bulkPrice)}</div>` : ''}
          </div>
          <a href="https://wa.me/${WA}?text=${waMsg}" target="_blank" class="btn ${btnClass} btn-xs">${btnLabel}</a>
        </div>
      </div>
    </div>`;
}

/* =====================================================================
   RENDER : HERO FLOATING CARDS
   ===================================================================== */

function buildHeroCards() {
  const picks     = products.filter(p => p.isBest).slice(0, 3);
  const positions = ['hcard1', 'hcard2', 'hcard3'];

  document.getElementById('heroCards').innerHTML = picks.map((p, i) => `
    <div class="hcard ${positions[i]}">
      ${p.badges.length ? `<span class="hcard-badge">${p.badges[0].toUpperCase()}</span>` : ''}
      <div class="hcard-emoji">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji}
      </div>
      <div class="hcard-name">${p.name}</div>
      <div class="hcard-price">${fmt(p.price)}</div>
    </div>`).join('');
}

/* =====================================================================
   RENDER : HOME PAGE SECTIONS
   ===================================================================== */

function buildHome() {
  /* Category grid */
  document.getElementById('catGrid').innerHTML = categories.map(c => `
    <div class="cat-card" onclick="showPage('products'); filterCat('${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${products.filter(p => p.cat === c.name).length} products</div>
    </div>`).join('');

  /* New arrivals */
  document.getElementById('newArrivalsGrid').innerHTML = products
    .filter(p => p.isNew)
    .slice(0, 4)
    .map(p => prodCardHTML(p, false))
    .join('');

  /* Best sellers */
  document.getElementById('bestSellersGrid').innerHTML = products
    .filter(p => p.isBest)
    .slice(0, 4)
    .map(p => prodCardHTML(p, false))
    .join('');
}

/* =====================================================================
   RENDER : ALL-PRODUCTS PAGE  (filters + grid)
   ===================================================================== */

/** Rebuild the category filter pills */
function buildCatPills() {
  const cats = ['All', ...new Set(products.map(p => p.cat))];
  document.getElementById('catPills').innerHTML = cats.map(c => `
    <button class="filter-pill${c === activeFilter ? ' active' : ''}" onclick="filterCat('${c}')">${c}</button>
  `).join('');
}

/** Set active category filter and re-render product grid */
function filterCat(cat) {
  activeFilter = cat;
  buildCatPills();
  applyFilters();
  document.getElementById('searchResults').classList.remove('show');
}

/** Apply all active filters (category + price range + flavour type) and render grid */
function applyFilters() {
  const priceVal  = document.getElementById('priceFilter').value;
  const flavorVal = document.getElementById('flavorFilter').value;
  const showBulk  = currentMode === 'bulk';

  let filtered = activeFilter === 'All' ? [...products] : products.filter(p => p.cat === activeFilter);

  if (priceVal) {
    const [min, max] = priceVal.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }

  if (flavorVal) {
    filtered = filtered.filter(p => p.flavorType === flavorVal);
  }

  const grid = document.getElementById('allProdGrid');
  grid.style.opacity = '0';

  setTimeout(() => {
    grid.innerHTML = filtered.length
      ? filtered.map(p => prodCardHTML(p, showBulk)).join('')
      : '<div class="empty"><div class="ei">🔍</div><p>No products match your filters.</p></div>';
    grid.style.transition = 'opacity .3s, transform .3s';
    grid.style.opacity    = '1';
  }, 180);
}

/* =====================================================================
   RENDER : BULK WHOLESALE TABLE
   ===================================================================== */

function buildBulkTable() {
  document.getElementById('bulkTable').innerHTML = products.map(p => {
    const waMsg = encodeURIComponent(
      `Hi, I want bulk pricing details for ${p.name} from CloudSupply Co. Min qty: ${p.moq} units.`
    );
    return `
      <div class="price-row">
        <div class="pr-name">
          ${p.image ? `<img src="${p.image}" alt="" class="pr-img">` : p.emoji}
          ${p.name}
        </div>
        <div class="pr-price" data-label="Retail">${fmt(p.price)}</div>
        <div class="pr-bulk"  data-label="Bulk Rate">${fmt(p.bulkPrice)}</div>
        <div class="pr-moq"   data-label="Min. Qty">${p.moq} units</div>
        <div class="pr-action">
          <button onclick="window.open('https://wa.me/${WA}?text=${waMsg}', '_blank')">Order</button>
        </div>
      </div>`;
  }).join('');
}

/* =====================================================================
   PRODUCT DETAIL MODAL
   ===================================================================== */

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const showBulk = currentMode === 'bulk';
  const waMsg    = encodeURIComponent(
    showBulk
      ? `Hi, I want bulk pricing details for ${p.name} from CloudSupply Co.`
      : `Hi, I want to order ${p.name} from CloudSupply Co!`
  );
  const waMsgBulk = encodeURIComponent(
    `Hi, I want to place a bulk order for ${p.name} from CloudSupply Co. Min qty: ${p.moq} units.`
  );

  /* WhatsApp SVG icon (reusable) */
  const waSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;

  /* Flavour variant pills with click-to-select */
  const variantPills = p.flavors.map((f, i) => `
    <span
      class="variant-pill${i === 0 ? ' active' : ''}"
      onclick="this.closest('.modal-variants').querySelectorAll('.variant-pill').forEach(x => x.classList.remove('active')); this.classList.add('active')"
    >${f}</span>`).join('');

  document.getElementById('mImg').innerHTML = p.image 
    ? `<img src="${p.image}" alt="${p.name}">` 
    : p.emoji;
  document.getElementById('mInfo').innerHTML  = `
    <div class="modal-cat">${p.cat}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-desc">${p.desc}</div>
    <div class="modal-price-row">
      <div class="modal-price-label">Retail Price</div>
      <div class="modal-price-val">${fmt(p.price)}</div>
      <div class="modal-bulk-price">📦 Bulk Rate: ${fmt(p.bulkPrice)} / unit (min. ${p.moq} units)</div>
    </div>
    <div>
      <div style="font-size:.75rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Available Flavors</div>
      <div class="modal-variants">${variantPills}</div>
    </div>
    <div class="modal-actions">
      <a href="https://wa.me/${WA}?text=${waMsg}" target="_blank" class="btn btn-wa">
        ${waSVG} Order Single Unit
      </a>
      <a href="https://wa.me/${WA}?text=${waMsgBulk}" target="_blank" class="btn btn-bulk btn-sm">📦 Order Bulk</a>
    </div>`;

  document.getElementById('prod-modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('prod-modal').classList.remove('show');
  document.body.style.overflow = '';
}

/* =====================================================================
   SEARCH
   ===================================================================== */

function handleSearch(val) {
  const q    = val.trim().toLowerCase();
  const wrap = document.getElementById('searchResults');

  if (!q) {
    wrap.classList.remove('show');
    return;
  }

  const res = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q)  ||
    p.desc.toLowerCase().includes(q) ||
    p.flavors.some(f => f.toLowerCase().includes(q))
  );

  document.getElementById('searchGrid').innerHTML = res.length
    ? res.map(p => prodCardHTML(p, currentMode === 'bulk')).join('')
    : '<div class="empty"><div class="ei">😶‍🌫️</div><p>No results found.</p></div>';

  wrap.querySelector('.sr-title').textContent =
    `${res.length} result${res.length !== 1 ? 's' : ''} for "${val}"`;

  wrap.classList.add('show');

  /* Switch to products page if not already there */
  if (!document.getElementById('page-products').classList.contains('active')) {
    showPage('products');
  }
}

/* =====================================================================
   MODE TOGGLE  (Single Buyer / Bulk Reseller)
   ===================================================================== */

function setMode(m) {
  currentMode = m;
  document.getElementById('tab-single').classList.toggle('active', m === 'single');
  document.getElementById('tab-bulk').classList.toggle('active', m === 'bulk');
  applyFilters();
}

/* =====================================================================
   PAGE NAVIGATION
   ===================================================================== */

function showPage(name) {
  /* Hide all pages, show target */
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  /* Update active nav link */
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navLink = document.getElementById('nl-' + name);
  if (navLink) navLink.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Rebuild dynamic content for the products page */
  if (name === 'products') {
    buildCatPills();
    applyFilters();
  }

  observeFU();
}

/* =====================================================================
   THEME TOGGLE
   ===================================================================== */

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.querySelector('.mode-toggle-nav').textContent = isDark ? '🌙' : '☀️';
}

/* =====================================================================
   CONTACT FORM → WHATSAPP
   ===================================================================== */

function sendContactWA() {
  const name    = document.getElementById('cName').value    || 'Customer';
  const type    = document.getElementById('cType').value;
  const product = document.getElementById('cProduct').value || 'general inquiry';
  const message = document.getElementById('cMsg').value     || '';
  const text    = encodeURIComponent(
    `Hi! I'm ${name} (${type}). I'm interested in: ${product}. ${message}`
  );
  window.open(`https://wa.me/${WA}?text=${text}`, '_blank');
}

/* =====================================================================
   SCROLL EVENTS
   ===================================================================== */

window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 40);
  document.getElementById('btt').classList.toggle('show', scrollY > 400);
  observeFU();
});

/* =====================================================================
   FADE-UP ON SCROLL  (.fu elements)
   ===================================================================== */

function observeFU() {
  document.querySelectorAll('.fu:not(.in)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('in');
  });
}

/* =====================================================================
   HAMBURGER MENU
   ===================================================================== */

document.getElementById('ham').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('mobMenu').classList.toggle('show');
});

function closeMob() {
  document.getElementById('ham').classList.remove('open');
  document.getElementById('mobMenu').classList.remove('show');
}

/* =====================================================================
   CUSTOM CURSOR
   ===================================================================== */

const dot  = document.getElementById('curDot');
const ring = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

/* Smooth ring follow using rAF */
(function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

/* Enlarge ring on interactive elements */
document.querySelectorAll('a, button, .prod-card, .cat-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

/* =====================================================================
   MODAL — CLOSE BEHAVIOURS
   ===================================================================== */

/* Click backdrop to close */
document.getElementById('prod-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

/* Note: ESC key handling is consolidated in the DELIVERY POPUP section above */

/* =====================================================================
   LOADER  +  AUTO-SHOW DELIVERY POPUP
   ===================================================================== */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
    observeFU();

    /* Show the delivery popup 1.8 s after loader clears,
       but only once per browser session */
    if (!sessionStorage.getItem('dp-seen')) {
      setTimeout(openDeliveryPopup, 1800);
    }
  }, 2000);
});

/* =====================================================================
   INITIALISE
   ===================================================================== */

buildHeroCards();
buildHome();
buildBulkTable();
buildCatPills();
applyFilters();
setTimeout(observeFU, 100);
