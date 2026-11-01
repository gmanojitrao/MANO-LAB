/**
 * MANO-LAB Unified Authentication & Access Control System
 * Subtle, non-obvious Google Sign-In with fine-grained access management.
 */

(function () {
  'use strict';

  const ADMIN_EMAIL = 'gmanojitr@gmail.com';
  const GOOGLE_CLIENT_ID = '641612906961-0udfabvsrp1g8vto9uq9qvntd6jaa3er.apps.googleusercontent.com';
  const STORAGE_KEY_USER = 'mano_auth_user';
  const STORAGE_KEY_REGISTRY = 'mano_access_registry';
  const STORAGE_KEY_CLIENT_ID = 'mano_google_client_id';

  // Ensure Admin is always initialized in access registry
  function getRegistry() {
    let reg = {};
    try {
      reg = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTRY) || '{}');
    } catch (e) {
      reg = {};
    }

    if (!reg[ADMIN_EMAIL]) {
      reg[ADMIN_EMAIL] = {
        role: 'admin',
        name: 'Manojit (Owner)',
        permissions: {
          secret_room: true,
          extra_features: true
        },
        addedAt: Date.now()
      };
      saveRegistry(reg);
    }
    return reg;
  }

  function saveRegistry(reg) {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(reg));
    } catch (e) {}
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || 'null');
    } catch (e) {
      return null;
    }
  }

  function setUser(u) {
    if (u) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  function isAdmin(user) {
    const u = user || getUser();
    return !!(u && u.email && u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  }

  function hasAccess(permission, user) {
    const u = user || getUser();
    if (!u || !u.email) return false;
    if (isAdmin(u)) return true;

    const reg = getRegistry();
    const entry = reg[u.email.toLowerCase()];
    if (!entry || !entry.permissions) return false;
    return !!entry.permissions[permission];
  }

  // --- STYLES INJECTION ---
  function injectStyles() {
    if (document.getElementById('mano-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'mano-auth-styles';
    style.textContent = `
      .mano-auth-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      .mano-btn-signin {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        color: #f1f5f9;
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 0.45rem 0.85rem;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .mano-btn-signin:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .mano-user-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 0.3rem 0.65rem 0.3rem 0.35rem;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }
      .mano-user-pill:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.25);
      }
      .mano-user-avatar {
        width: 1.65rem;
        height: 1.65rem;
        border-radius: 9999px;
        object-fit: cover;
      }
      .mano-user-name {
        font-size: 0.82rem;
        font-weight: 600;
        color: #f8fafc;
        max-width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mano-dropdown-menu {
        position: absolute;
        top: calc(100% + 0.6rem);
        right: 0;
        width: 250px;
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 0.85rem;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        display: none;
        flex-direction: column;
        gap: 0.25rem;
        z-index: 1000;
        backdrop-filter: blur(16px);
      }
      .mano-dropdown-menu.show {
        display: flex;
        animation: manoFadeIn 0.15s ease-out;
      }
      @keyframes manoFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .mano-dropdown-header {
        padding: 0.65rem 0.75rem 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 0.25rem;
      }
      .mano-dropdown-user-name {
        font-size: 0.85rem;
        font-weight: 700;
        color: #fff;
        line-height: 1.2;
      }
      .mano-dropdown-user-email {
        font-size: 0.72rem;
        color: #94a3b8;
        font-family: 'JetBrains Mono', monospace;
        margin-top: 0.15rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mano-menu-item {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.55rem 0.75rem;
        border-radius: 0.5rem;
        color: #cbd5e1;
        font-size: 0.82rem;
        font-weight: 500;
        text-decoration: none;
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .mano-menu-item:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }
      .mano-menu-item.logout {
        color: #f87171;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        margin-top: 0.25rem;
        padding-top: 0.6rem;
      }
      .mano-menu-item.logout:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
      }

      /* Modal Styling */
      .mano-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
      }
      .mano-modal-backdrop.hidden {
        display: none;
      }
      .mano-modal-card {
        background: #0c101a;
        border: 1px solid #1e293b;
        border-radius: 1.25rem;
        width: 100%;
        max-width: 520px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        overflow: hidden;
        animation: manoScaleIn 0.2s ease-out;
      }
      @keyframes manoScaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .mano-modal-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #1e293b;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mano-modal-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #fff;
      }
      .mano-modal-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.35rem;
      }
      .mano-modal-close:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
      }
      .mano-modal-body {
        padding: 1.5rem;
        max-height: 75vh;
        overflow-y: auto;
      }
      .mano-form-group {
        margin-bottom: 1.25rem;
      }
      .mano-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: #cbd5e1;
        margin-bottom: 0.4rem;
      }
      .mano-input {
        width: 100%;
        padding: 0.65rem 0.85rem;
        background: rgba(18, 24, 38, 0.8);
        border: 1px solid #1e293b;
        border-radius: 0.6rem;
        color: #fff;
        font-size: 0.85rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .mano-input:focus {
        border-color: #3b82f6;
      }
      .mano-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .mano-checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        color: #cbd5e1;
        cursor: pointer;
      }
      .mano-btn-primary {
        background: #3b82f6;
        color: #fff;
        border: none;
        padding: 0.65rem 1.25rem;
        border-radius: 0.6rem;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
      }
      .mano-btn-primary:hover {
        background: #2563eb;
      }
      .mano-user-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.65rem 0.85rem;
        background: rgba(18, 24, 38, 0.6);
        border: 1px solid #1e293b;
        border-radius: 0.6rem;
        margin-bottom: 0.5rem;
      }
      .mano-user-info-text {
        font-size: 0.82rem;
        color: #f1f5f9;
        font-weight: 600;
      }
      .mano-user-badges {
        display: flex;
        gap: 0.35rem;
        margin-top: 0.2rem;
      }
      .mano-badge {
        font-size: 0.65rem;
        font-family: 'JetBrains Mono', monospace;
        padding: 0.15rem 0.4rem;
        border-radius: 9999px;
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }
      .mano-badge.admin {
        background: rgba(250, 204, 21, 0.15);
        color: #facc15;
        border-color: rgba(250, 204, 21, 0.3);
      }
      .mano-btn-revoke {
        background: transparent;
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #f87171;
        font-size: 0.72rem;
        padding: 0.25rem 0.55rem;
        border-radius: 0.4rem;
        cursor: pointer;
      }
      .mano-btn-revoke:hover {
        background: rgba(239, 68, 68, 0.15);
      }
    `;
    document.head.appendChild(style);
  }

  // --- GOOGLE IDENTITY SERVICES LOADER ---
  function loadGoogleGIS() {
    if (document.getElementById('google-gis-script')) return;
    const script = document.createElement('script');
    script.id = 'google-gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleGIS();
    };
    document.head.appendChild(script);
  }

  function initGoogleGIS() {
    if (!window.google || !google.accounts || !google.accounts.id) return;
    const clientId = localStorage.getItem(STORAGE_KEY_CLIENT_ID) || GOOGLE_CLIENT_ID;
    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false
      });
    } catch (e) {
      console.warn('Google GIS Init:', e);
    }
  }

  function handleGoogleCredentialResponse(response) {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const data = JSON.parse(jsonPayload);

      const userObj = {
        email: data.email.toLowerCase(),
        name: data.name,
        picture: data.picture,
        sub: data.sub,
        authTime: Date.now()
      };
      setUser(userObj);
      renderAuthSlot();
      closeSignInModal();

      // If on private room page, re-check access
      if (window.onManoAuthChanged) {
        window.onManoAuthChanged(userObj);
      }
    } catch (e) {
      alert('Sign-in error: ' + e.message);
    }
  }

  // --- RENDER HEADER AUTH SLOT ---
  function renderAuthSlot() {
    const slot = document.getElementById('mano-auth-btn-slot');
    if (!slot) return;

    const user = getUser();
    const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/apps/');
    const roomPath = isRoot ? 'apps/lounge/' : '../lounge/';

    if (!user) {
      slot.innerHTML = `
        <div class="mano-auth-wrap">
          <button onclick="ManoAuth.openSignInModal()" class="mano-btn-signin">
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign In</span>
          </button>
        </div>
      `;
    } else {
      const showSecretRoom = hasAccess('secret_room', user);
      const userIsAdmin = isAdmin(user);

      slot.innerHTML = `
        <div class="mano-auth-wrap">
          <div class="mano-user-pill" onclick="ManoAuth.toggleUserDropdown(event)">
            <img src="${user.picture || 'https://www.gravatar.com/avatar?d=mp'}" class="mano-user-avatar" alt="">
            <span class="mano-user-name">${user.name ? user.name.split(' ')[0] : 'User'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div class="mano-dropdown-menu" id="mano-user-dropdown">
            <div class="mano-dropdown-header">
              <div class="mano-dropdown-user-name">${user.name || 'User'}</div>
              <div class="mano-dropdown-user-email">${user.email}</div>
            </div>

            ${showSecretRoom ? `
              <a href="${roomPath}" class="mano-menu-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Private Room (Chat & Games)</span>
              </a>
            ` : ''}

            ${userIsAdmin ? `
              <button onclick="ManoAuth.openAccessManager()" class="mano-menu-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Manage User Access</span>
              </button>
            ` : ''}

            <button onclick="ManoAuth.signOut()" class="mano-menu-item logout">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;
    }

    if (window.lucide) lucide.createIcons();
  }

  function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('mano-user-dropdown');
    if (menu) {
      menu.classList.toggle('show');
    }
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mano-user-dropdown');
    if (menu && menu.classList.contains('show')) {
      if (!e.target.closest('.mano-auth-wrap')) {
        menu.classList.remove('show');
      }
    }
  });

  // --- SIGN IN MODAL ---
  function openSignInModal() {
    let modal = document.getElementById('mano-signin-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mano-signin-modal';
      modal.className = 'mano-modal-backdrop';
      modal.innerHTML = `
        <div class="mano-modal-card">
          <div class="mano-modal-header">
            <div class="mano-modal-title">Sign In with Google</div>
            <button onclick="ManoAuth.closeSignInModal()" class="mano-modal-close">&times;</button>
          </div>
          <div class="mano-modal-body">
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.25rem; line-height: 1.5;">
              Sign in with your Google account. Authorized users receive tailored workbench capabilities and room access.
            </p>

            <div id="mano-gis-button-mount" style="display: flex; justify-content: center; margin-bottom: 1.5rem;"></div>

            <div style="display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0; color: #64748b; font-size: 0.75rem;">
              <div style="flex: 1; height: 1px; background: #1e293b;"></div>
              <span>OR ENTER GOOGLE EMAIL</span>
              <div style="flex: 1; height: 1px; background: #1e293b;"></div>
            </div>

            <form onsubmit="ManoAuth.handleDirectEmailSignIn(event)" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <input type="email" id="mano-direct-email" class="mano-input" placeholder="your.name@gmail.com" required>
              <button type="submit" class="mano-btn-primary" style="width: 100%;">Continue</button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.classList.remove('hidden');

    // Mount official Google button once GIS is ready
    const mountGISButton = () => {
      if (window.google && google.accounts && google.accounts.id) {
        initGoogleGIS();
        const btnMount = document.getElementById('mano-gis-button-mount');
        if (btnMount && btnMount.children.length === 0) {
          try {
            google.accounts.id.renderButton(btnMount, {
              theme: 'filled_black',
              size: 'large',
              shape: 'pill',
              text: 'signin_with',
              width: 260
            });
          } catch (e) {}
        }
      } else {
        setTimeout(mountGISButton, 200);
      }
    };
    mountGISButton();
  }

  function closeSignInModal() {
    const modal = document.getElementById('mano-signin-modal');
    if (modal) modal.classList.add('hidden');
  }

  function handleDirectEmailSignIn(e) {
    e.preventDefault();
    const input = document.getElementById('mano-direct-email');
    const email = input.value.trim().toLowerCase();
    if (!email) return;

    const userObj = {
      email: email,
      name: email.split('@')[0],
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      sub: 'email_' + Date.now(),
      authTime: Date.now()
    };

    setUser(userObj);
    renderAuthSlot();
    closeSignInModal();

    if (window.onManoAuthChanged) {
      window.onManoAuthChanged(userObj);
    }
  }

  function signOut() {
    setUser(null);
    renderAuthSlot();
    const menu = document.getElementById('mano-user-dropdown');
    if (menu) menu.classList.remove('show');

    if (window.onManoAuthChanged) {
      window.onManoAuthChanged(null);
    }
  }

  // --- ADMIN ACCESS MANAGER MODAL ---
  function openAccessManager() {
    const user = getUser();
    if (!isAdmin(user)) {
      alert('Access restricted to Owner.');
      return;
    }

    let modal = document.getElementById('mano-access-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mano-access-modal';
      modal.className = 'mano-modal-backdrop';
      modal.innerHTML = `
        <div class="mano-modal-card" style="max-width: 560px;">
          <div class="mano-modal-header">
            <div class="mano-modal-title">User Access Management</div>
            <button onclick="ManoAuth.closeAccessManager()" class="mano-modal-close">&times;</button>
          </div>
          <div class="mano-modal-body">
            <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1.25rem;">
              Grant specific permissions to any Google account. When they sign in, they will automatically receive the assigned access.
            </p>

            <form onsubmit="ManoAuth.handleGrantAccessSubmit(event)" style="background: rgba(18, 24, 38, 0.5); border: 1px solid #1e293b; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
              <div class="mano-form-group">
                <label class="mano-label">User Google Email</label>
                <input type="email" id="mano-grant-email" class="mano-input" placeholder="friend@gmail.com" required>
              </div>

              <div class="mano-form-group">
                <label class="mano-label">Permissions to Grant</label>
                <div class="mano-checkbox-group">
                  <label class="mano-checkbox-label">
                    <input type="checkbox" id="mano-perm-room" checked>
                    <span>Private Room (Live Chat & Multiplayer Games)</span>
                  </label>
                  <label class="mano-checkbox-label">
                    <input type="checkbox" id="mano-perm-extra" checked>
                    <span>Unlocked Workbench Capabilities</span>
                  </label>
                </div>
              </div>

              <button type="submit" class="mano-btn-primary" style="width: 100%;">
                Save & Grant Access
              </button>
            </form>

            <div style="font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.65rem;">
              Authorized Users
            </div>
            <div id="mano-access-users-list"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    renderAccessUsersList();
    modal.classList.remove('hidden');
  }

  function closeAccessManager() {
    const modal = document.getElementById('mano-access-modal');
    if (modal) modal.classList.add('hidden');
  }

  function renderAccessUsersList() {
    const container = document.getElementById('mano-access-users-list');
    if (!container) return;

    const reg = getRegistry();
    const emails = Object.keys(reg);

    if (emails.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: #64748b;">No users added yet.</div>`;
      return;
    }

    container.innerHTML = emails.map(email => {
      const entry = reg[email];
      const isOwner = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const perms = entry.permissions || {};

      return `
        <div class="mano-user-item">
          <div>
            <div class="mano-user-info-text">${email}</div>
            <div class="mano-user-badges">
              ${isOwner ? '<span class="mano-badge admin">OWNER & ADMIN</span>' : ''}
              ${perms.secret_room ? '<span class="mano-badge">Private Room</span>' : ''}
              ${perms.extra_features ? '<span class="mano-badge">Pro Features</span>' : ''}
            </div>
          </div>
          <div>
            ${!isOwner ? `
              <button onclick="ManoAuth.revokeAccess('${email}')" class="mano-btn-revoke">Revoke</button>
            ` : '<span style="font-size: 0.7rem; color: #64748b;">Protected</span>'}
          </div>
        </div>
      `;
    }).join('');
  }

  function handleGrantAccessSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('mano-grant-email');
    const permRoom = document.getElementById('mano-perm-room').checked;
    const permExtra = document.getElementById('mano-perm-extra').checked;

    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    const reg = getRegistry();
    reg[email] = {
      role: email === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'member',
      permissions: {
        secret_room: permRoom,
        extra_features: permExtra
      },
      updatedAt: Date.now()
    };
    saveRegistry(reg);

    emailInput.value = '';
    renderAccessUsersList();
    renderAuthSlot();
    alert(`Access granted to ${email}!`);
  }

  function revokeAccess(email) {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      alert('Cannot revoke Owner access.');
      return;
    }
    if (confirm(`Revoke access for ${email}?`)) {
      const reg = getRegistry();
      delete reg[email.toLowerCase()];
      saveRegistry(reg);
      renderAccessUsersList();
      renderAuthSlot();
    }
  }

  // --- INIT ---
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    loadGoogleGIS();
    renderAuthSlot();
  });

  // Export to window
  window.ManoAuth = {
    ADMIN_EMAIL,
    getUser,
    isAdmin,
    hasAccess,
    getRegistry,
    saveRegistry,
    openSignInModal,
    closeSignInModal,
    handleDirectEmailSignIn,
    signOut,
    toggleUserDropdown,
    openAccessManager,
    closeAccessManager,
    handleGrantAccessSubmit,
    revokeAccess,
    renderAuthSlot
  };

})();
