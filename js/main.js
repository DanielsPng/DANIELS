/* ==========================================================================
   DANIELS® — homepage
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var DS = window.DS;
  var esc = DS.esc, link = DS.link;
  var P = SITE.profile || {};

  function $(sel) { return document.querySelector(sel); }
  function sampleTag(item) { return item.sample ? '<span class="tag">Sample</span>' : ""; }

  /* ------------------------------------------------------------------ */
  /*  HERO                                                               */
  /* ------------------------------------------------------------------ */
  function initHero() {
    var H = SITE.hero || {};
    var hero = $("[data-hero]");
    if (!hero) return;

    var poster = $("[data-hero-poster]");
    if (H.poster && poster && poster.getAttribute("src") !== H.poster) poster.src = H.poster;
    if (H.focus) {
      hero.style.setProperty("--focus-d", H.focus.desktop || "50% 50%");
      hero.style.setProperty("--focus-m", H.focus.mobile || H.focus.desktop || "50% 50%");
    }

    var cap = $("[data-hero-caption]");
    if (cap) { if (H.caption) cap.textContent = H.caption; else cap.remove(); }

    // Video — only when a source is configured; respects reduced motion & data saver.
    var v = H.video || {};
    var isMobile = window.matchMedia("(max-width: 760px)").matches;
    var src = (isMobile && v.mobile) ? v.mobile : v.desktop;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!src || saveData) return;

    var media = $("[data-hero-media]");
    var btn = $("[data-hero-playback]");
    var video = document.createElement("video");
    video.className = "hero__video";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.preload = "metadata";
    if (H.poster) video.poster = H.poster;
    video.src = src;
    media.appendChild(video);

    var userPaused = DS.reducedMotion.matches; // reduced motion → start paused on the poster
    function setBtn() {
      if (!btn) return;
      var paused = video.paused;
      btn.textContent = paused ? "Play" : "Pause";
      btn.setAttribute("aria-label", (paused ? "Play" : "Pause") + " background video");
    }
    function tryPlay() {
      if (userPaused) return;
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked — the poster stays */ });
    }

    video.addEventListener("playing", function () { hero.classList.add("has-video"); setBtn(); });
    video.addEventListener("pause", setBtn);
    video.addEventListener("error", function () { video.remove(); if (btn) btn.hidden = true; });
    video.addEventListener("loadeddata", function () { if (btn) btn.hidden = false; setBtn(); });

    if (btn) btn.addEventListener("click", function () {
      if (video.paused) { userPaused = false; hero.classList.add("has-video"); tryPlay(); }
      else { userPaused = true; video.pause(); }
    });

    DS.reducedMotion.addEventListener("change", function (m) {
      if (m.matches) { userPaused = true; video.pause(); }
    });

    // Pause while off-screen to save battery / CPU.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) tryPlay(); else video.pause();
      }).observe(hero);
    } else {
      tryPlay();
    }
  }

  /* ------------------------------------------------------------------ */
  /*  SELECTED WORK                                                      */
  /* ------------------------------------------------------------------ */
  function projectCard(p, i) {
    var meta = [DS.titleCase(p.category), p.year].filter(Boolean).join(" · ");
    return '<li class="poster-card" data-category="' + esc(p.category) + '">' +
      '<a class="poster-card__link" href="project.html?p=' + encodeURIComponent(p.slug) + '">' +
        '<span class="poster">' + DS.poster(p, i) + "</span>" +
        '<span class="poster-card__meta">' +
          '<span class="poster-card__num">' + DS.pad(i + 1) + "</span>" +
          '<span class="poster-card__text">' +
            '<h3 class="poster-card__title">' + esc(p.title) + "</h3>" +
            '<span class="poster-card__cat">' + esc(meta) + "</span>" +
          "</span>" +
          sampleTag(p) +
        "</span>" +
      "</a></li>";
  }

  function renderProjects() {
    var grid = $("[data-project-grid]");
    var list = SITE.projects || [];
    if (!grid) return;
    grid.innerHTML = list.map(projectCard).join("");

    // Filters only earn their place when there is enough work to browse.
    var cats = [];
    list.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
    var bar = $("[data-filters]");
    if (!bar || list.length < 8 || cats.length < 3) return;

    bar.hidden = false;
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Filter projects by category");
    bar.innerHTML = ["ALL"].concat(cats).map(function (c, i) {
      return '<button type="button" class="filter" aria-pressed="' + (i === 0) + '" data-filter="' + esc(c) + '">' + esc(DS.titleCase(c)) + "</button>";
    }).join("");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (!b) return;
      var f = b.getAttribute("data-filter");
      bar.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      grid.querySelectorAll(".poster-card").forEach(function (card) {
        card.hidden = !(f === "ALL" || card.getAttribute("data-category") === f);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  DESIGN & ART DIRECTION                                             */
  /* ------------------------------------------------------------------ */
  function renderDesign() {
    var grid = $("[data-design-grid]");
    if (!grid) return;
    grid.innerHTML = (SITE.design || []).map(function (d, i) {
      var media = d.image
        ? '<img src="' + esc(d.image) + '" alt="' + esc(d.alt || d.title) + '" loading="lazy" decoding="async">'
        : '<span class="dph" role="img" aria-label="Placeholder for ' + esc(d.title) + '">' +
            '<span class="dph__crop dph__crop--tl"></span><span class="dph__crop dph__crop--br"></span>' +
            '<span class="dph__label">' + esc(d.type) + "<br>Artwork to be supplied</span>" +
          "</span>";
      var meta = [d.type, d.year].filter(Boolean).join(" · ");
      return '<article class="design-item design-item--' + esc(d.size || "wide") + '">' +
        '<div class="design-item__media" style="aspect-ratio:' + esc(d.ratio || "4/3") + '">' + media + "</div>" +
        '<div class="design-item__caption">' +
          '<span class="design-item__num">' + DS.pad(i + 1) + "</span>" +
          "<div>" +
            '<h3 class="design-item__title">' + esc(d.title) + " " + sampleTag(d) + "</h3>" +
            '<p class="design-item__meta">' + esc(meta) + "</p>" +
            (d.description ? '<p class="design-item__desc">' + esc(d.description) + "</p>" : "") +
          "</div>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /*  ABOUT                                                              */
  /* ------------------------------------------------------------------ */
  function renderAbout() {
    var A = SITE.about || {};
    var fig = $("[data-portrait]");
    if (fig) {
      fig.innerHTML = A.portrait
        ? '<img src="' + esc(A.portrait) + '" alt="' + esc(A.portraitAlt || "Portrait of Daniels") + '" loading="lazy" decoding="async">'
        : '<span class="portrait-ph" role="img" aria-label="Portrait placeholder"><span>Portrait<br>to be supplied</span></span>';
    }

    var facts = $("[data-about-facts]");
    if (facts) {
      var pending = '<span class="pending">To be added</span>';
      var exp = (A.experience || []).length
        ? "<ul>" + A.experience.map(function (e) {
            return "<li><span>" + esc(e.role) + (e.place ? " — " + esc(e.place) : "") + "</span>" +
                   (e.period ? '<span class="facts__period">' + esc(e.period) + "</span>" : "") + "</li>";
          }).join("") + "</ul>"
        : pending;
      var skills = (A.skills || []).length ? esc(A.skills.join(", ")) : pending;
      facts.innerHTML =
        row("Based in", esc(A.location || "")) +
        row("Disciplines", esc((A.disciplines || []).join(", "))) +
        row("Experience", exp) +
        row("Skills", skills);
    }
    function row(k, v) { return v ? '<div class="facts__row"><dt>' + k + "</dt><dd>" + v + "</dd></div>" : ""; }

    var links = $("[data-about-links]");
    if (links) {
      links.innerHTML =
        "<li><span class=\"about__links-k\">CV</span>" + link(P.cv, "Download CV", { download: !/^https?:/.test(P.cv) }) + "</li>" +
        "<li><span class=\"about__links-k\">LinkedIn</span>" + link(P.linkedin, "View profile") + "</li>";
    }
  }

  /* ------------------------------------------------------------------ */
  /*  ARTURUS                                                            */
  /* ------------------------------------------------------------------ */
  function renderArturus() {
    var R = SITE.arturus || {};
    var media = $("[data-arturus-media]");
    if (media) {
      media.innerHTML = R.image
        ? '<img src="' + esc(R.image) + '" alt="' + esc(R.imageAlt || "") + '" loading="lazy" decoding="async" width="896" height="1200">'
        : "";
      if (!R.image) media.remove();
    }
    var links = $("[data-arturus-links]");
    if (links) {
      links.innerHTML =
        '<li><span class="k">Website</span>' + link(R.website, "Visit Arturus", { pendingText: "Coming soon" }) + "</li>" +
        '<li><span class="k">Instagram</span>' + link(R.instagram, DS.handleFromUrl(R.instagram), { pendingText: "Coming soon" }) + "</li>";
    }
  }

  /* ------------------------------------------------------------------ */
  /*  CONTACT                                                            */
  /* ------------------------------------------------------------------ */
  function renderContact() {
    var el = $("[data-contact-list]");
    if (!el) return;
    var rows = [
      { k: "Email", html: link(P.email ? "mailto:" + P.email : "", P.email, { arrow: false }) },
      { k: "LinkedIn", html: link(P.linkedin, "Daniels on LinkedIn") },
      { k: "Instagram", html: link(P.instagram, P.instagramHandle || DS.handleFromUrl(P.instagram)) },
      { k: "CV", html: link(P.cv, "Download CV (PDF)", { download: !/^https?:/.test(P.cv) }) }
    ];
    el.innerHTML = rows.map(function (r) {
      return '<li class="contact__row"><span class="contact__k">' + r.k + '</span><span class="contact__v">' + r.html + "</span></li>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  document.documentElement.classList.add("js");
  initHero();
  renderProjects();
  renderDesign();
  renderAbout();
  renderArturus();
  renderContact();
  DS.renderFooter("");
  DS.initHeader();
  if (window.location.hash) {
    try {
      var initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) initialTarget.scrollIntoView({ behavior: "auto" });
    } catch (e) {}
  }
  requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
})();
