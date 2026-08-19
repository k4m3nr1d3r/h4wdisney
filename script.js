(() => {
  "use strict";

  // MAPA DOS ÍCONES (01 a 05)
  const iconMap = {
      "folder": "01",
      "about": "02",
      "contact": "03",
      "crash": "04",
      "art": "05"
  };

  // ==========================================
  // O RADAR NÍVEL DEUS
  // ==========================================
  window.getPathsToTest = function(baseFile) {
      const exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'];
      const doubleExts = ['png.png', 'jpg.jpg', 'jpeg.jpeg']; 
      const allExts = exts.concat(doubleExts);
      
      let parts = baseFile.split('/');
      let filename = parts.pop(); 
      let folder = parts.join('/'); 

      let folders = [folder, 'assets/' + folder, folder.toLowerCase(), folder.toUpperCase()];
      
      if (folder.includes('exhibiti0ns')) {
          folders.push(folder.replace('exhibiti0ns', 'exhibiti0n'));
          folders.push(folder.replace('exhibiti0ns', 'exhibitions'));
      }
      if (folder.includes('ACERVO')) {
          folders.push(folder.replace('ACERVO', 'acervo'));
          folders.push(folder.replace('ACERVO', 'Obras'));
      }
      if (folder.includes('archives')) {
          folders.push(folder.replace('archives', 'Archives'));
          folders.push(folder.replace('archives', 'ARCHIVES'));
          folders.push(folder.replace('archives', 'beck_END'));
      }

      let files = [filename];
      if (filename.startsWith('0')) files.push(filename.substring(1));
      else if (filename.length === 1) files.push('0' + filename);
      
      let paths = [];
      [...new Set(folders)].forEach(f => {
          files.forEach(file => {
              allExts.forEach(ext => {
                  paths.push(f + '/' + file + '.' + ext);
              });
          });
      });
      return paths;
  };

  window.handleThumbErr = function(img) {
     let step = parseInt(img.dataset.step || "0");
     let rawPath = img.dataset.filepath.replace(/\.[a-zA-Z0-9]+$/i, '');
     let paths = window.getPathsToTest(rawPath);
     
     if (step < paths.length) {
         img.dataset.step = step + 1;
         img.src = paths[step].split("/").map(encodeURIComponent).join("/");
     } else {
         let btn = img.closest('.image-entry');
         if (btn) btn.style.display = 'none';
     }
  };

  let metaViewport = document.querySelector('meta[name="viewport"]');
  if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = "viewport";
      document.head.appendChild(metaViewport);
  }
  metaViewport.setAttribute('content', 'width=1280, user-scalable=yes');

  const extraStyles = document.createElement('style');
  extraStyles.textContent = `
    .file-grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 15px; justify-content: flex-start; align-items: flex-end; background: #ffffff; min-height: 100%; }
    .image-entry { display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid transparent; background: transparent !important; cursor: pointer; padding: 8px; border-radius: 2px; color: #000; max-width: 130px; touch-action: manipulation; }
    
    @media (hover: hover) { .image-entry:hover { background: #e5f3ff !important; border: 1px solid #d8ebf9 !important; } }
    .image-entry:active { background: #cce8ff !important; border: 1px solid #99d1ff !important; }
    .image-entry.selected { background: #cce8ff !important; border: 1px solid #99d1ff !important; }
    
    .work-thumb { width: auto; height: auto; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; background: transparent !important; }
    .work-thumb img { max-width: 100px; max-height: 80px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4)); }
    
    .frameless-art { background: transparent !important; background-image: none !important; border: none !important; box-shadow: none !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; outline: none !important; }
    .frameless-art .window-body { height: auto !important; background: transparent !important; background-image: none !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
    .frameless-art:before, .frameless-art:after { display: none !important; }
    
    .art-plate { overflow: visible; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: transparent !important; border: none !important; box-shadow: none !important; width: 100%; height: 100%; }
    .img-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.05s linear; cursor: pointer; background: transparent !important; border: none !important; box-shadow: none !important; touch-action: none; }
    .img-wrapper img { display: block; touch-action: none; max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(3px 3px 12px rgba(0,0,0,0.8)); background: transparent !important; border: none !important; }
    
    .close-art { position: absolute; top: -12px; right: -12px; background: #e81123; color: #fff; border: 1px solid #fff; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); width: 24px; height: 26px; font-family: sans-serif; font-weight: bold; cursor: pointer; z-index: 100000; display: flex; align-items: center; justify-content: center; border-radius: 2px; touch-action: manipulation; }
    .close-art:hover { background: #ff0000; }
    
    .nav-art { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: #fff; border: 1px solid rgba(255,255,255,0.5); width: 34px; height: 34px; font-size: 16px; font-weight: bold; cursor: pointer; z-index: 100001; border-radius: 50%; display: flex; align-items: center; justify-content: center; touch-action: manipulation; transition: background 0.2s, transform 0.1s; box-shadow: 0 2px 5px rgba(0,0,0,0.5); padding-bottom: 2px; }
    .nav-art:hover { background: rgba(255,255,255,0.9); color: #000; }
    .nav-art:active { transform: translateY(-50%) scale(0.9); }
    .prev-art { left: -45px; }
    .next-art { right: -45px; }
    @media (max-width: 768px) { .prev-art { left: -15px; } .next-art { right: -15px; } }
    
    .art-instruction { margin-top: 8px; font-family: 'Archivo', sans-serif; font-size: 11px; font-weight: bold; color: #fff; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; pointer-events: none; text-align: center; width: 100%; }
    
    /* ABOUT */
    .glass-about { background: rgba(255, 255, 255, 0.35) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border: 1px solid rgba(255, 255, 255, 0.6) !important; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important; }
    .glass-about .window-body { background: transparent !important; border: none !important; display: block !important; width: 100% !important; height: 100% !important; text-align: left !important; overflow: hidden; }
    .glass-about .titlebar { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.3) !important; color: #000 !important; text-shadow: 0 0 5px rgba(255,255,255,0.8); text-align: left !important; }
    
    .about-content-box { text-align: left !important; padding: 25px !important; color: #000; text-shadow: 0 1px 2px rgba(255,255,255,0.8); font-family: 'Segoe UI', Tahoma, sans-serif; display: block !important; width: 100% !important; box-sizing: border-box; height: 100%; overflow-y: auto; }
    .about-content-box * { text-align: left !important; justify-content: flex-start !important; align-items: flex-start !important; }
    .about-content-box h2 { font-size: 24px; margin-bottom: 15px; margin-top: 0; text-align: left !important; width: 100%; display: block; }
    .about-content-box p { font-size: 14px; margin-bottom: 20px; line-height: 1.5; text-align: left !important; width: 100%; display: block; }
    .about-content-box .chronology { font-family: monospace; font-size: 13px; line-height: 1.8; background: transparent; padding: 0; border-radius: 0; text-align: left !important; display: block; width: 100%; }
    
    /* ======================================================= */
    /* ESTILOS DE PROPAGANDAS E PUBLI (ADS) E HOLOGRAMA MÁGICO */
    /* ======================================================= */
    .popup-ad { cursor: crosshair; overflow: visible !important; background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
    .popup-ad .window-body { padding: 0 !important; margin: 0 !important; width: 100% !important; height: 100% !important; overflow: visible; pointer-events: none; background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; }
    .popup-ad .window-body img { display: block; width: 100%; height: 100%; object-fit: contain !important; background: transparent !important; filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.5)); }
    
    .publi-ad { cursor: pointer; overflow: visible !important; background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; position: fixed !important; }
    .publi-ad .window-body { padding: 0 !important; margin: 0 !important; width: 100% !important; height: 100% !important; overflow: visible; background: transparent !important; border: none !important; display: flex; align-items: center; justify-content: center; }
    
    @keyframes publiFloat {
        0% { transform: translateY(0px); filter: drop-shadow(3px 3px 15px rgba(255,255,255,0.3)); }
        50% { transform: translateY(18px); filter: drop-shadow(3px 3px 35px rgba(255,255,255,1)); }
        100% { transform: translateY(0px); filter: drop-shadow(3px 3px 15px rgba(255,255,255,0.3)); }
    }
    .publi-ad .window-body img {
        display: block; width: 100%; height: 100%; object-fit: contain !important; 
        background: transparent !important; pointer-events: none;
        animation: publiFloat 4.5s ease-in-out infinite;
    }
    
    @keyframes realisticPixelExplosion {
      0% { box-shadow: 0 0 0 4px #fff, 0 0 0 8px #ffeb3b; background: transparent; transform: scale(0.6); opacity: 1; }
      35% { box-shadow: 0 -16px 0 3px #fff, 0 16px 0 3px #fff, 16px 0 0 3px #fff, -16px 0 0 3px #fff, -12px -12px 0 4px #ffeb3b, 12px 12px 0 4px #ffeb3b, -12px 12px 0 4px #ffeb3b, 12px -12px 0 4px #ffeb3b, 0 -25px 0 3px #ff9800, 0 25px 0 3px #ff9800; transform: scale(1.1); opacity: 1; border: none; }
      70% { box-shadow: 0 -32px 0 4px #ff9800, 0 32px 0 4px #ff9800, 32px 0 4px #ff9800, -32px 0 4px #ff9800, -22px -22px 0 4px #f44336, 22px 22px 0 4px #f44336, -22px 22px 0 4px #f44336, 22px -22px 0 4px #f44336, -36px -36px 0 3px #ffeb3b, 36px 36px 0 3px #ffeb3b, 0 -45px 0 4px #f44336; transform: scale(1.4); opacity: 0.8; border: none; }
      100% { box-shadow: 0 -40px 0 1px rgba(211,47,47,0), 0 40px 0 1px rgba(211,47,47,0), -30px -30px 0 1px rgba(255,152,0,0), 30px 30px 0 1px rgba(255,152,0,0); transform: scale(1.6); opacity: 0; display: none; border: none; }
    }
    .explode-anim { pointer-events: none !important; background: transparent !important; border: none !important; box-shadow: none !important; }
    .explode-anim .window-body { display: none !important; } 
    .explode-anim::after { content: ""; position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; margin-top: -2px; margin-left: -2px; animation: realisticPixelExplosion 0.45s steps(5) forwards; }
    
    @keyframes msnSlideIn { 0% { transform: translateY(250px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    .msn-window { position: fixed !important; border-radius: 8px !important; background: linear-gradient(to bottom, #E6F0FA 0%, #CDE0F5 40%, #A4CBF0 100%) !important; border: 1px solid #6E98C7 !important; box-shadow: 2px 2px 10px rgba(0,0,0,0.4) !important; animation: msnSlideIn 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; transition: height 0.15s ease-in-out, top 0.15s ease-in-out, left 0.15s ease-in-out; }
    .msn-window .titlebar { display: none !important; }
    .task-msn { background: linear-gradient(to bottom, #E6F0FA, #A4CBF0) !important; border: 1px solid #6E98C7 !important; color: #000 !important; }
    
    .taskbar { display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; padding: 0 10px; }
    .task-strip { flex: 1; display: flex; gap: 4px; overflow: hidden; margin: 0 10px; min-width: 0; }
    .task-button { flex: 0 1 140px; min-width: 35px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .system-tray-container { display: flex; align-items: center; gap: 8px; flex-shrink: 0; background: linear-gradient(to bottom, #0c82dc, #045cc0); padding: 0 8px; height: 100%; border-left: 1px solid #08449c; }
    .system-tray-icons { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #fff; cursor: default; }
    
    @keyframes crtWallpaperGlitch {
      0% { transform: scale(1) translate(0,0) skewX(0); filter: none; }
      20% { transform: scale(1.02) translate(-3px, 2px) skewX(2deg); filter: hue-rotate(90deg) contrast(1.5) saturate(1.8); }
      40% { transform: scale(0.99) translate(4px, -3px) skewX(-3deg); filter: hue-rotate(-45deg) brightness(1.3) contrast(1.7); }
      65% { transform: scale(1.03) translate(-1px, -1px) skewY(1deg); filter: invert(0.05) hue-rotate(140deg); }
      85% { transform: scale(1) translate(2px, 1px) skewX(4deg); filter: brightness(1.5) contrast(1.2); }
      100% { transform: scale(1) translate(0,0) skewX(0); filter: none; }
    }
    .wallpaper-glitch-active { animation: crtWallpaperGlitch 0.9s steps(6) forwards !important; }
    @keyframes crtLinesOscillation { 0% { transform: translateY(0px); opacity: 0.94; } 50% { transform: translateY(1.5px); opacity: 1; } 100% { transform: translateY(0px); opacity: 0.94; } }
    .crt::after { animation: crtLinesOscillation 0.18s steps(2) infinite !important; }
    
    @keyframes logoRgbShake {
      0% { transform: translate(0, 0) skewX(0deg); filter: none; }
      15% { transform: translate(-4px, 2px) skewX(3deg); filter: drop-shadow(3px 0 0 #ff0055) drop-shadow(-3px 0 0 #00f0ff) contrast(1.5); }
      30% { transform: translate(3px, -3px) skewX(-4deg); filter: drop-shadow(-2px 0 0 #ff0055) drop-shadow(2px 0 0 #00f0ff) brightness(1.3); }
      45% { transform: translate(-2px, -1px) skewY(2deg); filter: drop-shadow(4px 0 0 #ff0055) drop-shadow(-4px 0 0 #00f0ff) contrast(1.8); }
      60% { transform: translate(3px, 3px) skewX(5deg); filter: drop-shadow(-3px 0 0 #ff0055) drop-shadow(3px 0 0 #00f0ff) hue-rotate(30deg); }
      75% { transform: translate(-1px, -2px) skewX(-2deg); filter: drop-shadow(2px 0 0 #ff0055) drop-shadow(-2px 0 0 #00f0ff); }
      100% { transform: translate(0, 0) skewX(0deg); filter: none; }
    }
    .logo-shake-active { animation: logoRgbShake 0.45s steps(4) forwards !important; }
    #bsod { z-index: 999999999 !important; }
  `;
  document.head.appendChild(extraStyles);

  const FOLDER_SVG = `<svg width="50" height="50" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));"><path d="M40 12H22L18 6H8C5.8 6 4 7.8 4 10V38C4 40.2 5.8 42 8 42H40C42.2 42 44 40.2 44 38V16C44 13.8 42.2 12 40 12Z" fill="#F4D03F" stroke="#D68910" stroke-width="2" stroke-linejoin="round"/><path d="M4 16H44" stroke="#D68910" stroke-width="2"/></svg>`;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const state = { wins: [], top: 1000, focusedTop: 10000, active: null, menuOpen: false, cascade: 0, manifest: null, browserPath: [] };
  let adZCounter = 5000; 
  
  const windowsEl = $("#windows") || document.body;
  const taskStrip = $("#taskStrip");
  const bsod = $("#bsod");
  const clockEl = $("#clock");
  const wallpaperEl = $(".wallpaper");
  const logoEl = $(".brand-logo");

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
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.35);
    } catch(_) {}
  }

  document.addEventListener("click", () => {
    if (!msnNotified) { playMsnSound(); msnNotified = true; }
  }, { once: true });
  document.addEventListener("touchstart", () => {
    if (!msnNotified) { playMsnSound(); msnNotified = true; }
  }, { once: true });

  // ÍCONES DAS JANELAS PUXADOS DO MAPA DINÂMICO
  function getIcon(name, fallbackEmoji) {
    const num = iconMap[name] || "01";
    return `<img src="assets/icons/${num}.png" data-filepath="assets/icons/${num}.png" onerror="window.handleThumbErr(this)" alt="" style="width:16px; height:16px; object-fit:contain; vertical-align:middle; margin-right:4px;">`;
  }

  // ==========================================
  // O ORGANIZADOR DE ÍCONES DO DESKTOP (AUTO-FIX)
  // Espalha os ícones no canto superior esquerdo aleatoriamente e troca os nomes
  // ==========================================
  function arrangeDesktopIcons() {
      const icons = document.querySelectorAll('[data-open]');
      const positions = [
          { top: '30px', left: '40px' },
          { top: '150px', left: '20px' },
          { top: '260px', left: '60px' },
          { top: '380px', left: '30px' },
          { top: '500px', left: '50px' }
      ];
      
      Array.from(icons).forEach((icon, idx) => {
          icon.style.position = 'absolute';
          icon.style.top = positions[idx % positions.length].top;
          icon.style.left = positions[idx % positions.length].left;
          
          const kind = icon.dataset.open;
          const num = iconMap[kind] || String(idx+1).padStart(2, '0');
          
          const img = icon.querySelector('img');
          if (img) {
              img.dataset.filepath = `assets/icons/${num}.png`;
              img.dataset.step = "0";
              img.src = `assets/icons/${num}.png`;
              img.setAttribute("onerror", "window.handleThumbErr(this)");
          }
      });
  }

  function asset(file) { return String(file).split("/").map(encodeURIComponent).join("/"); }
  function imageSrc(item) { return item?.source || asset(item?.file || ""); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[m])); }

  function generateAutomaticManifest() {
    const buildItems = (folderPath, type) => {
      return Array.from({ length: 15 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return { id: `${folderPath}/${num}.png`, file: `${folderPath}/${num}.png`, title: `${num}`, type: type };
      });
    };
    return {
      version: 1,
      exhibitions: [
        { id: "exhibiti0ns:utopias_piratas_2021", name: "utopias_piratas_2021", year: 2021, items: buildItems("exhibiti0ns/utopias_piratas_2021", "exhibiti0ns") },
        { id: "exhibiti0ns:Hyperlinks, Distortion e Mormasso", name: "Hyperlinks, Distortion e Mormasso", year: 2022, items: buildItems("exhibiti0ns/Hyperlinks, Distortion e Mormasso", "exhibiti0ns") },
        { id: "exhibiti0ns:RAW 2025 (HOA+FDAG)", name: "RAW 2025 (HOA+FDAG)", year: 2025, items: buildItems("exhibiti0ns/RAW 2025 (HOA+FDAG)", "exhibiti0ns") }
      ],
      acervo: buildItems("ACERVO", "ACERVO"),
      archives: buildItems("archives", "archives")
    };
  }

  function allItems() { return [...state.manifest.exhibitions.flatMap(g => g.items), ...state.manifest.acervo, ...state.manifest.archives]; }
  function findItem(id) { return allItems().find(item => item.id === id); }
  
  function getSiblings(id) {
    if (!state.manifest) return null;
    for (const ex of state.manifest.exhibitions) {
      const idx = ex.items.findIndex(i => i.id === id);
      if (idx !== -1) return { list: ex.items, index: idx };
    }
    let idx = state.manifest.acervo.findIndex(i => i.id === id);
    if (idx !== -1) return { list: state.manifest.acervo, index: idx };
    
    idx = state.manifest.archives.findIndex(i => i.id === id);
    if (idx !== -1) return { list: state.manifest.archives, index: idx };
    return null;
  }

  function browserRoot() { return { kind: "root", name: "C:\\h4wnee", path: [] }; }

  function currentBrowser(win) {
    const path = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (path.length === 0) return browserRoot();
    if (path[0] === "exhibiti0ns") {
      if (path.length === 1) return { kind: "exhibiti0ns", name: "exhibiti0ns", path };
      const name = path.slice(1).join("/");
      const group = state.manifest.exhibitions.find(x => x.name === name);
      return group ? { kind: "exhibition", name: group.name, path, group } : { kind: "exhibiti0ns", name: "exhibiti0ns", path: ["exhibiti0ns"] };
    }
    if (path[0] === "ACERVO") return { kind: "ACERVO", name: "ACERVO", path };
    if (path[0] === "archives") return { kind: "archives", name: "archives", path };
    win.browserPath = []; return browserRoot();
  }

  function folderEntries() {
    return [
      { type: "folder", id: "exhibiti0ns", name: "exhibiti0ns", subtitle: `3 exposições` },
      { type: "folder", id: "ACERVO", name: "ACERVO", subtitle: `15 arquivos` },
      { type: "folder", id: "archives", name: "archives", subtitle: `15 arquivos` }
    ];
  }

  function defaultGeometry(kind, work = null, opts = {}) {
    const W = innerWidth, H = innerHeight;
    const n = state.cascade++;
    
    if (kind === "folder") return { x: W * 0.05, y: H * 0.23, w: Math.min(600, W * 0.8), h: Math.min(420, H * 0.7) };
    
    if (kind === "about") {
       const aW = Math.min(320, W * 0.9);
       const aH = 350; 
       return { x: clamp(W - aW - 20, 10, W - aW), y: clamp(H * 0.15, 10, H - aH), w: aW, h: aH };
    }
    
    if (kind === "contact") return { x: W - 270, y: H - 205, w: 250, h: 160 }; 
    
    if (kind === "art" && work) {
      const nw = Number(work.nw) || 800; const nh = Number(work.nh) || 600;
      
      let scaleFactorW = opts.isInit ? 0.35 : 0.85;
      let scaleFactorH = opts.isInit ? 0.50 : 0.85;
      
      const scale = Math.min(clamp(W * scaleFactorW, 150, W), (H * scaleFactorH) / nh, 2);
      const artW = Math.max(150, Math.round(nw * scale));
      const artH = Math.round(nh * scale);
      
      if (opts.isInit) {
         // Obras iniciais
         if (work.title === "01") return { x: W * 0.22, y: H * 0.15, w: artW, h: artH, initZ: 1002 };
         if (work.title === "02") return { x: Math.max(10, W - artW - 40), y: H * 0.28, w: artW, h: artH, initZ: 1001 }; 
         if (work.title === "03") return { x: W * 0.02, y: H * 0.42, w: artW, h: artH, initZ: 1001 }; 
      }
      return { x: clamp((W - artW) / 2, 0, W), y: clamp((H - artH) / 2, 0, H), w: artW, h: artH };
    }
    return { x: 180 + (n % 6) * 46, y: 120 + (n % 6) * 38, w: Math.min(350, W * 0.8), h: Math.min(250, H * 0.8) };
  }

  function addWindow(kind, work = null, opts = {}) {
    const existing = state.wins.find(w => w.kind === kind && (!work || (w.work && w.work.id === work.id)));
    if (existing) { focusWin(existing.id); return; }

    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;
    const titleMap = { folder: "C:\\h4wnee", about: "about_h4wnee.txt", contact: "Windows Live Messenger" };
    const iconHtml = work ? getIcon("art", "🖼") : getIcon(kind, ({ folder: "📁", about: "🗒", contact: "👥" }[kind]));
    
    const geom = defaultGeometry(kind, work, opts);
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

    if (targetedZ > state.top) state.top = targetedZ;
    state.wins.push(win); state.active = id; state.menuOpen = false;
    
    if (windowsEl) windowsEl.appendChild(createWindow(win));
    
    if (!opts.isInit && kind !== "popup" && kind !== "publi") focusWin(win.id);
    renderTasks();
  }

  function closeWindow(id) {
    state.wins = state.wins.filter(w => w.id !== id);
    if (windowsEl) {
       const el = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
       if (el) el.remove();
    }
    if (state.active === id) {
      state.active = state.wins.filter(w => !w.min).sort((a, b) => b.z - a.z)[0]?.id || null;
      if (state.active) focusWin(state.active);
    }
    renderTasks();
  }

  function focusWin(id) {
    const w = state.wins.find(x => x.id === id);
    if (!w || w.kind === "popup" || w.kind === "publi") return;
    
    w.z = ++state.focusedTop; 
    w.min = false; state.active = id; state.menuOpen = false;
    
    if (windowsEl) {
       const el = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
       if (el) el.style.zIndex = w.z;
       $$(".window", windowsEl).forEach(win => {
         if (win.dataset.id === id) win.classList.remove("inactive");
         else win.classList.add("inactive");
       });
    }
    renderTasks();
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
      if (windowsEl) {
         const el = windowsEl.querySelector(`[data-id="${CSS.escape(w.id)}"]`);
         if (el) { el.style.left = `${w.x}px`; el.style.top = `${w.y}px`; el.style.width = `${w.w}px`; el.style.height = `${w.h}px`; }
      }
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
    win.browserHistory.push(next); win.browserPath = next; focusWin(win.id);
    
    if (windowsEl) {
       const el = windowsEl.querySelector(`[data-id="${CSS.escape(win.id)}"]`);
       if(el) {
          const body = el.querySelector(".window-body");
          if(body) body.innerHTML = windowBodyHTML(win);
          bindWindowBody(el, win);
       }
    }
  }

  function goBack(win) {
    if (!Array.isArray(win.browserHistory) || win.browserHistory.length <= 1) return;
    win.browserHistory.pop(); win.browserPath = [...win.browserHistory.at(-1)]; focusWin(win.id);
    
    if (windowsEl) {
       const el = windowsEl.querySelector(`[data-id="${CSS.escape(win.id)}"]`);
       if(el) {
          const body = el.querySelector(".window-body");
          if(body) body.innerHTML = windowBodyHTML(win);
          bindWindowBody(el, win);
       }
    }
  }

  function imageCard(item) {
    const rawPath = escapeHtml(item.file);
    return `
      <button class="work-item image-entry" type="button" data-work="${escapeHtml(item.id)}">
        <div class="work-thumb">
           <img src="${escapeHtml(imageSrc(item))}" data-filepath="${rawPath}" alt="" loading="lazy" onerror="window.handleThumbErr(this)">
        </div>
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
    else if (current.kind === "exhibiti0ns") {
      content = `<div class="file-grid">` + state.manifest.exhibitions.map(group => `
        <button class="work-item image-entry" type="button" data-folder="${escapeHtml(`exhibiti0ns/${group.name}`)}">
          <div class="work-thumb">${FOLDER_SVG}</div>
          <span>${escapeHtml(group.name)}</span>
        </button>`).join("") + `</div>`;
    } 
    else if (current.kind === "exhibition") {
      content = `<div class="file-grid">${current.group.items.map(item => imageCard(item)).join("")}</div>`;
    } 
    else if (current.kind === "ACERVO") {
      content = `<div class="file-grid">${state.manifest.acervo.map(item => imageCard(item)).join("")}</div>`;
    }
    else if (current.kind === "archives") {
      content = `<div class="file-grid">${state.manifest.archives.map(item => imageCard(item)).join("")}</div>`;
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
      const acervoPanel = w.work.type === "ACERVO" ? `
        <div class="acervo-toast" style="position: absolute; left: calc(100% + 60px); top: 20px; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 15px; border: 1px solid rgba(255,255,255,0.4); border-radius: 4px; color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; width: max-content; min-width: 220px; box-shadow: 2px 2px 10px rgba(0,0,0,0.5); text-align: left; cursor: default; touch-action: auto;">
           <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px; text-transform: uppercase;">OBRA ${escapeHtml(w.title)}</div>
           <div style="font-size: 12px; line-height: 1.8;">
             <strong style="color:#A4CBF0; display:inline-block; width:80px;">STATUS:</strong> <a href="mailto:h4wnee@gmail.com?subject=Interesse%20na%20obra%20${escapeHtml(w.work.id)}" target="_blank" style="color:#F4D03F; text-decoration:none; border-bottom:1px dashed #F4D03F;">[ SOLICITAR INFO ]</a><br>
             <strong style="color:#A4CBF0; display:inline-block; width:80px;">ANO:</strong> 2026<br>
             <strong style="color:#A4CBF0; display:inline-block; width:80px;">MATERIAL:</strong> ...<br>
             <strong style="color:#A4CBF0; display:inline-block; width:80px;">DIMENSÕES:</strong> ...<br>
             <strong style="color:#A4CBF0; display:inline-block; width:80px;">LOCAL:</strong> CARIRI/PB
           </div>
        </div>
      ` : '';

      const rawPath = escapeHtml(w.work.file);
      return `
        <div class="art-plate">
          <div class="img-wrapper">
             <button class="nav-art prev-art" data-dir="-1">❮</button>
             <img src="${escapeHtml(imageSrc(w.work))}" data-filepath="${rawPath}" alt="${escapeHtml(w.title)}" onerror="window.handleThumbErr(this)">
             <button class="close-art" data-act="close">X</button>
             <button class="nav-art next-art" data-dir="1">❯</button>
             ${acervoPanel}
             <div class="art-instruction">Alt+Scroll / Pinça: Zoom | Arrastar: Mover</div>
          </div>
        </div>`;
    }

    if (w.kind === "about") {
      return `
        <div class="about-content-box" style="text-align: left !important; display: block !important;">
          <h2 style="text-align: left !important; margin: 0 0 10px 0; font-size: 24px;">h4wnee</h2>
          <p style="text-align: left !important; margin: 0; line-height: 1.5; font-size: 14px;">
            is a Latin American transdisciplinary artist whose work explores the intersection of digital culture, popular imagination, and contemporary technologies.<br><br>
            <span style="font-family: monospace; font-size: 13px;">
            2021 &nbsp; utopias_piratas_2021<br>
            2021 &nbsp; n0_f*ture_(prime)<br>
            2022 &nbsp; Hyperlinks, Distortion e Mormasso<br>
            2025 &nbsp; RAW 2025 (HOA+FDAG)
            </span>
          </p>
        </div>
      `;
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
        const openAction = (e) => {
          e.preventDefault(); e.stopPropagation();
          if (btn.dataset.work) {
            const work = findItem(btn.dataset.work);
            if (work) {
               loadDimensions(work).then(() => {
                  addWindow("art", work, { isInit: false }); 
               }).catch(() => {});
            }
          } else if (btn.dataset.folder) {
            navigateBrowser(w, btn.dataset.folder);
          }
        };

        btn.addEventListener("click", openAction);
        let moved = false;
        btn.addEventListener("touchmove", () => moved = true, { passive: true });
        btn.addEventListener("touchstart", () => moved = false, { passive: true });
        btn.addEventListener("touchend", e => { if (!moved) { e.preventDefault(); openAction(e); } });
      });

      $$('[data-nav="back"]', el).forEach(btn => {
        const goBackAction = (e) => { e.preventDefault(); e.stopPropagation(); goBack(w); };
        btn.addEventListener("click", goBackAction);
        let moved = false;
        btn.addEventListener("touchmove", () => moved = true, { passive: true });
        btn.addEventListener("touchstart", () => moved = false, { passive: true });
        btn.addEventListener("touchend", e => { if (!moved) { e.preventDefault(); goBackAction(e); } });
      });
    }

    if (w.kind === "contact") {
       $$('[data-act="close"]', el).forEach(btn => btn.addEventListener("pointerdown", e => {
         e.preventDefault(); e.stopPropagation(); closeWindow(w.id);
       }));
       
       const toggleBtn = $(".msg-toggle", el); const expandArea = $(".msn-expand", el);
       const sendBtn = $(".send-msg", el); const textArea = $("textarea", el);

       toggleBtn.addEventListener("click", e => {
           e.preventDefault(); e.stopPropagation();
           focusWin(w.id);
           const isExpanded = expandArea.style.display !== "none";
           expandArea.style.display = isExpanded ? "none" : "block";
           w.h = isExpanded ? 160 : 255;
           if (w.anchor === "bottom-right") { w.y = innerHeight - w.h - 45; }
           w.ratioY = w.y / innerHeight;
           el.style.height = `${w.h}px`; el.style.top = `${w.y}px`;
       });
       sendBtn.addEventListener("click", () => {
           if(textArea.value.trim() === "") return;
           expandArea.style.display = "none"; w.h = 160; 
           if(w.anchor === "bottom-right") w.y = innerHeight - w.h - 45; 
           w.ratioY = w.y / innerHeight;
           el.style.height = `${w.h}px`; el.style.top = `${w.y}px`; textArea.value = "";
           alert("Mensagem enviada com sucesso!");
       });
    }

    if (w.kind === "art") {
      const wrapper = $(".img-wrapper", el);
      let scale = 1, panX = 0, panY = 0, isDragging = false;
      let startMouseX = 0, startMouseY = 0, initialPanX = 0, initialPanY = 0;
      
      let initialTouchDist = 0, initialTouchScale = 1;
      let initialTouchMidX = 0, initialTouchMidY = 0;
      let touchStartPanX = 0, touchStartPanY = 0;

      $$('.nav-art', el).forEach(btn => {
         btn.addEventListener("click", e => {
            e.preventDefault(); e.stopPropagation();
            const dir = parseInt(btn.dataset.dir);
            const sibs = getSiblings(w.work.id);
            if (sibs) {
               let nextIdx = sibs.index + dir;
               if (nextIdx < 0) nextIdx = sibs.list.length - 1;
               if (nextIdx >= sibs.list.length) nextIdx = 0;
               const nextWork = sibs.list[nextIdx];
               
               loadDimensions(nextWork).then(() => {
                  w.work = nextWork;
                  w.title = nextWork.title;
                  const body = el.querySelector(".window-body");
                  if(body) body.innerHTML = windowBodyHTML(w);
                  bindWindowBody(el, w);
               }).catch(() => {});
            }
         });
         btn.addEventListener("pointerdown", e => { e.stopPropagation(); focusWin(w.id); });
      });

      const moveHandler = e => {
        if (!isDragging) return;
        panX = initialPanX + (e.clientX - startMouseX);
        panY = initialPanY + (e.clientY - startMouseY);
        wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      };

      $$('.close-art', el).forEach(btn => btn.addEventListener("pointerdown", e => {
         e.preventDefault(); e.stopPropagation();
         document.removeEventListener("pointermove", moveHandler);
         closeWindow(w.id);
      }));

      wrapper.addEventListener("wheel", e => {
        if (e.altKey) {
          e.preventDefault();
          scale += e.deltaY * -0.002;
          scale = Math.min(Math.max(0.4, scale), 5);
          wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }
      });

      wrapper.addEventListener("click", e => {
        if (e.target.closest('.close-art') || e.target.closest('.nav-art') || e.target.closest('.acervo-toast')) return;
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

      wrapper.addEventListener("touchstart", e => {
        focusWin(w.id);
        if (e.target.closest('.close-art') || e.target.closest('.nav-art') || e.target.closest('.acervo-toast')) return;
        
        if (e.touches.length === 1) {
          e.stopPropagation();
          isDragging = true;
          startMouseX = e.touches[0].clientX; startMouseY = e.touches[0].clientY;
          initialPanX = panX; initialPanY = panY;
        } else if (e.touches.length === 2) {
          e.preventDefault(); e.stopPropagation();
          isDragging = false;
          const t1 = e.touches[0], t2 = e.touches[1];
          initialTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          initialTouchScale = scale;
          initialTouchMidX = (t1.clientX + t2.clientX) / 2;
          initialTouchMidY = (t1.clientY + t2.clientY) / 2;
          touchStartPanX = panX;
          touchStartPanY = panY;
        }
      }, { passive: false });

      wrapper.addEventListener("touchmove", e => {
        if (e.touches.length === 1 && isDragging) {
          e.stopPropagation();
          panX = initialPanX + (e.touches[0].clientX - startMouseX);
          panY = initialPanY + (e.touches[0].clientY - startMouseY);
          wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        } else if (e.touches.length === 2) {
          e.preventDefault(); e.stopPropagation();
          const t1 = e.touches[0], t2 = e.touches[1];
          const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          if (initialTouchDist > 0) {
            const factor = dist / initialTouchDist;
            scale = clamp(initialTouchScale * factor, 0.4, 5);
          }
          const midX = (t1.clientX + t2.clientX) / 2;
          const midY = (t1.clientY + t2.clientY) / 2;
          panX = touchStartPanX + (midX - initialTouchMidX);
          panY = touchStartPanY + (midY - initialTouchMidY);
          wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }
      }, { passive: false });

      wrapper.addEventListener("touchend", e => {
        if (e.touches.length < 2) { initialTouchDist = 0; }
        if (e.touches.length === 0) {
          isDragging = false;
          const rect = el.getBoundingClientRect();
          w.x = rect.left + panX; w.y = rect.top + panY;
          w.ratioX = w.x / innerWidth; w.ratioY = w.y / innerHeight;
        }
      });
    }
  }

  function loadDimensions(work) {
    return new Promise((resolve, reject) => {
      const rawPath = work.file.replace(/\.[a-zA-Z0-9]+$/i, '');
      const paths = window.getPathsToTest(rawPath);
      let step = 0;
      
      const tryNext = () => {
        if (step >= paths.length) {
           reject("Imagem não encontrada"); 
           return;
        }
        const testPath = paths[step++];
        const img = new Image();
        img.onload = () => { 
           work.file = testPath; 
           work.nw = img.naturalWidth; work.nh = img.naturalHeight; 
           resolve(work); 
        };
        img.onerror = tryNext;
        img.src = testPath.split("/").map(encodeURIComponent).join("/");
      };
      tryNext();
    });
  }

  function createWindow(w) {
    const el = document.createElement("article");
    
    let extraClass = "";
    if (w.kind === "popup") extraClass = "popup-ad";
    if (w.kind === "publi") extraClass = "publi-ad";
    if (w.kind === "contact") extraClass = "msn-window";
    if (w.kind === "about") extraClass = "glass-about";
    
    el.className = `window ${state.active === w.id ? "" : "inactive"} ${extraClass}`;
    el.dataset.id = w.id;
    el.style.left = `${w.x}px`; el.style.top = `${w.y}px`;
    el.style.width = `${w.w}px`; el.style.height = `${w.h}px`;
    el.style.zIndex = w.z;
    
    if (w.kind === "popup" || w.kind === "publi" || w.kind === "contact") el.style.position = "fixed";
    if (w.kind === "art") el.classList.add("frameless-art");

    el.addEventListener("pointerdown", () => focusWin(w.id), { capture: true });
    el.addEventListener("touchstart", () => focusWin(w.id), { capture: true, passive: true });

    if (w.kind === "popup") {
      const explodeAd = (e) => {
        e.stopPropagation();
        if (!el.classList.contains("explode-anim")) {
          lastAdCloseTime = Date.now();
          playExplosionSound();
          el.classList.add("explode-anim");
          setTimeout(() => closeWindow(w.id), 450);
        }
      };
      el.addEventListener("mousedown", explodeAd);
      el.addEventListener("touchstart", explodeAd, { passive: true });
    } else if (w.kind === "publi") {
      const closePubli = (e) => {
         e.stopPropagation();
         closeWindow(w.id);
      };
      el.addEventListener("mousedown", closePubli);
      el.addEventListener("touchstart", closePubli, { passive: true });
    } else {
      el.addEventListener("pointerdown", e => {
         if (!e.target.closest("button") && !e.target.closest("a") && !e.target.closest("textarea") && !el.classList.contains("frameless-art") && !e.target.closest(".browser-body")) {
            let start = { px: e.clientX, py: e.clientY, x: w.x, y: w.y };
            const move = ev => {
              w.x = clamp(start.x + (ev.clientX - start.px), 96 - w.w + 140, innerWidth - 60);
              w.y = clamp(start.y + (ev.clientY - start.py), 38, innerHeight - 70);
              w.ratioX = w.x / innerWidth; w.ratioY = w.y / innerHeight;
              w.anchor = null; 
              el.style.left = `${w.x}px`; el.style.top = `${w.y}px`;
            };
            const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
            window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
         }
      });
    }
    
    if (w.kind !== "contact" && w.kind !== "art" && w.kind !== "popup" && w.kind !== "publi") el.appendChild(titlebar(w));

    const body = document.createElement("div");
    body.className = "window-body";
    body.innerHTML = w.kind === "popup" || w.kind === "publi" ? w.content : windowBodyHTML(w);
    el.appendChild(body);
    
    bindWindowBody(el, w); return el;
  }

  function renderTasks() {
    if (!taskStrip) return;
    taskStrip.innerHTML = "";
    state.wins.filter(w => w.kind !== "popup" && w.kind !== "publi").forEach(w => {
      const b = document.createElement("button");
      b.className = `task-button ${state.active === w.id && !w.min ? "focused" : ""} ${w.kind === "contact" ? "task-msn" : ""}`;
      b.innerHTML = `${w.iconHtml || ""} ${w.title}`;
      b.addEventListener("click", () => { if (state.active === w.id && !w.min) { w.min = true; renderTasks(); } else focusWin(w.id); });
      taskStrip.appendChild(b);
    });

    if (clockEl && clockEl.parentNode) {
        let tray = $(".system-tray-container");
        if (!tray) {
           tray = document.createElement("div"); tray.className = "system-tray-container";
           tray.innerHTML = `<div class="system-tray-icons"><span title="Volume">🔊</span><span title="Wi-Fi">📶</span></div>`;
           clockEl.parentNode.insertBefore(tray, clockEl);
        }
    }
  }

  function openByKind(kind) {
    if (kind === "folder") { addWindow("folder"); return; }
    if (kind === "crash") { if (bsod) bsod.classList.remove("hidden"); return; }
    if (kind === "about" || kind === "contact") addWindow(kind);
  }

  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) openByKind(open.dataset.open);
  });
  
  if (bsod) bsod.addEventListener("click", () => bsod.classList.add("hidden"));

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
    if (bsod) bsod.classList.remove("hidden");
    crashMultiplier++;
    setTimeout(scheduleNextCrash, 60000 * crashMultiplier);
  }

  // ==========================================
  // PROPAGANDAS E PUBLI (ADS)
  // ==========================================
  let totalAdsSpawned = 0;
  let currentAdSequence = 1;
  let lastAdCloseTime = Date.now(); 

  function spawnAd() {
    const id = "popup_" + Math.random().toString(36).slice(2, 8);
    totalAdsSpawned++;
    let numStr;
    
    if (totalAdsSpawned <= 10) {
        numStr = String(currentAdSequence).padStart(2, '0');
        currentAdSequence++;
    } else {
        const randomAdIndex = Math.floor(Math.random() * 10) + 1;
        numStr = String(randomAdIndex).padStart(2, '0');
    }

    const extensions = ['gif', 'png', 'jpg', 'webp', 'GIF', 'PNG', 'JPG', 'WEBP'];
    
    const tryLoad = () => {
       if (extensions.length === 0) return;
       const ext = extensions.shift();
       const img = new Image();
       
       img.onload = () => {
          const scale = Math.min(140 / img.naturalWidth, 140 / img.naturalHeight, 1);
          const adW = Math.max(60, Math.round(img.naturalWidth * scale));
          const adH = Math.max(60, Math.round(img.naturalHeight * scale));
          const contentHtml = `<img src="${img.src}" style="display:block; width:100%; height:100%; object-fit:contain; pointer-events:none;">`;
          
          const ad = {
             id, kind: "popup", title: "AD", iconHtml: "⚠",
             x: Math.random() * (innerWidth - adW), y: Math.random() * (innerHeight - adH - 20),
             w: adW, h: adH, z: ++adZCounter, min: false, max: false,
             content: contentHtml, vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()), vy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random())
          };
          
          ad.ratioX = ad.x / innerWidth; ad.ratioY = ad.y / innerHeight;
          state.wins.push(ad); 
          if (windowsEl) windowsEl.appendChild(createWindow(ad)); 
          
          requestAnimationFrame(function bounce() {
             const winData = state.wins.find(w => w.id === id);
             if (!winData) return; 
             winData.x += winData.vx; winData.y += winData.vy;
             if (winData.x <= 0 || winData.x + winData.w >= innerWidth) winData.vx *= -1;
             if (winData.y <= 0 || winData.y + winData.h >= innerHeight) winData.vy *= -1;
             winData.ratioX = winData.x / innerWidth; winData.ratioY = winData.y / innerHeight;
             if (windowsEl) {
               const currentEl = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
               if (currentEl && !currentEl.classList.contains("explode-anim")) { 
                 currentEl.style.left = `${winData.x}px`; currentEl.style.top = `${winData.y}px`; 
               }
             }
             requestAnimationFrame(bounce);
          });
       };
       img.onerror = () => { setTimeout(tryLoad, 80); };
       img.src = `assets/ads/${numStr}.${ext}?v=${Date.now()}`;
    };
    tryLoad();
  }

  function scheduleNextAd() {
    spawnAd();
    
    let timeSinceLastClose = Date.now() - lastAdCloseTime;
    let isFlood = timeSinceLastClose > 5 * 60 * 1000; 
    
    if (totalAdsSpawned >= 10 && Math.random() > 0.6) {
        setTimeout(spawnAd, 500); 
    }
    
    let timeToNext;
    if (isFlood) { timeToNext = Math.floor(Math.random() * 8000) + 5000; } 
    else { timeToNext = Math.floor(Math.random() * 30000) + 40000; } 
    setTimeout(scheduleNextAd, timeToNext);
  }

  // ==========================================
  // FUNÇÃO PUBLI COM EFEITO UNIVERSAL DE HOLOGRAMA
  // ==========================================
  function spawnPubli(forcedIndex = null, forcedX = null, forcedY = null) {
      const id = "publi_" + Math.random().toString(36).slice(2, 8);
      const index = forcedIndex !== null ? forcedIndex : (Math.floor(Math.random() * 5) + 1);
      const numStr = String(index).padStart(2, '0');
      const extensions = ['gif', 'png', 'jpg', 'webp', 'GIF', 'PNG', 'JPG', 'WEBP'];

      const tryLoad = () => {
         if (extensions.length === 0) return;
         const ext = extensions.shift();
         const img = new Image();

         img.onload = () => {
            const W = innerWidth, H = innerHeight;
            const scale = Math.min((W * 0.7) / img.naturalWidth, (H * 0.7) / img.naturalHeight, 1);
            const adW = Math.max(50, Math.round(img.naturalWidth * scale));
            const adH = Math.max(50, Math.round(img.naturalHeight * scale));

            let posX = forcedX !== null ? forcedX : (W * 0.4 + Math.random() * (W * 0.5 - adW)); 
            let posY = forcedY !== null ? forcedY : (Math.random() * (H - adH - 20));

            const contentHtml = `<img src="${img.src}" style="display:block; width:100%; height:100%; object-fit:contain; pointer-events:none;">`;

            const ad = {
               id, kind: "publi", title: "PUBLI", iconHtml: "",
               x: posX, y: posY, w: adW, h: adH, z: ++adZCounter, min: false, max: false,
               content: contentHtml
            };

            ad.ratioX = ad.x / innerWidth; ad.ratioY = ad.y / innerHeight;
            state.wins.push(ad);
            if (windowsEl) windowsEl.appendChild(createWindow(ad));
         };
         img.onerror = () => { setTimeout(tryLoad, 80); };
         img.src = `assets/ads/publi/${numStr}.${ext}?v=${Date.now()}`;
      };
      tryLoad();
  }

  function scheduleNextPubli() {
      let timeToNext = Math.floor(Math.random() * 60000) + 90000; 
      setTimeout(() => {
          spawnPubli();
          scheduleNextPubli();
      }, timeToNext);
  }

  function scheduleNextLogoShake() {
     if (logoEl) {
        logoEl.classList.add("logo-shake-active");
        setTimeout(() => { logoEl.classList.remove("logo-shake-active"); }, 460);
     }
     setTimeout(scheduleNextLogoShake, Math.floor(Math.random() * 6000) + 4000);
  }

  function fixBackgroundCache() {
    if (!wallpaperEl) return;
    wallpaperEl.style.backgroundImage = `url("assets/background.gif?v=${Date.now()}"), linear-gradient(180deg,#07225f 0%,#1156c4 18%,#3f9ce8 42%,#a8dcf5 60%,#e9d9b6 62%,#d8a878 74%,#b9743f 92%,#8c4a24 100%)`;
  }

  function init() {
    try {
      const W = innerWidth, H = innerHeight;
      state.manifest = generateAutomaticManifest();
      nowClock(); setInterval(nowClock, 1000);
      fixBackgroundCache();
      arrangeDesktopIcons(); // Executa a mágica de remapear os ícones!

      if (state.manifest.archives && state.manifest.archives.length >= 3) {
        const w1 = state.manifest.archives[0];
        const w2 = state.manifest.archives[1];
        const w3 = state.manifest.archives[2];

        // Obras Laterais
        loadDimensions(w3).then(() => { addWindow("art", w3, { isInit: true, x: W * 0.02, y: H * 0.42, z: 1001 }); }).catch(()=>{});
        loadDimensions(w2).then(() => { addWindow("art", w2, { isInit: true, x: Math.max(10, W - 580), y: H * 0.28, z: 1001 }); }).catch(()=>{});

        // Obra Central
        setTimeout(() => { loadDimensions(w1).then(() => { addWindow("art", w1, { isInit: true, x: W * 0.22, y: H * 0.15, z: 1002 }); }).catch(()=>{}); }, 150);

        // About
        setTimeout(() => addWindow("about", null, { z: 1003 }), 300);
        
        // Explorador POR CIMA DE TUDO (Z-Index garantido nas estrelas: 1010)
        setTimeout(() => {
            addWindow("folder", null, { z: 1010 });
            // Força o foco absoluto no explorador
            const folderWin = state.wins.find(w => w.kind === "folder");
            if (folderWin) focusWin(folderWin.id);
        }, 1200);

      } else {
        addWindow("folder", null, { z: 1010 }); addWindow("about", null, { z: 1003 });
      }

      setTimeout(() => {
         addWindow("contact", null, { anchor: "bottom-right", x: W - 270, y: H - 205, z: 1006 });
      }, 1000);

      // APARIÇÕES IMEDIATAS:
      setTimeout(spawnAd, 1500); 
      
      // O Publi 01.png nasce "abaixo da obra do centro porem a parte de cima sobrepondo" 
      // Calculamos o Y para ser na altura média-baixa da tela (H * 0.55), do lado direito
      setTimeout(() => spawnPubli(1, W * 0.55, H * 0.55), 2000); 

      // Agenda os Loops
      setTimeout(scheduleNextAd, 15000);
      setTimeout(scheduleNextPubli, 90000);
      setTimeout(scheduleNextGlitch, 40000);
      setTimeout(scheduleNextCrash, 60000);
      setTimeout(scheduleNextLogoShake, 4000);
      
    } catch(err) {
      console.error("Erro inicial tratado:", err);
    }
  }

  window.addEventListener("resize", () => {
    state.wins.forEach(w => {
      if (w.anchor === "bottom-right") {
         w.x = innerWidth - w.w - 20;
         w.y = innerHeight - w.h - 45;
      } else {
         w.x = clamp(w.ratioX * innerWidth, 0, innerWidth - w.w);
         w.y = clamp(w.ratioY * innerHeight, 38, innerHeight - w.h - 40);
      }
      if (windowsEl) {
         const el = windowsEl.querySelector(`[data-id="${CSS.escape(w.id)}"]`);
         if (el) { el.style.left = `${w.x}px`; el.style.top = `${w.y}px`; }
      }
    });
  });

  init();
})();