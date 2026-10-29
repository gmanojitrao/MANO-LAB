/**
 * MANO-LAB — Laboratory Interactivity & Directory Controller
 */

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilters();
    renderAppCards();
    initSearch();
    initKeyboardShortcuts();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  /**
   * Initialize Category Filter Buttons
   */
  function initCategoryFilters() {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;

    const apps = window.MANO_APPS || [];
    const categories = window.MANO_CATEGORIES || [
      { id: 'all', label: 'All Items' }
    ];

    // Compute accurate dynamic counts
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
      btn.innerHTML = `${cat.label} <span style="opacity: 0.6; font-size: 0.75rem; font-family: var(--font-mono); margin-left: 0.25rem;">(${count})</span>`;
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = cat.id;
        renderAppCards();
      });

      filterContainer.appendChild(btn);
    });
  }

  /**
   * Search Input Controller
   */
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

  /**
   * Global Keyboard Shortcuts (e.g. '/' or 'Cmd/Ctrl+K' focuses search)
   */
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && 
          document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('directorySearch');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  /**
   * Render Filtered App Cards
   */
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.5rem;">No matching apps or experiments</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">No experiment matches "${escapeHTML(searchQuery)}" in this category.</p>
          <button id="btnResetSearch" class="btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
            Clear Search & Reset Filters
          </button>
        </div>
      `;
      initSearch();
      return;
    }

    grid.innerHTML = filtered.map(app => renderSingleCard(app)).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Generate HTML for a Single App Card
   */
  function renderSingleCard(app) {
    const isAvailable = app.status === 'Available';
    const statusClass = app.status === 'Available' 
      ? 'status-available' 
      : (app.status === 'Experimental' ? 'status-experimental' : 'status-coming');

    const actionButton = isAvailable
      ? `<a href="${app.route}" class="btn-card-action btn-card-active">
           <span>Open App</span>
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
              <i data-lucide="${app.icon || 'box'}" style="width: 20px; height: 20px;"></i>
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
