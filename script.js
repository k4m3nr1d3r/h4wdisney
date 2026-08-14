(() => {
  "use strict";

  // ==========================================
  // CONFIGURAÇÃO DOS SEUS ANÚNCIOS (GIFS)
  // Coloque seus gifs na pasta assets/ads/ e adicione os nomes aqui.
  // Exemplo: ["assets/ads/gif1.gif", "assets/ads/gif2.gif"]
  // ==========================================
  const CUSTOM_ADS = [
    
  ];

  // Injetando CSS extra para garantir a grade de miniaturas e o zoom
  const extraStyles = document.createElement('style');
  extraStyles.textContent = `
    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 15px; padding: 15px; }
    .image-entry { display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid transparent; background: transparent; cursor: pointer; padding: 8px; border-radius: 4px; }
    .image-entry:hover { background: rgba(0, 120, 215, 0.15); border: 1px dotted #0078d7; }
    .work-thumb { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
    .work-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); }
    .art-plate { overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: calc(100% - 40px); background: #111; }
    .art-plate img { touch-action: none; transition: transform 0.05s linear; max-width: 100%; max-height: 100%; object-fit: contain; }
    .popup-ad .window-body { padding: 0; margin: 0; width: 100%; height: 100%; overflow: hidden; }
  `;
  document.head.appendChild(extraStyles);

  const IMAGE_EXTS = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
  const LEGACY_MANIFEST = { version: 1, exhibitions: [], works: [] };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const state = {
    wins: [],
    top: 100,
    active: null,
    menuOpen: false,
    cascade: 0,
    manifest: LEGACY_MANIFEST,
    browserPath: []
  };

  const windowsEl = $("#windows");
  const taskStrip = $("#taskStrip");
  const startMenu = $("#startMenu");
  const bsod = $("#bsod");

  function asset(file) { return String(file).split("/").map(encodeURIComponent).join("/"); }
  function imageSrc(item) { return item?.source || asset(item?.file || ""); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[m])); }
  
  function fileTitle(file) {
    if (!file) return "";
    return (file.split("/").pop() || file).replace(/\.[^/.]+$/, "").replace(/_/g, " ");
  }
  function fileId(file) { return file; }

  function normalizeManifest(data) {
    const exhibitions = Array.isArray(data?.exhibitions) ? data.exhibitions : [];
    const works = Array.isArray(data?.works) ? data.works : [];

    exhibitions.forEach(group => {
      group.items = Array.isArray(group.items) ? group.items : [];
      group.items = group.items.map(item => {
        if (typeof item === "string") return { id: item, file: item, title: fileTitle(item) };
        item.title = item.title || fileTitle(item.file || "");
        item.id = item.id || fileId(item.file || "");
        return item;
      });
    });

    const normWorks = works.map(item => {
      if (typeof item === "string") return { id: item, file: item, title: fileTitle(item) };
      item.title = item.title || fileTitle(item.file || "");
      item.id = item.id || fileId(item.file || "");
      return item;
    });

    return { version: 1, exhibitions, works: normWorks };
  }

  async function loadGallery() {
    if (window.__GALLERY_MANIFEST__) {
      state.manifest = normalizeManifest(window.__GALLERY_MANIFEST__);
      return;
    }
    const response = await fetch(`gallery-index.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("gallery-index.json não encontrado");
    state.manifest = normalizeManifest(await response.json());
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
      { type: "folder", id: "Vernissages", name: "Vernissages", subtitle: `${state.manifest.exhibitions.reduce((n, g) => n + g.items.length, 0)} arquivos` },
      { type: "folder", id: "Obras", name: "Obras", subtitle: `${state.manifest.works.length} arquivos` }
    ];
  }

  function defaultGeometry(kind, work = null) {
    const W = innerWidth, H = innerHeight;
    if (kind === "folder") return { x: W * .09, y: H * .23, w: 600, h: 420 };
    if (kind === "about") return { x: Math.max(96, W - 430), y: H * .33, w: 390, h: 392 };
    if (kind === "contact") return { x: W * .24, y: H * .28, w: 372, h: 220 };
    
    if (kind === "art" && work) {
      const nw = Number(work.nw) || 800; const nh = Number(work.nh) || 600;
      const scale = Math.min(clamp(W * .4, 300, 700) / nw, (H * 0.6) / nh, 1);
      return {
        x: clamp(W * .2, 50, Math.max(50, W - 400)), y: clamp(H * .1, 50, Math.max(50, H - 300)),
        w: Math.max(300, Math.round(nw * scale)) + 20, h: Math.round(nh * scale) + 90
      };
    }
    const n = state.cascade++;
    return { x: 180 + (n % 6) * 46, y: 120 + (n % 6) * 38, w: 350, h: 250 };
  }

  function addWindow(kind, work = null, opts = {}) {
    if (kind === "crash") { bsod.classList.remove("hidden"); return; }
    const existing = state.wins.find(w => w.kind === kind && (!work || (w.work && w.work.id === work.id)));
    if (existing) { focusWin(existing.id); return; }

    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;
    const titleMap = { folder: "Explorador de Arquivos", about: "about_h4wnee.txt", contact: "contact.exe" };
    
    const win = {
      id, kind, title: work ? (work.file || work.title) : titleMap[kind],
      icon: work ? "🖼" : ({ folder: "📁", about: "🗒", contact: "📟" }[kind]),
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
    if (!w) return;
    const alreadyActive = (state.active === id && !w.min && !state.menuOpen);
    w.z = ++state.top; w.min = false; state.active = id; state.menuOpen = false;
    
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
        w.w = Math.max(300, start.width + dx);
        w.h = Math.max(250, start.height + dy);
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
      <span class="title-icon">${w.icon}</span>
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
        <div class="work-thumb"><img src="${escapeHtml(imageSrc(item))}" alt="" loading="lazy"></div>
        <span>${escapeHtml(item.title || fileTitle(item.file))}</span>
      </button>`;
  }

  function windowBodyHTML(w) {
    if (w.kind === "folder") {
      const current = currentBrowser(w); let content = "";
      
      if (current.kind === "root") {
        content = `<div class="file-grid">` + folderEntries().map(entry => `
          <button class="work-item image-entry" type="button" data-folder="${escapeHtml(entry.id)}">
            <div class="work-thumb" style="font-size:40px;">📁</div>
            <strong>${escapeHtml(entry.name)}</strong>
          </button>`).join("") + `</div>`;
      } 
      else if (current.kind === "vernissages") {
        content = `<div class="file-grid">` + state.manifest.exhibitions.map(group => `
          <button class="work-item image-entry" type="button" data-folder="${escapeHtml(`Vernissages/${group.name}`)}">
            <div class="work-thumb" style="font-size:40px;">📁</div>
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
        <div class="folder-menu"><span>File</span><span>Edit</span><span>View</span></div>
        <div class="address toolbar-address">
          <button type="button" class="nav-btn" data-nav="back">← Voltar</button>
          <div class="address-breadcrumb" style="margin-left:10px;">C:\\h4wnee\\${current.path.join('\\')}</div>
        </div>
        <div class="folder-body browser-body" style="cursor: default; overflow-y:auto; height:calc(100% - 85px); background:#fff; color:#000;">${content}</div>`;
    }

    if (w.kind === "art") {
      return `
        <div class="art-body" style="height:100%;">
          <div class="art-plate">
            <img src="${imageSrc(w.work)}" alt="${escapeHtml(w.title)}">
          </div>
          <div class="caption" style="padding: 10px; text-align: center; background:#ddd; height:40px;">
            <b>${escapeHtml(w.title)}</b> <i>(Use Alt + Scroll para Zoom. Arraste para mover)</i>
          </div>
        </div>`;
    }
    return "";
  }

  function bindWindowBody(el, w) {
    if (w.kind === "folder") {
      // UM CLIQUE: Abre a imagem na hora (como você pediu)
      $$(".image-entry[data-work]", el).forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault(); e.stopPropagation();
          const work = findItem(btn.dataset.work);
          if (work) loadDimensions(work).then(() => addWindow("art", work));
        });
      });

      // UM CLIQUE: Entra na pasta
      $$('[data-folder]', el).forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault(); e.stopPropagation();
          navigateBrowser(w, btn.dataset.folder);
        });
      });

      $$('[data-nav="back"]', el).forEach(btn => btn.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation(); goBack(w);
      }));
    }

    if (w.kind === "art") {
      const img = $(".art-plate img", el);
      let scale = 1, panX = 0, panY = 0, isDragging = false, startX, startY;

      // Mecânica do ZOOM (Alt + Scroll)
      img.addEventListener("wheel", e => {
        if (e.altKey) {
          e.preventDefault();
          scale += e.deltaY * -0.002;
          scale = Math.min(Math.max(0.5, scale), 5); // Limites de zoom (50% a 500%)
          img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
          img.style.cursor = scale > 1 ? "grab" : "default";
        }
      });

      // Mecânica de ARRASTAR (Pan)
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
    el.className = `window ${state.active === w.id ? "" : "inactive"} ${w.kind === "popup" ? "popup-ad" : ""}`;
    el.dataset.id = w.id;
    el.style.left = `${w.x}px`; el.style.top = `${w.y}px`;
    el.style.width = `${w.w}px`; el.style.height = `${w.h}px`;
    el.style.zIndex = w.z;
    if (w.kind === "popup") el.style.position = "fixed";
    
    el.addEventListener("pointerdown", () => focusWin(w.id));
    el.appendChild(titlebar(w));

    const body = document.createElement("div");
    body.className = "window-body";
    body.innerHTML = w.kind === "popup" ? w.content : windowBodyHTML(w);
    el.appendChild(body);

    if (!w.max && w.kind !== "popup") {
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
      b.className = `task-button ${state.active === w.id && !w.min ? "focused" : ""}`;
      b.textContent = `${w.icon} ${w.title}`;
      b.addEventListener("click", () => { if (state.active === w.id && !w.min) { w.min = true; render(); } else focusWin(w.id, true); });
      taskStrip.appendChild(b);
    });
  }
  function render() { renderWindowLayer(); renderTasks(); }

  // ==========================================
  // SISTEMA DE PROPAGANDAS QUICANTES
  // ==========================================
  function spawnAd() {
    const id = "popup_" + Math.random().toString(36).slice(2, 8);
    const isBet = Math.random() > 0.4 || CUSTOM_ADS.length === 0;
    
    let contentHtml = "";
    if (isBet) {
      contentHtml = `<div style="background:#00c800; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#ffff00; font-size: 32px; font-family: 'Archivo Black', sans-serif; font-weight:900; text-shadow: 2px 2px 0px #000; letter-spacing: 2px;">BET</div>`;
    } else {
      const gif = CUSTOM_ADS[Math.floor(Math.random() * CUSTOM_ADS.length)];
      contentHtml = `<img src="${gif}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    const ad = {
      id, kind: "popup", title: "ADVERTISEMENT", icon: "⚠",
      x: Math.random() * (innerWidth - 180), y: Math.random() * (innerHeight - 150),
      w: 180, h: 120, z: ++state.top, min: false, max: false,
      content: contentHtml, vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()), vy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random())
    };

    state.wins.push(ad); render();

    function bounce() {
      const winData = state.wins.find(w => w.id === id);
      if (!winData) return; // Se foi fechado no X
      
      winData.x += winData.vx;
      winData.y += winData.vy;
      
      if (winData.x <= 0 || winData.x + winData.w >= innerWidth) winData.vx *= -1;
      if (winData.y <= 0 || winData.y + winData.h >= innerHeight) winData.vy *= -1;

      const el = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (el) { el.style.left = `${winData.x}px`; el.style.top = `${winData.y}px`; }
      
      requestAnimationFrame(bounce);
    }
    requestAnimationFrame(bounce);
  }

  async function init() {
    try { await loadGallery(); } catch (error) { state.manifest = normalizeManifest(LEGACY_MANIFEST); }
    addWindow("folder");

    // Lança propagandas a cada 8 segundos (Max 4 na tela ao mesmo tempo)
    setInterval(() => {
      if (state.wins.filter(w => w.kind === "popup").length < 4 && Math.random() > 0.2) {
        spawnAd();
      }
    }, 8000);

    render();
  }

  $("[data-open='folder']").addEventListener("click", () => addWindow("folder"));
  
  init();
})();