/* ==========================================================================
   DANIELS® — project detail template (project.html?p=<slug>)
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var DS = window.DS;
  var esc = DS.esc;
  var list = SITE.projects || [];
  var root = document.querySelector("[data-case]");

  var slug = new URLSearchParams(window.location.search).get("p");
  var index = -1;
  for (var i = 0; i < list.length; i++) if (list[i].slug === slug) { index = i; break; }

  document.documentElement.classList.add("js");
  DS.renderFooter("index.html");
  DS.initHeader();

  if (index < 0) {
    document.title = "Project not found — DANIELS®";
    root.innerHTML =
      '<div class="container case__empty">' +
        '<p class="eyebrow">404</p>' +
        '<h1 class="case__title">This project could not be found.</h1>' +
        '<p><a class="textlink" href="index.html#work">← Back to selected works</a></p>' +
      "</div>";
    return;
  }

  var p = list[index];
  var next = list.length > 1 ? list[(index + 1) % list.length] : null;
  var nextIndex = (index + 1) % list.length;
  var meta = [DS.titleCase(p.category), p.year].filter(Boolean).join(" · ");

  document.title = p.title + " — DANIELS®";
  setMeta("description", p.overview || (p.title + " — " + meta + ". A project by Daniels."));
  setMeta("og:title", p.title + " — DANIELS®", true);
  if (p.poster) setMeta("og:image", p.poster, true);

  function setMeta(name, value, prop) {
    var el = document.querySelector('meta[' + (prop ? "property" : "name") + '="' + name + '"]');
    if (el) el.setAttribute("content", value);
  }

  /* ---------- video embed ---------- */
  function videoEmbed(v) {
    if (!v) return "";
    var inner = "";
    var title = esc(p.title) + " — vídeo";
    if (v.type === "youtube" && v.id) {
      inner = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) + '?rel=0" title="' + title + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else if (v.type === "vimeo" && v.id) {
      inner = '<iframe src="https://player.vimeo.com/video/' + esc(v.id) + '?dnt=1&title=0&byline=0&portrait=0" title="' + title + '" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (v.type === "instagram" && v.id) {
      inner = '<div class="case__instagram-embed">' +
                '<iframe src="https://www.instagram.com/reel/' + esc(v.id) + '/embed/" title="' + title + '" width="400" height="700" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy"></iframe>' +
              '</div>';
    } else if (v.type === "file" && v.src) {
      inner = '<video src="' + esc(v.src) + '" controls playsinline preload="metadata"></video>';
    }
    return inner ? '<section class="case__video" aria-label="Filme"><div class="container"><div class="case__video-frame' + (v.type === "instagram" ? ' case__video-frame--portrait' : '') + '">' + inner + "</div></div></section>" : "";
  }

  /* ---------- stills ---------- */
  function stills() {
    var s = p.stills || [];
    var items;
    if (s.length) {
      items = s.map(function (st, i) {
        return '<figure class="still' + (i === 0 ? " still--lead" : "") + '"><img src="' + esc(st.src) + '" alt="' + esc(st.alt || p.title + " — still " + (i + 1)) + '" loading="lazy" decoding="async">' +
               (st.caption ? "<figcaption>" + esc(st.caption) + "</figcaption>" : "") + "</figure>";
      }).join("");
    } else if (p.sample) {
      items = [1, 2, 3].map(function (n) {
        return '<figure class="still' + (n === 1 ? " still--lead" : "") + '"><span class="still-ph" role="img" aria-label="Still placeholder ' + n + '"><span>Still ' + DS.pad(n) + " — to be supplied</span></span></figure>";
      }).join("");
    } else {
      return "";
    }
    return '<section class="case__stills" aria-labelledby="stills-title"><div class="container">' +
             '<h2 class="eyebrow case__section-k" id="stills-title">Stills</h2>' +
             '<div class="stills">' + items + "</div>" +
           "</div></section>";
  }

  /* ---------- credits ---------- */
  function credits() {
    var c = p.credits || [];
    if (!c.length) {
      return p.sample ? '<div class="case__block"><h2 class="case__k">Credits</h2><p class="pending">To be added</p></div>' : "";
    }
    return '<div class="case__block"><h2 class="case__k">Credits</h2><dl class="credits">' +
      c.map(function (x) { return "<div><dt>" + esc(x.role) + "</dt><dd>" + esc(x.name) + "</dd></div>"; }).join("") +
      "</dl></div>";
  }

  var overview = p.overview ||
    (p.sample ? "Sample entry. Replace this with a short overview of the project — the idea, the context, and what the work sets out to do." : "");
  var role = p.role || (p.sample ? "To be confirmed — e.g. direction, editing, art direction." : "");

  root.innerHTML =
    '<article class="case__article">' +
      '<div class="container case__intro">' +
        '<a class="case__back textlink" href="index.html#work"><span aria-hidden="true">←</span> Selected works</a>' +
        '<div class="case__grid">' +
          '<figure class="case__poster poster">' + DS.poster(p, index, { eager: true }) + "</figure>" +
          '<div class="case__info">' +
            '<p class="eyebrow case__meta"><span>' + DS.pad(index + 1) + "</span><span>" + esc(meta) + "</span>" + (p.sample ? '<span class="tag">Sample</span>' : "") + "</p>" +
            '<h1 class="case__title">' + esc(p.title) + "</h1>" +
            (overview ? '<div class="case__block"><h2 class="case__k">Overview</h2><p class="case__overview">' + esc(overview) + "</p></div>" : "") +
            (role ? '<div class="case__block"><h2 class="case__k">Role</h2><p>' + esc(role) + "</p></div>" : "") +
            (p.instagramUrl ? '<div class="case__block"><h2 class="case__k">Instagram</h2><p>' + DS.link(p.instagramUrl, "Assistir no Instagram Reel") + "</p></div>" : "") +
            credits() +
          "</div>" +
        "</div>" +
      "</div>" +
      videoEmbed(p.video) +
      stills() +
      (next ?
        '<nav class="case__next" aria-label="Next project"><div class="container">' +
          '<a class="next-link" href="project.html?p=' + encodeURIComponent(next.slug) + '">' +
            '<span class="eyebrow">Next project</span>' +
            '<span class="next-link__title">' + esc(next.title) + ' <span class="arrow" aria-hidden="true">→</span></span>' +
            '<span class="next-link__meta">' + esc([DS.titleCase(next.category), next.year].filter(Boolean).join(" · ")) + "</span>" +
            '<span class="next-link__poster poster" aria-hidden="true">' + DS.poster(next, nextIndex) + "</span>" +
          "</a>" +
        "</div></nav>" : "") +
    "</article>";

  window.scrollTo(0, 0);
  requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
})();
