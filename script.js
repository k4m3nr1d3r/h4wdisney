(() => {
  "use strict";

  const IMAGE_EXTS = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
  const LEGACY_MANIFEST = {
    version: 1,
    exhibitions: [],
    works: []
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const state = {
    wins: [],
    top: 100,
    active: null,
    menuOpen: false,
    cascade: 0,
    glitchTimer: null,
    clockTimer: null,
    errorTimer: null,
    manifest: LEGACY_MANIFEST,
    browserPath: [],
    localFiles: [],
    localRootName: ""
  };

  const windowsEl = $("#windows");
  const taskStrip = $("#taskStrip");
  const startMenu = $("#startMenu");
  const bsod = $("#bsod");
  const rgbOverlay = $("#rgbOverlay");

  function asset(file) {
    return String(file).split("/").map(encodeURIComponent).join("/");
  }

  function imageSrc(item) {
    return item?.source || asset(item?.file || "");
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function fileTitle(file) {
    if (!file) return "";
    const name = file.split("/").pop() || file;
    return name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
  }

  function fileId(file) {
    return file;
  }

  function normalizeManifest(data) {
    const exhibitions = Array.isArray(data?.exhibitions) ? data.exhibitions : [];
    const works = Array.isArray(data?.works) ? data.works : [];

    exhibitions.forEach(group => {
      group.items = Array.isArray(group.items) ? group.items : [];
      group.items = group.items.map(item => {
        if (typeof item === "string") {
          return { id: item, file: item, title: fileTitle(item) };
        }
        item.title = item.title || fileTitle(item.file || "");
        item.id = item.id || fileId(item.file || "");
        return item;
      });
    });

    const normWorks = works.map(item => {
      if (typeof item === "string") {
        return { id: item, file: item, title: fileTitle(item) };
      }
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

  function allItems() {
    return [
      ...state.manifest.exhibitions.flatMap(group => group.items),
      ...state.manifest.works
    ];
  }

  function findItem(id) {
    return allItems().find(item => item.id === id);
  }

  function browserRoot() {
    return { kind: "root", name: "C:\\h4wnee", path: [] };
  }

  function currentBrowser(win) {
    const path = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (path.length === 0) return browserRoot();

    if (path[0] === "Vernissages") {
      if (path.length === 1) return { kind: "vernissages", name: "Vernissages", path };
      const name = path.slice(1).join("/");
      const group = state.manifest.exhibitions.find(x => x.name === name);
      return group
        ? { kind: "exhibition", name: group.name, path, group }
        : { kind: "vernissages", name: "Vernissages", path: ["Vernissages"] };
    }

    if (path[0] === "Obras") return { kind: "obras", name: "Obras", path };
    win.browserPath = [];
    return browserRoot();
  }

  function folderEntries() {
    return [
      { type: "folder", id: "Vernissages", name: "Vernissages", subtitle: `${state.manifest.exhibitions.reduce((n, g) => n + g.items.length, 0)} imagens` },
      { type: "folder", id: "Obras", name: "Obras", subtitle: `${state.manifest.works.length} imagens` }
    ];
  }

  function imageEntries(items) {
    return items.map(item => ({ type: "file", id: item.id, item, name: item.title || fileTitle(item.file) }));
  }

  function defaultGeometry(kind, work = null) {
    const W = innerWidth, H = innerHeight;

    if (kind === "folder") return { x: W * .09, y: H * .23, w: 520, h: 390 };
    if (kind === "about") return { x: Math.max(96, W - 430), y: H * .33, w: 390, h: 392 };
    if (kind === "contact") return { x: W * .24, y: H * .28, w: 372, h: 220 };
    if (kind === "error") return { x: W * .62, y: H * .55, w: 352, h: 170 };

    if (kind === "art" && work) {
      const nw = Number(work.nw) || 800;
      const nh = Number(work.nh) || 600;
      const scale = Math.min(clamp(W * .34, 260, 460) / nw, 290 / nh, 1.5);
      return {
        x: clamp(W * .36, 96, Math.max(96, W - 260)),
        y: clamp(H * .16, 80, Math.max(80, H - 220)),
        w: Math.max(230, Math.round(nw * scale)) + 8,
        h: Math.round(nh * scale) + 82
      };
    }

    const n = state.cascade++;
    return { x: 180 + (n % 6) * 46, y: 120 + (n % 6) * 38, w: 350, h: 250 };
  }

  function addWindow(kind, work = null, opts = {}) {
    if (kind === "crash") {
      bsod.classList.remove("hidden");
      return;
    }

    const existing = state.wins.find(w =>
      w.kind === kind && (!work || (w.work && w.work.id === work.id))
    );

    if (existing) {
      focusWin(existing.id);
      return;
    }

    const g = defaultGeometry(kind, work);
    const id = `${kind}_${work ? work.id : Math.random().toString(36).slice(2, 8)}`;

    const titleMap = {
      folder: "C:\\h4wnee",
      about: "about_h4wnee.txt",
      contact: "contact.exe",
      error: "system_error"
    };

    const win = {
      id,
      kind,
      title: work ? (work.file || work.title) : titleMap[kind],
      icon: work ? "🖼" : ({ folder: "📁", about: "🗒", contact: "📟", error: "⚠" }[kind]),
      ...g,
      z: ++state.top,
      min: false,
      max: false,
      work,
      browserPath: [],
      browserHistory: [[]],
      ...opts
    };

    state.wins.push(win);
    state.active = id;
    state.menuOpen = false;
    render();
  }

  function closeWindow(id) {
    state.wins = state.wins.filter(w => w.id !== id);
    if (state.active === id) {
      state.active = state.wins.filter(w => !w.min).sort((a, b) => b.z - a.z)[0]?.id || null;
    }
    render();
  }

  function focusWin(id) {
    const w = state.wins.find(x => x.id === id);
    if (!w) return;
    w.z = ++state.top;
    w.min = false;
    state.active = id;
    state.menuOpen = false;
    render();
  }

  function toggleMin(id) {
    const w = state.wins.find(x => x.id === id);
    if (!w) return;
    w.min = !w.min;
    if (!w.min) {
      w.z = ++state.top;
      state.active = id;
    }
    render();
  }

  function toggleMax(id) {
    const w = state.wins.find(x => x.id === id);
    if (!w) return;

    if (!w.max) {
      w.px = w.x; w.py = w.y; w.pw = w.w; w.ph = w.h;
      w.x = 96; w.y = 80;
      w.w = Math.max(230, innerWidth - 110);
      w.h = Math.max(140, innerHeight - 152);
      w.max = true;
    } else {
      Object.assign(w, { x: w.px, y: w.py, w: w.pw, h: w.ph, max: false });
    }

    focusWin(id);
  }

  function beginPointer(e, id, mode) {
    if (e.button !== undefined && e.button !== 0) return;

    const w = state.wins.find(x => x.id === id);
    if (!w || w.min) return;

    focusWin(id);

    const start = {
      px: e.clientX,
      py: e.clientY,
      x: w.x,
      y: w.y,
      width: w.w,
      height: w.h
    };

    const move = ev => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;

      if (mode === "move" && !w.max) {
        w.x = clamp(start.x + dx, 96 - w.w + 140, innerWidth - 60);
        w.y = clamp(start.y + dy, 38, innerHeight - 70);
      }

      if (mode === "size" && !w.max) {
        w.w = Math.max(300, start.width + dx);
        w.h = Math.max(180, start.height + dy);
      }

      render(false);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function titlebar(w) {
    const bar = document.createElement("div");
    bar.className = "titlebar";
    bar.innerHTML = `
      <span class="title-icon">${w.icon}</span>
      <span class="title-text"></span>
      <span class="window-buttons">
        <button type="button" data-act="min" aria-label="Minimizar">_</button>
        <button type="button" data-act="max" aria-label="Maximizar">□</button>
        <button type="button" class="close" data-act="close" aria-label="Fechar">×</button>
      </span>`;
    $(".title-text", bar).textContent = w.title;

    bar.addEventListener("pointerdown", e => {
      if (e.target.closest("button")) return;
      beginPointer(e, w.id, "move");
    });

    bar.addEventListener("dblclick", e => {
      if (!e.target.closest("button")) toggleMax(w.id);
    });

    $$(".window-buttons button", bar).forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const act = btn.dataset.act;
        if (act === "min") toggleMin(w.id);
        else if (act === "max") toggleMax(w.id);
        else if (act === "close") closeWindow(w.id);
      });
    });

    return bar;
  }

  function createWindow(w) {
    const el = document.createElement("article");
    el.className = `window ${state.active === w.id ? "" : "inactive"}`;
    el.dataset.id = w.id;
    el.style.left = `${w.x}px`;
    el.style.top = `${w.y}px`;
    el.style.width = `${w.w}px`;
    el.style.height = `${w.h}px`;
    el.style.zIndex = w.z;
    el.addEventListener("pointerdown", () => focusWin(w.id));

    el.appendChild(titlebar(w));

    const body = document.createElement("div");
    body.className = "window-body";
    body.innerHTML = windowBodyHTML(w);
    el.appendChild(body);

    if (!w.max) {
      const grip = document.createElement("div");
      grip.className = "resize-grip";
      grip.addEventListener("pointerdown", e => {
        e.stopPropagation();
        beginPointer(e, w.id, "size");
      });
      el.appendChild(grip);
    }

    bindWindowBody(el, w);
    return el;
  }

  function breadcrumb(win) {
    const path = Array.isArray(win.browserPath) ? win.browserPath : [];
    const parts = ["C:\\h4wnee"];
    let built = [];

    path.forEach(part => {
      built.push(part);
      parts.push(part);
    });

    return parts.map((part, index) => {
      const selected = index === parts.length - 1;
      const path = index === 0 ? [] : built.slice(0, index);
      return `<button type="button" class="crumb ${selected ? "selected" : ""}" data-path="${escapeHtml(JSON.stringify(path))}">
        ${escapeHtml(part)}
      </button>`;
    }).join("<span class=\"crumb-sep\">›</span>");
  }

  function navigateBrowser(win, target) {
    const next = target.split('/').filter(Boolean);
    const current = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (JSON.stringify(next) === JSON.stringify(current)) return;
    if (!Array.isArray(win.browserHistory) || !win.browserHistory.length) win.browserHistory = [current];
    win.browserHistory.push(next);
    win.browserPath = next;
    focusWin(win.id);
  }

  function goBack(win) {
    if (!Array.isArray(win.browserHistory) || win.browserHistory.length <= 1) return;
    win.browserHistory.pop();
    win.browserPath = [...win.browserHistory.at(-1)];
    focusWin(win.id);
  }

  function goUp(win) {
    const current = Array.isArray(win.browserPath) ? win.browserPath : [];
    if (!current.length) return;
    navigateBrowser(win, current.slice(0, -1).join('/'));
  }

  function browserBodyHTML(win) {
    const current = currentBrowser(win);
    let content = "";

    if (current.kind === "root") {
      content = folderEntries().map(entry => `
        <button class="work-item folder-entry" type="button" data-folder="${escapeHtml(entry.id)}">
          <div class="file-icon folder-large">📁</div>
          <strong>${escapeHtml(entry.name)}</strong>
          <span>${escapeHtml(entry.subtitle)}</span>
        </button>
      `).join("");
    }

    if (current.kind === "vernissages") {
      content = state.manifest.exhibitions.length
        ? state.manifest.exhibitions.map(group => `
          <section class="exhibition-group">
            <button class="group-title" type="button" data-folder="${escapeHtml(`Vernissages/${group.name}`)}">
              <span>${escapeHtml(group.name)}</span>
              <small>${group.items.length} ${group.items.length === 1 ? "imagem" : "imagens"}</small>
            </button>
            <div class="group-grid">
              ${group.items.map(item => imageCard(item)).join("")}
            </div>
          </section>
        `).join("")
        : `<div class="empty-folder">Nenhuma exposição encontrada.</div>`;
    }

    if (current.kind === "exhibition") {
      content = `
        <div class="group-heading">
          <strong>${escapeHtml(current.group.name)}</strong>
          <span>${current.group.items.length} ${current.group.items.length === 1 ? "imagem" : "imagens"}</span>
        </div>
        <div class="file-grid">
          ${current.group.items.map(item => imageCard(item)).join("")}
        </div>
      `;
    }

    if (current.kind === "obras") {
      content = state.manifest.works.length
        ? `<div class="file-grid">${imageEntries(state.manifest.works).map(entry => imageCard(entry.item)).join("")}</div>`
        : `<div class="empty-folder">Nenhuma obra encontrada.</div>`;
    }

    return `
      <div class="folder-menu">
        <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span>
      </div>
      <div class="address toolbar-address">
        <button type="button" class="nav-btn" data-nav="back" aria-label="Voltar">←</button>
        <button type="button" class="nav-btn" data-nav="up" aria-label="Pasta acima">↑</button>
        <div class="address-breadcrumb">${breadcrumb(win)}</div>
      </div>
      <div class="folder-body browser-body">${content}</div>
      <div class="statusbar">
        <span>${current.kind === "root" ? "2 pastas" : current.kind === "vernissages" ? `${state.manifest.exhibitions.length} exposições` : current.kind === "exhibition" ? `${current.group.items.length} objetos` : `${state.manifest.works.length} objetos`}</span>
        <span>local / portfolio</span>
      </div>`;
  }

  function imageCard(item) {
    return `
      <button class="work-item image-entry" type="button" data-work="${escapeHtml(item.id)}">
        <div class="work-thumb"><img src="${escapeHtml(imageSrc(item))}" alt="" loading="lazy" decoding="async"></div>
        <span>${escapeHtml(item.title || fileTitle(item.file))}</span>
      </button>`;
  }

  function windowBodyHTML(w) {
    if (w.kind === "folder") {
      return browserBodyHTML(w);
    }

    if (w.kind === "art") {
      return `
        <div class="art-body">
          <div class="art-plate">
            <img src="${imageSrc(w.work)}" alt="${escapeHtml(w.work.title || fileTitle(w.work.file))}">
          </div>
          <div class="caption">
            <b>${escapeHtml(w.work.title || fileTitle(w.work.file))}</b>${w.work.year ? ` · ${escapeHtml(w.work.year)}` : ""}
            ${w.work.note ? `<div class="note" style="color:#ff4444; margin-top:8px;">${escapeHtml(w.work.note)}</div>` : ""}
          </div>
        </div>`;
    }

    if (w.kind === "about") {
      return `
        <div class="about-body">
          <h2>h4wnee</h2>
          <p>is a Latin American transdisciplinary artist whose work explores the intersection of digital culture, popular imagination, and contemporary technologies.</p>
          <div class="chronology">2021  utopias_piratas_2021
2021  n0_f*ture_(prime)
2022  hyperlinks, distorção e mormaço
2025  RAW 2025 (HOA+FDAG)</div>
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

    if (w.kind === "error") {
      return `
        <div class="error-body">
          <div class="error-row">
            <div class="error-badge">!</div>
            <div>h4wnee.exe has encountered a problem and needs to close.<br>We are sorry for the inconvenience.</div>
          </div>
          <div class="error-actions">
            <button data-error="ok">OK</button>
            <button data-error="cancel">Cancel</button>
          </div>
        </div>`;
    }

    return "";
  }

  function bindWindowBody(el, w) {
    if (w.kind === "folder") {
      $$(".image-entry", el).forEach(btn => btn.addEventListener("click", () => {
        const id = btn.dataset.work;
        const work = findItem(id);
        if (work) {
          loadDimensions(work).then(() => addWindow("art", work));
        } else {
          alert(`Erro Interno: A imagem "${id}" está na memória, mas não foi possível vinculá-la ao clique.`);
        }
      }));

      $$('[data-folder]', el).forEach(btn => btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        navigateBrowser(w, btn.dataset.folder);
      }));

      $$('[data-nav]', el).forEach(btn => btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        if (btn.dataset.nav === "back") goBack(w);
        else if (btn.dataset.nav === "up") goUp(w);
      }));

      $$(".crumb", el).forEach(btn => btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        try { navigateBrowser(w, JSON.parse(btn.dataset.path).join('/')); } catch (_) {}
      }));
    }

    if (w.kind === "error") {
      $$("[data-error]", el).forEach(btn => btn.addEventListener("click", () => {
        closeWindow(w.id);
        clearTimeout(state.errorTimer);
        state.errorTimer = setTimeout(() => addWindow("error"), 1400);
      }));
    }
  }

  function loadDimensions(work) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        work.nw = img.naturalWidth;
        work.nh = img.naturalHeight;
        work.note = "";
        resolve(work);
      };
      img.onerror = () => {
        work.nw = 800;
        work.nh = 600;
        work.note = "⚠ ERRO: Arquivo não encontrado. Verifique se o nome no código é idêntico ao do computador.";
        resolve(work);
      };
      img.src = imageSrc(work);
    });
  }

  function renderWindowLayer() {
    windowsEl.innerHTML = "";
    state.wins
      .filter(w => !w.min)
      .sort((a, b) => a.z - b.z)
      .forEach(w => windowsEl.appendChild(createWindow(w)));
  }

  function renderTasks() {
    taskStrip.innerHTML = "";
    state.wins.forEach(w => {
      const b = document.createElement("button");
      b.className = `task-button ${state.active === w.id && !w.min ? "focused" : ""}`;
      b.textContent = `${w.icon} ${w.title}`;
      b.title = w.title;
      b.addEventListener("click", () => {
        if (state.active === w.id && !w.min) toggleMin(w.id);
        else focusWin(w.id);
      });
      taskStrip.appendChild(b);
    });
  }

  function render() {
    renderWindowLayer();
    renderTasks();
    startMenu.classList.toggle("hidden", !state.menuOpen);
  }

  function glitchBurst() {
    const visible = state.wins.filter(w => !w.min);
    if (!visible.length) return;

    const w = visible[Math.floor(Math.random() * visible.length)];
    const el = windowsEl.querySelector(`[data-id="${CSS.escape(w.id)}"]`);
    if (!el) return;

    el.animate([
      { transform: "translate(0,0) skewX(0)", filter: "none" },
      { transform: "translate(4px,-3px) skewX(-1.4deg)", filter: "hue-rotate(90deg) contrast(1.5)" },
      { transform: "translate(0,0) skewX(0)", filter: "none" }
    ], { duration: 190, easing: "steps(2)" });

    rgbOverlay.style.opacity = ".9";
    setTimeout(() => rgbOverlay.style.opacity = "0", 190);
  }

  function openByKind(kind) {
    if (kind === "folder") { addWindow("folder"); return; }
    if (kind === "about" || kind === "contact" || kind === "crash") addWindow(kind);
  }

  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) openByKind(open.dataset.open);
  });

  windowsEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const win = e.target.closest(".window");
    if (!win) return;
    const id = win.dataset.id;
    const act = btn.dataset.act;
    if (act === "close") closeWindow(id);
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const active = state.wins.find(w => w.id === state.active);
    if (active) closeWindow(active.id);
  });

  $("#startButton").addEventListener("click", e => {
    e.stopPropagation();
    state.menuOpen = !state.menuOpen;
    render();
  });

  document.addEventListener("click", e => {
    if (state.menuOpen && !e.target.closest("#startMenu") && !e.target.closest("#startButton")) {
      state.menuOpen = false;
      render();
    }
  });

  bsod.addEventListener("click", () => bsod.classList.add("hidden"));

  window.addEventListener("resize", () => {
    state.wins.forEach(w => {
      if (w.max) {
        w.x = 96;
        w.y = 80;
        w.w = Math.max(230, innerWidth - 110);
        w.h = Math.max(140, innerHeight - 152);
      } else {
        w.x = clamp(w.x, 96 - w.w + 140, innerWidth - 60);
        w.y = clamp(w.y, 38, innerHeight - 70);
      }
    });
    render();
  });

  function fixBackgroundCache() {
    const wallpaper = $(".wallpaper");
    if (!wallpaper) return;
    wallpaper.style.backgroundImage =
      `url("assets/background.jpg?v=${Date.now()}"), linear-gradient(180deg,#07225f 0%,#1156c4 18%,#3f9ce8 42%,#a8dcf5 60%,#e9d9b6 62%,#d8a878 74%,#b9743f 92%,#8c4a24 100%)`;
  }

  const mobileWorks = $("#mobileWorks");

  async function init() {
    try {
      await loadGallery();
    } catch (error) {
      console.error("Falha ao carregar", error);
      state.manifest = normalizeManifest(LEGACY_MANIFEST);
    }
    fixBackgroundCache();
    addWindow("folder");

    nowClock();
    state.clockTimer = setInterval(nowClock, 20000);
    state.glitchTimer = setInterval(() => { if (Math.random() < .55) glitchBurst(); }, 3000);

    if (mobileWorks) {
      mobileWorks.innerHTML = allItems().map(item => `
        <article class="mobile-card" data-mobile-work="${escapeHtml(item.id)}">
          <img src="${imageSrc(item)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="m-info"><b>${escapeHtml(item.title || fileTitle(item.file))}</b></div>
        </article>
      `).join("");

      mobileWorks.addEventListener("click", e => {
        const card = e.target.closest("[data-mobile-work]");
        if (!card) return;
        const work = findItem(card.dataset.mobileWork);
        if (work) loadDimensions(work).then(() => addWindow("art", work));
      });
    }
    render();
  }

  function nowClock() {
    const d = new Date();
    $("#clock").textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  init();
})();