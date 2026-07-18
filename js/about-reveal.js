/* =====================================================================
   MONARK STUDIO — About statement "word illumination" scroll reveal
   (russellnumo.nl style): the long statement sits dim and each word
   brightens to full white as you scroll through it. Scrubbed, so it
   reverses on scroll-up too — reveals on the way down AND back up.

   Targets .section-4 .about-statement (single long paragraph).
   Desktop only; respects reduced-motion. Self-contained — delete file
   + its <script> tag to remove.
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

  function splitWords(el) {
    var tokens = (el.textContent || "").split(/(\s+)/);
    el.textContent = "";
    var inners = [];
    tokens.forEach(function (tok) {
      if (tok === "") return;
      if (/^\s+$/.test(tok)) {
        el.appendChild(document.createTextNode(tok));
      } else {
        var span = document.createElement("span");
        span.className = "mk-word";
        span.textContent = tok;
        el.appendChild(span);
        inners.push(span);
      }
    });
    return inners;
  }

  function init() {
    var el = document.querySelector(".section-4 .about-statement");
    if (!el) return;

    // dim base state applied immediately so there's no bright flash
    var style = document.createElement("style");
    style.id = "mk-about-styles";
    style.textContent = ".section-4 .mk-word{opacity:.16;will-change:opacity;}";
    document.head.appendChild(style);

    var words = splitWords(el);
    if (!words.length) return;

    gsap.to(words, {
      opacity: 1,
      ease: "none",
      duration: 0.6,
      stagger: 0.4,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        end: "bottom 48%",
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    ScrollTrigger.refresh();
  }

  window.addEventListener("load", init);
})();
