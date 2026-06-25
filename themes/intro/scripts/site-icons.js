(function () {
  document.querySelectorAll("[data-site-icon]").forEach(function (target) {
    var site = target.getAttribute("data-site-icon");
    if (!site) return;

    var url;
    try {
      url = new URL("/favicon.ico", site);
    } catch (error) {
      return;
    }

    var img = document.createElement("img");
    img.src = url.toString();
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = function () {
      target.textContent = target.getAttribute("data-fallback") || "";
    };
    target.replaceChildren(img);
  });
})();
