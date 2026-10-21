/* ==========================================================================
   DANIELS® — shared helpers (header, footer, links, posters)
   Plain scripts (no modules) so the site also works opened from disk.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var P = SITE.profile || {};

  /* ---------- small utilities ---------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isExternal(url) { return /^https?:\/\//i.test(url); }
  function titleCase(s) {
    return String(s || "").toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  }

  /** A real link when `url` is set, otherwise an honest "To be added" note. */
  function link(url, text, opts) {
    opts = opts || {};
    if (!url) {
      return '<span class="pending" title="Link not available yet">' + esc(opts.pendingText || "To be added") + "</span>";
    }
    var ext = isExternal(url);
    var attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : "";
    if (opts.download) attrs += " download";
    var arrow = opts.arrow === false ? "" : ' <span class="arrow" aria-hidden="true">' + (ext ? "↗" : "→") + "</span>";
    var sr = ext ? '<span class="sr-only"> (opens in a new tab)</span>' : "";
    return '<a class="textlink" href="' + esc(url) + '"' + attrs + ">" + esc(text) + arrow + sr + "</a>";
  }

  function handleFromUrl(url) {
    var m = String(url || "").match(/instagram\.com\/([^/?#]+)/i);
    return m ? "@" + m[1] : url;
  }

  /** Social links that actually exist — used by footer and contact. */
  function socials() {
    var list = [];
    if (P.instagram) list.push({ label: "Instagram", url: P.instagram });
    if (P.linkedin) list.push({ label: "LinkedIn", url: P.linkedin });
    if (P.vimeo) list.push({ label: "Vimeo", url: P.vimeo });
    if (P.youtube) list.push({ label: "YouTube", url: P.youtube });
    return list;
  }

  /* ---------- posters ---------- */
  /** Poster artwork, or a typographic placeholder when none is supplied. */
  function poster(project, index, opts) {
    opts = opts || {};
    var loading = opts.eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    if (project.poster) {
      return '<img class="poster__img" src="' + esc(project.poster) + '" alt="' + esc(project.posterAlt || "Poster for " + project.title) + '" ' + loading + ' decoding="async" width="1200" height="1800">';
    }
    var v = index % 4;
    var num = pad(index + 1);
    var cat = esc(titleCase(project.category));
    var t = esc(project.title);
    var inner;
    if (v === 0) {
      inner = '<span class="ph__top"><span>' + num + "</span><span>" + cat + "</span></span>" +
              '<span class="ph__title ph__title--sans">' + t + "</span>";
    } else if (v === 1) {
      inner = '<span class="ph__top"><span>' + cat + "</span><span>" + num + "</span></span>" +
              '<span class="ph__title ph__title--serif">' + t + "</span>";
    } else if (v === 2) {
      inner = '<span class="ph__bignum" aria-hidden="true">' + num + "</span>" +
              '<span class="ph__title ph__title--vertical">' + t + "</span>" +
              '<span class="ph__top ph__top--end"><span>' + cat + "</span></span>";
    } else {
      inner = '<span class="ph__top"><span>' + num + "</span><span>" + cat + "</span></span>" +
              '<span class="ph__frame" aria-hidden="true"></span>' +
              '<span class="ph__title ph__title--small">' + t + "</span>";
    }
    return '<span class="ph ph--v' + v + '" role="img" aria-label="Poster placeholder for ' + t + '">' +
             inner + '<span class="ph__note">Poster to be supplied</span></span>';
  }

  /* ---------- header ---------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    // Solid background once the hero has scrolled away (always solid on inner pages).
    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var ticking = false;
      var update = function () {
        ticking = false;
        header.classList.toggle("is-solid", window.scrollY > hero.offsetHeight - header.offsetHeight - 1);
      };
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener("resize", update);
      update();
    } else {
      header.classList.add("is-solid");
    }

    // Mobile menu
    var toggle = header.querySelector("[data-nav-toggle]");
    var list = header.querySelector("[data-nav-list]");
    if (!toggle || !list) return;
    var label = toggle.querySelector(".nav__toggle-label");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      header.classList.toggle("is-open", open);
      document.documentElement.classList.toggle("no-scroll", open);
      if (label) label.textContent = open ? "Close" : "Menu";
      if (open) { var first = list.querySelector("a"); if (first) first.focus(); }
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 761px)").addEventListener("change", function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- footer ---------- */
  function renderFooter(prefix) {
    var el = document.querySelector("[data-footer]");
    if (!el) return;
    prefix = prefix || "";
    var s = socials().map(function (x) { return "<li>" + link(x.url, x.label) + "</li>"; }).join("");
    el.innerHTML =
      '<div class="container site-footer__inner">' +
        '<div class="site-footer__brand">' +
          '<a class="wordmark" href="' + prefix + '#top">DANIELS<sup>®</sup></a>' +
          '<p class="site-footer__tag">' + esc(P.tagline || "Creative · Audiovisual · Storytelling") + "</p>" +
        "</div>" +
        (s ? '<ul class="site-footer__social" aria-label="Social links">' + s + "</ul>" : "") +
        '<p class="site-footer__copy">© ' + new Date().getFullYear() + " Daniels. All rights reserved.</p>" +
      "</div>";
  }

  window.DS = {
    esc: esc, pad: pad, link: link, socials: socials, poster: poster,
    titleCase: titleCase, handleFromUrl: handleFromUrl,
    initHeader: initHeader, renderFooter: renderFooter,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
  };
})();
