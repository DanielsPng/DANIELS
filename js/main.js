/* ==========================================================================
   DANIELS® — homepage sections
   Every render function is re-run when the language changes (ds:lang).
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var DS = window.DS;
  var esc = DS.esc, t = DS.t, ui = DS.ui, link = DS.link;
  var P = SITE.profile || {};

  function $(sel) { return document.querySelector(sel); }

  /* ------------------------------------------------------------------ */
  /*  01 — OPENING TITLE                                                 */
  /* ------------------------------------------------------------------ */
  var heroVideo = null;

  function initHero() {
    var H = SITE.hero || {};
    var hero = $("[data-hero]");
    if (!hero) return;

    var poster = $("[data-hero-poster]");
    if (H.poster && poster.getAttribute("src") !== H.poster) poster.src = H.poster;
    if (H.focus) {
      hero.style.setProperty("--focus-d", H.focus.desktop || "50% 50%");
      hero.style.setProperty("--focus-m", H.focus.mobile || H.focus.desktop || "50% 50%");
    }

    // Running timecode (HH:MM:SS:FF at 24 fps) — a quiet "recording" detail
    var tc = $("[data-hero-tc]");
    var t0 = performance.now();
    function two(n) { return (n < 10 ? "0" : "") + n; }
    function tick(now) {
      var s = (now - t0) / 1000;
      tc.textContent = two(Math.floor(s / 3600)) + ":" + two(Math.floor(s / 60) % 60) + ":" + two(Math.floor(s) % 60) + ":" + two(Math.floor((s % 1) * 24));
      if (!DS.reducedMotion.matches) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Subtle push-in while the opening title scrolls away
    if (!DS.reducedMotion.matches) {
      var media = $("[data-hero-media]");
      window.addEventListener("scroll", function () {
        var p = Math.min(1, window.scrollY / hero.offsetHeight);
        media.style.transform = "scale(" + (1.04 + p * 0.08).toFixed(4) + ")";
        hero.style.setProperty("--bar", (p * 6).toFixed(2) + "vh");
      }, { passive: true });
    }

    // Video — only when a source is configured; respects reduced motion & data saver.
    var v = H.video || {};
    var isMobile = window.matchMedia("(max-width: 760px)").matches;
    var src = (isMobile && v.mobile) ? v.mobile : v.desktop;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!src || saveData) return;

    var btn = $("[data-hero-playback]");
    var video = heroVideo = document.createElement("video");
    video.className = "hero__video";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.preload = "metadata";
    if (H.poster) video.poster = H.poster;
    video.src = src;
    $("[data-hero-media]").appendChild(video);

    var userPaused = DS.reducedMotion.matches;
    function tryPlay() {
      if (userPaused) return;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
    video.addEventListener("playing", function () { hero.classList.add("has-video"); setBtn(); });
    video.addEventListener("pause", setBtn);
    video.addEventListener("error", function () { video.remove(); btn.hidden = true; });
    video.addEventListener("loadeddata", function () { btn.hidden = false; setBtn(); });
    btn.addEventListener("click", function () {
      if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) tryPlay(); else video.pause(); }).observe(hero);
    } else {
      tryPlay();
    }
  }

  function setBtn() {
    var btn = $("[data-hero-playback]");
    if (!btn || !heroVideo) return;
    var paused = heroVideo.paused;
    btn.textContent = paused ? "▶ " + ui("hero.reel") : "❚❚ " + ui("hero.reel");
    btn.setAttribute("aria-label", ui(paused ? "hero.play" : "hero.pause"));
  }

  function renderHero() {
    var H = SITE.hero || {};
    $("[data-hero-scene]").textContent = t(H.scene);
    setBtn();
  }

  /* ------------------------------------------------------------------ */
  /*  03 — IN DEVELOPMENT                                                */
  /* ------------------------------------------------------------------ */
  var STAGES = ["idea", "writing", "preproduction", "shooting", "post"];

  function renderDev() {
    var el = $("[data-dev-list]");
    if (!el) return;
    el.innerHTML = (SITE.development || []).map(function (d) {
      var at = Math.max(0, STAGES.indexOf(d.status));
      return '<li class="dcard" data-reveal>' +
        '<div class="dcard__top">' +
          '<span class="dcard__code">' + esc(d.code || "") + "</span>" +
          '<span class="dcard__format">' + esc(t(d.format)) + "</span>" +
          DS.sampleTag(d) +
        "</div>" +
        '<h3 class="dcard__title">' + esc(t(d.title)) + "</h3>" +
        (t(d.logline) ? '<p class="dcard__logline">' + esc(t(d.logline)) + "</p>" : "") +
        '<div class="dcard__status">' +
          '<p class="dcard__now"><i aria-hidden="true"></i>' + esc(ui("dev.status." + STAGES[at])) + "</p>" +
          '<ol class="dcard__track" aria-hidden="true">' +
            STAGES.map(function (s, i) {
              return '<li class="' + (i < at ? "is-done" : i === at ? "is-now" : "") + '"><span>' + esc(ui("dev.status." + s)) + "</span></li>";
            }).join("") +
          "</ol>" +
        "</div>" +
        (d.target ? '<p class="dcard__target"><span>' + esc(ui("dev.target")) + "</span>" + esc(d.target) + "</p>" : "") +
      "</li>";
    }).join("");
    DS.observeReveal(el);
  }

  /* ------------------------------------------------------------------ */
  /*  04 — WORK                                                          */
  /* ------------------------------------------------------------------ */
  var activeFilter = "all";

  function renderWork() {
    var grid = $("[data-work-grid]");
    var bar = $("[data-filters]");
    if (!grid) return;
    var list = DS.projects();

    grid.innerHTML = list.map(function (p, i) {
      var meta = [DS.catLabel(p.category), p.year].filter(Boolean).join(" · ");
      return '<li class="card" data-cat="' + esc(p.category) + '" data-reveal>' +
        '<a class="card__link" href="' + esc(DS.projectUrl(p)) + '">' +
          '<span class="card__media poster">' + DS.poster(p, i) + "</span>" +
          '<span class="card__meta">' +
            '<span class="card__num">' + DS.pad(i + 1) + "</span>" +
            '<span class="card__text"><h3 class="card__title">' + esc(t(p.title)) + "</h3>" +
            '<span class="card__cat">' + esc(meta) + "</span></span>" +
            DS.sampleTag(p) +
          "</span>" +
        "</a></li>";
    }).join("");

    var cats = [];
    list.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.length < 2) { bar.hidden = true; return; }
    bar.hidden = false;
    bar.setAttribute("aria-label", ui("work.kicker"));
    bar.innerHTML = ["all"].concat(cats).map(function (c) {
      var n = c === "all" ? list.length : list.filter(function (p) { return p.category === c; }).length;
      return '<button type="button" class="chip" aria-pressed="' + (c === activeFilter) + '" data-filter="' + esc(c) + '">' +
        esc(c === "all" ? ui("work.all") : DS.catLabel(c)) + "<sup>" + n + "</sup></button>";
    }).join("");
    applyFilter();
    DS.observeReveal(grid);
  }

  function applyFilter() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-filter]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === activeFilter));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-work-grid] .card"), function (c) {
      c.hidden = !(activeFilter === "all" || c.getAttribute("data-cat") === activeFilter);
    });
  }

  function initWork() {
    var bar = $("[data-filters]");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (!b) return;
      activeFilter = b.getAttribute("data-filter");
      applyFilter();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  05 — STATEMENT + ARTURUS                                           */
  /* ------------------------------------------------------------------ */
  function renderStatement() {
    var S = SITE.statement || {};
    var fig = $("[data-portrait]");
    fig.innerHTML = S.portrait
      ? '<img src="' + esc(S.portrait) + '" alt="' + esc(t(S.portraitAlt)) + '" loading="lazy" decoding="async">'
      : '<span class="slate slate--portrait" role="img" aria-label="' + esc(ui("st.portrait")) + '">' +
          '<span class="slate__bar" aria-hidden="true"></span>' +
          '<span class="slate__row"><span>DANIELS</span><span>4:5</span></span>' +
          '<span class="slate__note">' + esc(ui("st.portrait")) + "</span>" +
        "</span>";

    $("[data-st-lead]").textContent = t(S.lead);
    $("[data-st-text]").innerHTML = (S.paragraphs || []).map(function (p) { return "<p>" + esc(t(p)) + "</p>"; }).join("");

    var disciplines = t(S.disciplines) || [];
    $("[data-st-facts]").innerHTML =
      row(ui("st.based"), esc(t(P.location))) +
      row(ui("st.disciplines"), esc(disciplines.join(" · ")));

    var inf = S.influences || [];
    $("[data-st-influences]").innerHTML = inf.length
      ? '<p class="st__k">' + esc(ui("st.influences")) + (S.influencesSample ? " " + DS.sampleTag({ sample: true }) : "") + "</p>" +
        '<ol class="inf">' + inf.map(function (x, i) {
          return '<li><span class="inf__n">' + DS.pad(i + 1) + '</span><span class="inf__name">' + esc(x.name) + '</span><span class="inf__work">' + esc(x.work || "") + "</span></li>";
        }).join("") + "</ol>"
      : "";

    $("[data-st-cv]").innerHTML = P.cv ? link(P.cv, ui("st.cv"), { download: !/^https?:/.test(P.cv) }) : "";

    var R = SITE.arturus || {};
    var media = $("[data-ar-media]");
    media.innerHTML = R.image ? '<img src="' + esc(R.image) + '" alt="' + esc(t(R.imageAlt)) + '" loading="lazy" decoding="async">' : "";
    media.hidden = !R.image;
    $("[data-ar-text]").textContent = t(R.text);
    $("[data-ar-links]").innerHTML =
      '<li><span class="k">' + esc(ui("ar.site")) + "</span>" + link(R.website, "arturus") + "</li>" +
      '<li><span class="k">' + esc(ui("ar.ig")) + "</span>" + link(R.instagram, DS.handleFromUrl(R.instagram)) + "</li>";

    function row(k, v) { return v ? '<div class="facts__row"><dt>' + esc(k) + "</dt><dd>" + v + "</dd></div>" : ""; }
  }

  /* ------------------------------------------------------------------ */
  /*  06 — CONTACT                                                       */
  /* ------------------------------------------------------------------ */
  function renderContact() {
    $("[data-ct-main]").innerHTML = P.email
      ? '<a class="ct__email" href="mailto:' + esc(P.email) + '">' + esc(P.email) + ' <span aria-hidden="true">↗</span></a>'
      : '<p class="ct__email ct__email--soon"><span class="k">' + esc(ui("ct.email")) + "</span>" + esc(ui("soon")) + "</p>";

    var rows = [
      { k: "Instagram", html: link(P.instagram, P.instagramHandle || DS.handleFromUrl(P.instagram)) },
      { k: "Vimeo", html: link(P.vimeo, "Vimeo") },
      { k: "LinkedIn", html: link(P.linkedin, "LinkedIn") },
      { k: "CV", html: link(P.cv, ui("st.cv"), { download: !/^https?:/.test(P.cv) }) }
    ];
    $("[data-ct-list]").innerHTML = rows.map(function (r) {
      return '<li class="ct__row"><span class="ct__k">' + r.k + '</span><span class="ct__v">' + r.html + "</span></li>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  function renderAll() {
    document.title = ui("meta.title");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", ui("meta.desc"));
    renderHero();
    renderDev();
    renderWork();
    renderStatement();
    renderContact();
    DS.observeReveal();
  }

  initHero();
  initWork();
  renderAll();
  document.addEventListener("ds:lang", renderAll);

  if (window.location.hash) {
    try {
      var target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: "auto" });
    } catch (e) {}
  }
  requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
})();
