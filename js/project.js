/* ==========================================================================
   DANIELS® — project page (project.html?p=<slug>)
   Re-rendered when the language changes (ds:lang).
   ========================================================================== */
(function () {
  "use strict";

  var DS = window.DS;
  var esc = DS.esc, t = DS.t, ui = DS.ui;
  var list = DS.projects();
  var root = document.querySelector("[data-case]");

  var slug = new URLSearchParams(window.location.search).get("p");
  var index = -1;
  for (var i = 0; i < list.length; i++) if (list[i].slug === slug) { index = i; break; }

  function setMeta(sel, value) {
    var el = document.querySelector(sel);
    if (el && value) el.setAttribute("content", value);
  }

  function videoEmbed(p) {
    var v = p.video;
    if (!v) return "";
    var title = esc(t(p.title));
    var inner = "", portrait = false;
    if (v.type === "youtube" && v.id) {
      inner = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) + '?rel=0" title="' + title + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else if (v.type === "vimeo" && v.id) {
      inner = '<iframe src="https://player.vimeo.com/video/' + esc(v.id) + '?dnt=1&title=0&byline=0&portrait=0" title="' + title + '" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (v.type === "instagram" && v.id) {
      portrait = true;
      inner = '<iframe src="https://www.instagram.com/reel/' + esc(v.id) + '/embed/" title="' + title + '" scrolling="no" loading="lazy"></iframe>';
    } else if (v.type === "file" && v.src) {
      inner = '<video src="' + esc(v.src) + '" controls playsinline preload="metadata"></video>';
    }
    if (!inner) return "";
    return '<section class="case__video" id="watch" aria-label="' + esc(ui("pj.watch")) + '"><div class="container">' +
      '<h2 class="case__section-k">' + esc(ui("pj.watch")) + "</h2>" +
      '<div class="' + (portrait ? "frame-portrait" : "frame16") + '">' + inner + "</div>" +
    "</div></section>";
  }

  function stills(p) {
    var s = p.stills || [];
    var body = s.length
      ? '<div class="stills">' + s.map(function (st, k) {
          return '<figure class="still' + (k === 0 && s.length > 2 ? " still--lead" : "") + '"><img src="' + esc(st.src) + '" alt="' + esc(t(st.alt) || t(p.title) + " — still " + (k + 1)) + '" loading="lazy" decoding="async">' +
            (t(st.caption) ? "<figcaption>" + esc(t(st.caption)) + "</figcaption>" : "") + "</figure>";
        }).join("") + "</div>"
      : '<div class="still-soon"><span class="soon">' + esc(ui("pj.stills_soon")) + "</span></div>";
    return '<section class="case__stills" aria-label="' + esc(ui("pj.stills")) + '"><div class="container">' +
      '<h2 class="case__section-k">' + esc(ui("pj.stills")) + "</h2>" + body +
    "</div></section>";
  }

  function billing(p) {
    var c = p.credits || [];
    if (!c.length) return "";
    return '<div class="case__billing"><p class="billing">' +
      c.map(function (x) { return "<span><small>" + esc(t(x.role)) + "</small>" + esc(x.name) + "</span>"; }).join("") +
      "<span><small>" + esc(ui("ft.produced")) + "</small>Arturus</span>" +
    "</p></div>";
  }

  function block(k, v) {
    return v ? '<div class="case__block"><h2 class="case__k">' + esc(k) + "</h2><div>" + v + "</div></div>" : "";
  }

  function render() {
    if (index < 0) {
      document.title = ui("pj.nf.title") + " — DANIELS®";
      root.innerHTML =
        '<div class="container case__empty">' +
          '<p class="case__meta">404</p>' +
          '<h1 class="case__title">' + esc(ui("pj.nf.title")) + "</h1>" +
          '<p style="margin-top:2rem"><a class="textlink" href="index.html#work">← ' + esc(ui("pj.nf.back")) + "</a></p>" +
        "</div>";
      return;
    }

    var p = list[index];
    var next = list.length > 1 ? list[(index + 1) % list.length] : null;
    var title = t(p.title);
    var meta = [DS.catLabel(p.category), p.year, p.duration ? p.duration + " min" : ""].filter(Boolean);

    document.title = title + " — DANIELS®";
    setMeta('meta[name="description"]', t(p.overview) || t(p.logline) || title);
    setMeta('meta[property="og:title"]', title + " — DANIELS®");
    DS.setTicket(p, true);

    var watch = p.video ? '<p class="case__watch"><a class="btn btn--solid" href="#watch">▶ ' + esc(ui("pj.watch")) + "</a></p>" : "";
    var ig = p.video && p.video.type === "instagram"
      ? DS.link("https://www.instagram.com/reel/" + p.video.id + "/", ui("pj.watch_ig"))
      : "";

    root.innerHTML =
      '<article class="case__article">' +
        '<div class="container">' +
          '<a class="case__back textlink" href="index.html#work"><span aria-hidden="true">←</span> ' + esc(ui("pj.back")) + "</a>" +
          '<div class="case__grid">' +
            '<figure class="case__poster poster">' + DS.poster(p, index, { eager: true }) + "</figure>" +
            '<div class="case__info">' +
              '<p class="case__meta"><span class="shead__n">' + DS.pad(index + 1) + "</span>" + meta.map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("<span aria-hidden=\"true\">·</span>") + DS.sampleTag(p) + "</p>" +
              '<h1 class="case__title">' + esc(title) + "</h1>" +
              (t(p.logline) ? '<p class="case__logline">' + esc(t(p.logline)) + "</p>" : "") +
              watch +
              '<div class="case__blocks">' +
                block(ui("pj.overview"), t(p.overview) ? "<p>" + esc(t(p.overview)) + "</p>" : '<span class="soon">' + esc(ui("soon")) + "</span>") +
                block(ui("pj.role"), t(p.role) ? "<p>" + esc(t(p.role)) + "</p>" : "") +
                block("Instagram", ig) +
              "</div>" +
              billing(p) +
            "</div>" +
          "</div>" +
        "</div>" +
        videoEmbed(p) +
        stills(p) +
        (next
          ? '<nav class="case__next" aria-label="' + esc(ui("pj.next")) + '"><div class="container">' +
              '<a class="next-link" href="' + esc(DS.projectUrl(next)) + '">' +
                '<span class="next-link__k">' + esc(ui("pj.next")) + "</span>" +
                '<span class="next-link__title">' + esc(t(next.title)) + ' <span aria-hidden="true">→</span></span>' +
                '<span class="next-link__poster poster" aria-hidden="true">' + DS.poster(next, (index + 1) % list.length) + "</span>" +
              "</a>" +
            "</div></nav>"
          : "") +
      "</article>";
  }

  render();
  document.addEventListener("ds:lang", render);
  window.scrollTo(0, 0);
})();
