/* =====================================================================
   MONARK STUDIO — Services "stacking cards" on scroll
   Turns the .service-row items into sticky cards that slide up and
   stack on top of each other as you scroll, dimming the ones underneath.

   Desktop pointers only (matches main.js FULL gating); mobile /
   reduced-motion keep the original stacked-list layout untouched.

   Self-contained: injects its own CSS + ScrollTriggers, reuses the GSAP
   loaded by index.html. Delete this file + its <script> tag to remove.
   ===================================================================== */
(function () {
  "use strict";

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia("(max-width: 991px)").matches;
  var touch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
  if (reduce || mobile || touch) return; // desktop experience only

  function init() {
    var section = document.querySelector(".services-section");
    var right = document.querySelector(".services-right");
    if (!section || !right) return;
    var rows = Array.prototype.slice.call(right.querySelectorAll(".service-row"));
    if (rows.length < 2) return;

    /* ---- injected styles (scoped to .is-stack, easy to remove) ---- */
    var css = [
      ".services-section.is-stack{align-items:flex-start;}",
      ".services-section.is-stack .services-left{position:sticky;top:120px;align-self:flex-start;}",
      ".services-section.is-stack .services-right{overflow:visible;}",
      ".services-section.is-stack .service-row{position:sticky;background:#0e0e0e;" +
        "border:1px solid #2a2a2a;border-radius:16px;padding:32px;margin-bottom:22vh;" +
        "transform-origin:50% 0%;will-change:filter;}",
      ".services-section.is-stack .service-row:last-child{margin-bottom:0;}"
    ].join("");
    var style = document.createElement("style");
    style.id = "mk-stack-styles";
    style.textContent = css;
    document.head.appendChild(style);

    section.classList.add("is-stack");

    // per-card sticky offset + stacking order (later cards cover earlier)
    var BASE = 110, STEP = 16;
    rows.forEach(function (row, i) {
      row.style.top = (BASE + i * STEP) + "px";
      row.style.zIndex = String(i + 1);
    });

    // dim each card as the NEXT one rises up to cover it (scrubbed, so it
    // plays forward on scroll-down and reverses on scroll-up — both ends)
    rows.forEach(function (row, i) {
      if (i === rows.length - 1) return;
      gsap.fromTo(row,
        { filter: "brightness(1)" },
        {
          filter: "brightness(0.5)",
          ease: "none",
          scrollTrigger: {
            trigger: rows[i + 1],
            start: "top 45%",
            end: "top " + (BASE + (i + 1) * STEP) + "px",
            scrub: true,
            invalidateOnRefresh: true
          }
        });
    });

    ScrollTrigger.refresh();
  }

  if (document.readyState !== "loading") window.addEventListener("load", init);
  else document.addEventListener("DOMContentLoaded", function () { window.addEventListener("load", init); });
})();
