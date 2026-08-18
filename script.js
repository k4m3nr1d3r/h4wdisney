(() => {
  "use strict";

  // Injetando CSS: Frameless Art, Explosão Radial Realista, Drop-Shadow Inteligente
  const extraStyles = document.createElement('style');
  extraStyles.textContent = `
    /* Grade flexível para tamanhos variados e fundo transparente */
    .file-grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 15px; justify-content: flex-start; align-items: flex-end; background: #ffffff; min-height: 100%; }
    .image-entry { display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid transparent; background: transparent !important; cursor: pointer; padding: 6px; border-radius: 2px; color: #000; max-width: 130px; }
    
    .image-entry:hover { background: #e5f3ff !important; border: 1px solid #d8ebf9 !important; }
    .image-entry.selected { background: #cce8ff !important; border: 1px solid #99d1ff !important; }
    
    .work-thumb { width: auto; height: auto; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; background: transparent !important; }
    
    /* Drop-Shadow recorta perfeitamente PNGs sem fundo */
    .work-thumb img { max-width: 100px; max-height: 80px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4)); }
    
    /* JANELA DE ARTE FLUTUANTE (Frameless) */
    .frameless-art { background: transparent !important; border: none !important; box-shadow: none !important; overflow: visible !important; }
    .frameless-art .window-body { height: 100% !important; background: transparent !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; border: none !important; }
    
    .art-plate { overflow: visible; position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: transparent; }
    .art-plate img { touch-action: none; transition: transform 0.05s linear; max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(3px 3px 12px rgba(0,0,0,0.8)); }
    
    /* O Botão 'X' vermelho solto */
    .close-art { position: absolute; top: -15px; right: -15px; background: #e81123; color: #fff; border: 1px solid #fff; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); width: 26px; height: 26px; font-family: sans-serif; font-weight: bold; cursor: pointer; z-index: 100000; display: flex; align-items: center; justify-content: center; border-radius: 2px; }
    .close-art:hover { background: #ff0000; }
    
    /* POPUP ADS QUE SE ADAPTAM */
    .popup-ad { cursor: crosshair; border: 2px outset #dfdfdf; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); z-index: 999999 !important; overflow: visible !important; }
    .popup-ad .window-body { padding: 0 !important; margin: 0; width: 100% !important; height: calc(100% - 20px) !important; overflow: hidden; pointer-events: none; background: #fff; }
    .popup-ad .titlebar { height: 20px; font-size: 11px; }
    
    /* EXPLOSÃO RADIAL 8-BITS + EVAPORAÇÃO */
    @keyframes pixelExplosion {
      0% { box-shadow: 0 0 0 10px #fff, 0 0 0 20px #ffeb3b; background: #fff; transform: scale(0.5); opacity: 1; filter: contrast(1) blur(0px); }
      20% { box-shadow: 0 0 0 15px #fff, 0 0 0 30px #ffeb3b, 0 0 0 45px #ff9800, -25px -25px 0 5px #ffeb3b, 25px 25px 0 5px #ffeb3b, -25px 25px 0 5px #ffeb3b, 25px -25px 0 5px #ffeb3b; background: #fff; border: none; transform: scale(1); filter: contrast(2) blur(1px) hue-rotate(45deg); }
      40% { box-shadow: 0 0 0 20px #ffeb3b, 0 0 0 40px #ff9800, 0 0 0 60px #f44336, -50px -50px 0 8px #ff9800, 50px 50px 0 8px #ff9800, -50px 50px 0 8px #ff9800, 50px -50px 0 8px #ff9800, 0 -70px 0 6px #ffeb3b, 0 70px 0 6px #ffeb3b, -70px 0 0 6px #ffeb3b, 70px 0 0 6px #ffeb3b; background: #ffeb3b; border: none; transform: scale(1.2); filter: contrast(3) blur(2px) hue-rotate(90deg); opacity: 0.8; }
      60% { box-shadow: 0 0 0 20px #ff9800, 0 0 0 40px #f44336, -80px -80px 0 6px #f44336, 80px 80px 0 6px #f44336, -80px 80px 0 6px #f44336, 80px -80px 0 6px #f44336, 0 -100px 0 5px #ff9800, 0 100px 0 5px #ff9800, -100px 0 0 5px #ff9800, 100px 0 0 5px #ff9800, -50px -90px 0 4px #ccc, 50px 90px 0 4px #ccc, 90px 50px 0 4px #ccc; background: transparent; border: none; transform: scale(1.4); opacity: 0.5; filter: contrast(4) blur(3px) hue-rotate(180deg); }
      80% { box-shadow: 0 0 0 20px #f44336, -110px -110px 0 4px #f44336, 110px 110px 0 4px #f44336, -110px 110px 0 4px #f44336, 110px -110px 0 4px #f44336, 0 -130px 0 3px #f44336, 0 130px 0 3px #f44336, -130px 0 0 3px #f44336, 130px 0 0 3px #f44336, -70px -120px 0 3px #ccc, 70px 120px 0 3px #ccc; background: transparent; border: none; transform: scale(1.6); opacity: 0.2; }
      100% { box-shadow: none; background: transparent; transform: scale(2); opacity: 0; display: none; filter: none; }
    }
    .explode-anim {
      animation: pixelExplosion 0.5s steps(6) forwards !important;
      pointer-events: none; border: none !important;
    }
    .explode-anim .titlebar { display: none !important; }
    
    .msn-window { border-radius: 8px !important; background: linear-gradient(to bottom, #E6F0FA 0%, #CDE0F5 40%, #A4CBF0 100%) !important; border: 1px solid #6E98C7 !important; box-shadow: 2px 2px 10px rgba(0,0,0,0.4) !important; transition: height 0.2s ease-in-out; }
    .msn-window .titlebar { display: none !important; }
    .task-msn { background: linear-gradient(to bottom, #E6F0FA, #A4CBF0) !important; border: 1px solid #6E98C7 !important; color: #000 !important; }
    
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
  let adMultiplier = 1;
  let adSequenceIndex = 1; // De 1 a 10

  function getIcon(name, fallbackEmoji) {
    return `<img src="assets/icons/${name}.png" onerror="this.outerHTML='<span>${fallbackEmoji}</span>'" alt="" style="width:16px; height:16px; object-fit:contain; vertical-align:middle; margin-right:4px;">`;
  }

  function asset(file) { return String(file).split("/").map(encodeURIComponent).join("/"); }
  function imageSrc(item) { return item?.source || asset(item?.file || ""); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[m])); }

  // ==========================================
  // CÉREBRO AUTOMÁTICO (1 a 15 arquivos por pasta)
  // ==========================================
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
    if (kind === "folder") return { x: W * .09, y: H * .23, w: 600, h: 420 };
    if (kind === "contact") return { x: clamp(W - 280, 50, W - 260), y: clamp(H * 0.1, 50, H - 200), w: 250, h: 160 }; 
    if (kind === "about") return { x: clamp(W - 420, 80, W - 390), y: clamp(H * 0.25, 80, H - 250), w: 390, h: 392 };
    
    if (kind === "art" && work) {
      const nw = Number(work.nw) || 800; const nh = Number(work.nh) || 600;
      const scale = Math.min(clamp(W * .5, 300, 800) / nw, (H * 0.7) / nh, 1.2);
      return {
        x: clamp(W * .2, 50, Math.max(50, W - 400)), y: clamp(H * .1, 50, Math.max(50, H - 300)),
        w: Math.max(200, Math.round(nw * scale)), h: Math.round(nh * scale)
      };
    }
    const n = state.cascade++;
    return { x: 180 + (n % 6) * 46, y: 120 + (n % 6) * 38, w: 350, h: 250 };
  }

  function addWindow(kind, work = null, opts = {}) {
    const existing = state.wins.find(w => w.kind === kind && (!work || (w.work && w.work.id === work.id)));
    if (existing) { focusWin(existing.id); return; }

    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;
    const titleMap = { folder: "C:\\h4wnee", about: "about_h4wnee.txt", contact: "Windows Live Messenger" };
    const iconHtml = work ? getIcon("art", "🖼") : getIcon(kind, ({ folder: "📁", about: "🗒", contact: "👥" }[kind]));
    
    const win = {
      id, kind, title: work ? (work.file || work.title) : titleMap[kind],
      iconHtml,
      ...defaultGeometry(kind, work), z: ++state.top, min: false, max: false,
      work, browserPath: [], browserHistory: [[]], ...opts
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
    
    w.z = ++state.top + (w.kind === "art" ? 90000 : 0); 
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
      const dx = ev.clientX - start.px; const dy = ev.clientY - start.py;
      if (mode === "move" && !w.max) {
        w.x = clamp(start.x + dx, 96 - w.w + 140, innerWidth - 60);
        w.y = clamp(start.y + dy, 38, innerHeight - 70);
      }
      if (mode === "size" && !w.max) {
        w.w = Math.max(200, start.width + dx);
        w.h = Math.max(150, start.height + dy);
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
        <div class="work-thumb"><img src="${escapeHtml(imageSrc(item))}" alt="" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'50\\' height=\\'50\\'><rect width=\\'50\\' height=\\'50\\' fill=\\'%23eee\\'/></svg>'"></div>
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

    // ==========================================
    // JANELA DE OBRAS (FRAMELESS, SEM BARRA)
    // ==========================================
    if (w.kind === "art") {
      return `
        <div class="art-plate">
          <img src="${imageSrc(w.work)}" alt="${escapeHtml(w.title)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'600\\'><rect width=\\'800\\' height=\\'600\\' fill=\\'%23333\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23fff\\' font-family=\\'sans-serif\\' font-size=\\'24\\' text-anchor=\\'middle\\'>Imagem n\u00E3o encontrada</text></svg>'">
          <button class="close-art" data-act="close">X</button>
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
         if (!e.target.closest("button") && !e.target.closest("a") && !e.target.closest("textarea")) beginPointer(e, w.id, "move");
       });
       $$('[data-act="close"]', el).forEach(btn => btn.addEventListener("click", e => {
         e.preventDefault(); e.stopPropagation(); closeWindow(w.id);
       }));
       
       const toggleBtn = $(".msg-toggle", el);
       const expandArea = $(".msn-expand", el);
       const sendBtn = $(".send-msg", el);
       const textArea = $("textarea", el);

       toggleBtn.addEventListener("click", e => {
           e.preventDefault(); e.stopPropagation();
           const isExpanded = expandArea.style.display !== "none";
           expandArea.style.display = isExpanded ? "none" : "block";
           w.h = isExpanded ? 160 : 255; el.style.height = `${w.h}px`;
       });

       sendBtn.addEventListener("click", () => {
           if(textArea.value.trim() === "") return;
           expandArea.style.display = "none"; w.h = 160; el.style.height = `${w.h}px`; textArea.value = "";
           alert("Mensagem enviada com sucesso!");
       });
    }

    if (w.kind === "art") {
      const img = $(".art-plate img", el);
      let scale = 1, panX = 0, panY = 0, isDragging = false, startX, startY;

      // Botão X
      $$('.close-art', el).forEach(btn => btn.addEventListener("click", e => {
         e.preventDefault(); e.stopPropagation(); closeWindow(w.id);
      }));

      img.addEventListener("wheel", e => {
        if (e.altKey) {
          e.preventDefault();
          scale += e.deltaY * -0.002;
          scale = Math.min(Math.max(0.5, scale), 5);
          img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
          img.style.cursor = scale > 1 ? "grab" : "default";
        }
      });

      img.addEventListener("pointerdown", e => {
        if (scale > 1) {
          isDragging = true;
          startX = e.clientX - panX;
          startY = e.clientY - panY;
          img.setPointerCapture(e.pointerId);
          img.style.cursor = "grabbing";
        }
      });
      img.addEventListener("pointermove", e => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      });
      img.addEventListener("pointerup", e => {
        isDragging = false;
        img.releasePointerCapture(e.pointerId);
        img.style.cursor = scale > 1 ? "grab" : "default";
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
    if (w.kind === "popup") el.style.position = "fixed";
    
    // Adiciona classe para remover totalmente bordas nas artes
    if (w.kind === "art") el.classList.add("frameless-art");

    // CLIQUE PARA EXPLOSÃO NAS ADS
    if (w.kind === "popup") {
      el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        if (!el.classList.contains("explode-anim")) {
          el.classList.add("explode-anim");
          setTimeout(() => closeWindow(w.id), 490);
        }
      });
      // Suporte extra para Touch Mobile
      el.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        if (!el.classList.contains("explode-anim")) {
          el.classList.add("explode-anim");
          setTimeout(() => closeWindow(w.id), 490);
        }
      }, {passive: true});
    } else {
      el.addEventListener("pointerdown", () => focusWin(w.id));
    }
    
    // Apenas pastas ganham barra
    if (w.kind !== "contact" && w.kind !== "popup" && w.kind !== "art") {
        el.appendChild(titlebar(w));
    } else if (w.kind === "popup") {
        // Popups recebem o titlebar interno com X
        el.appendChild(titlebar(w));
    }

    const body = document.createElement("div");
    body.className = "window-body";
    body.innerHTML = w.kind === "popup" ? w.content : windowBodyHTML(w);
    el.appendChild(body);

    if (!w.max && w.kind !== "popup" && w.kind !== "contact" && w.kind !== "art") {
      const grip = document.createElement("div");
      grip.className = "resize-grip";
      grip.addEventListener("pointerdown", e => { e.stopPropagation(); beginPointer(e, w.id, "size"); });
      el.appendChild(grip);
    }
    
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
    setTimeout(() => {
      wallpaperEl.classList.remove("wallpaper-glitch-active");
    }, 1000); 
  }

  function scheduleNextGlitch() {
    triggerCrtWallpaperGlitch();
    setTimeout(scheduleNextGlitch, 40000); 
  }

  function scheduleNextCrash() {
    bsod.classList.remove("hidden");
    crashMultiplier++;
    const nextDelay = 60000 * crashMultiplier;
    setTimeout(scheduleNextCrash, nextDelay);
  }

  // ==========================================
  // PROPAGANDAS INTELIGENTES (GIF ou PNG) + BARRINHA DE TÍTULO
  // ==========================================
  function spawnAd() {
    const id = "popup_" + Math.random().toString(36).slice(2, 8);
    const numStr = String(adSequenceIndex).padStart(2, '0');
    adSequenceIndex = adSequenceIndex >= 10 ? 1 : adSequenceIndex + 1;
    
    const img = new Image();
    let isGif = true;

    img.onload = () => {
       // Calcula escala para manter a proporção com tamanho máximo adaptado
       const scale = Math.min(140 / img.naturalWidth, 140 / img.naturalHeight, 1);
       const adW = Math.max(90, img.naturalWidth * scale);
       const adH = Math.max(90, img.naturalHeight * scale);
       
       const contentHtml = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#fff; overflow:hidden;"><img src="${img.src}" style="width:100%; height:100%; object-fit:contain; background:transparent; pointer-events:none;"></div>`;
       
       const ad = {
          id, kind: "popup", title: "AD", iconHtml: "⚠",
          x: Math.random() * (innerWidth - adW), y: Math.random() * (innerHeight - adH - 25),
          w: adW, h: adH + 20, z: 999999, min: false, max: false,
          content: contentHtml, vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()), vy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random())
       };
       state.wins.push(ad); render();
       
       requestAnimationFrame(function bounce() {
          const winData = state.wins.find(w => w.id === id);
          if (!winData) return; 
          winData.x += winData.vx; winData.y += winData.vy;
          if (winData.x <= 0 || winData.x + winData.w >= innerWidth) winData.vx *= -1;
          if (winData.y <= 0 || winData.y + winData.h >= innerHeight) winData.vy *= -1;
          const currentEl = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
          if (currentEl && !currentEl.classList.contains("explode-anim")) { 
            currentEl.style.left = `${winData.x}px`; currentEl.style.top = `${winData.y}px`; 
          }
          requestAnimationFrame(bounce);
       });
    };

    img.onerror = () => {
       if (isGif) {
           isGif = false;
           img.src = `assets/ads/${numStr}.png`; // Tenta PNG se o GIF não existir
       }
    };
    img.src = `assets/ads/${numStr}.gif`; // Tenta GIF primeiro
  }

  function scheduleNextAd() {
    if (state.wins.filter(w => w.kind === "popup").length < 4) spawnAd();
    adMultiplier++;
    const nextAdDelay = 45000 * adMultiplier; // Intervalos gigantes: 45s, 90s, 135s
    setTimeout(scheduleNextAd, nextAdDelay);
  }

  function init() {
    state.manifest = generateAutomaticManifest();
    nowClock(); setInterval(nowClock, 1000);

    addWindow("folder"); 
    
    if (state.manifest.works && state.manifest.works.length > 0) {
      const firstWork = state.manifest.works[0];
      loadDimensions(firstWork).then(() => addWindow("art", firstWork));
    }

    addWindow("contact"); addWindow("about");   

    // Dispara a primeira AD após 8 segundos
    setTimeout(spawnAd, 8000);
    
    setTimeout(scheduleNextAd, 45000);
    setTimeout(scheduleNextGlitch, 40000);
    setTimeout(scheduleNextCrash, 60000);

    render();
  }
  
  init();
})();