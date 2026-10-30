/**
 * MANO-LAB — Playful & Clean Laboratory Controller
 */

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let soundEnabled = localStorage.getItem('mano_sound_fx') === 'true';
  let audioCtx = null;

  document.addEventListener('DOMContentLoaded', () => {
    updateCounts();
    initHeroModeSwitcher();
    initHeroZenSand();
    initBouncyCanvas();
    initFilters();
    renderCards();
    initSearch();
    initSound();
    initSurpriseBtn();
    initSparkleClicks();

    if (window.lucide) window.lucide.createIcons();
  });

  function updateCounts() {
    const apps = window.MANO_APPS || [];
    const count = apps.length;
    const badge = document.getElementById('appCountBadge');
    if (badge) badge.textContent = `${count} APPS & GAMES ONLINE`;

    const exploreBtn = document.getElementById('exploreCountText');
    if (exploreBtn) exploreBtn.textContent = `Explore ${count} Apps & Games`;

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = `Search ${count} apps and games...`;
  }

  // ==========================================================================
  // 1. Procedural Bubble Pop Sound (Native WebAudio API)
  // ==========================================================================
  function playPop(freq = 900) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch(e) {}
  }

  function initSound() {
    const btn = document.getElementById('soundBtn');
    if (!btn) return;
    updateSoundBtn(btn);

    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('mano_sound_fx', soundEnabled);
      updateSoundBtn(btn);
      if (soundEnabled) playPop(1100);
    });
  }

  function updateSoundBtn(btn) {
    const txt = document.getElementById('soundText');
    if (soundEnabled) {
      btn.classList.add('active');
      if (txt) txt.textContent = 'Sound: ON 🔊';
    } else {
      btn.classList.remove('active');
      if (txt) txt.textContent = 'Sound: OFF 🔇';
    }
  }

  // ==========================================================================
  // 2. Playful Bouncy Physics Orbs Canvas in Hero
  // ==========================================================================
  function initBouncyCanvas() {
    const canvas = document.getElementById('bouncyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const apps = window.MANO_APPS || [];
    const colors = ['#c8ff00', '#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#38bdf8', '#c084fc'];

    class Bubble {
      constructor(app, idx) {
        this.app = app;
        this.radius = 24;
        const colCount = Math.min(apps.length, 6);
        const col = idx % colCount;
        const row = Math.floor(idx / colCount);
        this.x = 40 + col * ((width - 80) / Math.max(1, colCount - 1)) + (Math.random() - 0.5) * 15;
        this.y = 35 + row * ((height - 70) / Math.max(1, Math.ceil(apps.length / colCount) - 1)) + (Math.random() - 0.5) * 15;
        this.vx = (Math.random() - 0.5) * 1.6;
        this.vy = (Math.random() - 0.5) * 1.3;
        this.color = colors[idx % colors.length];
        this.emoji = app.emoji || '🧪';
        this.hovered = false;
      }
      update(mouse) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce walls
        if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -1; }
        if (this.x + this.radius > width) { this.x = width - this.radius; this.vx *= -1; }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -1; }
        if (this.y + this.radius > height) { this.y = height - this.radius; this.vy *= -1; }

        // Mouse repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radius + 35) {
          const force = (this.radius + 35 - dist) / (this.radius + 35);
          this.vx -= (dx / dist) * force * 1.4;
          this.vy -= (dy / dist) * force * 1.4;
          this.hovered = true;
        } else {
          this.hovered = false;
        }

        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.hovered ? this.color : 'rgba(24, 27, 36, 0.9)';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.hovered ? 16 : 6;
        ctx.fill();
        ctx.stroke();

        // Draw Emoji
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y + 1);

        ctx.restore();
      }
    }

    const bubbles = apps.map((app, idx) => new Bubble(app, idx));
    const mouse = { x: -1000, y: -1000 };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    canvas.addEventListener('click', () => {
      bubbles.forEach(b => {
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < b.radius) {
          playPop(1200);
          window.location.href = b.app.route;
        }
      });
    });

    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Bubble to bubble bounce
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const dx = bubbles[j].x - bubbles[i].x;
          const dy = bubbles[j].y - bubbles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = bubbles[i].radius + bubbles[j].radius;
          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const force = (minDist - dist) * 0.5;
            bubbles[i].x -= Math.cos(angle) * force;
            bubbles[i].y -= Math.sin(angle) * force;
            bubbles[j].x += Math.cos(angle) * force;
            bubbles[j].y += Math.sin(angle) * force;
          }
        }
      }

      bubbles.forEach(b => {
        b.update(mouse);
        b.draw();
      });

      requestAnimationFrame(loop);
    }
    loop();
  }

  // ==========================================================================
  // 3. Category Filter Buttons
  // ==========================================================================
  function initFilters() {
    const wrap = document.getElementById('filterPills');
    if (!wrap) return;

    const categories = window.MANO_CATEGORIES || [{ id: 'all', label: 'All Apps' }];
    wrap.innerHTML = '';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `pill-btn ${cat.id === currentCategory ? 'active' : ''}`;
      btn.textContent = cat.label;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = cat.id;
        playPop(800);
        renderCards();
      });

      wrap.appendChild(btn);
    });
  }

  // ==========================================================================
  // 4. Live Search Input
  // ==========================================================================
  function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCards();
    });
  }

  // ==========================================================================
  // 5. Render App Cards
  // ==========================================================================
  function renderCards() {
    const grid = document.getElementById('appsGrid');
    if (!grid) return;

    const apps = window.MANO_APPS || [];
    const filtered = apps.filter(app => {
      const catMatch = currentCategory === 'all' || app.category === currentCategory;
      if (!catMatch) return false;

      if (!searchQuery) return true;
      const haystack = [app.name, app.tagline, app.description, ...(app.tags || [])].join(' ').toLowerCase();
      return haystack.includes(searchQuery);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #7a8294;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.5rem;">No matching apps found</h3>
          <p style="font-size: 0.9rem;">Try searching for something else or reset your filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(app => {
      const tags = (app.tags || []).slice(0, 3).map(t => `<span class="card-tag">${t}</span>`).join('');
      return `
        <div class="app-card">
          <div class="card-top">
            <div class="card-header-row">
              <div class="card-emoji-wrap">
                <span>${app.emoji || '⚡'}</span>
              </div>
              <span class="card-badge ${app.featured ? 'flagship' : ''}">${app.badge || app.category}</span>
            </div>

            <h3 class="card-title">${app.name}</h3>
            <div class="card-tagline">${app.tagline}</div>
            <p class="card-desc">${app.description}</p>

            <div class="card-tags">
              ${tags}
            </div>
          </div>

          <div class="card-bottom">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #5a6070;">Status: Ready</span>
            <a href="${app.route}" class="btn-open-app" onclick="playPop(1200)">
              <span>Open App</span>
              <i data-lucide="arrow-up-right" style="width: 15px; height: 15px;"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================================================
  // 6. Surprise Me (Random App Launcher)
  // ==========================================================================
  function initSurpriseBtn() {
    const btn = document.getElementById('btnSurprise');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const apps = window.MANO_APPS || [];
      if (apps.length === 0) return;
      playPop(1300);
      const chosen = apps[Math.floor(Math.random() * apps.length)];
      btn.innerHTML = `<span>Opening ${chosen.name}...</span>`;
      setTimeout(() => {
        window.location.href = chosen.route;
      }, 350);
    });
  }

  // ==========================================================================
  // 7. Click Sparkles Effect
  // ==========================================================================
  function initSparkleClicks() {
    window.addEventListener('click', (e) => {
      // Don't spawn over buttons
      if (e.target.closest('button') || e.target.closest('a')) return;

      const colors = ['#c8ff00', '#38bdf8', '#f43f5e', '#fbbf24', '#a855f7'];
      for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.borderRadius = '50%';
        dot.style.background = colors[Math.floor(Math.random() * colors.length)];
        dot.style.boxShadow = `0 0 8px ${dot.style.background}`;
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '9999';
        dot.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        document.body.appendChild(dot);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 45 + 15;
        requestAnimationFrame(() => {
          dot.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
          dot.style.opacity = '0';
        });

        setTimeout(() => dot.remove(), 550);
      }
    });
  }

  // ==========================================================================
  // 8. Hero Mode Switcher (The Wheel of Time vs App Bubbles)
  // ==========================================================================
  function initHeroModeSwitcher() {
    const btnZen = document.getElementById('btnModeZen');
    const btnOrbs = document.getElementById('btnModeOrbs');
    const panelZen = document.getElementById('zenHeroPanel');
    const panelOrbs = document.getElementById('orbsHeroPanel');

    if (!btnZen || !btnOrbs || !panelZen || !panelOrbs) return;

    btnZen.addEventListener('click', () => {
      btnZen.classList.add('active');
      btnOrbs.classList.remove('active');
      panelZen.style.display = 'flex';
      panelOrbs.style.display = 'none';
      playPop(900);
    });

    btnOrbs.addEventListener('click', () => {
      btnOrbs.classList.add('active');
      btnZen.classList.remove('active');
      panelZen.style.display = 'none';
      panelOrbs.style.display = 'block';
      playPop(1100);
    });
  }

  // ==========================================================================
  // 9. Frontpage Kinetic Zen Sand Garden Engine
  // ==========================================================================
  function initHeroZenSand() {
    const canvas = document.getElementById('heroSandCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const quoteText = document.getElementById('heroQuoteText');

    const GRID = 160;
    const R_GRID = GRID / 2;
    const heights = new Float32Array(GRID * GRID);
    const targetHeights = new Float32Array(GRID * GRID);
    const grainTable = new Float32Array(GRID * GRID);

    for (let i = 0; i < grainTable.length; i++) {
      grainTable[i] = (Math.random() - 0.5) * 2;
    }

    // Concentric Ripples Target
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const idx = y * GRID + x;
        const dx = x - R_GRID;
        const dy = y - R_GRID;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > R_GRID) {
          targetHeights[idx] = 0;
        } else {
          targetHeights[idx] = Math.cos(dist * 0.38) * 0.45;
        }
        heights[idx] = targetHeights[idx];
      }
    }

    let rakeAngle = 0;
    let currentTool = 'scoop';
    let isDrawing = false;
    let disturbance = 0;
    let quoteState = 'restored';

    const QUOTES = {
      disturbed: "A scar appears in an instant... but time never stops turning.",
      healing: "Round by round, the edges soften. The hollows fill.",
      restored: "Your patience. In time, everything fits into its proper place."
    };

    function setHeroQuote(text) {
      if (!quoteText || quoteText.textContent === `"${text}"`) return;
      quoteText.style.opacity = '0';
      setTimeout(() => {
        quoteText.textContent = `"${text}"`;
        quoteText.style.opacity = '1';
      }, 250);
    }

    // Tool switching
    document.querySelectorAll('.zen-mini-tool[data-tool]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.zen-mini-tool[data-tool]').forEach(el => el.classList.remove('active'));
        b.classList.add('active');
        currentTool = b.dataset.tool;
        playPop(1000);
      });
    });

    // Chaos button
    const btnChaos = document.getElementById('btnHeroChaos');
    if (btnChaos) {
      btnChaos.addEventListener('click', () => {
        for (let i = 0; i < 4; i++) {
          const rx = Math.round(R_GRID + (Math.random() - 0.5) * R_GRID * 1.2);
          const ry = Math.round(R_GRID + (Math.random() - 0.5) * R_GRID * 1.2);
          applyHeroTool(rx, ry, 'scoop');
        }
        setHeroQuote(QUOTES.disturbed);
        playPop(600);
      });
    }

    // Harmonize button
    const btnHeal = document.getElementById('btnHeroHeal');
    if (btnHeal) {
      btnHeal.addEventListener('click', () => {
        for (let i = 0; i < heights.length; i++) {
          heights[i] = targetHeights[i];
        }
        setHeroQuote(QUOTES.restored);
        playPop(1200);
      });
    }

    function applyHeroTool(gx, gy, tool) {
      const radius = tool === 'scoop' ? 12 : 16;
      const rSq = radius * radius;
      const dCenter = Math.sqrt((gx - R_GRID) ** 2 + (gy - R_GRID) ** 2);
      if (dCenter > R_GRID - 3) return;

      for (let y = Math.max(1, gy - radius); y <= Math.min(GRID - 2, gy + radius); y++) {
        for (let x = Math.max(1, gx - radius); x <= Math.min(GRID - 2, gx + radius); x++) {
          const distSq = (x - gx) ** 2 + (y - gy) ** 2;
          if (distSq > rSq) continue;
          const dist = Math.sqrt(distSq);
          const factor = (1 - dist / radius);
          const idx = y * GRID + x;

          if (tool === 'scoop') {
            if (dist < radius * 0.6) heights[idx] -= factor * 0.75;
            else heights[idx] += factor * 0.4;
          } else {
            heights[idx] += factor * 0.55;
          }
          heights[idx] = Math.max(-1.8, Math.min(1.8, heights[idx]));
        }
      }

      setHeroQuote(QUOTES.disturbed);
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        gx: Math.round(((cx - rect.left) / rect.width) * GRID),
        gy: Math.round(((cy - rect.top) / rect.height) * GRID)
      };
    }

    canvas.addEventListener('pointerdown', (e) => {
      isDrawing = true;
      const { gx, gy } = getCoords(e);
      applyHeroTool(gx, gy, currentTool);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const { gx, gy } = getCoords(e);
      applyHeroTool(gx, gy, currentTool);
    });

    window.addEventListener('pointerup', () => { isDrawing = false; });
    window.addEventListener('pointercancel', () => { isDrawing = false; });

    // Rake and Render Loop
    const imgData = ctx.createImageData(GRID, GRID);
    const data32 = new Uint32Array(imgData.data.buffer);

    // Warm Golden Sand Palette
    const bR = 222, bG = 190, bB = 142;
    const hR = 255, hG = 238, hB = 205;
    const sR = 115, sG = 84, sB = 52;
    const nlx = -0.52, nly = -0.62, nlz = 0.58;

    function renderLoop() {
      // Rotate Rake of Time
      const prevAngle = rakeAngle;
      rakeAngle = (rakeAngle + 0.009) % (Math.PI * 2);

      let totalDiff = 0;
      for (let i = 0; i < 90; i++) {
        const r = (i / 90) * (R_GRID - 2);
        for (let a = prevAngle; a <= rakeAngle + 0.02; a += 0.02) {
          const gx = Math.round(R_GRID + Math.cos(a) * r);
          const gy = Math.round(R_GRID + Math.sin(a) * r);
          if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) {
            const idx = gy * GRID + gx;
            const diff = Math.abs(heights[idx] - targetHeights[idx]);
            totalDiff += diff;
            heights[idx] += (targetHeights[idx] - heights[idx]) * 0.12;
          }
        }
      }

      disturbance = totalDiff;
      if (disturbance > 12) {
        if (quoteState !== 'healing') {
          quoteState = 'healing';
          setHeroQuote(QUOTES.healing);
        }
      } else {
        if (quoteState !== 'restored') {
          quoteState = 'restored';
          setHeroQuote(QUOTES.restored);
        }
      }

      // Normal-mapped pixel shader
      for (let y = 1; y < GRID - 1; y++) {
        const yOffset = y * GRID;
        for (let x = 1; x < GRID - 1; x++) {
          const idx = yOffset + x;
          const dx = x - R_GRID;
          const dy = y - R_GRID;
          if (dx * dx + dy * dy > (R_GRID - 1) * (R_GRID - 1)) {
            data32[idx] = 0x00000000;
            continue;
          }

          const dzdx = (heights[idx + 1] - heights[idx - 1]) * 1.8;
          const dzdy = (heights[idx + GRID] - heights[idx - GRID]) * 1.8;
          const invLen = 1 / Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1);
          const nx = -dzdx * invLen;
          const ny = -dzdy * invLen;
          const nz = invLen;

          const dot = nx * nlx + ny * nly + nz * nlz;
          const light = Math.max(0, Math.min(1, dot));
          const grain = grainTable[idx] * 12;
          const h = heights[idx];
          const depth = Math.max(0.65, Math.min(1.25, 1 + h * 0.4));

          let r, g, b;
          if (light > 0.5) {
            const f = (light - 0.5) * 2;
            r = Math.min(255, (bR + (hR - bR) * f) * depth + grain);
            g = Math.min(255, (bG + (hG - bG) * f) * depth + grain);
            b = Math.min(255, (bB + (hB - bB) * f) * depth + grain);
          } else {
            const f = light * 2;
            r = Math.max(0, (sR + (bR - sR) * f) * depth + grain);
            g = Math.max(0, (sG + (bG - sG) * f) * depth + grain);
            b = Math.max(0, (sB + (bB - sB) * f) * depth + grain);
          }

          data32[idx] = (255 << 24) | ((b & 0xff) << 16) | ((g & 0xff) << 8) | (r & 0xff);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Render Rake Arm overlay
      const cx = 160;
      const cy = 160;
      const armLen = 155;
      const ax = cx + Math.cos(rakeAngle) * armLen;
      const ay = cy + Math.sin(rakeAngle) * armLen;

      // Shadow
      ctx.beginPath();
      ctx.moveTo(cx + 4, cy + 6);
      ctx.lineTo(ax + 4, ay + 6);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Brass Arm
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(212,175,55,0.4)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Comb Tines
      for (let i = 2; i < 11; i++) {
        const tr = (i / 11) * armLen;
        const tx = cx + Math.cos(rakeAngle) * tr;
        const ty = cy + Math.sin(rakeAngle) * tr;
        const pa = rakeAngle + Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(tx - Math.cos(pa) * 4, ty - Math.sin(pa) * 4);
        ctx.lineTo(tx + Math.cos(pa) * 4, ty + Math.sin(pa) * 4);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Spindle Center Jewel
      ctx.shadowColor = '#c8ff00';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#141722';
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#c8ff00';
      ctx.fill();

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  window.playPop = playPop;

})();
