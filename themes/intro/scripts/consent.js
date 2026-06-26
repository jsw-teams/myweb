(function () {
  var config = window.JSGripeConfig || {};
  var supported = Array.isArray(config.locales) && config.locales.length ? config.locales : ["zh-CN", "zh-TW", "en"];
  var defaultLocale = supported.indexOf(config.defaultLocale) >= 0 ? config.defaultLocale : supported[0];
  var storageKey = config.storageKey || "blog.locale";
  var basePath = String(config.basePath || window.JSGripeBasePath || "").replace(/\/$/, "");
  var features = config.themeFeatures || {};
  var featureScripts = config.themeFeatureScripts || {};
  var featureStyles = config.themeFeatureStyles || {};
  var featureCategories = config.themeFeatureCategories || {};
  var consentConfig = config.themeConsent || {};

  function withBase(path) {
    if (!basePath || path.indexOf("/") !== 0 || path.indexOf(basePath + "/") === 0) return path;
    return basePath + path;
  }

  function storedLocale() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return supported.indexOf(value) >= 0 ? value : "";
    } catch (error) {
      return "";
    }
  }

  function saveLocale(locale) {
    if (supported.indexOf(locale) < 0) return;
    try {
      window.localStorage.setItem(storageKey, locale);
    } catch (error) {}
  }

  function browserLocale() {
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var index = 0; index < languages.length; index += 1) {
      var language = String(languages[index]).toLowerCase();
      if (language === "zh-tw" || language === "zh-hk" || language === "zh-mo" || language.indexOf("zh-hant") === 0) return "zh-TW";
      if (language === "zh-cn" || language.indexOf("zh-hans") === 0 || language === "zh") return "zh-CN";
      if (language.indexOf("en") === 0) return "en";
    }
    return defaultLocale;
  }

  function preferredLocale() {
    return storedLocale() || browserLocale();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatDate(value, locale) {
    var date = new Date(String(value || "") + "T00:00:00Z");
    if (Number.isNaN(date.getTime())) return value || "";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    }).format(date);
  }

  function loadScriptOnce(src, id) {
    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      var script = document.createElement("script");
      script.id = id;
      script.src = withBase(src);
      script.async = true;
      script.defer = true;
      script.onload = function () {
        script.setAttribute("data-loaded", "true");
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadStyleOnce(href, id) {
    if (!href || document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = withBase(href);
    document.head.appendChild(link);
  }

  window.JSGripeTheme = {
    config: config,
    supportedLocales: supported,
    withBase: withBase,
    preferredLocale: preferredLocale,
    saveLocale: saveLocale,
    escapeHtml: escapeHtml,
    normalizeText: normalizeText,
    formatDate: formatDate,
    loadScriptOnce: loadScriptOnce,
    loadStyleOnce: loadStyleOnce
  };

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-locale-choice]");
    if (link) saveLocale(link.getAttribute("data-locale-choice"));
  });

  var pathParts = window.location.pathname.split("/").filter(Boolean);
  if (supported.indexOf(pathParts[0]) >= 0) saveLocale(pathParts[0]);

  var preferred = preferredLocale();
  document.documentElement.setAttribute("data-preferred-locale", preferred);

  if (document.body && document.body.getAttribute("data-root-language-picker") === "true") {
    window.location.replace(withBase("/" + preferred + "/"));
    return;
  }

  function consentEnabled() {
    return consentConfig.enabled !== false;
  }

  function consentRevision() {
    return String(consentConfig.revision || 1);
  }

  function consentStorageKey() {
    return consentConfig.storageKey || "site-consent";
  }

  function consentOptionalCategories() {
    var categories = consentConfig.categories || {};
    var optional = Object.keys(categories).filter(function (key) {
      return key !== "necessary" && categories[key] && categories[key].required !== true;
    });
    return optional.length ? optional : ["preferences", "analytics", "marketing"];
  }

  function readChoice() {
    try {
      var parsed = JSON.parse(localStorage.getItem(consentStorageKey()) || "null");
      return parsed && String(parsed.revision) === consentRevision() ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function consentAllows(category) {
    var normalized = category || "necessary";
    if (!consentEnabled()) return true;
    if (normalized === "necessary") return !!readChoice();
    var choice = readChoice();
    return !!(choice && choice.categories && choice.categories[normalized]);
  }

  function hasConsentChoice() {
    return !consentEnabled() || !!readChoice();
  }

  function activateConsentScripts(choice) {
    document.querySelectorAll("script[type='text/plain'][data-consent-src][data-consent-category]").forEach(function (node) {
      var category = node.getAttribute("data-consent-category") || "necessary";
      if (category !== "necessary" && !(choice && choice[category])) return;
      var script = document.createElement("script");
      Array.prototype.slice.call(node.attributes).forEach(function (attr) {
        if (attr.name === "type" || attr.name === "data-consent-src" || attr.name === "data-consent-category") return;
        script.setAttribute(attr.name, attr.value);
      });
      if (node.getAttribute("data-consent-src")) script.src = node.getAttribute("data-consent-src");
      script.text = node.textContent || "";
      script.async = node.async !== false;
      node.replaceWith(script);
    });
  }

  function loadThemeFeatures() {
    if (!hasConsentChoice()) return;
    [
      ["search", "[data-search-root]"],
      ["lightbox", ".prose img"],
      ["media", "[data-region-media], [data-audio-track-root], [data-caption-track-root]"],
      ["comments", "[data-comments-root]"],
      ["webMcp", ""]
    ].forEach(function (entry) {
      var key = entry[0];
      var selector = entry[1];
      var category = featureCategories[key] || "necessary";
      if (key === "consent" || features[key] === false || !featureScripts[key]) return;
      if (selector && !document.querySelector(selector)) return;
      if (!consentAllows(category)) return;
      (featureStyles[key] || []).forEach(function (href, index) {
        loadStyleOnce(href, "theme-feature-style-" + key + "-" + index);
      });
      loadScriptOnce(featureScripts[key], "theme-feature-" + key).catch(function () {});
    });
  }

  function hidePanel() {
    var layer = document.querySelector("[data-consent-layer]");
    if (layer) layer.hidden = true;
    if (readChoice()) document.documentElement.classList.add("has-consent-choice");
    document.body.classList.remove("consent-pending");
  }

  function writeChoice(values) {
    var optional = consentOptionalCategories();
    var categoriesChoice = { necessary: true };
    optional.forEach(function (key) {
      categoriesChoice[key] = !!values[key];
    });
    try {
      localStorage.setItem(consentStorageKey(), JSON.stringify({
        revision: consentRevision(),
        categories: categoriesChoice,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {}
    window.dispatchEvent(new CustomEvent("jsgripe:consentchange", { detail: categoriesChoice }));
    activateConsentScripts(categoriesChoice);
    hidePanel();
    loadThemeFeatures();
  }

  function bindPanel(layer) {
    if (!layer || layer.getAttribute("data-consent-bound") === "true") return layer;
    var optional = consentOptionalCategories();
    var panel = layer.querySelector("[data-consent-panel]");
    if (!panel) return layer;
    panel.querySelector("[data-consent-close]").addEventListener("click", hidePanel);
    panel.querySelector("[data-consent-accept]").addEventListener("click", function () {
      var values = {};
      optional.forEach(function (key) { values[key] = true; });
      writeChoice(values);
    });
    panel.querySelector("[data-consent-reject]").addEventListener("click", function () {
      writeChoice({});
    });
    panel.querySelector("[data-consent-save]").addEventListener("click", function () {
      var values = {};
      optional.forEach(function (key) {
        var input = panel.querySelector("[data-consent-input='" + key + "']");
        values[key] = !!(input && input.checked);
      });
      writeChoice(values);
    });
    layer.setAttribute("data-consent-bound", "true");
    return layer;
  }

  function openPanel(forcePending) {
    if (!consentEnabled()) return;
    var layer = document.querySelector("[data-consent-layer]");
    if (!layer) return;
    bindPanel(layer);
    var panel = layer.querySelector("[data-consent-panel]");
    var choice = readChoice();
    var pending = forcePending === true || !choice;
    consentOptionalCategories().forEach(function (key) {
      var input = panel.querySelector("[data-consent-input='" + key + "']");
      if (input) input.checked = !!(choice && choice.categories && choice.categories[key]);
    });
    var close = panel.querySelector("[data-consent-close]");
    if (close) close.hidden = pending;
    document.documentElement.classList.remove("has-consent-choice");
    document.body.classList.toggle("consent-pending", pending);
    layer.hidden = false;
  }

  window.JSGripeConsent = {
    allows: consentAllows,
    open: openPanel,
    choice: readChoice
  };

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-consent-open]");
    if (!trigger) return;
    event.preventDefault();
    openPanel();
  });

  if (!consentEnabled()) {
    loadThemeFeatures();
    return;
  }

  var current = readChoice();
  if (current) {
    document.documentElement.classList.add("has-consent-choice");
    hidePanel();
    activateConsentScripts(current.categories);
    loadThemeFeatures();
  } else {
    openPanel(true);
  }
})();
