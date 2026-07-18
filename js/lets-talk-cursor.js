/* =====================================================================
   MONARK STUDIO — "LETS TALK" cursor-follow image + crosshair
   Scoped to the .section-3 ("LETS TALK") screen only.

   Behaviour (roshan-sahu style):
     - ONE poster is pinned to the cursor and trails it with a soft lag.
     - As the cursor moves, the poster FLIPS to the next one in the set
       and a caption ("DESIGN THAT THINKS" ...) updates with it.
     - Plus the crosshair HUD: X/Y axis lines + "+" + live coordinates.

   Layering (inside .hero-talk-wrap, to beat the wrapper's GSAP
   transform stacking context):
     - follower image + caption -> z 5  (behind the talk card, so it
       tucks behind the CTA instead of covering it)
     - talk card (.div-block-15) -> z 10
     - crosshair HUD             -> z 60

   Self-contained: injects its own CSS + DOM, uses GSAP from index.html.
   Desktop pointers only; respects reduced-motion. Delete this file +
   its <script> tag to remove.

   IMAGES + LABELS are in the DATA array below — edit freely.
   ===================================================================== */
(function () {
  "use strict";

  var gsap = window.gsap;
  if (!gsap) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
  if (reduce || touch) return; // desktop pointer experience only

  // ---- poster + caption pairs (edit these) ----
  var DATA = [
    { src: "assets/images/1 new.jpg", label: "DESIGN THAT THINKS" },
    { src: "assets/images/2.jpg",     label: "CODE THAT SHIPS" },
    { src: "assets/images/3.jpg",     label: "AI THAT SCALES" },
    { src: "assets/images/4.jpg",     label: "PIXEL PERFECT EXECUTION" }
  ];

  function init() {
    var section = document.querySelector(".section-3");
    if (!section) return;
    var origin = section.querySelector(".hero-talk-wrap") || section;

    /* ---- injected styles ---- */
    var css = [
      ".hero-talk-wrap{position:relative;}",
      ".mk-lt{position:absolute;inset:0;overflow:hidden;pointer-events:none;}",
      ".mk-lt--img{z-index:5;}",
      ".mk-lt--hud{z-index:60;}",
      ".section-3 .div-block-15{z-index:10;}",
      // follower image
      ".mk-lt__follow{position:absolute;left:0;top:0;width:210px;height:280px;object-fit:cover;" +
        "border-radius:2px;opacity:0;will-change:transform,opacity;}",
      // caption under the image
      ".mk-lt__cap{position:absolute;left:0;top:0;color:#fff;font-family:'Space Mono',monospace;" +
        "font-size:12px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;" +
        "opacity:0;will-change:transform,opacity;}",
      // crosshair HUD
      ".mk-lt__line{position:absolute;background:rgba(255,255,255,.38);opacity:0;transition:opacity .3s ease;will-change:transform;}",
      ".mk-lt__line--v{top:0;left:0;width:1px;height:100%;}",
      ".mk-lt__line--h{left:0;top:0;height:1px;width:100%;}",
      ".mk-lt__plus{position:absolute;left:0;top:0;color:#fff;font-family:'Space Mono',monospace;" +
        "font-size:15px;line-height:1;opacity:0;transition:opacity .3s ease;will-change:transform;}",
      ".mk-lt__coord{position:absolute;left:0;top:0;color:#fff;font-family:'Space Mono',monospace;" +
        "font-size:11px;letter-spacing:.1em;white-space:nowrap;opacity:0;transition:opacity .3s ease;will-change:transform;}",
      ".mk-lt--hud.is-active .mk-lt__line,.mk-lt--hud.is-active .mk-lt__plus,.mk-lt--hud.is-active .mk-lt__coord{opacity:1;}"
    ].join("");
    var style = document.createElement("style");
    style.id = "mk-lt-styles";
    style.textContent = css;
    document.head.appendChild(style);

    /* ---- layers ---- */
    var imgLayer = document.createElement("div");
    imgLayer.className = "mk-lt mk-lt--img";
    var hud = document.createElement("div");
    hud.className = "mk-lt mk-lt--hud";

    var fimg = document.createElement("img");
    fimg.className = "mk-lt__follow";
    fimg.alt = "";
    var cap = document.createElement("div");
    cap.className = "mk-lt__cap";
    imgLayer.appendChild(fimg);
    imgLayer.appendChild(cap);

    var vline = document.createElement("div");
    vline.className = "mk-lt__line mk-lt__line--v";
    var hline = document.createElement("div");
    hline.className = "mk-lt__line mk-lt__line--h";
    var plus = document.createElement("div");
    plus.className = "mk-lt__plus";
    plus.textContent = "+";
    var coord = document.createElement("div");
    coord.className = "mk-lt__coord";
    coord.textContent = "X 0000  Y 0000";
    hud.appendChild(vline);
    hud.appendChild(hline);
    hud.appendChild(plus);
    hud.appendChild(coord);

    origin.appendChild(imgLayer);
    origin.appendChild(hud);

    /* ---- preload (keep only the pairs whose image loads) ---- */
    var ready = [];
    DATA.forEach(function (d) {
      var src = encodeURI(d.src);
      var probe = new Image();
      probe.onload = function () { ready.push({ src: src, label: d.label }); };
      probe.src = src;
    });

    /* ---- state ---- */
    var rect = origin.getBoundingClientRect();
    function refresh() { rect = origin.getBoundingClientRect(); }
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, { passive: true });

    var tx = 0, ty = 0;        // raw cursor (origin-relative)
    var fx = 0, fy = 0;        // follower (laggier)
    var lx = 0, ly = 0;        // crosshair (snappier)
    var inside = false, primed = false;
    var lastX = 0, lastY = 0, acc = 0, idx = 0;
    var SWAP = 110;            // px travelled before the poster flips

    gsap.set([fimg, cap, plus], { xPercent: -50, yPercent: -50 });
    var setV = gsap.quickSetter(vline, "x", "px");
    var setH = gsap.quickSetter(hline, "y", "px");

    function showCurrent() {
      if (!ready.length) return;
      var d = ready[idx % ready.length];
      fimg.src = d.src;
      cap.textContent = d.label;
    }
    function flip() {
      idx++;
      showCurrent();
      gsap.fromTo(fimg, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "power3.out" });
    }

    section.addEventListener("mouseenter", function () {
      inside = true;
      hud.classList.add("is-active");
      refresh();
      if (ready.length) {
        if (!primed) { primed = true; showCurrent(); }
        gsap.to([fimg, cap], { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    });
    section.addEventListener("mouseleave", function () {
      inside = false;
      hud.classList.remove("is-active");
      gsap.to([fimg, cap], { opacity: 0, duration: 0.3, ease: "power2.in" });
    });
    section.addEventListener("mousemove", function (e) {
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      var dx = tx - lastX, dy = ty - lastY;
      acc += Math.hypot(dx, dy);
      lastX = tx; lastY = ty;
      if (acc >= SWAP && ready.length) { acc = 0; flip(); }
    });

    /* ---- rAF loop ---- */
    gsap.ticker.add(function () {
      if (!inside) return;
      // follower (soft lag) + caption under it
      fx += (tx - fx) * 0.16;
      fy += (ty - fy) * 0.16;
      gsap.set(fimg, { x: fx, y: fy });
      gsap.set(cap, { x: fx, y: fy + 168 }); // ~half image height + gap
      // crosshair (snappier)
      lx += (tx - lx) * 0.25;
      ly += (ty - ly) * 0.25;
      setV(lx); setH(ly);
      gsap.set(plus, { x: lx, y: ly });
      gsap.set(coord, { x: lx + 16, y: ly + 16, xPercent: 0, yPercent: 0 });
      coord.textContent =
        "X " + String(Math.round(lx)).padStart(4, "0") +
        "  Y " + String(Math.round(ly)).padStart(4, "0");
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
