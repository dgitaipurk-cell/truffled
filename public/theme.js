(function () {
  const THEME_KEY = "ApricityTheme";
  const CHANNEL_KEY = "Apricity-theme";
  const themeChannel = typeof BroadcastChannel === "function"
    ? new BroadcastChannel(CHANNEL_KEY)
    : null;
  const themes = {
    default: { name: "default" },
    green: {
      name: "green",
      bg: "#06170b", bgAlt: "#031008", surface: "#0b2412", surface2: "#10381b",
      border: "#1d6b35", text: "#f0fff4", muted: "#a9cdb2", accent: "#22c55e", highlight: "#15803d",
      cursor: { url: "/cursors/tinted/green/cursor.cur", hotspot: [0, 0] },
      linkCursor: { url: "/cursors/tinted/green/link.cur", hotspot: [0, 0] },
      textCursor: { url: "/cursors/tinted/green/text.cur", hotspot: [0, 0] }
    },
    gray: {
      name: "gray",
      bg: "#1a1a1a", bgAlt: "#181818", surface: "#1f1f1f", surface2: "#202020",
      border: "#4d4d4d", text: "#f2f5f7", muted: "#aab3bb", accent: "rgb(104, 104, 104)", highlight: "rgb(75, 75, 75)",
      cursor: { url: "/cursors/tinted/gray/cursor.cur", hotspot: [0, 0] },
      linkCursor: { url: "/cursors/tinted/gray/link.cur", hotspot: [0, 0] },
      textCursor: { url: "/cursors/tinted/gray/text.cur", hotspot: [0, 0] }
    },
    blue: {
      name: "blue",
      bg: "#112e4d", bgAlt: "#081a2e", surface: "#194268", surface2: "#2b7ec7",
      border: "#2574af", text: "#f0f8ff", muted: "#a8bfd3", accent: "#38bdf8", highlight: "#0580c2",
      cursor: { url: "/cursors/tinted/blue/cursor.cur", hotspot: [0, 0] },
      linkCursor: { url: "/cursors/tinted/blue/link.cur", hotspot: [0, 0] },
      textCursor: { url: "/cursors/tinted/blue/text.cur", hotspot: [0, 0] }
    },
    purple: {
      name: "purple",
      bg: "#160a24", bgAlt: "#0f0718", surface: "#241336", surface2: "#32194c",
      border: "#6d3aa0", text: "#faf5ff", muted: "#cdb7df", accent: "#a855f7", highlight: "#7e22ce",
      cursor: { url: "/cursors/tinted/purple/cursor.cur", hotspot: [0, 0] },
      linkCursor: { url: "/cursors/tinted/purple/link.cur", hotspot: [0, 0] },
      textCursor: { url: "/cursors/tinted/purple/text.cur", hotspot: [0, 0] }
    }
  };
  function getThemeId(id = localStorage.getItem(THEME_KEY) || "default") {
    return themes[id] ? id : "default";
  }
  function clearThemeVariables(root) {
    ["--bg","--bg-alt","--surface","--surface-2","--border","--text","--text-muted","--accent","--highlight","--radius","--theme-bg-image","--theme-bg-opacity","--cursor-default","--cursor-link","--cursor-text"].forEach((name) => {
      root.style.removeProperty(name);
    });
  }
  function cursorValue(cursor) {
    if (!cursor?.url) return "";
    const [x = 0, y = 0] = cursor.hotspot || [];
    return `url("${cursor.url}") ${x} ${y}`;
  }
  function applyTheme(id = localStorage.getItem(THEME_KEY) || "default") {
    const themeId = getThemeId(id);
    const root = document.documentElement;
    root.dataset.theme = themeId;
    if (themeId === "default") {
      clearThemeVariables(root);
      return;
    }
    const theme = themes[themeId];
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--bg-alt", theme.bgAlt);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--surface-2", theme.surface2);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-muted", theme.muted);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--highlight", theme.highlight);
    root.style.setProperty("--radius", "8px");
    root.style.setProperty("--cursor-default", cursorValue(theme.cursor) || 'url("/css/comic.cur") 0 0');
    root.style.setProperty("--cursor-link", cursorValue(theme.linkCursor) || 'url("/css/comiclink.cur") 0 0');
    root.style.setProperty("--cursor-text", cursorValue(theme.textCursor) || 'url("/css/comictext.cur") 0 0');
  }
  function saveTheme(id) {
    const themeId = getThemeId(id);
    localStorage.setItem(THEME_KEY, themeId);
    applyTheme(themeId);
    themeChannel?.postMessage({ type: "theme-changed", id: themeId });
  }
  function updateControls() {
    const select = document.getElementById("themeSelect");
    if (select) select.value = getThemeId();
  }
  function initSettingsControls() {
    const select = document.getElementById("themeSelect");
    if (!select) return;
    select.innerHTML = "";
    Object.entries(themes).forEach(([id, theme]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = theme.name;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      saveTheme(select.value);
      updateControls();
    });
    document.getElementById("themeReset")?.addEventListener("click", () => {
      saveTheme("default");
      updateControls();
    });
    updateControls();
  }
  window.ApricityTheme = { applyTheme, saveTheme, themes };
  themeChannel?.addEventListener("message", (event) => {
    if (event.data?.type === "theme-changed") {
      applyTheme(event.data.id);
      updateControls();
    }
  });
  applyTheme();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSettingsControls, { once: true });
  } else {
    initSettingsControls();
  }
})();
