(() => {
  "use strict";

  const CUSTOM_ADS = [
    "assets/ads/01.png", "assets/ads/02.gif", "assets/ads/03.png", "assets/ads/04.gif", "assets/ads/05.png",
    "assets/ads/06.gif", "assets/ads/07.png", "assets/ads/08.png", "assets/ads/09.gif", "assets/ads/10.png"
  ];
  let currentAdIndex = 0;

  const extraStyles = document.createElement('style');
  extraStyles.textContent = `
    .file-grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 15px; justify-content: flex-start; align-items: flex-end; background: #ffffff; min-height: 100%; }
    .image-entry { display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid transparent; background: transparent !important; cursor: pointer; padding: 8px; border-radius: 2px; color: #000; max-width: 130px; }
    
    .image-entry:hover { background: #e5f3ff !important; border: 1px solid #d8ebf9 !important; }
    .image-entry.selected { background: #cce8ff !important; border: 1px solid #99d1ff !important; }
    
    .work-thumb { width: auto; height: auto; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; background: transparent !important; }
    .work-thumb img { max-width: 100px; max-height: 80px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4)); }
    
    /* ANIQUILAÇÃO TOTAL DE REQUADROS NAS ARTES SOLTAS */
    .frameless-art { background: transparent !important; background-image: none !important; border: none !important; box-shadow: none !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; outline: none !important; }
    .frameless-art .window-body { height: auto !important; background: transparent !important; background-image: none !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
    .frameless-art:before, .frameless-art:after { display: none !important; }
    
    .art-plate { overflow: visible; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: transparent !important; border: none !important; box-shadow: none !important; }
    .img-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.05s linear; cursor: pointer; background: transparent !important; border: none !important; box-shadow: none !important; }
    .img-wrapper img { display: block; touch-action: none; max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(3px 3px 12px rgba(0,0,0,0.8)); background: transparent !important; border: none !important; }
    
    .close-art { position: absolute; top: -12px; right: -12px; background: #e81123; color: #fff; border: 1px solid #fff; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); width: 24px; height: 26px; font-family: sans-serif; font-weight: bold; cursor: pointer; z-index: 100000; display: flex; align-items: center; justify-content: center; border-radius: 2px; }
    .close-art:hover { background: #ff0000; }
    
    .art-instruction { margin-top: 8px; font-family: 'Archivo', sans-serif; font-size: 11px; font-weight: bold; color: #fff; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; pointer-events: none; text-align: center; width: 100%; }
    
    /* CONTÊINER DA PROPAGANDA SEM ALONGAR */
    .popup-ad { cursor: crosshair; z-index: 999999 !important; overflow: visible !important; background: transparent !important; background-image: none !important; border: 1px solid #0058e6 !important; box-shadow: 2px 2px 5px rgba(0,0,0,0.5) !important; padding: 0 !important; box-sizing: content-box; }
    .popup-ad .titlebar { height: 20px; font-size: 11px; background: linear-gradient(to right, #0058e6, #3a93ff) !important; margin: 0 !important; border: none !important; padding: 0 6px; display: flex; align-items: center; justify-content: space-between; }
    .popup-ad .window-body { padding: 0 !important; margin: 0 !important; width: 100% !important; height: calc(100% - 20px) !important; overflow: hidden; pointer-events: none; background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; }
    .popup-ad .window-body img { display: block; width: 100%; height: 100%; object-fit: contain !important; background: transparent !important; }
    
    /* RECONSTRUÇÃO DA EXPLOSÃO PIXELADA RADIAL 8-BITS */
    @keyframes realisticPixelExplosion {
      0% { box-shadow: 0 0 0 4px #fff, 0 0 0 8px #ffeb3b; background: transparent; transform: scale(0.6); opacity: 1; }
      35% { box-shadow: 
        0 -16px 0 3px #fff, 0 16px 0 3px #fff, 16px 0 0 3px #fff, -16px 0 0 3px #fff,
        -12px -12px 0 4px #ffeb3b, 12px 12px 0 4px #ffeb3b, -12px 12px 0 4px #ffeb3b, 12px -12px 0 4px #ffeb3b,
        0 -25px 0 3px #ff9800, 0 25px 0 3px #ff9800; transform: scale(1.1); opacity: 1; border: none; }
      70% { box-shadow: 
        0 -32px 0 4px #ff9800, 0 32px 0 4px #ff9800, 32px 0 4px #ff9800, -32px 0 4px #ff9800,
        -22px -22px 0 4px #f44336, 22px 22px 0 4px #f44336, -22px 22px 0 4px #f44336, 22px -22px 0 4px #f44336,
        -36px -36px 0 3px #ffeb3b, 36px 36px 0 3px #ffeb3b, 0 -45px 0 4px #f44336; transform: scale(1.4); opacity: 0.8; border: none; }
      100% { box-shadow: none; transform: scale(2); opacity: 0; display: none; }
    }
    .explode-anim { animation: realisticPixelExplosion 0.45s steps(5) forwards !important; pointer-events: none; background: transparent !important; border: none !important; box-shadow: none !important; }
    .explode-anim .titlebar, .explode-anim .window-body { display: none !important; }
    
    /* TOAST MSN MESSENGER */
    @keyframes msnSlideIn {
      0% { transform: translateY(250px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .msn-window { position: fixed !important; border-radius: 8px !important; background: linear-gradient(to bottom, #E6F0FA 0%, #CDE0F5 40%, #A4CBF0 100%) !important; border: 1px solid #6E98C7 !important; box-shadow: 2px 2px 10px rgba(0,0,0,0.4) !important; animation: msnSlideIn 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; transition: height 0.15s ease-in-out, top 0.15s ease-in-out, left 0.15s ease-in-out; }
    .msn-window .titlebar { display: none !important; }
    .task-msn { background: linear-gradient(to bottom, #E6F0FA, #A4CBF0) !important; border: 1px solid #6E98C7 !important; color: #000 !important; }
    
    /* BARRA DE TAREFAS RESPONSIVA */
    .taskbar { display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; padding: 0 10px; }
    .task-strip { flex: 1; display: flex; gap: 4px; overflow: hidden; margin: 0 10px; min-width: 0; }
    .task-button { flex: 0 1 140px; min-width: 35px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .system-tray-container { display: flex; align-items: center; gap: 8px; flex-shrink: 0; background: linear-gradient(to bottom, #0c82dc, #045cc0); padding: 0 8px; height: 100%; border-left: 1px solid #08449c; }
    .system-tray-icons { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #fff; cursor: default; }
    
    @keyframes crtWallpaperGlitch {
      0% { transform: scale(1) translate(0,0) skewX(0); filter: none; }
      20% { transform: scale(1.03) translate(-5px, 3px) skewX(4deg); filter: hue-rotate(120deg) contrast(1.8) saturate(2); }
      40% { transform: scale(0.98) translate(6px, -4px) skewX(-6deg); filter: hue-rotate(-60deg) brightness(1.5) contrast(2); }
      60% { transform: scale(1.05) translate(-2px, -2px) skewY(2deg); filter: invert(0.1) hue-rotate(180deg); }
      80% { transform: scale(1.01) translate(4px, 2px) skewX(8deg); filter: brightness(1.8) contrast(1.3); }
      100% { transform: scale(1) translate(0,0) skewX(0); filter: none; }
    }
    .wallpaper-glitch-active { animation: crtWallpaperGlitch 1s steps(8) forwards !important; }
    #bsod { z-index: 999999999 !important; }
  `;
  document.head.appendChild(extraStyles);

  const FOLDER_SVG = `<svg width="50" height="50" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));"><path d="M40 12H22L18 6H8C5.8 6 4 7.8 4 10V38C4 40.2 5.8 42 8 42H40C42.2 42 44 40.2 44 38V16C44 13.8 42.2 12 40 12Z" fill="#F4D03F" stroke="#D68910" stroke-width="2" stroke-linejoin="round"/><path d="M4 16H44" stroke="#D68910" stroke-width="2"/></svg>`;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const state = { wins: [], top: 1000, active: null, menuOpen: false, cascade: 0, manifest: null, browserPath: [] };
  const windowsEl = $("#windows");
  const taskStrip = $("#taskStrip");
  const bsod = $("#bsod");
  const clockEl = $("#clock");
  const wallpaperEl = $(".wallpaper");

  let crashMultiplier = 1;
  let msnNotified = false;

  function playMsnSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.25);
    } catch(_) {}
  }

  function playExplosionSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.04, ctx.currentTime); // Baixinho
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.35);
    } catch(_) {}
  }

  document.addEventListener("click", () => {
    if (!msnNotified) {
      playMsnSound();
      msnNotified = true;
    }
  }, { once: true });

  function getIcon(name, fallbackEmoji) {
    return `<img src="assets/icons/${name}.png" onerror="this.outerHTML='<span>${fallbackEmoji}</span>'" alt="" style="width:16px; height:16px; object-fit:contain; vertical-align:middle; margin-right:4px;">`;
  }

  function asset(file) { return String(file).split("/").map(encodeURIComponent).join("/"); }
  function imageSrc(item) { return item?.source || asset(item?.file || ""); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[m])); }

  function generateAutomaticManifest() {
    const buildItems = (folderPath) => {
      return Array.from({ length: 15 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return { id: `${folderPath}/${num}.png`, file: `${folderPath}/${num}.png`, title: `${num}` };
      });
    };
    return {
      version: 1,
      exhibitions: [
        { id: "vernissage:utopias_piratas_2021", name: "utopias_piratas_2021", year: 2021, items: buildItems("Vernissages/utopias_piratas_2021") },
        { id: "vernissage:Hyperlinks, Distortion e Mormasso", name: "Hyperlinks, Distortion e Mormasso", year: 2022, items: buildItems("Vernissages/Hyperlinks, Distortion e Mormasso") },
        { id: "vernissage:RAW 2025 (HOA+FDAG)", name: "RAW 2025 (HOA+FDAG)", year: 2025, items: buildItems("Vernissages/RAW 2025 (HOA+FDAG)") }
      ],
      works: buildItems("Obras")
    };
  }

  function allItems() { return [...state.manifest.exhibitions.flatMap(g => g.items), ...state.manifest.works]; }
  function findItem(id) { return allItems().find(item => item.id === id); }
  function browserRoot() { return { kind: "root", name: "C:\\h4wnee", path: [] }; }

  function currentBrowser(win) {
    const path = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (path.length === 0) return browserRoot();
    if (path[0] === "Vernissages") {
      if (path.length === 1) return { kind: "vernissages", name: "Vernissages", path };
      const name = path.slice(1).join("/");
      const group = state.manifest.exhibitions.find(x => x.name === name);
      return group ? { kind: "exhibition", name: group.name, path, group } : { kind: "vernissages", name: "Vernissages", path: ["Vernissages"] };
    }
    if (path[0] === "Obras") return { kind: "obras", name: "Obras", path };
    win.browserPath = []; return browserRoot();
  }

  function folderEntries() {
    return [
      { type: "folder", id: "Vernissages", name: "Vernissages", subtitle: `3 exposições` },
      { type: "folder", id: "Obras", name: "Obras", subtitle: `15 arquivos` }
    ];
  }

  function defaultGeometry(kind, work = null) {
    const W = innerWidth, H = innerHeight;
    const n = state.cascade++;
    if (kind === "folder") return { x: W * .05, y: H * .23, w: 600, h: 420 };
    if (kind === "about") return { x: clamp(W - 420, 80, W - 390), y: clamp(H * 0.2, 80, H - 250), w: 390, h: 392 };
    
    // MSN ANCORADO E INICIADO PERFEITAMENTE NO CANTO INFERIOR DIREITO NA RAIZ
    if (kind === "contact") return { x: W - 270, y: H - 205, w: 250, h: 160 }; 
    
    if (kind === "art" && work) {
      const nw = Number(work.nw) || 800; const nh = Number(work.nh) || 600;
      const scale = Math.min(clamp(W * .35, 250, 600) / nw, (H * 0.5) / nh, 1);
      
      // DISPOSIÇÃO INICIAL DOS Z-INDEX DO TRIO DE ABERTURA
      if (work.title === "01") return { x: W * 0.12, y: H * 0.15, w: Math.max(200, Math.round(nw * scale)), h: Math.round(nh * scale), initZ: 1003 };
      if (work.title === "02") return { x: W - 580, y: H * 0.28, w: Math.max(200, Math.round(nw * scale)), h: Math.round(nh * scale), initZ: 1001 }; // METADE APARECENDO ATRÁS DO ABOUT
      if (work.title === "03") return { x: W * 0.02, y: H * 0.38, w: Math.max(200, Math.round(nw * scale)), h: Math.round(nh * scale), initZ: 1001 }; // ATRÁS DO EXPLORER
    }
    return { x: 180 + (n % 6) * 46, y: 120 + (n % 6) * 38, w: 350, h: 250 };
  }

  function addWindow(kind, work = null, opts = {}) {
    const existing = state.wins.find(w => w.kind === kind && (!work || (w.work && w.work.id === work.id)));
    if (existing) { focusWin(existing.id); return; }

    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;
    const titleMap = { folder: "C:\\h4wnee", about: "about_h4wnee.txt", contact: "Windows Live Messenger" };
    const iconHtml = work ? getIcon("art", "🖼") : getIcon(kind, ({ folder: "📁", about: "🗒", contact: "👥" }[kind]));
    
    const geom = defaultGeometry(kind, work);
    let targetedZ = opts.z || ++state.top;
    if (geom.initZ && !opts.z) targetedZ = geom.initZ;

    const win = {
      id, kind, title: work ? (work.file || work.title) : titleMap[kind],
      iconHtml,
      ...geom, z: targetedZ, min: false, max: false,
      work, browserPath: [], browserHistory: [[]],
      ratioX: geom.x / innerWidth, ratioY: geom.y / innerHeight,
      anchor: opts.anchor || null,
      ...opts
    };

    state.wins.push(win); state.active = id; state.menuOpen = false; render();
  }

  function closeWindow(id) {
    state.wins = state.wins.filter(w => w.id !== id);
    if (state.active === id) state.active = state.wins.filter(w => !w.min).sort((a, b) => b.z - a.z)[0]?.id || null;
    render();
  }

  function focusWin(id, forceRender = false) {
    const w = state.wins.find(x => x.id === id);
    if (!w || w.kind === "popup") return;
    const alreadyActive = (state.active === id && !w.min && !state.menuOpen);
    
    w.z = ++state.top + (w.kind === "art" ? 950000 : 0); 
    w.min = false; state.active = id; state.menuOpen = false;
    
    if (!alreadyActive || forceRender) render();
    else {
      const el = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (el) {
        el.style.zIndex = w.z;
        $$(".window", windowsEl).forEach(win => win.classList.toggle("inactive", win.dataset.id !== id));
      }
    }
  }

  function beginPointer(e, id, mode) {
    if (e.button !== undefined && e.button !== 0) return;
    const w = state.wins.find(x => x.id === id);
    if (!w || w.min) return;
    focusWin(id);

    const start = { px: e.clientX, py: e.clientY, x: w.x, y: w.y, width: w.w, height: w.h };

    const move = ev => {
      if (mode === "move" && !w.max) {
        w.x = clamp(start.x + (ev.clientX - start.px), 96 - w.w + 140, innerWidth - 60);
        w.y = clamp(start.y + (ev.clientY - start.py), 38, innerHeight - 70);
        w.ratioX = w.x / innerWidth; w.ratioY = w.y / innerHeight;
      }
      if (mode === "size" && !w.max) {
        w.w = Math.max(200, start.width + (ev.clientX - start.px));
        w.h = Math.max(150, start.height + (ev.clientY - start.py));
      }
      const el = windowsEl.querySelector(`[data-id="${CSS.escape(w.id)}"]`);
      if (el) { el.style.left = `${w.x}px`; el.style.top = `${w.y}px`; el.style.width = `${w.w}px`; el.style.height = `${w.h}px`; }
    };

    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }

  function titlebar(w) {
    const bar = document.createElement("div");
    bar.className = "titlebar";
    bar.innerHTML = `
      <span class="title-icon">${w.iconHtml || ""}</span>
      <span class="title-text">${w.title}</span>
      <span class="window-buttons"><button type="button" class="close" data-act="close">×</button></span>`;
    
    bar.addEventListener("pointerdown", e => { if (!e.target.closest("button")) beginPointer(e, w.id, "move"); });
    $$(".window-buttons button", bar).forEach(btn => btn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      if (btn.dataset.act === "close") closeWindow(w.id);
    }));
    return bar;
  }

  function navigateBrowser(win, target) {
    const next = target.split('/').filter(Boolean);
    const current = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (JSON.stringify(next) === JSON.stringify(current)) return;
    win.browserHistory.push(next); win.browserPath = next; focusWin(win.id, true);
  }

  function goBack(win) {
    if (!Array.isArray(win.browserHistory) || win.browserHistory.length <= 1) return;
    win.browserHistory.pop(); win.browserPath = [...win.browserHistory.at(-1)]; focusWin(win.id, true);
  }

  function imageCard(item) {
    return `
      <button class="work-item image-entry" type="button" data-work="${escapeHtml(item.id)}">
        <div class="work-thumb"><img src="${escapeHtml(imageSrc(item))}" alt="" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'50\\' height=\\'50\\'><rect width=\\'50\\' height=\\'50\\' fill=\\'transparent\\'/></svg>'"></div>
        <span>${escapeHtml(item.title)}</span>
      </button>`;
  }

  function browserBodyHTML(win) {
    const current = currentBrowser(win); let content = "";
    if (current.kind === "root") {
      content = `<div class="file-grid">` + folderEntries().map(entry => `
        <button class="work-item image-entry" type="button" data-folder="${escapeHtml(entry.id)}">
          <div class="work-thumb">${FOLDER_SVG}</div>
          <strong>${escapeHtml(entry.name)}</strong>
        </button>`).join("") + `</div>`;
    } 
    else if (current.kind === "vernissages") {
      content = `<div class="file-grid">` + state.manifest.exhibitions.map(group => `
        <button class="work-item image-entry" type="button" data-folder="${escapeHtml(`Vernissages/${group.name}`)}">
          <div class="work-thumb">${FOLDER_SVG}</div>
          <span>${escapeHtml(group.name)}</span>
        </button>`).join("") + `</div>`;
    } 
    else if (current.kind === "exhibition") {
      content = `<div class="file-grid">${current.group.items.map(item => imageCard(item)).join("")}</div>`;
    } 
    else if (current.kind === "obras") {
      content = `<div class="file-grid">${state.manifest.works.map(item => imageCard(item)).join("")}</div>`;
    }

    return `
      <div class="folder-menu" style="display: flex; gap: 12px; padding: 4px 8px; background: #ece9d8; border-bottom: 1px solid #d4d0c8; font-size: 11px; color: #000;">
        <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
      </div>
      <div class="toolbar" style="display: flex; align-items: center; gap: 4px; padding: 4px 8px; background: #ece9d8; border-bottom: 1px solid #d4d0c8;">
        <button type="button" data-nav="back" style="display:flex; align-items:center; gap:4px; padding:2px 6px; background:transparent; border:1px solid transparent; cursor:pointer; font-size:11px;">
          <span style="color:#008000; font-size:16px; font-weight:bold; line-height:1;">←</span> Back
        </button>
        <div style="width: 1px; height: 22px; background: #aca899; margin: 0 4px;"></div>
        <button type="button" style="padding:2px 6px; background:transparent; border:1px solid transparent; cursor:pointer; font-size:11px;">Search</button>
        <button type="button" style="padding:2px 6px; background:transparent; border:1px solid transparent; cursor:pointer; font-size:11px;">Folders</button>
      </div>
      <div class="address-bar" style="display: flex; align-items: center; gap: 8px; padding: 4px 8px; background: #ece9d8; border-bottom: 1px solid #aca899; font-size: 11px;">
        <span style="color: #aca899;">Address</span>
        <div style="flex: 1; display:flex; align-items:center; gap:4px; background: #fff; border: 1px solid #7f9db9; padding: 2px 4px;">
          <span style="font-size:12px;">📁</span>
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:#000;">C:\\h4wnee\\${current.path.join('\\')}</div>
        </div>
      </div>
      <div class="folder-body browser-body" style="cursor: default; overflow-y:auto; height:calc(100% - 94px); background:#fff;">${content}</div>`;
  }

  function windowBodyHTML(w) {
    if (w.kind === "folder") return browserBodyHTML(w);

    if (w.kind === "art") {
      return `
        <div class="art-plate">
          <div class="img-wrapper">
             <img src="${imageSrc(w.work)}" alt="${escapeHtml(w.title)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23fff\\' font-family=\\'sans-serif\\' font-size=\\'18\\' text-anchor=\\'middle\\'>Imagem n\u00E3o encontrada</text></svg>'">
             <button class="close-art" data-act="close">X</button>
             <div class="art-instruction">Alt+Scroll: Zoom | Clique: Mover/Travar</div>
          </div>
        </div>`;
    }

    if (w.kind === "about") {
      return `
        <div class="about-body">
          <h2>h4wnee</h2>
          <p>is a Latin American transdisciplinary artist whose work explores the intersection of digital culture, popular imagination, and contemporary technologies.</p>
          <div class="chronology">2021  utopias_piratas_2021<br>2021  n0_f*ture_(prime)<br>2022  Hyperlinks, Distortion e Mormasso<br>2025  RAW 2025 (HOA+FDAG)</div>
        </div>`;
    }

    if (w.kind === "contact") {
      return `
        <div style="position:relative; font-family: 'Segoe UI', Tahoma, sans-serif; color: #000; height: 100%; display: flex; flex-direction: column; padding: 10px;">
          <button class="close" data-act="close" style="position:absolute; top:8px; right:8px; background:transparent; border:none; font-size:14px; font-weight:bold; cursor:pointer; color:#444; padding:0;">×</button>
          <div style="display:flex; align-items:center; gap:6px; font-size:11px; font-weight:bold; margin-bottom:12px; pointer-events:none;">
            ${getIcon("contact", "👥")}
            <span>Windows Live Messenger</span>
          </div>
          <div style="display:flex; gap:12px; align-items:center;">
            <div style="width:55px; height:55px; border:1px solid #8ca6c0; border-radius:4px; background: linear-gradient(to bottom, #fff, #d2e4f5); padding:2px; display:flex; justify-content:center; align-items:center;">
               <img src="assets/profile/avatar.png" onerror="this.outerHTML='<span style=\\'font-size:35px;\\'>👤</span>'" style="max-width:100%; max-height:100%;">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
              <div style="font-size:16px; margin-bottom:2px; letter-spacing:-0.5px;">h4wnee</div>
              <div style="font-size:11px; color:#222; line-height:1.3;">acaba de iniciar sessão</div>
            </div>
          </div>
          <div style="text-align:right; margin-top:10px;">
            <a href="#" class="msg-toggle" style="font-size:11px; color:#0055CC; text-decoration:none; cursor:pointer;">Enviar Mensagem</a>
          </div>
          <div class="msn-expand" style="display:none; margin-top:10px; border-top:1px solid #8ca6c0; padding-top:10px;">
             <textarea placeholder="Digite sua mensagem..." style="width:100%; height:45px; resize:none; font-family:inherit; font-size:11px; box-sizing:border-box; border:1px solid #8ca6c0; padding:4px; margin-bottom:5px;"></textarea>
             <button class="send-msg" style="width:100%; cursor:pointer; font-size:11px; padding:3px; background:#f0f0f0; border:1px solid #8ca6c0; border-radius:3px;">Send</button>
          </div>
        </div>`;
    }
    return "";
  }

  function bindWindowBody(el, w) {
    if (w.kind === "folder") {
      $$(".image-entry", el).forEach(btn => {
        btn.addEventListener("mouseenter", () => btn.classList.add("selected"));
        btn.addEventListener("mouseleave", () => btn.classList.remove("selected"));
        btn.addEventListener("click", e => {
          e.preventDefault(); e.stopPropagation();
          if (btn.dataset.work) {
            const work = findItem(btn.dataset.work);
            if (work) loadDimensions(work).then(() => addWindow("art", work));
          } else if (btn.dataset.folder) {
            navigateBrowser(w, btn.dataset.folder);
          }
        });
      });
      $$('[data-nav="back"]', el).forEach(btn => btn.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation(); goBack(w);
      }));
    }

    if (w.kind === "contact") {
       el.addEventListener("pointerdown", e => {
         if (!e.target.closest("button") && !e.target.closest("a") && !e.target.closest("textarea")) {
            focusWin(w.id);
            let start = { px: e.clientX, py: e.clientY, x: w.x, y: w.y };
            const move = ev => {
              w.x = clamp(start.x + (ev.clientX - start.px), 96 - w.w + 140, innerWidth - 60);
              w.y = clamp(start.y + (ev.clientY - start.py), 38, innerHeight - 70);
              w.ratioX = w.x / innerWidth; w.ratioY = w.y / innerHeight;
              el.style.left = `${w.x}px`; el.style.top = `${w.y}px`;
            };
            const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
            window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
         }
       });
       $$('[data-act="close"]', el).forEach(btn => btn.addEventListener("click", e => {
         e.preventDefault(); e.stopPropagation(); closeWindow(w.id);
       }));
       
       const toggleBtn = $(".msg-toggle", el); const expandArea = $(".msn-expand", el);
       const sendBtn = $(".send-msg", el); const textArea = $("textarea", el);

       toggleBtn.addEventListener("click", e => {
           e.preventDefault(); e.stopPropagation();
           const isExpanded = expandArea.style.display !== "none";
           expandArea.style.display = isExpanded ? "none" : "block";
           w.h = isExpanded ? 160 : 255;
           w.y = innerHeight - w.h - 45; // Crava o chão acima da barra de tarefas sempre
           w.ratioY = w.y / innerHeight;
           el.style.height = `${w.h}px`; el.style.top = `${w.y}px`;
       });
       sendBtn.addEventListener("click", () => {
           if(textArea.value.trim() === "") return;
           expandArea.style.display = "none"; w.h = 160; w.y = innerHeight - 160 - 45; w.ratioY = w.y / innerHeight;
           el.style.height = `${w.h}px`; el.style.top = `${w.y}px`; textArea.value = "";
           alert("Mensagem enviada com sucesso!");
       });
    }

    if (w.kind === "art") {
      const wrapper = $(".img-wrapper", el);
      let scale = 1, panX = 0, panY = 0, isDragging = false;
      let startMouseX = 0, startMouseY = 0, initialPanX = 0, initialPanY = 0;

      const moveHandler = e => {
        if (!isDragging) return;
        panX = initialPanX + (e.clientX - startMouseX);
        panY = initialPanY + (e.clientY - startMouseY);
        wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      };

      $$('.close-art', el).forEach(btn => btn.addEventListener("click", e => {
         e.preventDefault(); e.stopPropagation();
         document.removeEventListener("pointermove", moveHandler);
         closeWindow(w.id);
      }));

      wrapper.addEventListener("wheel", e => {
        if (e.altKey) {
          e.preventDefault();
          scale += e.deltaY * -0.002;
          scale = Math.min(Math.max(0.5, scale), 5);
          wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }
      });

      wrapper.addEventListener("click", e => {
        if (e.target.closest('.close-art')) return;
        e.stopPropagation(); focusWin(w.id);
        isDragging = !isDragging;
        
        if (isDragging) {
          startMouseX = e.clientX; startMouseY = e.clientY;
          initialPanX = panX; initialPanY = panY;
          wrapper.style.cursor = "grabbing";
          document.addEventListener("pointermove", moveHandler);
        } else {
          wrapper.style.cursor = "pointer";
          document.removeEventListener("pointermove", moveHandler);
          const rect = el.getBoundingClientRect();
          w.x = rect.left + panX; w.y = rect.top + panY;
          w.ratioX = w.x / innerWidth; w.ratioY = w.y / innerHeight;
        }
      });
    }
  }

  function loadDimensions(work) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { work.nw = img.naturalWidth; work.nh = img.naturalHeight; resolve(work); };
      img.onerror = () => { work.nw = 800; work.nh = 600; resolve(work); };
      img.src = imageSrc(work);
    });
  }

  function createWindow(w) {
    const el = document.createElement("article");
    el.className = `window ${state.active === w.id ? "" : "inactive"} ${w.kind === "popup" ? "popup-ad" : ""} ${w.kind === "contact" ? "msn-window" : ""}`;
    el.dataset.id = w.id;
    el.style.left = `${w.x}px`; el.style.top = `${w.y}px`;
    el.style.width = `${w.w}px`; el.style.height = `${w.h}px`;
    el.style.zIndex = w.z;
    if (w.kind === "popup" || w.kind === "contact") el.style.position = "fixed";
    if (w.kind === "art") el.classList.add("frameless-art");

    if (w.kind === "popup") {
      el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        if (!el.classList.contains("explode-anim")) {
          playExplosionSound();
          el.classList.add("explode-anim");
          setTimeout(() => closeWindow(w.id), 450);
        }
      });
    } else {
      el.addEventListener("pointerdown", () => focusWin(w.id));
    }
    
    if (w.kind !== "contact" && w.kind !== "art") el.appendChild(titlebar(w));

    const body = document.createElement("div");
    body.className = "window-body";
    body.innerHTML = w.kind === "popup" ? w.content : windowBodyHTML(w);
    el.appendChild(body);
    
    bindWindowBody(el, w); return el;
  }

  function renderWindowLayer() {
    windowsEl.innerHTML = "";
    state.wins.filter(w => !w.min).sort((a, b) => a.z - b.z).forEach(w => windowsEl.appendChild(createWindow(w)));
  }

  function renderTasks() {
    taskStrip.innerHTML = "";
    state.wins.filter(w => w.kind !== "popup").forEach(w => {
      const b = document.createElement("button");
      b.className = `task-button ${state.active === w.id && !w.min ? "focused" : ""} ${w.kind === "contact" ? "task-msn" : ""}`;
      b.innerHTML = `${w.iconHtml || ""} ${w.title}`;
      b.addEventListener("click", () => { if (state.active === w.id && !w.min) { w.min = true; render(); } else focusWin(w.id, true); });
      taskStrip.appendChild(b);
    });

    let tray = $(".system-tray-container");
    if (!tray) {
       tray = document.createElement("div"); tray.className = "system-tray-container";
       tray.innerHTML = `<div class="system-tray-icons"><span title="Volume">🔊</span><span title="Wi-Fi">📶</span></div>`;
       clockEl.parentNode.insertBefore(tray, clockEl);
    }
  }
  function render() { renderWindowLayer(); renderTasks(); }

  function openByKind(kind) {
    if (kind === "folder") { addWindow("folder"); return; }
    if (kind === "crash") { bsod.classList.remove("hidden"); return; }
    if (kind === "about" || kind === "contact") addWindow(kind);
  }

  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) openByKind(open.dataset.open);
  });
  bsod.addEventListener("click", () => bsod.classList.add("hidden"));

  function nowClock() {
    if (!clockEl) return;
    const d = new Date();
    clockEl.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function triggerCrtWallpaperGlitch() {
    if (!wallpaperEl) return;
    wallpaperEl.classList.add("wallpaper-glitch-active");
    setTimeout(() => { wallpaperEl.classList.remove("wallpaper-glitch-active"); }, 1000); 
  }

  function scheduleNextGlitch() {
    triggerCrtWallpaperGlitch();
    setTimeout(scheduleNextGlitch, 40000); 
  }

  function scheduleNextCrash() {
    bsod.classList.remove("hidden");
    crashMultiplier++;
    setTimeout(scheduleNextCrash, 60000 * crashMultiplier);
  }

  // ==========================================
  // SPAWN AD: ACOPLAMENTO INTEGRAL SEM DISTORÇÃO
  // ==========================================
  function spawnAd() {
    if (CUSTOM_ADS.length === 0) return; 
    const id = "popup_" + Math.random().toString(36).slice(2, 8);
    const adImageSrc = CUSTOM_ADS[currentAdIndex];
    currentAdIndex = (currentAdIndex + 1) % CUSTOM_ADS.length;

    const img = new Image();
    img.onload = () => {
       const ratio = img.naturalWidth / img.naturalHeight;
       let targetW = 120, targetH = 120;
       
       if (ratio > 1) { targetH = targetW / ratio; } 
       else { targetW = targetH * ratio; }
       
       const adW = Math.max(65, Math.round(targetW));
       const adH = Math.max(65, Math.round(targetH));
       
       const contentHtml = `<img src="${img.src}" style="display:block; width:100%; height:100%; pointer-events:none;">`;
       
       const ad = {
          id, kind: "popup", title: "AD", iconHtml: "⚠",
          x: Math.random() * (innerWidth - adW), y: Math.random() * (innerHeight - adH - 20),
          w: adW, h: adH + 20, z: 999999, min: false, max: false,
          content: contentHtml, vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()), vy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random())
       };
       
       ad.ratioX = ad.x / innerWidth; ad.ratioY = ad.y / innerHeight;
       state.wins.push(ad); render();
       
       requestAnimationFrame(function bounce() {
          const winData = state.wins.find(w => w.id === id);
          if (!winData) return; 
          winData.x += winData.vx; winData.y += winData.vy;
          if (winData.x <= 0 || winData.x + winData.w >= innerWidth) winData.vx *= -1;
          if (winData.y <= 0 || winData.y + winData.h >= innerHeight) winData.vy *= -1;
          
          winData.ratioX = winData.x / innerWidth; winData.ratioY = winData.y / innerHeight;

          const currentEl = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
          if (currentEl && !currentEl.classList.contains("explode-anim")) { 
            currentEl.style.left = `${winData.x}px`; currentEl.style.top = `${winData.y}px`; 
          }
          requestAnimationFrame(bounce);
       });
    };
    img.src = adImageSrc;
  }

  // Intervalo estrito e cíclico inquebrável para novas Ads
  setInterval(() => {
     if (state.wins.filter(w => w.kind === "popup").length < 4) spawnAd();
  }, 25000);

  function init() {
    const W = innerWidth, H = innerHeight;
    state.manifest = generateAutomaticManifest();
    nowClock(); setInterval(nowClock, 1000);

    // COREOGRAFIA DE CRIAÇÃO E Z-INDEX INICIAIS
    if (state.manifest.works && state.manifest.works.length >= 3) {
      const w1 = state.manifest.works[0];
      const w2 = state.manifest.works[1];
      const w3 = state.manifest.works[2];

      // 1. Obras do fundo
      loadDimensions(w3).then(() => { addWindow("art", w3, { x: W * 0.02, y: H * 0.42, z: 1001 }); });
      loadDimensions(w2).then(() => { addWindow("art", w2, { x: W - 560, y: H * 0.26, z: 1001 }); });

      // 2. Janelas nativas cobrindo os cantos
      setTimeout(() => addWindow("folder", null, { z: 1002 }), 100);
      setTimeout(() => addWindow("about", null, { z: 1002 }), 200);

      // 3. Obra do centro na frente do explorer
      setTimeout(() => { loadDimensions(w1).then(() => { addWindow("art", w1, { x: W * 0.22, y: H * 0.15, z: 1003 }); }); }, 300);
    } else {
      addWindow("folder"); addWindow("about");
    }

    // 4. Ancoragem imediata e correta do MSN Toast na raiz
    setTimeout(() => {
       addWindow("contact", null, { anchor: "bottom-right", x: W - 270, y: H - 205, z: 1005 });
    }, 1000);

    setTimeout(spawnAd, 8000);
    setTimeout(scheduleNextGlitch, 40000);
    setTimeout(scheduleNextCrash, 60000);

    render();
  }

  // GERENCIADOR RESPONSIVO COMPLETO (ARRASSTA TUDO JUNTO)
  window.addEventListener("resize", () => {
    state.wins.forEach(w => {
      if (w.anchor === "bottom-right") {
         w.x = innerWidth - w.w - 20;
         w.y = innerHeight - w.h - 45;
      } else {
         w.x = clamp(w.ratioX * innerWidth, 0, innerWidth - w.w);
         w.y = clamp(w.ratioY * innerHeight, 38, innerHeight - w.h - 40);
      }
      const el = windowsEl.querySelector(`[data-id="${CSS.escape(w.id)}"]`);
      if (el) { el.style.left = `${w.x}px`; el.style.top = `${w.y}px`; }
    });
    render();
  });

  init();
})();