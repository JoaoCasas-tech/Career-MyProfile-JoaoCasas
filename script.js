(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function resolveInitial() {
    if (stored === "light" || stored === "dark") return stored;
    return prefersDark.matches ? "dark" : "light";
  }

  applyTheme(resolveInitial());

  prefersDark.addEventListener("change", function (e) {
    if (!stored) applyTheme(e.matches ? "dark" : "light");
  });

  document.querySelector(".header-actions .theme-toggle")?.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    stored = next;
    applyTheme(next);
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();

(function () {
  function syncHeaderHeight() {
    var header = document.querySelector(".site-header");
    if (header) {
      document.documentElement.style.setProperty(
        "--header-sticky-height",
        Math.round(header.getBoundingClientRect().height) + "px"
      );
    }
  }

  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  window.addEventListener("load", syncHeaderHeight);

  var siteHeader = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navBackdrop = document.querySelector(".nav-backdrop");
  var siteNav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!siteHeader || !navToggle) return;
    siteHeader.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    syncHeaderHeight();
  }

  function closeNav() {
    setNavOpen(false);
  }

  navToggle?.addEventListener("click", function () {
    var open = !siteHeader.classList.contains("nav-open");
    setNavOpen(open);
  });

  navBackdrop?.addEventListener("click", closeNav);

  siteNav?.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 720px)").matches) {
        closeNav();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && siteHeader?.classList.contains("nav-open")) {
      closeNav();
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 721px)").matches) {
      closeNav();
    }
  });
})();

(function () {
  var sectionIds = ["sobre", "experiencia", "programming-technical", "projetos", "ai-assisted", "contato"];
  var headerSel = ".site-header";
  var headingSel = "h2.section-title";
  var extraGapPx = 12;

  function headerOffset() {
    var header = document.querySelector(headerSel);
    return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  }

  function scrollToSectionTitle(sectionId, smooth) {
    var section = document.getElementById(sectionId);
    if (!section || section.tagName !== "SECTION") return false;
    var heading = section.querySelector(headingSel);
    if (!heading) return false;
    var y = heading.getBoundingClientRect().top + window.scrollY - headerOffset() - extraGapPx;
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? "smooth" : "auto" });
    return true;
  }

  function hashId() {
    var h = location.hash.replace(/^#/, "");
    try {
      return decodeURIComponent(h);
    } catch (e) {
      return h;
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var raw = a.getAttribute("href");
      if (!raw || raw === "#") return;
      var id = raw.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch (err) {}
      if (!id || id === "conteudo") return;
      if (sectionIds.indexOf(id) === -1) return;
      e.preventDefault();
      if (scrollToSectionTitle(id, true)) {
        history.pushState(null, "", "#" + id);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    var id = hashId();
    if (id && sectionIds.indexOf(id) !== -1) {
      scrollToSectionTitle(id, true);
    }
  });

  window.addEventListener("load", function () {
    var id = hashId();
    if (id && sectionIds.indexOf(id) !== -1) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          scrollToSectionTitle(id, false);
        });
      });
    }
  });
})();
