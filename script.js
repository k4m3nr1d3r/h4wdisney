(() => {
  "use strict";

  // ==========================================
  // CONFIGURAÇÃO DOS SEUS ANÚNCIOS (GIFS)
  // Coloque seus gifs na pasta assets/ads/ e adicione os nomes aqui.
  // ==========================================
  const CUSTOM_ADS = [];

  // Injetando CSS extra para grade, zoom, toolbar e EXPLOSÃO 8-BITS
  const extraStyles = document.createElement('style');
  extraStyles.textContent = `
    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 15px; padding: 15px; }
    .image-entry { display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px dotted transparent; background: transparent; cursor: pointer; padding: 8px; border-radius: 4px; color: inherit; }
    .image-entry:hover { background: rgba(0, 120, 215, 0.15); border: 1px dotted #0078d7; }
    .work-thumb { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; font-size: 50px; }
    .work-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); }
    .art-plate { overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: calc(100% - 40px); background: #111; }
    .art-plate img { touch-action: none; transition: transform 0.05s linear; max-width: 100%; max-height: 100%; object-fit: contain; }
    
    /* Propagandas */
    .popup-ad { cursor: pointer; border: 2px outset #dfdfdf; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); }
    .popup-ad .window-body { padding: 0; margin: 0; width: 100%; height: calc(100% - 25px); overflow: hidden; pointer-events: none; }
    .popup-ad .titlebar { height: 25px; }
    
    /* ANIMAÇÃO EXPLOSÃO 8-BITS (Fogo Pixelado) */
    @keyframes pixelExplosion {
      0% { box-shadow: inset 0 0 0 10px #ff6600, 0 0 0 0 transparent; background: #ffcc00; }
      25% { box-shadow: inset 0 0 0 20px #ff0000, 15px 15px 0 #ffaa00, -15px -15px 0 #ffff00, 15px -15px 0 #ffaa00, -15px 15px 0 #ffff00; background: #ff6600; border: none; }
      50% { box-shadow: 30px 30px 0 5px #ff5500, -30px -30px 0 5px #ffaa00, 30px -30px 0 5px #ffff00, -30px 30px 0 5px #ff5500, 0 40px 0 #ff0000, 0 -40px 0 #ffaa00, 40px 0 0 #ffff00, -40px 0 0 #ff0000; background: transparent; border: none; }
      75% { box-shadow: 50px 50px 0 -5px #ff0000, -50px -50px 0 -5px #ff5500, 50px -50px 0 -5px #ff0000, -50px 50px 0 -5px #ffff00, 0 60px 0 -5px #ffaa00, 0 -60px 0 -5px #ff0000, 60px 0 0 -5px #ff5500, -60px 0 0 -5px #ffaa00; background: transparent; border: none; opacity: 0.8; }
      100% { opacity: 0; display: none; background: transparent; border: none; box-shadow: none; }
    }
    .explode-anim {
      animation: pixelExplosion 0.4s steps(4) forwards;
      pointer-events: none;
    }
    .explode-anim .titlebar, .explode-anim .window-body { display: none !important; }
  `;
  document.head.appendChild(extraStyles);

  // Pasta Branca Vetorial (SVG)
  const FOLDER_SVG = `<svg width="45" height="45" viewBox="0 0 24 24" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linejoin="round" style="drop-shadow: 2px 2px 2px rgba(0,0,0,0.3);"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;

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
    
    // As janelas iniciais (About e Contact) que vão para o lado direito
    if (kind === "contact") return { x: clamp(W - 460, 50, W - 370), y: clamp(H * 0.15, 50, H - 300), w: 372, h: 220 };
    if (kind === "about") return { x: clamp(W - 420, 80, W - 390), y: clamp(H * 0.25, 80, H - 250), w: 390, h: 392 };
    
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
    const existing = state.wins.find(w => w.kind === kind && (!work || (w.work && w.work.id === work.id)));
    if (existing) { focusWin(existing.id); return; }

    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;
    const titleMap = { folder: "C:\\h4wnee", about: "about_h4wnee.txt", contact: "contact.exe" };
    
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

    // Resolvendo a sobreposição dos toolbars com layout Flexbox estrito
    return `
      <div class="folder-menu" style="display: flex; gap: 15px; padding: 6px 15px; border-bottom: 1px solid #ccc; background: #ece9d8; font-size: 13px;">
        <span>File</span><span>Edit</span><span>View</span>
      </div>
      <div class="address toolbar-address" style="display: flex; align-items: center; gap: 10px; padding: 6px 15px; border-bottom: 1px solid #ccc; background: #fff; font-size: 13px;">
        <button type="button" class="nav-btn" data-nav="back" style="padding: 2px 8px; cursor: pointer;">← Voltar</button>
        <div class="address-breadcrumb" style="flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">C:\\h4wnee\\${current.path.join('\\')}</div>
      </div>
      <div class="folder-body browser-body" style="cursor: default; overflow-y:auto; height:calc(100% - 90px); background:#fff;">${content}</div>`;
  }

  function windowBodyHTML(w) {
    if (w.kind === "folder") {
      return browserBodyHTML(w);
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

    if (w.kind === "about") {
      return `
        <div class="about-body">
          <h2>h4wnee</h2>
          <p>is a Latin American transdisciplinary artist whose work explores the intersection of digital culture, popular imagination, and contemporary technologies.</p>
          <div class="chronology">2021  utopias_piratas_2021<br>2021  n0_f*ture_(prime)<br>2022  hyperlinks, distorção e mormaço<br>2025  RAW 2025 (HOA+FDAG)</div>
        </div>`;
    }

    if (w.kind === "contact") {
      return `
        <div class="contact-body">
          <div class="prompt">C:\\&gt; whois h4wnee</div>
          mail&nbsp;&nbsp;&nbsp; <a href="mailto:h4wnee@gmail.com">h4wnee@gmail.com</a><br>
          insta&nbsp;&nbsp; <a href="https://instagram.com/h4wnee" target="_blank" rel="noopener">@h4wnee</a><br>
          base&nbsp;&nbsp;&nbsp; <span style="color:#f2ff00">Cariri / Paraíba / BR</span><br><br>
          <div class="prompt">C:\\&gt; <span class="blink">_</span></div>
        </div>`;
    }

    return "";
  }

  function bindWindowBody(el, w) {
    if (w.kind === "folder") {
      $$(".image-entry[data-work]", el).forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault(); e.stopPropagation();
          const work = findItem(btn.dataset.work);
          if (work) loadDimensions(work).then(() => addWindow("art", work));
        });
      });

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
    
    // Ação de explosão para a propaganda (Clica em qualquer lugar dela)
    if (w.kind === "popup") {
      el.addEventListener("mousedown", () => {
        el.classList.add("explode-anim");
        setTimeout(() => closeWindow(w.id), 380); // Tempo exato para a janela sumir após a explosão
      });
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

  // Restaura os atalhos de clique da área de trabalho
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

  // ==========================================
  // PROPAGANDA BET
  // ==========================================
  function spawnAd() {
    const id = "popup_" + Math.random().toString(36).slice(2, 8);
    
    const contentHtml = `<div style="background:#006400; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#ffff00; font-size: 32px; font-family: 'Archivo Black', sans-serif; font-weight:900; text-shadow: 2px 2px 0px #000; letter-spacing: 2px;">BET</div>`;

    const ad = {
      id, kind: "popup", title: "AD", icon: "⚠",
      x: Math.random() * (innerWidth - 130), y: Math.random() * (innerHeight - 155),
      w: 130, h: 155, z: ++state.top, min: false, max: false, // 130x155 (Tamanho pequeno e corpo da janela perfeitamente quadrado)
      content: contentHtml, vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()), vy: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random())
    };

    state.wins.push(ad); render();

    function bounce() {
      const winData = state.wins.find(w => w.id === id);
      if (!winData) return; 
      
      winData.x += winData.vx;
      winData.y += winData.vy;
      
      if (winData.x <= 0 || winData.x + winData.w >= innerWidth) winData.vx *= -1;
      if (winData.y <= 0 || winData.y + winData.h >= innerHeight) winData.vy *= -1;

      const currentEl = windowsEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (currentEl && !currentEl.classList.contains("explode-anim")) { 
        currentEl.style.left = `${winData.x}px`; 
        currentEl.style.top = `${winData.y}px`; 
      }
      requestAnimationFrame(bounce);
    }
    requestAnimationFrame(bounce);
  }

  async function init() {
    try { await loadGallery(); } catch (error) { state.manifest = normalizeManifest(LEGACY_MANIFEST); }
    
    // Abertura Inicial Automática
    addWindow("contact"); 
    addWindow("about");   

    // Lança propagandas a cada 16 segundos (Max 3 na tela ao mesmo tempo)
    setInterval(() => {
      if (state.wins.filter(w => w.kind === "popup").length < 3) {
        spawnAd();
      }
    }, 16000);

    render();
  }
  
  init();
})();