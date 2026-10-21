/* ==========================================================================
   DANIELS® — FILMS ROLL (siena.film home roll)
   - Looping vertical film roll: scrolling down moves the reel up, items wrap
     around (last film peeks above the first)
   - Scroll-driven (sticky stage) with snap to the nearest film and mouse drag
   - WebGL frames: organic celluloid mask atlas, corner/edge grading, image parallax
   - Post pass: vertical motion blur + glow by scroll speed, animated film grain
   - DOM overlay: per-element parallax (data-parallax) and speed blur
   - Drives the header ticket ("now showing") and the EXPLORE cursor
   - Falls back to CSS-masked <img> frames when WebGL is unavailable (e.g. file://)
   Films = projects with a `featured` block in js/data.js.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.querySelector("[data-sf]");
  if (!root) return;

  var DS = window.DS;
  var esc = DS.esc, t = DS.t, ui = DS.ui;
  var films = DS.featured();
  if (!films.length) { root.remove(); return; }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var mobileMQ = window.matchMedia("(max-width: 767px)");

  var stage = root.querySelector("[data-sf-stage]");
  var rollEl = root.querySelector("[data-sf-roll]");
  var canvas = root.querySelector("[data-sf-canvas]");
  var cursor = root.querySelector("[data-sf-cursor]");

  var N = films.length;
  var MASK_ATLAS = "assets/img/film-mask.webp";

  /* ---------- Icons ---------- */
  var STAR = '<path d="M5 0l1.18 3.43h3.62L6.9 5.95 8 9.4 5 7.3 2 9.4l1.1-3.45L.2 3.83h3.62z"/>';
  var ARROW_R = '<svg viewBox="0 0 11 10" aria-hidden="true"><path fill="currentColor" d="M4.481.005a6.65 6.65 0 0 1 6.46 4.659c.078.229.08.479-.003.706C10.302 7.105 8.318 10 4.48 10V8.39c.941.127 2.922-.257 4.442-2.603H0V4.208h8.938c-.756-1.229-2.216-2.78-4.457-2.78V.006Z"/></svg>';
  var EXPLORE_BG = '<svg viewBox="0 0 142 44" preserveAspectRatio="none" aria-hidden="true"><path class="sf-explore__bg" d="M5 1h90c0 1 .6 3 3 3s3-2 3-3h36c0 3.2 2.667 4.144 4 4.216V39c-3.2 0-4 2.667-4 4h-35c0-1.333-.8-4-4-4s-4 2.667-4 4H5c0-3.6-2.667-4.167-4-4V5c3.2 0 4-2.667 4-4Z"/><path class="sf-explore__seam" d="M98 4.5v34" stroke-dasharray="4"/></svg>';

  function stars(n) {
    var s = "";
    for (var i = 0; i < 5; i++) s += '<svg viewBox="0 0 10 10"' + (i < n ? "" : ' class="is-off"') + ">" + STAR + "</svg>";
    return '<span class="sf-stars" aria-label="' + n + ' / 5">' + s + "</span>";
  }

  /* Laurel wreath — only for real festival selections (featured.laurel) */
  function laurel(l) {
    var R = 40, cx = 50, cy = 54, leaves = "";
    for (var k = 0; k < 9; k++) {
      var deg = 112 + k * 16;
      var a = deg * Math.PI / 180;
      var x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      var rot = deg - 12;
      leaves += '<ellipse cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" rx="2.7" ry="7" transform="rotate(' + rot + " " + x.toFixed(2) + " " + y.toFixed(2) + ')"/>';
      leaves += '<ellipse cx="' + (100 - x).toFixed(2) + '" cy="' + y.toFixed(2) + '" rx="2.7" ry="7" transform="rotate(' + (-rot) + " " + (100 - x).toFixed(2) + " " + y.toFixed(2) + ')"/>';
    }
    return '<span class="sf-laurel">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor">' + leaves + "</g>" +
        '<path d="M44 95 Q14 86 12 50 M56 95 Q86 86 88 50" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
      '<span class="sf-laurel__tx"><small>' + esc(t(l.selection) || "Official selection") + "</small><b>" + esc(t(l.festival)) + "</b><small>" + esc(l.year || "") + "</small></span>" +
    "</span>";
  }

  function exploreBtn(f, extra) {
    var label = ui("films.explore").toUpperCase();
    return '<a class="sf-explore' + (extra || "") + '" href="' + esc(DS.projectUrl(f)) + '" data-sf-nocursor aria-label="' + esc(ui("films.explore") + " — " + t(f.title)) + '">' +
      '<span class="sf-explore__btn" data-parallax="24">' +
        '<span class="sf-explore__col"><span class="sf-explore__of"><span class="sf-explore__tx" data-after="' + esc(label) + '">' + esc(label) + "</span></span></span>" +
        '<span class="sf-explore__col sf-explore__col--last"><span class="sf-explore__of sf-explore__of--ar"><span class="sf-explore__ar">' + ARROW_R + ARROW_R + "</span></span></span>" +
        '<span class="sf-explore__shape">' + EXPLORE_BG + "</span>" +
      "</span>" +
    "</a>";
  }

  /* ---------- Render roll items (re-run on language change) ---------- */
  var items = [], imgs = [], parallax = [];

  function itemHTML(f, i) {
    var F = f.featured || {};
    var l = F.laurel;
    var notes = (F.notes || []).map(function (q, o) {
      return '<div class="sf-review" data-parallax="' + (15 + o * 8) + '">' +
        (q.rating > 0 ? stars(q.rating) : "") +
        "<p>" + esc(t(q.label)) + "</p>" +
        "<h3>“" + esc(t(q.text)) + "”</h3>" +
      "</div>";
    }).join("");

    var rows = [
      [ui("films.director"), f.director || "Daniels"],
      [ui("films.year"), f.year || "—"],
      [ui("films.category"), DS.catLabel(f.category)]
    ];

    var award = l
      ? '<span class="sf-award__year">' + esc(l.year || f.year) + "</span>" +
        '<span class="sf-award__he">' + esc(t(l.award)) + "</span>" + laurel(l)
      : '<span class="sf-award__year">' + DS.pad(i + 1) + "</span>" +
        '<span class="sf-award__he">' + esc(ui("hero.kicker")) + " Daniels</span>";

    return '<div class="sf-item" data-sf-item="' + i + '"' + (i ? ' aria-hidden="true"' : "") + ">" +
      '<div class="sf-item__c">' +
        '<div class="sf-item__img"><img src="' + esc(F.backdrop || f.poster) + '" alt="" data-sf-img ' + (i === 0 ? 'loading="eager"' : 'loading="lazy"') + ' decoding="async"></div>' +
        '<div class="sf-item__ui">' +
          '<div class="sf-content" data-parallax="2">' +
            '<div class="sf-col">' +
              '<div class="sf-ci sf-award" data-parallax="12">' + award + "</div>" +
              '<div class="sf-ci sf-titleblock" data-parallax="15">' +
                '<span class="sf-eyeb">' + esc(t(F.label) || DS.catLabel(f.category)) + "</span>" +
                '<h2 class="sf-title">' + esc(t(f.title)) + "</h2>" +
                '<div class="sf-callout"><ul>' +
                  rows.map(function (r, k) {
                    return "<li>" +
                      (k === 0 ? '<span class="sf-line"></span>' : "") +
                      "<span" + (k === 0 ? ' class="sf-shift"' : "") + ">" + esc(r[0]) + "</span>" +
                      "<span>" + esc(r[1]) + "</span>" +
                      '<span class="sf-line sf-line--up"></span>' +
                    "</li>";
                  }).join("") +
                "</ul></div>" +
                exploreBtn(f, " sf-explore--mobile") +
              "</div>" +
            "</div>" +
            '<div class="sf-col sf-col--reviews">' +
              '<div class="sf-reviews" data-parallax="2">' + notes + "</div>" +
              exploreBtn(f, "") +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";
  }

  function renderItems() {
    rollEl.innerHTML = films.map(itemHTML).join("");
    items = Array.prototype.slice.call(rollEl.querySelectorAll("[data-sf-item]"));
    imgs = items.map(function (el) { return el.querySelector("[data-sf-img]"); });
    parallax = items.map(function (el) {
      return Array.prototype.map.call(el.querySelectorAll("[data-parallax]"), function (p) {
        return { el: p, v: +p.getAttribute("data-parallax") };
      });
    });
  }

  renderItems();

  /* ==========================================================================
     Roll state (mirrors siena: wrap, lerp, speed → blur)
     ========================================================================== */
  function mod(a, n) { return ((a % n) + n) % n; }
  function wrap(a, half) { var w = mod(a, 2 * half); return w >= half ? w - 2 * half : w; }
  function lerp(a, b, k) { return a * (1 - k) + b * k; }

  var vh = 0, stageH = 0, itemH = 0, marginH = 0;
  var target = 0, current = 0, lastTarget = 0;
  var speed = 0, lspeed = 0;
  var active = 0;
  var offsets = new Array(N);
  var imgBox = { x: 0, w: 0, h: 0 };
  var inView = false;

  function sectionTop() { return root.getBoundingClientRect().top + window.pageYOffset; }

  function measure() {
    vh = window.innerHeight;
    root.style.height = (N * vh) + "px";
    stageH = stage.clientHeight;
    itemH = items[0].clientHeight;
    marginH = (stageH - itemH) / 2;
    var sr = stage.getBoundingClientRect();
    var ir = imgs[0].parentNode.getBoundingClientRect();
    imgBox.x = ir.left - sr.left + ir.width / 2;
    imgBox.w = ir.width;
    imgBox.h = ir.height;
    if (gl) resizeGL();
    readScroll();
    current = target;
    lastTarget = target;
  }

  function readScroll() {
    var r = root.getBoundingClientRect();
    target = Math.max(0, Math.min(N - 1, -r.top / vh));
    var nowIn = r.top < vh * 0.5 && r.bottom > vh * 0.5;
    if (nowIn && !inView) DS.setTicket(films[active]);
    inView = nowIn;
  }

  function scrollToFilm(i) {
    var idx = Math.max(0, Math.min(N - 1, i));
    window.scrollTo({ top: sectionTop() + idx * vh, behavior: reduced ? "auto" : "smooth" });
  }

  window.SF = { goTo: scrollToFilm };

  /* Snap to the nearest film once scrolling settles (siena snaps target → round) */
  var snapTimer = 0, dragging = false;
  function scheduleSnap() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(function () {
      if (dragging) return;
      var r = root.getBoundingClientRect();
      if (r.top > 0 || r.bottom < vh) return;
      var p = -r.top / vh;
      if (Math.abs(p - Math.round(p)) > 0.002) scrollToFilm(Math.round(p));
    }, 160);
  }

  window.addEventListener("scroll", function () { readScroll(); scheduleSnap(); }, { passive: true });

  /* Mouse drag (siena: dragSensitivity .005 per px) */
  var dragStartY = 0, dragStartScroll = 0, dragMoved = false;
  if (finePointer) {
    stage.addEventListener("mousedown", function (e) {
      if (e.button !== 0 || e.target.closest("[data-sf-nocursor]")) return;
      dragging = true; dragMoved = false;
      dragStartY = e.clientY;
      dragStartScroll = window.pageYOffset;
      stage.classList.add("is-grabbing");
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      var dy = e.clientY - dragStartY;
      if (Math.abs(dy) > 4) dragMoved = true;
      var top = sectionTop();
      var y = dragStartScroll - dy * 0.005 * vh;
      window.scrollTo(0, Math.max(top, Math.min(top + (N - 1) * vh, y)));
    });
    window.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("is-grabbing");
      scheduleSnap();
    });
  }

  /* Click: top/bottom hitboxes go prev/next, the centred frame opens the film */
  stage.addEventListener("click", function (e) {
    if (dragMoved) { dragMoved = false; return; }
    if (e.target.closest("[data-sf-nocursor]")) return;
    var hit = e.target.closest("[data-sf-hit]");
    if (hit) { scrollToFilm(active + (hit.getAttribute("data-sf-hit") === "next" ? 1 : -1)); return; }
    var y = e.clientY - stage.getBoundingClientRect().top;
    if (Math.abs(y - stageH / 2) < imgBox.h / 2) window.location.href = DS.projectUrl(films[active]);
  });

  /* ---------- EXPLORE cursor ---------- */
  var cx = -200, cy = -200, mx = -200, my = -200;
  if (finePointer && cursor) {
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      var inStage = stage.contains(e.target);
      var hide = !inStage || !!e.target.closest("[data-sf-nocursor]");
      var hit = e.target.closest("[data-sf-hit]");
      cursor.classList.toggle("is-on", inStage);
      cursor.classList.toggle("is-hide", hide);
      cursor.classList.toggle("is-top", !!hit && hit.getAttribute("data-sf-hit") === "prev");
      cursor.classList.toggle("is-bottom", !!hit && hit.getAttribute("data-sf-hit") === "next");
      cursor.classList.toggle("is-prevnext", !!hit);
    });
    stage.addEventListener("mousedown", function () { cursor.classList.add("is-pressed"); });
    window.addEventListener("mouseup", function () { cursor.classList.remove("is-pressed"); });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-on"); });
  } else if (cursor) {
    cursor.remove();
    cursor = null;
  }

  /* ==========================================================================
     WebGL (siena home roll program + post pass)
     ========================================================================== */
  var gl = null, progImg, progPost, quadBuf, fbo, fboTex, maskTex = null, texs = [], dpr = 1;

  var IMAGEUV = "vec2 imageuv(vec2 uv,vec2 size,vec2 resolution){vec2 ratio=vec2(min((resolution.x/resolution.y)/(size.x/size.y),1.0),min((resolution.y/resolution.x)/(size.y/size.x),1.0));return vec2(uv.x*ratio.x+(1.0-ratio.x)*0.5,uv.y*ratio.y+(1.0-ratio.y)*0.5);}";
  var BLUR13 = "vec4 blur13(sampler2D image,vec2 uv,vec2 resolution,vec2 direction){vec4 color=vec4(0.0);vec2 off1=vec2(1.411764705882353)*direction;vec2 off2=vec2(3.2941176470588234)*direction;vec2 off3=vec2(5.176470588235294)*direction;color+=texture2D(image,uv)*0.1964825501511404;color+=texture2D(image,uv+(off1/resolution))*0.2969069646728344;color+=texture2D(image,uv-(off1/resolution))*0.2969069646728344;color+=texture2D(image,uv+(off2/resolution))*0.09447039785044732;color+=texture2D(image,uv-(off2/resolution))*0.09447039785044732;color+=texture2D(image,uv+(off3/resolution))*0.010381362401148057;color+=texture2D(image,uv-(off3/resolution))*0.010381362401148057;return color;}";

  var VS_IMG = [
    "precision highp float;",
    IMAGEUV,
    "attribute vec2 a_pos;",
    "uniform vec4 u_rect;uniform vec2 u_view;uniform vec2 u_diff_aspect;uniform vec2 u_resolution;uniform float u_a_parallax;",
    "varying vec2 v_uv;varying vec2 v_uv_base;",
    "void main(){",
    "  vec2 p=u_rect.xy+a_pos*u_rect.zw;",
    "  gl_Position=vec4(p.x/u_view.x*2.0-1.0,1.0-p.y/u_view.y*2.0,0.0,1.0);",
    "  vec2 uv=vec2(a_pos.x+0.5,0.5-a_pos.y);",
    "  v_uv_base=uv;",
    "  vec2 map_uv=imageuv(uv,u_diff_aspect,u_resolution);",
    "  map_uv-=.5;map_uv.y-=u_a_parallax*0.3;map_uv+=.5;",
    "  v_uv=map_uv;",
    "}"
  ].join("\n");

  var FS_IMG = [
    "precision highp float;",
    "varying vec2 v_uv;varying vec2 v_uv_base;",
    "uniform sampler2D u_diff;uniform sampler2D u_mask;uniform float u_a_page_alpha;",
    "float blendColorDodge(float base,float blend){return(blend==1.0)?blend:min(base/(1.0-blend),1.0);}",
    "vec3 blendColorDodge(vec3 base,vec3 blend){return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));}",
    "void main(){",
    "  vec2 calc_uv=vec2(v_uv_base.x*0.7167957095,v_uv_base.y);",
    "  float mask=texture2D(u_mask,calc_uv).r;",
    "  vec3 color=texture2D(u_diff,v_uv).rgb;",
    "  vec2 stp=vec2(.1,.4);",
    "  float grad1=smoothstep(stp.x,stp.y,distance(v_uv,vec2(0.15)));",
    "  float grad2=smoothstep(stp.x,stp.y,distance(v_uv,vec2(0.85)));",
    "  float grads=grad1*grad2;",
    "  color=mix(mix(color*.2,blendColorDodge(color,vec3(1.,.86,.0))*.3,.2),color,grads);",
    "  float v_grad=1.0-smoothstep(.1,.5,distance(v_uv.y,.5));",
    "  color*=v_grad;",
    "  gl_FragColor=vec4(color,mask*u_a_page_alpha);",
    "}"
  ].join("\n");

  var VS_POST = [
    "precision highp float;",
    "attribute vec2 a_pos;varying vec2 v_uv;",
    "void main(){v_uv=vec2(a_pos.x+0.5,0.5-a_pos.y);gl_Position=vec4(a_pos.x*2.0,-a_pos.y*2.0,0.0,1.0);}"
  ].join("\n");

  var FS_POST = [
    "precision highp float;",
    "uniform float u_time;uniform sampler2D u_texture;varying vec2 v_uv;",
    "uniform float u_NOISE_AMOUNT;uniform float u_FILM_POWER;uniform vec2 u_a_blur_direction;uniform float u_a_blur_power;uniform float u_a_speed;",
    BLUR13,
    "void main(){",
    "  vec2 uv=v_uv;",
    "  vec4 img=texture2D(u_texture,uv);",
    "  vec4 img_blur=blur13(u_texture,uv,vec2(1920.,1080.),u_a_blur_direction*10.);",
    "  img=mix(img,img_blur,u_a_speed*.5);",
    "  img+=img_blur*u_a_speed*u_a_blur_power*u_FILM_POWER;",
    "  float noise=fract(sin(dot(vec2(sin(uv.x+u_time)+1.,uv.y),vec2(12.9898,78.233)*2.0))*43758.5453);",
    "  img+=noise*u_NOISE_AMOUNT;",
    "  gl_FragColor=vec4(img.rgb,1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function program(vs, fs, uniforms) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var o = { p: p, a: gl.getAttribLocation(p, "a_pos"), u: {} };
    uniforms.forEach(function (n) { o.u[n] = gl.getUniformLocation(p, n); });
    return o;
  }

  function newTexture() {
    var tx = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tx;
  }

  function loadTexture(src, done) {
    var im = new Image();
    im.decoding = "async";
    im.onload = function () {
      if (!gl) return;
      try {
        var tx = newTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        done({ tex: tx, aspect: [im.naturalWidth, im.naturalHeight] });
      } catch (err) {
        disableGL(); // tainted image (file://) — use the DOM frames instead
      }
    };
    im.src = src;
  }

  function resizeGL() {
    var w = stage.clientWidth, h = stage.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.bindTexture(gl.TEXTURE_2D, fboTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  function disableGL() {
    gl = null;
    root.classList.remove("sf-gl");
    root.classList.add("sf-nogl");
  }

  function initGL() {
    try {
      gl = canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
      if (!gl) throw new Error("no webgl");
      progImg = program(VS_IMG, FS_IMG, ["u_rect", "u_view", "u_diff_aspect", "u_resolution", "u_a_parallax", "u_diff", "u_mask", "u_a_page_alpha"]);
      progPost = program(VS_POST, FS_POST, ["u_time", "u_texture", "u_NOISE_AMOUNT", "u_FILM_POWER", "u_a_blur_direction", "u_a_blur_power", "u_a_speed"]);

      quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5]), gl.STATIC_DRAW);

      fboTex = newTexture();
      fbo = gl.createFramebuffer();
      resizeGL();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      root.classList.add("sf-gl");
      loadTexture(MASK_ATLAS, function (tx) { maskTex = tx.tex; });
      films.forEach(function (f, i) { loadTexture((f.featured && f.featured.backdrop) || f.poster, function (tx) { texs[i] = tx; }); });
    } catch (err) {
      disableGL();
    }
  }

  function drawQuad(prog) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(prog.a);
    gl.vertexAttribPointer(prog.a, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function renderGL(time) {
    var w = canvas.width, h = canvas.height;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (maskTex) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(progImg.p);
      gl.uniform2f(progImg.u.u_view, w, h);
      gl.uniform1f(progImg.u.u_a_page_alpha, 1);
      gl.uniform1i(progImg.u.u_diff, 0);
      gl.uniform1i(progImg.u.u_mask, 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, maskTex);

      var spacing = imgBox.h + marginH / 2;
      for (var i = 0; i < N; i++) {
        var tx = texs[i];
        var o = offsets[i];
        if (!tx || Math.abs(o) > 1.6) continue;
        var cyPx = stageH / 2 + o * spacing;
        gl.uniform4f(progImg.u.u_rect, imgBox.x * dpr, cyPx * dpr, imgBox.w * dpr, imgBox.h * dpr);
        gl.uniform2f(progImg.u.u_resolution, imgBox.w, imgBox.h);
        gl.uniform2f(progImg.u.u_diff_aspect, tx.aspect[0], tx.aspect[1]);
        gl.uniform1f(progImg.u.u_a_parallax, o);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tx.tex);
        drawQuad(progImg);
      }
      gl.disable(gl.BLEND);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(progPost.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboTex);
    gl.uniform1i(progPost.u.u_texture, 0);
    gl.uniform1f(progPost.u.u_time, time);
    gl.uniform1f(progPost.u.u_NOISE_AMOUNT, 0.07);
    gl.uniform1f(progPost.u.u_FILM_POWER, 0.5);
    gl.uniform2f(progPost.u.u_a_blur_direction, 0, 1);
    gl.uniform1f(progPost.u.u_a_blur_power, 3);
    gl.uniform1f(progPost.u.u_a_speed, reduced ? 0 : lspeed);
    drawQuad(progPost);
  }

  /* ==========================================================================
     Tick
     ========================================================================== */
  function updatePositions() {
    var mobile = mobileMQ.matches;
    for (var i = 0; i < N; i++) {
      var o = wrap(i - current, N / 2);
      offsets[i] = o;
      var el = items[i];
      el.style.transform = "translate3d(0," + (o * itemH + marginH).toFixed(2) + "px,0)";
      el.style.visibility = Math.abs(o) > 1.6 ? "hidden" : "";
      if (!mobile && !reduced) {
        el.style.filter = lspeed > 0.002 ? "blur(" + (lspeed * 10).toFixed(2) + "px)" : "";
        var px = parallax[i];
        for (var k = 0; k < px.length; k++) {
          px[k].el.style.transform = "translate3d(0," + (o * px[k].v * 10).toFixed(2) + "%,0)";
        }
      }
    }

    var idx = mod(Math.round(current), N);
    if (idx !== active) {
      items[active].setAttribute("aria-hidden", "true");
      items[idx].removeAttribute("aria-hidden");
      active = idx;
      if (inView) DS.setTicket(films[active]);
    }
  }

  function tick(now) {
    requestAnimationFrame(tick);
    var r = root.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;

    speed += (target - lastTarget) * 0.5;
    lastTarget = target;
    speed *= 0.85;
    lspeed = lerp(lspeed, Math.abs(speed), 0.1);

    current = reduced ? target : lerp(current, target, mobileMQ.matches ? 0.09 : 0.1);
    if (Math.abs(current - target) < 0.0001) current = target;

    updatePositions();
    if (gl) renderGL(now / 1000);

    if (cursor) {
      cx = lerp(cx, mx, 0.2);
      cy = lerp(cy, my, 0.2);
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
    }
  }

  var rAf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(rAf);
    rAf = requestAnimationFrame(measure);
  });

  document.addEventListener("ds:lang", function () {
    renderItems();
    items[active].removeAttribute("aria-hidden");
    items.forEach(function (el, i) { if (i !== active) el.setAttribute("aria-hidden", "true"); });
    updatePositions();
  });

  initGL();
  measure();
  updatePositions();
  requestAnimationFrame(tick);
  window.addEventListener("load", measure);
})();
