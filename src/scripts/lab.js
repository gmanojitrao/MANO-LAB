/**
 * MANO-LAB — Interactive Digital Laboratory Controller
 * Features:
 * - Interactive Hero Particle Constellation Canvas
 * - Real-time Simulated Audio Diarization Waveform & Bilingual Stream
 * - Raycast-Style Spotlight Cursor Tracking on Cards
 * - Procedural WebAudio Acoustic Click Feedback (Zero Assets)
 * - Interactive Cellular Emergence Sandbox
 * - Spotlight Command Palette (Cmd/Ctrl + K or '/')
 * - Category Filtering & Instant Search
 */

(function () {
  'use strict';

  // State
  let currentCategory = 'all';
  let searchQuery = '';
  let audioFxEnabled = localStorage.getItem('mano_sound_fx') === 'true';
  let isWaveformPlaying = false;
  let audioCtx = null;
  let waveformAnimId = null;
  let activeSpeakerFilter = 'all';

  // Sample dialogue sequence for simulator
  const SIMULATED_DIALOGUE = [
    {
      speaker: 'INTERVIEWER (प्रश्नकर्ता)',
      role: 'int',
      native: 'नमस्ते, क्या आप हमें अपने शिल्प के बारे में बता सकते हैं?',
      english: '"Hello, could you tell us about your traditional craft?"'
    },
    {
      speaker: 'ARTISAN (कारीगर)',
      role: 'art',
      native: 'हम तीन पीढ़ियों से टेराकोटा और मिट्टी के पात्र तैयार कर रहे हैं।',
      english: '"We have been handcrafting terracotta and earthenware for three generations."'
    },
    {
      speaker: 'INTERVIEWER (प्रश्नकर्ता)',
      role: 'int',
      native: 'मिट्टी तैयार करने में कितना समय लगता है?',
      english: '"How long does the clay preparation and seasoning take?"'
    },
    {
      speaker: 'ARTISAN (कारीगर)',
      role: 'art',
      native: 'नदी की गाद को छानकर पकाने में लगभग दो सप्ताह का समय लगता है।',
      english: '"Filtering the river silt and kiln firing takes approximately two weeks."'
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initCategoryFilters();
    renderAppCards();
    initSearch();
    initSpotlightCards();
    initSoundToggle();
    initInteractiveWaveform();
    initCellularSandbox();
    initCommandPalette();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // ==========================================================================
  // 1. Procedural WebAudio Acoustic Feedback (Tactile Mechanical Clicks)
  // ==========================================================================
  function playAcousticClick(freq = 800, type = 'sine', duration = 0.04) {
    if (!audioFxEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext muted or not allowed
    }
  }

  function initSoundToggle() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;

    updateSoundBtnState(btn);
    btn.addEventListener('click', () => {
      audioFxEnabled = !audioFxEnabled;
      localStorage.setItem('mano_sound_fx', audioFxEnabled);
      updateSoundBtnState(btn);
      if (audioFxEnabled) {
        playAcousticClick(1200, 'triangle', 0.08);
      }
    });
  }

  function updateSoundBtnState(btn) {
    const label = document.getElementById('soundToggleText');
    if (audioFxEnabled) {
      btn.classList.add('sound-active');
      if (label) label.textContent = 'Audio FX: ON';
    } else {
      btn.classList.remove('sound-active');
      if (label) label.textContent = 'Audio FX: OFF';
    }
  }

  // ==========================================================================
  // 2. Interactive Hero Particle Constellation Canvas
  // ==========================================================================
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 45;
    let mouse = { x: -1000, y: -1000, radius: 140 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance/attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 0, ${this.baseAlpha})`;
        ctx.shadowColor = '#c8ff00';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes with proximity lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200, 255, 0, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ==========================================================================
  // 3. Interactive Waveform Simulator & Dialogue Stream
  // ==========================================================================
  function initInteractiveWaveform() {
    const canvas = document.getElementById('waveformCanvas');
    const playBtn = document.getElementById('btnPlayWaveform');
    const streamContainer = document.getElementById('bilingualStream');
    if (!canvas || !playBtn) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let streamIndex = 0;
    let streamTimer = null;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const barCount = 42;
    const bars = Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.1);

    function drawWaveform(active = false) {
      ctx.clearRect(0, 0, width, height);
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        if (active) {
          bars[i] = Math.min(1, Math.max(0.1, bars[i] + (Math.random() - 0.5) * 0.25));
        } else {
          bars[i] += (0.15 - bars[i]) * 0.1;
        }

        const barHeight = bars[i] * (height - 8);
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const isInterviewer = i % 2 === 0;
        ctx.fillStyle = active
          ? (isInterviewer ? 'rgba(56, 189, 248, 0.85)' : 'rgba(200, 255, 0, 0.9)')
          : 'rgba(255, 255, 255, 0.15)';

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      waveformAnimId = requestAnimationFrame(() => drawWaveform(active));
    }

    drawWaveform(false);

    playBtn.addEventListener('click', () => {
      isWaveformPlaying = !isWaveformPlaying;
      playAcousticClick(isWaveformPlaying ? 1000 : 600, 'sine', 0.06);

      if (isWaveformPlaying) {
        playBtn.innerHTML = `<i data-lucide="square" style="width: 12px; height: 12px;"></i> <span>Stop Simulation</span>`;
        if (window.lucide) window.lucide.createIcons();
        cancelAnimationFrame(waveformAnimId);
        drawWaveform(true);
        startDialogueStream();
      } else {
        playBtn.innerHTML = `<i data-lucide="play" style="width: 12px; height: 12px;"></i> <span>Simulate Diarization</span>`;
        if (window.lucide) window.lucide.createIcons();
        cancelAnimationFrame(waveformAnimId);
        drawWaveform(false);
        clearInterval(streamTimer);
      }
    });

    function startDialogueStream() {
      if (!streamContainer) return;
      streamContainer.innerHTML = '';
      streamIndex = 0;

      function addNext() {
        if (!isWaveformPlaying) return;
        const item = SIMULATED_DIALOGUE[streamIndex % SIMULATED_DIALOGUE.length];
        streamIndex++;

        const row = document.createElement('div');
        row.className = 'stream-row';
        row.innerHTML = `
          <div class="speaker-label ${item.role === 'int' ? 'speaker-int' : 'speaker-art'}">
            <span class="status-dot" style="background: currentColor;"></span>
            <span>${item.speaker}:</span>
          </div>
          <div class="dialogue-native">${item.native}</div>
          <div class="dialogue-english">${item.english}</div>
        `;

        streamContainer.appendChild(row);
        streamContainer.scrollTop = streamContainer.scrollHeight;
        playAcousticClick(item.role === 'int' ? 950 : 720, 'triangle', 0.03);
      }

      addNext();
      streamTimer = setInterval(addNext, 2400);
    }
  }

  // ==========================================================================
  // 4. Raycast-Style Spotlight Cursor Tracking on Cards
  // ==========================================================================
  function initSpotlightCards() {
    const cards = document.querySelectorAll('.app-card, .featured-card, .hero-spec-box');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseenter', () => {
        playAcousticClick(900, 'sine', 0.02);
      });
    });
  }

  // ==========================================================================
  // 5. Interactive Cellular Emergence Sandbox Canvas
  // ==========================================================================
  function initCellularSandbox() {
    const canvas = document.getElementById('cellularCanvas');
    const clearBtn = document.getElementById('btnClearSandbox');
    const spawnBtn = document.getElementById('btnSpawnSandbox');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cols = 48;
    const rows = 24;
    let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    let cellW = canvas.width / cols;
    let cellH = canvas.height / rows;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cellW = canvas.width / cols;
      cellH = canvas.height / rows;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initial random pattern
    seedRandom();

    function seedRandom() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid[r][c] = Math.random() > 0.82 ? 1 : 0;
        }
      }
    }

    function step() {
      const next = grid.map(arr => [...arr]);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let neighbors = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              const nr = (r + i + rows) % rows;
              const nc = (c + j + cols) % cols;
              neighbors += grid[nr][nc];
            }
          }
          if (grid[r][c] === 1 && (neighbors < 2 || neighbors > 3)) next[r][c] = 0;
          else if (grid[r][c] === 0 && neighbors === 3) next[r][c] = 1;
        }
      }
      grid = next;
    }

    function draw() {
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === 1) {
            ctx.fillStyle = '#c8ff00';
            ctx.shadowColor = '#c8ff00';
            ctx.shadowBlur = 6;
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    let lastTime = 0;
    function loop(time) {
      if (time - lastTime > 160) {
        step();
        lastTime = time;
      }
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Click/Drag to draw cells
    let isDrawing = false;
    function paint(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const c = Math.floor(x / cellW);
      const r = Math.floor(y / cellH);
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c] = 1;
        playAcousticClick(600 + c * 25, 'sine', 0.015);
      }
    }

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; paint(e); });
    window.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) paint(e); });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        playAcousticClick(400, 'triangle', 0.04);
      });
    }

    if (spawnBtn) {
      spawnBtn.addEventListener('click', () => {
        seedRandom();
        playAcousticClick(1100, 'triangle', 0.05);
      });
    }
  }

  // ==========================================================================
  // 6. Spotlight Command Palette (Cmd/Ctrl + K or '/')
  // ==========================================================================
  function initCommandPalette() {
    const backdrop = document.getElementById('paletteModal');
    const input = document.getElementById('paletteInput');
    const results = document.getElementById('paletteResults');
    if (!backdrop || !input || !results) return;

    function openPalette() {
      backdrop.classList.add('open');
      input.value = '';
      renderPaletteItems('');
      setTimeout(() => input.focus(), 50);
      playAcousticClick(1100, 'sine', 0.05);
    }

    function closePalette() {
      backdrop.classList.remove('open');
      playAcousticClick(500, 'sine', 0.04);
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        backdrop.classList.contains('open') ? closePalette() : openPalette();
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closePalette();
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette();
    });

    input.addEventListener('input', (e) => {
      renderPaletteItems(e.target.value.trim().toLowerCase());
    });

    function renderPaletteItems(q) {
      const apps = window.MANO_APPS || [];
      const matches = apps.filter(a => {
        if (!q) return true;
        return a.name.toLowerCase().includes(q) ||
               a.description.toLowerCase().includes(q) ||
               a.category.toLowerCase().includes(q);
      });

      if (matches.length === 0) {
        results.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No matching laboratory applications found.</div>`;
        return;
      }

      results.innerHTML = matches.map((app, idx) => `
        <div class="palette-item ${idx === 0 ? 'selected' : ''}" onclick="window.location.href='${app.route}';">
          <div class="palette-item-left">
            <div class="app-icon-wrap" style="width: 2.25rem; height: 2.25rem; color: ${app.accentColor || 'var(--accent-lime)'};">
              <i data-lucide="${app.icon || 'box'}" style="width: 15px; height: 15px;"></i>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${app.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${app.tagline || app.category}</div>
            </div>
          </div>
          <div class="status-pill status-${app.status.toLowerCase().replace(' ', '')}" style="font-size: 0.65rem;">
            <span>${app.status}</span>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    }

    // Attach open to search triggers
    document.querySelectorAll('.trigger-palette').forEach(btn => {
      btn.addEventListener('click', openPalette);
    });
  }

  // ==========================================================================
  // 7. Category Filters & Directory Grid
  // ==========================================================================
  function initCategoryFilters() {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;

    const apps = window.MANO_APPS || [];
    const categories = window.MANO_CATEGORIES || [{ id: 'all', label: 'All Items' }];

    const counts = { all: apps.length };
    apps.forEach(app => {
      counts[app.category] = (counts[app.category] || 0) + 1;
    });

    filterContainer.innerHTML = '';
    categories.forEach(cat => {
      const count = counts[cat.id] || 0;
      if (cat.id !== 'all' && count === 0) return;

      const btn = document.createElement('button');
      btn.className = `filter-btn ${cat.id === currentCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.id);
      btn.innerHTML = `${cat.label} <span style="opacity: 0.6; font-size: 0.75rem; font-family: var(--font-mono); margin-left: 0.35rem;">(${count})</span>`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = cat.id;
        playAcousticClick(850, 'sine', 0.03);
        renderAppCards();
      });

      filterContainer.appendChild(btn);
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('directorySearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderAppCards();
    });

    const resetBtn = document.getElementById('btnResetSearch');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        currentCategory = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === 'all');
        });
        renderAppCards();
      });
    }
  }

  function renderAppCards() {
    const grid = document.getElementById('appsGrid');
    if (!grid) return;

    const apps = window.MANO_APPS || [];
    const filtered = apps.filter(app => {
      const matchCategory = currentCategory === 'all' || app.category === currentCategory;
      if (!matchCategory) return false;

      if (!searchQuery) return true;
      const haystack = [
        app.name,
        app.tagline,
        app.description,
        app.category,
        ...(app.tags || []),
        ...(app.capabilities || [])
      ].join(' ').toLowerCase();

      return haystack.includes(searchQuery);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-directory">
          <div class="empty-icon">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">No matching experiments</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">No laboratory app matches "${escapeHTML(searchQuery)}" in this filter.</p>
          <button id="btnResetSearch" class="btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
            Clear Search & Reset Filters
          </button>
        </div>
      `;
      initSearch();
      return;
    }

    grid.innerHTML = filtered.map(app => renderSingleCard(app)).join('');
    initSpotlightCards();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderSingleCard(app) {
    const isAvailable = app.status === 'Available';
    const statusClass = app.status === 'Available'
      ? 'status-available'
      : (app.status === 'Experimental' ? 'status-experimental' : 'status-coming');

    const actionButton = isAvailable
      ? `<a href="${app.route}" class="btn-card-action btn-card-active">
           <span>Launch App</span>
           <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
         </a>`
      : `<span class="btn-card-action btn-card-disabled" title="In development">
           <span>${app.status}</span>
         </span>`;

    const tagsHtml = (app.tags || [])
      .slice(0, 3)
      .map(t => `<span class="tag-pill">${escapeHTML(t)}</span>`)
      .join('');

    return `
      <article class="app-card" data-app-id="${app.id}">
        <div class="app-card-top">
          <div class="app-card-header">
            <div class="app-icon-wrap" style="color: ${app.accentColor || 'var(--accent-lime)'}">
              <i data-lucide="${app.icon || 'box'}" style="width: 22px; height: 22px;"></i>
            </div>
            <div class="status-pill ${statusClass}">
              <span class="status-dot"></span>
              <span>${app.status}</span>
            </div>
          </div>

          <span class="category-tag">${escapeHTML(app.category)}</span>
          <h3 class="app-card-title">${escapeHTML(app.name)}</h3>
          <div class="app-card-tagline">${escapeHTML(app.tagline || '')}</div>
          <p class="app-card-desc">${escapeHTML(app.description)}</p>

          <div class="app-tags">
            ${tagsHtml}
          </div>
        </div>

        <div class="app-card-bottom">
          <span class="date-label">v${escapeHTML(app.version || '1.0')} • ${escapeHTML(app.dateAdded)}</span>
          ${actionButton}
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
