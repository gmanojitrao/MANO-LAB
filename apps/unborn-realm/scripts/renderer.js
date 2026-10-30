/**
 * PROJECT: THE UNBORN REALM (ORIGIN-001)
 * renderer.js - High-Precision 3D Projection Canvas Engine
 * 
 * Renders non-Earth synthetic geometry, resonant filaments, dynamic dimensions,
 * and polyhedral consciousnesses with software 3D projection, depth sorting,
 * and adaptive camera controls (Orbit, Follow Entity, Cinematic Drone, Free).
 */

class RealmRenderer {
  constructor(canvas, universe) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.universe = universe;

    // Camera parameters
    this.camera = {
      x: 0,
      y: -40,
      z: -480,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      rotX: 0.28,
      rotY: 0.0,
      zoom: 1.0,
      fov: 480,
      mode: 'CINEMATIC', // 'ORBIT', 'FOLLOW', 'CINEMATIC', 'FREE'
      followTarget: null,
      smoothFollowSpeed: 0.06
    };

    // Interaction state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.hoveredEntity = null;

    // Environmental background particles (200 ambient dust nodes)
    this.ambientParticles = [];
    this.initAmbientParticles(200);

    // Architectural spires for Dimension C (The Manifest)
    this.manifestSpires = this.createManifestSpires();

    // Resize handling
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.bindEvents();
  }

  handleResize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.camera.fov = Math.min(this.width, this.height) * 0.85;
  }

  initAmbientParticles(count) {
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 800,
        size: 1 + Math.random() * 2.5,
        speed: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createManifestSpires() {
    const spires = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 240 + (i % 3) * 60;
      spires.push({
        x: Math.cos(angle) * r,
        y: 80,
        z: Math.sin(angle) * r,
        height: 120 + (i % 4) * 50,
        radius: 18 + (i % 3) * 8,
        facets: 6
      });
    }
    return spires;
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      if (this.camera.mode === 'CINEMATIC') {
        this.camera.mode = 'ORBIT';
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.camera.rotY += dx * 0.005;
        this.camera.rotX = Math.max(-1.4, Math.min(1.4, this.camera.rotX + dy * 0.005));
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
      this.checkHover(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.z = Math.max(-1200, Math.min(-150, this.camera.z - e.deltaY * 0.8));
    }, { passive: false });

    this.canvas.addEventListener('click', (e) => {
      this.handleClick(e.clientX, e.clientY);
    });
  }

  setCameraMode(mode, targetEntity = null) {
    this.camera.mode = mode;
    if (mode === 'FOLLOW' && targetEntity) {
      this.camera.followTarget = targetEntity;
    }
  }

  checkHover(mx, my) {
    if (!this.lastProjectedEntities) return;
    let closest = null;
    let minD = 22; // 22px click radius

    for (let item of this.lastProjectedEntities) {
      if (!item.visible) continue;
      const d = Math.hypot(item.screenX - mx, item.screenY - my);
      if (d < minD) {
        minD = d;
        closest = item.entity;
      }
    }
    this.hoveredEntity = closest;
    this.canvas.style.cursor = closest ? 'pointer' : 'default';
  }

  handleClick(mx, my) {
    if (this.hoveredEntity) {
      this.universe.selectEntity(this.hoveredEntity);
      this.setCameraMode('FOLLOW', this.hoveredEntity);
    }
  }

  /**
   * 3D Coordinate to 2D Screen Space Projection
   */
  project(p3d) {
    // Relative to camera target
    let x = p3d.x - this.camera.targetX;
    let y = p3d.y - this.camera.targetY;
    let z = p3d.z - this.camera.targetZ;

    // Rotate around Y axis (rotY)
    const cosY = Math.cos(this.camera.rotY);
    const sinY = Math.sin(this.camera.rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotate around X axis (rotX)
    const cosX = Math.cos(this.camera.rotX);
    const sinX = Math.sin(this.camera.rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    // Camera Z distance offset
    const finalZ = z2 - this.camera.z;

    if (finalZ <= 20) {
      return { visible: false, screenX: 0, screenY: 0, depth: finalZ, scale: 0 };
    }

    const scale = this.camera.fov / finalZ;
    const screenX = this.width / 2 + x1 * scale;
    const screenY = this.height / 2 + y2 * scale;

    return {
      visible: screenX >= -100 && screenX <= this.width + 100 && screenY >= -100 && screenY <= this.height + 100,
      screenX,
      screenY,
      depth: finalZ,
      scale
    };
  }

  /**
   * Update camera motion per frame
   */
  updateCamera(dt) {
    if (this.camera.mode === 'CINEMATIC') {
      this.camera.rotY += 0.0018;
      this.camera.rotX = 0.25 + Math.sin(Date.now() * 0.0003) * 0.12;
      this.camera.targetX += (0 - this.camera.targetX) * 0.04;
      this.camera.targetY += (0 - this.camera.targetY) * 0.04;
      this.camera.targetZ += (0 - this.camera.targetZ) * 0.04;
    } else if (this.camera.mode === 'FOLLOW' && this.camera.followTarget) {
      const tgt = this.camera.followTarget;
      this.camera.targetX += (tgt.x - this.camera.targetX) * this.camera.smoothFollowSpeed;
      this.camera.targetY += (tgt.y - this.camera.targetY) * this.camera.smoothFollowSpeed;
      this.camera.targetZ += (tgt.z - this.camera.targetZ) * this.camera.smoothFollowSpeed;
    }
  }

  /**
   * Main Render Loop
   */
  render(dt) {
    this.updateCamera(dt);
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Clear with atmospheric dimensional gradient
    const dim = this.universe.cosmology.getDimension(this.universe.currentDimension);
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h) * 0.85);
    const col = dim.ambientColor;
    bgGrad.addColorStop(0, `rgba(${col[0] * 0.2}, ${col[1] * 0.2}, ${col[2] * 0.2}, 1)`);
    bgGrad.addColorStop(0.5, `rgba(${Math.floor(col[0] * 0.08)}, ${Math.floor(col[1] * 0.08)}, ${Math.floor(col[2] * 0.08)}, 1)`);
    bgGrad.addColorStop(1, '#05020a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Render dynamic dimensional ambient grid / lattice
    this.renderLattice(ctx, dim);

    // 3. Render ambient dust particles
    this.renderParticles(ctx, dim, dt);

    // 4. Render Architectural formations for Dimension C or D
    if (this.universe.currentDimension === 'MANIFEST' || this.universe.currentDimension === 'ECHO') {
      this.renderArchitecture(ctx);
    }

    // 5. Gather all entities and project them
    const renderList = [];
    this.lastProjectedEntities = [];

    const entities = this.universe.entityManager.entities;
    for (let e of entities) {
      // Filter or dim entities from other dimensions
      const isCurrentDim = (e.dimension === this.universe.currentDimension);
      const proj = this.project(e);

      if (proj.visible) {
        renderList.push({
          type: 'ENTITY',
          entity: e,
          isCurrentDim,
          depth: proj.depth,
          proj
        });

        this.lastProjectedEntities.push({
          entity: e,
          visible: proj.visible,
          screenX: proj.screenX,
          screenY: proj.screenY,
          depth: proj.depth
        });
      }
    }

    // 6. Gather active resonance filaments between pairs
    const filaments = [];
    const len = entities.length;
    for (let i = 0; i < len; i += 2) {
      const eA = entities[i];
      if (eA.dimension !== this.universe.currentDimension) continue;

      for (let j = i + 1; j < len; j += 4) {
        const eB = entities[j];
        if (eB.dimension !== this.universe.currentDimension) continue;

        const r = this.universe.physics.calculateResonance(eA, eB);
        if (r > 0.45) {
          const pA = this.project(eA);
          const pB = this.project(eB);
          if (pA.visible || pB.visible) {
            filaments.push({
              pA,
              pB,
              resonance: r,
              depth: (pA.depth + pB.depth) / 2,
              color: eA.color
            });
          }
        }
      }
    }

    // Add filaments to depth sorted render queue
    for (let f of filaments) {
      renderList.push({
        type: 'FILAMENT',
        filament: f,
        depth: f.depth
      });
    }

    // Depth sort: render furthest first
    renderList.sort((a, b) => b.depth - a.depth);

    // 7. Render depth sorted scene
    for (let item of renderList) {
      if (item.type === 'FILAMENT') {
        this.renderFilament(ctx, item.filament);
      } else if (item.type === 'ENTITY') {
        this.renderEntity(ctx, item.entity, item.proj, item.isCurrentDim);
      }
    }

    // 8. Render Selected / Hovered Entity HUD Highlights
    this.renderHUDIndicators(ctx);
  }

  /**
   * Non-Earth Synthetic Coordinate Lattice
   */
  renderLattice(ctx, dim) {
    ctx.save();
    ctx.lineWidth = 1;

    const ringCount = 5;
    const baseR = 80;
    const col = dim.ambientColor;

    for (let r = 1; r <= ringCount; r++) {
      const radius = r * baseR;
      ctx.beginPath();
      const segments = 36;
      let first = true;

      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const p = this.project({
          x: Math.cos(theta) * radius,
          y: 60,
          z: Math.sin(theta) * radius
        });
        if (p.visible) {
          if (first) {
            ctx.moveTo(p.screenX, p.screenY);
            first = false;
          } else {
            ctx.lineTo(p.screenX, p.screenY);
          }
        }
      }

      ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${0.05 + r * 0.02})`;
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Ambient particles floating in 3D
   */
  renderParticles(ctx, dim, dt) {
    const col = dim.ambientColor;
    ctx.save();

    for (let p of this.ambientParticles) {
      p.phase += dt * p.speed;
      p.y += Math.sin(p.phase) * 0.2;

      const proj = this.project(p);
      if (proj.visible) {
        const size = Math.max(1, p.size * proj.scale);
        const alpha = Math.min(0.6, (proj.scale * 1.2));
        ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`;
        ctx.fillRect(proj.screenX - size / 2, proj.screenY - size / 2, size, size);
      }
    }
    ctx.restore();
  }

  /**
   * Monolithic geometric spires for The Manifest & The Echo
   */
  renderArchitecture(ctx) {
    ctx.save();
    for (let s of this.manifestSpires) {
      const base = this.project({ x: s.x, y: s.y, z: s.z });
      const top = this.project({ x: s.x, y: s.y - s.height, z: s.z });

      if (base.visible && top.visible) {
        const rad = s.radius * base.scale;
        const grad = ctx.createLinearGradient(base.screenX, base.screenY, top.screenX, top.screenY);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.02)');
        grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.18)');
        grad.addColorStop(1, 'rgba(52, 211, 153, 0.5)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, 2 * base.scale);

        // Draw geometric column
        ctx.beginPath();
        ctx.moveTo(base.screenX - rad, base.screenY);
        ctx.lineTo(top.screenX, top.screenY);
        ctx.lineTo(base.screenX + rad, base.screenY);
        ctx.stroke();

        // Pulsing summit node
        const nodeRad = Math.max(2, 6 * top.scale);
        ctx.fillStyle = 'rgba(110, 231, 183, 0.8)';
        ctx.beginPath();
        ctx.arc(top.screenX, top.screenY, nodeRad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * Glowing resonant filament between two harmonized entities
   */
  renderFilament(ctx, f) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(f.pA.screenX, f.pA.screenY);
    ctx.lineTo(f.pB.screenX, f.pB.screenY);

    const alpha = Math.min(0.75, f.resonance * 0.8);
    ctx.strokeStyle = f.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = Math.max(0.8, f.resonance * 2.5 * f.pA.scale);
    ctx.stroke();

    // Harmonic midpoint pulse
    const midX = (f.pA.screenX + f.pB.screenX) / 2;
    const midY = (f.pA.screenY + f.pB.screenY) / 2;
    ctx.beginPath();
    ctx.arc(midX, midY, Math.max(1.5, 3 * f.pA.scale), 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders the 5 Distinct Non-Humanoid Inhabitant Forms
   */
  renderEntity(ctx, e, proj, isCurrentDim) {
    ctx.save();
    const s = proj.scale;
    const x = proj.screenX;
    const y = proj.screenY;

    // Entity opacity based on dimension residency
    const baseAlpha = isCurrentDim ? Math.min(1.0, 0.35 + e.coherence * 0.65) : 0.15;
    ctx.globalAlpha = baseAlpha;

    const isSelected = this.universe.selectedEntity && this.universe.selectedEntity.id === e.id;
    const isHovered = this.hoveredEntity && this.hoveredEntity.id === e.id;

    // 1. Aura glow ring
    const radius = Math.max(4, (12 + (e.meaningDensity || 0.6) * 6) * s);
    const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.2);
    grad.addColorStop(0, e.color);
    grad.addColorStop(0.6, e.glowColor || e.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Specific Non-Earth Synthetic Geometry per Category
    ctx.strokeStyle = isSelected ? '#ffffff' : (isHovered ? '#fef08a' : e.color);
    ctx.lineWidth = isSelected ? Math.max(2, 3 * s) : Math.max(1, 1.5 * s);
    ctx.fillStyle = e.glowColor || e.color;

    const phase = e.harmonicPhase || 0;

    switch (e.category) {
      case 'Auraliths': {
        // Octahedral Polyhedron / Double Pyramid
        const h = radius * 1.5;
        const w = radius * 1.1;
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x + w * Math.cos(phase), y + w * Math.sin(phase) * 0.4);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x - w * Math.cos(phase), y - w * Math.sin(phase) * 0.4);
        ctx.closePath();
        ctx.stroke();

        // Inner harmonic core
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Veskari': {
        // Multi-stranded Torus / Undulating Ribbon Tendrils
        const arms = 3;
        for (let a = 0; a < arms; a++) {
          const aOffset = phase + (a / arms) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const cpX = x + Math.cos(aOffset) * radius * 1.6;
          const cpY = y + Math.sin(aOffset) * radius * 1.6;
          const endX = x + Math.cos(aOffset + 0.8) * radius * 2.2;
          const endY = y + Math.sin(aOffset + 0.8) * radius * 2.2;
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Oroth': {
        // Heavy Angular Prismatic Monolith with etched glyph bands
        const w = radius * 0.9;
        const h = radius * 1.8;
        ctx.strokeRect(x - w / 2, y - h / 2, w, h);

        // Internal memory strata lines
        const bands = 3;
        for (let b = 1; b <= bands; b++) {
          const by = y - h / 2 + (b / (bands + 1)) * h;
          ctx.beginPath();
          ctx.moveTo(x - w / 2, by);
          ctx.lineTo(x + w / 2, by);
          ctx.stroke();
        }
        break;
      }

      case 'Nemori': {
        // Stellar Shard / High-frequency flickering kinetic cross
        const pts = 6;
        ctx.beginPath();
        for (let p = 0; p < pts; p++) {
          const ang = phase * 2 + (p / pts) * Math.PI * 2;
          const len = (p % 2 === 0 ? radius * 1.6 : radius * 0.5);
          const px = x + Math.cos(ang) * len;
          const py = y + Math.sin(ang) * len;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        break;
      }

      case 'Ilyr': {
        // Dual-phase Folding Hypercube / Oscillating Tesseract Shard
        const r1 = radius * 1.2;
        const r2 = radius * 0.6;
        const rot = phase * 1.4;

        ctx.strokeRect(x - r1 / 2, y - r1 / 2, r1, r1);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.strokeRect(-r2 / 2, -r2 / 2, r2, r2);
        ctx.restore();

        // Diagonal fold lines
        ctx.beginPath();
        ctx.moveTo(x - r1 / 2, y - r1 / 2);
        ctx.lineTo(x + r1 / 2, y + r1 / 2);
        ctx.stroke();
        break;
      }
    }

    // 3. Render floating Vareth Utterance if freshly spoken
    if (e.utterance && e.utteranceAge < 4.5 && isCurrentDim) {
      const uAlpha = Math.max(0, 1 - (e.utteranceAge / 4.5));
      ctx.globalAlpha = uAlpha;
      ctx.font = `${Math.max(10, 11 * s)}px "Courier New", monospace`;
      ctx.fillStyle = '#a7f3d0';
      ctx.textAlign = 'center';
      ctx.fillText(`⟦ ${e.utterance} ⟧`, x, y - radius * 2 - 4);
    }

    ctx.restore();
  }

  /**
   * HUD overlays for selected / hovered entities
   */
  renderHUDIndicators(ctx) {
    if (!this.universe.selectedEntity) return;

    const sel = this.universe.selectedEntity;
    const proj = this.project(sel);

    if (proj.visible) {
      ctx.save();
      const x = proj.screenX;
      const y = proj.screenY;
      const r = Math.max(16, 26 * proj.scale);

      // Target reticle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Corner markers
      const d = r + 6;
      ctx.beginPath();
      ctx.moveTo(x - d, y - d + 6); ctx.lineTo(x - d, y - d); ctx.lineTo(x - d + 6, y - d);
      ctx.moveTo(x + d, y - d + 6); ctx.lineTo(x + d, y - d); ctx.lineTo(x + d - 6, y - d);
      ctx.moveTo(x - d, y + d - 6); ctx.lineTo(x - d, y + d); ctx.lineTo(x - d + 6, y + d);
      ctx.moveTo(x + d, y + d - 6); ctx.lineTo(x + d, y + d); ctx.lineTo(x + d - 6, y + d);
      ctx.stroke();

      // Mini Name Plate
      ctx.font = '11px "Courier New", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${sel.id} : ${sel.name}`, x, y + r + 16);
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText(`C:${sel.coherence.toFixed(2)} | M:${(sel.meaningDensity || 0.6).toFixed(2)} | ${sel.currentGoal}`, x, y + r + 28);

      ctx.restore();
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.RealmRenderer = RealmRenderer;
}
