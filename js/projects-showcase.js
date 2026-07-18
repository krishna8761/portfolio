/* =====================================================================
   MONARK STUDIO — Projects two-column stacked-panel showcase
   Left panels (.pj-panel) stack via CSS sticky. This module:
     - swaps the right-hand meta column (.pj-meta) to match whichever
       panel is currently centred, with a quick mask transition
     - adds a subtle in-frame parallax to each screenshot

   Desktop only (mobile uses the static single-column CSS layout).
   Self-contained; delete file + <script> tag to remove.
   ===================================================================== */
(function () {
  "use strict";

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia("(max-width: 991px)").matches;
  var touch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
  if (reduce || mobile || touch) return;

  function init() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("#projects .pj-panel"));
    var metaInner = document.querySelector("#projects .pj-meta-inner");
    if (panels.length < 2 || !metaInner) return;

    var numEl = metaInner.querySelector(".pj-num");
    var titleEl = metaInner.querySelector(".pj-title-text");
    var catEl = metaInner.querySelector(".pj-cat");
    var locEl = metaInner.querySelector(".pj-loc");
    var yearEl = metaInner.querySelector(".pj-year");

    var cur = 0;
    function apply(i) {
      var p = panels[i];
      if (numEl) numEl.textContent = p.dataset.num;
      if (titleEl) titleEl.textContent = p.dataset.title;
      if (catEl) catEl.textContent = p.dataset.cat;
      if (locEl) locEl.textContent = p.dataset.loc;
      if (yearEl) yearEl.textContent = p.dataset.year;
    }
    function setActive(i) {
      if (i === cur || i < 0 || i >= panels.length) return;
      cur = i;
      gsap.killTweensOf(metaInner);
      gsap.timeline()
        .to(metaInner, {
          opacity: 0, y: -14, duration: 0.22, ease: "power2.in",
          onComplete: function () { apply(i); }
        })
        .to(metaInner, { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" });
    }

    // activation: when a panel's top passes viewport centre it becomes active
    panels.forEach(function (panel, i) {
      ScrollTrigger.create({
        trigger: panel,
        start: "top center",
        onEnter: function () { setActive(i); },
        onLeaveBack: function () { setActive(i - 1); }
      });

      // subtle in-frame parallax on the screenshot
      var shot = panel.querySelector(".pj-shot");
      if (shot) {
        gsap.fromTo(shot, { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true }
        });
      }
    });

    apply(0);
    ScrollTrigger.refresh();
  }

  window.addEventListener("load", init);
})();
