/* ==========================================================================
   DANIELS® — shared core
   - i18n (PT / EN): ?lang= → saved choice → browser language
   - Header: wordmark, PT|EN switch, cream ticket ("now showing" + menu)
   - Footer: end credits
   - Helpers: links, posters / placeholders, scroll reveal
   Plain scripts (no modules) so the site also works opened from disk.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var P = SITE.profile || {};
  var LANGS = ["pt", "en"];

  /* ---------- small utilities ---------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isExternal(url) { return /^https?:\/\//i.test(url); }

  /* ---------- i18n ---------- */
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  function detectLang() {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.indexOf(q) > -1) { store("daniels-lang", q); return q; }
    var saved = store("daniels-lang");
    if (LANGS.indexOf(saved) > -1) return saved;
    return /^pt/i.test(navigator.language || "") ? "pt" : "en";
  }

  var lang = detectLang();

  /** Bilingual value → current language ({pt,en} objects, arrays inside, or plain strings). */
  function t(v) {
    if (v == null) return "";
    if (typeof v === "object" && !Array.isArray(v) && ("pt" in v || "en" in v)) {
      var x = v[lang];
      return x == null || x === "" ? (v[lang === "pt" ? "en" : "pt"] || "") : x;
    }
    return v;
  }

  /** Interface string by key. */
  function ui(key) {
    var dict = (SITE.ui || {})[lang] || {};
    return dict[key] != null ? dict[key] : key;
  }

  function applyStatic(scope) {
    scope = scope || document;
    Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n]"), function (el) { el.textContent = ui(el.getAttribute("data-i18n")); });
    Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n-html]"), function (el) { el.innerHTML = ui(el.getAttribute("data-i18n-html")); });
    Array.prototype.forEach.call(scope.querySelectorAll("[data-i18n-aria]"), function (el) { el.setAttribute("aria-label", ui(el.getAttribute("data-i18n-aria"))); });
  }

  function setLang(next) {
    if (LANGS.indexOf(next) < 0 || next === lang) return;
    lang = next;
    store("daniels-lang", lang);
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    syncDocument();
    applyStatic();
    document.dispatchEvent(new CustomEvent("ds:lang", { detail: { lang: lang } }));
  }

  function syncDocument() {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
  }

  /* ---------- links ---------- */
  /** A real link when `url` is set, otherwise an honest "Coming soon" note. */
  function link(url, text, opts) {
    opts = opts || {};
    if (!url) return '<span class="soon">' + esc(opts.pendingText || ui("soon")) + "</span>";
    var ext = isExternal(url);
    var attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : "";
    if (opts.download) attrs += " download";
    var arrow = opts.arrow === false ? "" : ' <span class="arrow" aria-hidden="true">' + (ext ? "↗" : "→") + "</span>";
    var sr = ext ? '<span class="sr-only"> ' + esc(ui("newtab")) + "</span>" : "";
    return '<a class="textlink' + (opts.cls ? " " + opts.cls : "") + '" href="' + esc(url) + '"' + attrs + ">" + esc(text) + arrow + sr + "</a>";
  }

  function handleFromUrl(url) {
    var m = String(url || "").match(/instagram\.com\/([^/?#]+)/i);
    return m ? "@" + m[1] : url;
  }

  function socials() {
    var list = [];
    if (P.instagram) list.push({ label: "Instagram", url: P.instagram });
    if (P.vimeo) list.push({ label: "Vimeo", url: P.vimeo });
    if (P.youtube) list.push({ label: "YouTube", url: P.youtube });
    if (P.letterboxd) list.push({ label: "Letterboxd", url: P.letterboxd });
    if (P.linkedin) list.push({ label: "LinkedIn", url: P.linkedin });
    return list;
  }

  /* ---------- projects ---------- */
  function projects() { return SITE.projects || []; }
  function featured() { return projects().filter(function (p) { return p.featured; }); }
  function projectUrl(p) { return "project.html?p=" + encodeURIComponent(p.slug) + "&lang=" + lang; }
  function catLabel(c) { return ui("cat." + c); }
  function sampleTag(item) { return item && item.sample ? '<span class="tag">' + esc(ui("sample")) + "</span>" : ""; }

  /** Poster artwork, or a slate-style placeholder when none is supplied. */
  function poster(p, index, opts) {
    opts = opts || {};
    var title = t(p.title);
    if (p.poster) {
      var loading = opts.eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
      return '<img class="poster__img" src="' + esc(p.poster) + '" alt="' + esc(t(p.posterAlt) || title) + '" ' + loading + ' decoding="async">';
    }
    return '<span class="slate" role="img" aria-label="' + esc(title + " — " + ui("work.empty")) + '">' +
      '<span class="slate__bar" aria-hidden="true"></span>' +
      '<span class="slate__row"><span>' + pad((index || 0) + 1) + "</span><span>" + esc(catLabel(p.category)) + "</span></span>" +
      '<span class="slate__title">' + esc(title) + "</span>" +
      '<span class="slate__note">' + esc(ui("work.empty")) + "</span>" +
    "</span>";
  }

  /* ==========================================================================
     Header + ticket
     ========================================================================== */
  var CHEV = '<svg viewBox="0 0 15 8" aria-hidden="true"><path d="m1 1 5.09 5.09a2 2 0 0 0 2.82 0L14 1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 11 10" aria-hidden="true"><path fill="currentColor" d="M4.481.005a6.65 6.65 0 0 1 6.46 4.659c.078.229.08.479-.003.706C10.302 7.105 8.318 10 4.48 10V8.39c.941.127 2.922-.257 4.442-2.603H0V4.208h8.938c-.756-1.229-2.216-2.78-4.457-2.78V.006Z"/></svg>';

  var isHome = !!document.querySelector("[data-home]");
  var ticket = { current: null };

  function navItems() {
    var base = isHome ? "" : "index.html";
    return [
      ["films", "nav.films"],
      ["development", "nav.development"],
      ["work", "nav.work"],
      ["statement", "nav.statement"],
      ["contact", "nav.contact"]
    ].map(function (n) { return { href: base + "#" + n[0], key: n[1] }; });
  }

  function renderHeader() {
    var el = document.querySelector("[data-header]");
    if (!el) return;
    var home = isHome ? "#top" : "index.html";

    el.innerHTML =
      '<div class="hd__inner">' +
        '<a class="hd__logo" href="' + home + '" aria-label="DANIELS — ' + esc(ui("nav.home")) + '">' +
          "<span>DANIELS<sup>®</sup></span><small>DIRECTION · AUDIOVISUAL</small>" +
        "</a>" +
        '<div class="hd__right">' +
          '<div class="lang" role="group" aria-label="' + esc(ui("lang.label")) + '">' +
            '<button type="button" data-lang="pt" lang="pt-BR">PT</button>' +
            '<span aria-hidden="true">/</span>' +
            '<button type="button" data-lang="en" lang="en">EN</button>' +
          "</div>" +
          '<div class="tk" data-tk>' +
            '<div class="tk__body">' +
              '<button type="button" class="tk__film" data-tk-films aria-expanded="false" aria-controls="tk-drop">' +
                '<span class="tk__top">' +
                  '<span class="tk__thumb"><img src="" alt="" data-tk-img></span>' +
                  '<span class="tk__title" data-tk-title></span>' +
                  '<span class="tk__chev">' + CHEV + "</span>" +
                "</span>" +
                '<span class="tk__bot">' +
                  '<span class="tk__cell" data-tk-cat></span>' +
                  '<span class="tk__cell tk__cell--c" data-tk-year></span>' +
                  '<span class="tk__cell" data-tk-dur></span>' +
                "</span>" +
              "</button>" +
              '<span class="tk__seam" aria-hidden="true"></span>' +
              '<button type="button" class="tk__menu" data-tk-menu aria-expanded="false" aria-controls="tk-panel">' +
                '<span class="sr-only">' + esc(ui("nav.menu")) + "</span>" +
                '<span class="tk__lines" aria-hidden="true"><i></i><i></i><i></i></span>' +
              "</button>" +
            "</div>" +
            '<div class="tk__drop" id="tk-drop" data-tk-drop></div>' +
            '<nav class="tk__panel" id="tk-panel" data-tk-panel aria-label="' + esc(ui("nav.menu")) + '"></nav>' +
          "</div>" +
        "</div>" +
      "</div>";

    bindHeader(el);
    fillHeader();
    syncDocument();
  }

  function fillHeader() {
    var el = document.querySelector("[data-header]");
    if (!el) return;
    var films = featured();

    el.querySelector("[data-tk-drop]").innerHTML =
      '<p class="tk__label">' + esc(ui("nav.films_list")) + "</p>" +
      films.map(function (f, i) {
        return '<a class="tk__item" href="' + esc(isHome ? "#films" : projectUrl(f)) + '" data-tk-jump="' + i + '">' +
          '<span class="tk__thumb"><img src="' + esc(f.poster || f.featured.backdrop) + '" alt="" loading="lazy"></span>' +
          '<span class="tk__item-tx"><b>' + esc(t(f.title)) + "</b><small>" + esc([catLabel(f.category), f.year].filter(Boolean).join(" · ")) + "</small></span>" +
          '<span class="tk__item-ar">' + ARROW_R + "</span>" +
        "</a>";
      }).join("");

    el.querySelector("[data-tk-panel]").innerHTML =
      '<ul class="tk__nav">' +
        navItems().map(function (n, i) {
          return '<li><a href="' + n.href + '"><small>' + pad(i + 1) + "</small>" + esc(ui(n.key)) + "</a></li>";
        }).join("") +
      "</ul>" +
      (P.instagram ? '<a class="tk__social" href="' + esc(P.instagram) + '" target="_blank" rel="noopener noreferrer">Instagram ' + esc(P.instagramHandle || "") + " ↗</a>" : "");

    el.querySelector("[data-tk-menu] .sr-only").textContent = ui("nav.menu");
    el.querySelector(".lang").setAttribute("aria-label", ui("lang.label"));
    setTicket(ticket.current || films[0] || projects()[0], true);
  }

  function setTicket(p, silent) {
    var el = document.querySelector("[data-header]");
    if (!el || !p) return;
    var changed = ticket.current !== p;
    ticket.current = p;
    var tk = el.querySelector("[data-tk]");
    if (changed && !silent) {
      tk.classList.remove("is-swap");
      void tk.offsetWidth;
      tk.classList.add("is-swap");
    }
    el.querySelector("[data-tk-title]").textContent = t(p.title);
    var img = el.querySelector("[data-tk-img]");
    var src = p.poster || (p.featured && p.featured.backdrop) || "";
    if (src) { img.src = src; img.parentNode.hidden = false; } else { img.parentNode.hidden = true; }
    el.querySelector("[data-tk-cat]").textContent = catLabel(p.category);
    el.querySelector("[data-tk-year]").textContent = p.year || "—";
    el.querySelector("[data-tk-dur]").textContent = p.duration ? "MIN." + p.duration : "DANIELS";
    var films = featured();
    Array.prototype.forEach.call(el.querySelectorAll("[data-tk-jump]"), function (a) {
      a.classList.toggle("is-active", films[+a.getAttribute("data-tk-jump")] === p);
    });
  }

  function bindHeader(el) {
    var tk = el.querySelector("[data-tk]");
    var bFilms = el.querySelector("[data-tk-films]");
    var bMenu = el.querySelector("[data-tk-menu]");
    var drop = el.querySelector("[data-tk-drop]");
    var panel = el.querySelector("[data-tk-panel]");

    function open(which) {
      var f = which === "films", m = which === "menu";
      drop.classList.toggle("is-open", f);
      panel.classList.toggle("is-open", m);
      bFilms.setAttribute("aria-expanded", String(f));
      bMenu.setAttribute("aria-expanded", String(m));
      tk.classList.toggle("is-films", f);
      tk.classList.toggle("is-menu", m);
    }
    ticket.close = function () { open(null); };

    bFilms.addEventListener("click", function () { open(drop.classList.contains("is-open") ? null : "films"); });
    bMenu.addEventListener("click", function () { open(panel.classList.contains("is-open") ? null : "menu"); });
    drop.addEventListener("click", function (e) {
      var a = e.target.closest("[data-tk-jump]");
      if (!a) return;
      open(null);
      if (isHome && window.SF) { e.preventDefault(); window.SF.goTo(+a.getAttribute("data-tk-jump")); }
    });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) open(null); });
    document.addEventListener("click", function (e) { if (!tk.contains(e.target)) open(null); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && (tk.classList.contains("is-films") || tk.classList.contains("is-menu"))) { open(null); bMenu.focus(); }
    });

    el.querySelector(".lang").addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (b) setLang(b.getAttribute("data-lang"));
    });

    // Dark ink + no gradient while the header sits over a light "paper" section
    var papers = document.querySelectorAll("[data-paper]");
    var update = function () {
      var y = 50, on = false;
      for (var i = 0; i < papers.length; i++) {
        var r = papers[i].getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) { on = true; break; }
      }
      el.classList.toggle("on-paper", on);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ==========================================================================
     Footer — end credits
     ========================================================================== */
  function renderFooter() {
    var el = document.querySelector("[data-footer]");
    if (!el) return;
    var s = socials().map(function (x) { return "<li>" + link(x.url, x.label) + "</li>"; }).join("");
    var rows = [["ft.directed", "Daniels"], ["ft.edited", "Daniels"], ["ft.art", "Daniels"], ["ft.produced", "Arturus"]];
    el.innerHTML =
      '<div class="container ft">' +
        '<dl class="ft__credits" data-reveal>' +
          rows.map(function (r) { return "<div><dt>" + esc(ui(r[0])) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") +
        "</dl>" +
        '<p class="ft__end" data-reveal>' + esc(ui("ft.end")) + "</p>" +
        '<div class="ft__bar">' +
          '<a class="hd__logo ft__logo" href="' + (isHome ? "#top" : "index.html") + '"><span>DANIELS<sup>®</sup></span></a>' +
          (s ? '<ul class="ft__social">' + s + "</ul>" : "") +
          '<p class="ft__copy">© ' + new Date().getFullYear() + " Daniels · Arturus. " + esc(ui("ft.rights")) + "</p>" +
          '<a class="textlink ft__top" href="#top">' + esc(ui("ft.top")) + ' <span class="arrow" aria-hidden="true">↑</span></a>' +
        "</div>" +
      "</div>";
    observeReveal(el);
  }

  /* ---------- scroll reveal ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var io = ("IntersectionObserver" in window) && !reduced.matches
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -10% 0px" })
    : null;

  function observeReveal(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll("[data-reveal]:not(.is-in)"), function (el) {
      if (io) io.observe(el); else el.classList.add("is-in");
    });
  }

  document.addEventListener("ds:lang", function () { fillHeader(); renderFooter(); });

  window.DS = {
    esc: esc, pad: pad, link: link, socials: socials, poster: poster, handleFromUrl: handleFromUrl,
    t: t, ui: ui, lang: function () { return lang; }, setLang: setLang, applyStatic: applyStatic,
    projects: projects, featured: featured, projectUrl: projectUrl, catLabel: catLabel, sampleTag: sampleTag,
    renderHeader: renderHeader, renderFooter: renderFooter, setTicket: setTicket,
    closeTicket: function () { if (ticket.close) ticket.close(); },
    observeReveal: observeReveal,
    reducedMotion: reduced
  };

  document.documentElement.classList.add("js");
  renderHeader();
  renderFooter();
  applyStatic();
  syncDocument();
})();
