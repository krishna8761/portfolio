/* =====================================================================
   MONARK STUDIO — cinematic motion system
   GSAP 3 + ScrollTrigger + CustomEase + Lenis
   Dark / editorial / high-fashion. JS-only: the preloader, custom
   cursor, word-masks and clip states are all built at runtime — no
   markup or stylesheet is edited.

   Section index:
     0. Boot + injected styles + helpers
     1. Lenis smooth scroll
     2. Page preloader (counter 0->100, split reveal)
     3. Hero "MONARK Studio" reveal
     4. Sticky push-away scroll (hero -> eyes -> services)
     5. Project cards (clip-wipe image + mask title)
     6. Services (slot-machine number + clip title)
     7. CTA (word-mask headline + parallax zoom-out + link stagger)
     8. Custom cursor (dot + difference ring + VIEW label)
     9. Magnetic buttons
    10. Marquee (graceful skip — none in DOM)
     +  FAQ accordion + nav smooth-scroll (kept from prior build)
   ===================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     0. BOOT — guard, environment, injected styles, helpers
     --------------------------------------------------------------- */

  var root = document.documentElement;

  // If GSAP failed to load, reveal the page and do nothing fancy.
  if (typeof window.gsap === "undefined") {
    root.classList.remove("gsap-ready");
    return;
  }

  var gsap = window.gsap;

  // Neutralise the previous build's CSS reveal system (html.gsap-ready
  // hidden states). From here on, every initial state is owned by GSAP.
  root.classList.remove("gsap-ready");

  var ScrollTrigger = window.ScrollTrigger;
  var hasST = typeof ScrollTrigger !== "undefined";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 767px)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;

  // Full cinematic treatment only on desktop pointers without reduced-motion.
  var FULL = !isMobile && !isTouch && !reduceMotion;

  // Tiny query helpers.
  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function willChange(els, val) {
    (Array.isArray(els) ? els : [els]).forEach(function (el) { if (el) el.style.willChange = val; });
  }

  // Custom eases (loaded async below); sensible fallbacks meanwhile.
  var revealEase = "expo.out";
  var counterEase = "power4.out";

  // One injected stylesheet for things that MUST exist for the effects
  // (preloader, cursor, word masks). No edits to style.css.
  (function injectStyles() {
    var css = [
      /* preloader */
      ".mk-pre{position:fixed;inset:0;z-index:100000;overflow:hidden;}",
      ".mk-pre__panel{position:absolute;left:0;width:100%;height:50.5%;background:#000;}",
      ".mk-pre__panel--top{top:0;}",
      ".mk-pre__panel--bottom{bottom:0;}",
      ".mk-pre__count{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
        "font-family:'Space Mono',monospace;color:#fff;font-size:14vw;line-height:1;" +
        "letter-spacing:-0.02em;z-index:2;will-change:transform,opacity;}",
      /* custom cursor */
      ".mk-cur-dot{position:fixed;left:0;top:0;width:8px;height:8px;border-radius:50%;" +
        "background:#fff;pointer-events:none;z-index:100002;transform:translate(-50%,-50%);}",
      ".mk-cur-ring{position:fixed;left:0;top:0;width:8px;height:8px;border-radius:50%;" +
        "background:#fff;pointer-events:none;z-index:100001;mix-blend-mode:difference;" +
        "display:flex;align-items:center;justify-content:center;" +
        "transition:width .35s cubic-bezier(.2,.7,.2,1),height .35s cubic-bezier(.2,.7,.2,1);}",
      ".mk-cur-ring.is-active{width:60px;height:60px;}",
      ".mk-cur-ring.is-view{width:96px;height:96px;}",
      ".mk-cur-label{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;" +
        "color:#000;letter-spacing:.05em;opacity:0;transition:opacity .25s ease;white-space:nowrap;}",
      ".mk-cur-ring.is-view .mk-cur-label{opacity:1;}",
      /* word masks for the CTA headline */
      ".mk-wmask{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em;}",
      ".mk-winner{display:inline-block;will-change:transform;}"
    ].join("");
    var style = document.createElement("style");
    style.id = "mk-motion-styles";
    style.textContent = css;
    document.head.appendChild(style);
  })();

  // Load CustomEase (not in index.html) at runtime; resolve either way.
  function loadCustomEase() {
    return new Promise(function (resolve) {
      if (window.CustomEase) return resolve();
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js";
      s.onload = resolve;
      s.onerror = resolve; // fall back to built-in eases
      document.head.appendChild(s);
    });
  }

  /* Build the preloader immediately so a black screen covers everything
     while assets stream in (before the load event fires). */
  var pre, preCount, prePanelTop, prePanelBottom;
  (function buildPreloader() {
    pre = document.createElement("div");
    pre.className = "mk-pre";
    prePanelTop = document.createElement("div");
    prePanelTop.className = "mk-pre__panel mk-pre__panel--top";
    prePanelBottom = document.createElement("div");
    prePanelBottom.className = "mk-pre__panel mk-pre__panel--bottom";
    preCount = document.createElement("div");
    preCount.className = "mk-pre__count";
    preCount.textContent = "000";
    pre.appendChild(prePanelTop);
    pre.appendChild(prePanelBottom);
    pre.appendChild(preCount);
    document.body.appendChild(pre);
    document.body.style.overflow = "hidden"; // lock scroll during intro
  })();

  /* ---------------------------------------------------------------
     Everything else waits for full asset load.
     --------------------------------------------------------------- */
  window.addEventListener("load", function () {
    loadCustomEase().then(boot);
  });

  var lenis = null;

  function boot() {
    if (hasST) gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) {
      gsap.registerPlugin(window.CustomEase);
      // decelerating reveal, and a snappy-then-settling counter curve
      revealEase = window.CustomEase.create("mkReveal", "M0,0 C0.16,1 0.3,1 1,1");
      counterEase = window.CustomEase.create("mkCount", "M0,0 C0.05,0.75 0.15,1 1,1");
    }

    initLenis();          // 1
    runPreloader().then(function () {   // 2
      document.body.style.overflow = "";
      if (lenis) lenis.start();

      if (FULL) {
        // Created strictly top-to-bottom in DOM order so ScrollTrigger
        // refreshes pins/offsets in page order (gsap-scrolltrigger skill).
        revealHero();     // 3  hero
        stickyPushAway(); // 4  hero pin + eyes
        servicesReveal(); // 6  services  (above projects in the DOM)
        projectCards();   // 5  projects
        ctaSection();     // 7  cta
        initCursor();     // 8
        initMagnetic();   // 9
        initMarquee();    // 10
      } else {
        simpleReveals();  // mobile / reduced-motion: clean fades only
      }

      faqAccordion();
      pricingToggle();
      if (hasST) ScrollTrigger.refresh();
    });
  }

  /* ---------------------------------------------------------------
     1. LENIS — buttery smooth scroll, synced to GSAP + ScrollTrigger
     --------------------------------------------------------------- */
  function initLenis() {
    if (reduceMotion || typeof window.Lenis === "undefined") return;

    lenis = new window.Lenis({
      lerp: 0.08,          // slower interpolation = heavier, premium feel
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,    // no smoothing on touch = no mobile jank
      infinite: false      // no momentum wrap/bounce
    });

    if (hasST) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    lenis.stop(); // held until the preloader finishes

    // In-page anchors (nav, footer) scroll through Lenis.
    qa('a[href^="#"]').forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      link.addEventListener("click", function (e) {
        var el = q(href);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -40 });
      });
    });
  }

  /* ---------------------------------------------------------------
     2. PRELOADER — counter 0->100 (fast then slow), then split reveal
     --------------------------------------------------------------- */
  function runPreloader() {
    return new Promise(function (resolve) {
      // Reduced motion: skip the show, just uncover.
      if (reduceMotion) {
        gsap.set(pre, { display: "none" });
        return resolve();
      }

      willChange([prePanelTop, prePanelBottom, preCount], "transform");
      var counter = { v: 0 };

      gsap.timeline({ onComplete: function () { pre.remove(); resolve(); } })
        // count up, decelerating hard near 100
        .to(counter, {
          v: 100,
          duration: 2.0,
          ease: counterEase,
          onUpdate: function () {
            preCount.textContent = String(Math.round(counter.v)).padStart(3, "0");
          }
        })
        // counter flies off the top
        .to(preCount, { yPercent: -160, opacity: 0, duration: 0.7, ease: "power3.in" }, "+=0.08")
        // black splits horizontally: top half up, bottom half down
        .to(prePanelTop, { yPercent: -101, duration: 0.9, ease: "power4.inOut" }, "-=0.45")
        .to(prePanelBottom, { yPercent: 101, duration: 0.9, ease: "power4.inOut" }, "<");
      // total ≈ 2.5s
    });
  }

  /* ---------------------------------------------------------------
     Shared helper: mask slide-up (text/imagery rising through a mask)
     Uses clip-path + translate so no wrapper element is required.
     --------------------------------------------------------------- */
  function maskUp(target, vars) {
    willChange(qa(typeof target === "string" ? target : null), "transform");
    return gsap.fromTo(
      target,
      { yPercent: 115, clipPath: "inset(0 0 100% 0)" },
      Object.assign({
        yPercent: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.0,
        ease: revealEase
      }, vars || {})
    );
  }

  /* ---------------------------------------------------------------
     3. HERO — wordmark mask reveal + info-row stagger
     NOTE: the "MONARK Studio" wordmark is a single PNG, so it reveals
     as one masked unit rather than per-letter.
     --------------------------------------------------------------- */
  function revealHero() {
    var wordmark = q(".image");
    var nav = q(".nav-bar");

    var tl = gsap.timeline();

    if (nav) {
      tl.fromTo(nav, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
    }
    if (wordmark) {
      willChange(wordmark, "transform");
      tl.add(maskUp(wordmark, { duration: 1.2 }), 0.1);
      // "Studio" texture is baked into the same image; simulate the
      // 0.3s-later horizontal-blur clear with a brief filter on the mark.
      tl.fromTo(wordmark, { filter: "blur(14px)" }, { filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, 0.4);
    }

    // Info row: BHOPAL, service links, description, year — stagger up.
    var info = [q(".block-quote")]
      .concat(qa(".link-2"))
      .concat([q(".paragraph"), q(".paragraph-2"), q(".text-block")])
      .filter(Boolean);

    if (info.length) {
      tl.fromTo(info, { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.55);
    }
  }

  /* ---------------------------------------------------------------
     4. STICKY PUSH-AWAY — hero pinned + pushed back as next covers it
     Hero scales to .95 / fades to .3 while the eyes section rises over
     it; then the eyes section does the same as services covers it.
     --------------------------------------------------------------- */
  function stickyPushAway() {
    if (!hasST) return;

    var container = q(".container");
    var heroLayers = [q(".inner-hero"), q(".hero-container")].filter(Boolean);
    var eyes = q(".section-3");
    var talk = q(".hero-talk-wrap");

    if (container && heroLayers.length) {
      // Per gsap-scrolltrigger: PIN the container, ANIMATE its children —
      // never tween the pinned element itself. Per gsap-performance: only
      // transform + opacity (compositor-friendly), will-change on the two
      // layers that actually move.
      willChange(heroLayers, "transform");
      gsap.set(heroLayers, { transformOrigin: "50% 42%", force3D: true });

      // ScrollTrigger lives on the TIMELINE (not a child tween). pinSpacing
      // is off on purpose: the following sticky sections handle layout and
      // are meant to slide up and cover the pinned hero.
      gsap.timeline({
        scrollTrigger: {
          id: "hero-pin",
          trigger: container,
          start: "top top",
          end: "+=100%",           // pinned for one viewport as the cover rises
          scrub: 1.5,              // cinematic catch-up lag
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,        // prevents a 1-frame jump when the pin engages
          invalidateOnRefresh: true // recompute "+=100%" on resize/refresh
        }
      }).to(heroLayers, { scale: 0.95, opacity: 0.3, ease: "none" });
    }

    // Eyes section gets pushed away the same way as services covers it.
    // No pin here — the section's existing CSS `position: sticky` does the
    // covering; we only scrub its scale/opacity as it exits.
    if (eyes && talk) {
      willChange(talk, "transform");
      gsap.set(talk, { transformOrigin: "50% 42%", force3D: true });
      gsap.to(talk, {
        scale: 0.95,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          id: "eyes-push",
          trigger: eyes,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });
    }
  }

  /* ---------------------------------------------------------------
     5. PROJECT CARDS — image clip-wipe + mask title + fade meta
     --------------------------------------------------------------- */
  function projectCards() {
    if (!hasST) return;

    qa(".project-single-card").forEach(function (card) {
      var img = q(".psc-img", card);
      var title = q(".psc-title", card);
      var cat = q(".psc-cat", card);
      var loc = q(".psc-loc", card);

      willChange([img, title], "transform");

      var tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%" } });

      // image wipes in from the left
      if (img) {
        tl.fromTo(img,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: revealEase }, 0);
      }
      // title rises through a mask, 0.1s in
      if (title) tl.add(maskUp(title, { duration: 0.9 }), 0.1);
      // category / location fade up after the title
      if (cat) tl.fromTo(cat, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.3);
      if (loc) tl.fromTo(loc, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.42);
    });
  }

  /* ---------------------------------------------------------------
     6. SERVICES — slot-machine number roll + clip title + fade desc
     --------------------------------------------------------------- */
  function slotRoll(el, finalText) {
    var obj = { t: 0 };
    gsap.to(obj, {
      t: 1,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: function () {
        // spin random 3-digit numbers, then land on the real one
        el.textContent = obj.t < 0.88
          ? String(Math.floor(Math.random() * 1000)).padStart(3, "0")
          : finalText;
      },
      onComplete: function () { el.textContent = finalText; }
    });
  }

  function servicesReveal() {
    if (!hasST) return;

    qa(".service-row").forEach(function (row) {
      var num = q(".service-number", row);
      var title = q(".service-title", row);
      var desc = q(".service-desc", row);

      willChange(title, "transform");
      var finalNum = num ? num.textContent.trim() : "";

      var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "restart none restart reset" } });
      if (title) {
        tl.fromTo(title,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: revealEase }, 0);
      }
      if (num) tl.add(function () { slotRoll(num, finalNum); }, 0);
      if (desc) tl.fromTo(desc, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.3);
    });
  }

  /* ---------------------------------------------------------------
     7. CTA — word-mask headline + parallax zoom-out + link stagger
     --------------------------------------------------------------- */
  function splitWords(el) {
    var words = (el.textContent || "").trim().split(/\s+/);
    el.textContent = "";
    var inners = [];
    words.forEach(function (w, i) {
      var mask = document.createElement("span");
      mask.className = "mk-wmask";
      var inner = document.createElement("span");
      inner.className = "mk-winner";
      inner.textContent = w;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      inners.push(inner);
    });
    return inners;
  }

  function ctaSection() {
    if (!hasST) return;

    // headline: each WORD slides up through its own mask
    var head = q(".cta-headline");
    if (head) {
      var inners = splitWords(head);
      gsap.fromTo(inners, { yPercent: 120 },
        { yPercent: 0, duration: 1.0, ease: revealEase, stagger: 0.1,
          scrollTrigger: { trigger: head, start: "top 85%" } });
    }

    // center portrait: scale 1.15 -> 1 as you scroll through (zoom-out)
    var portrait = q(".image-10");
    var wrap = q(".cta-center-img-wrap");
    if (portrait && wrap) {
      willChange(portrait, "transform");
      gsap.fromTo(portrait, { scale: 1.15 },
        { scale: 1, ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
    }

    // PAGES / FOLLOW ON columns stagger in after the headline
    var links = qa(".cta-col-label").concat(qa(".cta-col-link"));
    if (links.length) {
      gsap.fromTo(links, { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: q(".cta-columns-row") || head, start: "top 85%" } });
    }
  }

  /* ---------------------------------------------------------------
     8. CUSTOM CURSOR — dot + difference ring, "VIEW ↗" on cards
     --------------------------------------------------------------- */
  function initCursor() {
    var ring = document.createElement("div");
    ring.className = "mk-cur-ring";
    var label = document.createElement("span");
    label.className = "mk-cur-label";
    label.textContent = "VIEW ↗";
    ring.appendChild(label);

    var dot = document.createElement("div");
    dot.className = "mk-cur-dot";

    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.body.style.cursor = "none"; // hide OS cursor

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });

    // ring trails with lerp 0.15 for a premium lag
    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    });

    // generic interactive elements expand the ring (blend inverts colours)
    qa("a, button, .service-row, .faq-question-row").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-active", "is-view"); });
    });

    // project cards show the VIEW label inside a larger ring
    qa(".project-single-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-active", "is-view"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-active", "is-view"); });
    });
  }

  /* ---------------------------------------------------------------
     9. MAGNETIC BUTTONS — pull toward cursor within 80px, elastic back
     --------------------------------------------------------------- */
  function initMagnetic() {
    var els = qa(".cta-button, .button-3, .button-2");
    if (!els.length) return;
    willChange(els, "transform");

    var STRENGTH = 0.2;   // fraction of the cursor offset the button follows
    var REACH = 40;       // px of proximity beyond the button edge that activates
    var MAX = 16;         // hard cap on displacement so it never leaves its box
    var clamp = gsap.utils.clamp(-MAX, MAX);

    window.addEventListener("mousemove", function (e) {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        // IMPORTANT: the rect already includes the transform we applied, so
        // subtract the current x/y to get the RESTING centre. Without this
        // the measurement feeds back on itself and the button drifts away.
        var curX = Number(gsap.getProperty(el, "x")) || 0;
        var curY = Number(gsap.getProperty(el, "y")) || 0;
        var cx = r.left + r.width / 2 - curX;
        var cy = r.top + r.height / 2 - curY;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var reach = Math.max(r.width, r.height) / 2 + REACH;

        if (Math.hypot(dx, dy) < reach) {
          gsap.to(el, {
            x: clamp(dx * STRENGTH),
            y: clamp(dy * STRENGTH),
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto"
          });
          el._mkPulled = true;
        } else if (el._mkPulled) {
          el._mkPulled = false;
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)", overwrite: "auto" });
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     10. MARQUEE — infinite ticker, velocity-reactive direction.
     No marquee exists in this DOM, so this skips gracefully. Drop in
     an element with .marquee / [data-marquee] and it activates.
     --------------------------------------------------------------- */
  function initMarquee() {
    if (!hasST) return;
    qa(".marquee, [data-marquee]").forEach(function (track) {
      var inner = track.firstElementChild;
      if (!inner) return;
      var loop = gsap.to(inner, {
        xPercent: -50, repeat: -1, ease: "none", duration: 20
      });
      var dir = 1;
      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        onUpdate: function (self) {
          var v = self.getVelocity();
          if (v < 0 && dir !== -1) { dir = -1; loop.timeScale(-1); }
          else if (v > 0 && dir !== 1) { dir = 1; loop.timeScale(1); }
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     MOBILE / REDUCED-MOTION — clean fades, zero heavy effects
     --------------------------------------------------------------- */
  function simpleReveals() {
    // hero shows immediately, just a soft rise
    var heroBits = [q(".nav-bar"), q(".image"), q(".div-block-2")].filter(Boolean);
    gsap.fromTo(heroBits, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" });

    if (!hasST) return;

    var targets = [
      ".services-left", ".service-row", ".psc-info", ".psc-img-wrap",
      ".heading", ".heading-2", ".image-9", ".heading-4", ".process-subtitle",
      ".process-card", ".faq-left", ".faq-item", ".heading-6", ".pricing-heading-1",
      ".div-1", ".div-block-47", ".cta-headline", ".image-10", ".cta-columns-row",
      ".footer-top-row", ".footer-bottom-row"
    ];
    targets.forEach(function (sel) {
      qa(sel).forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    });
  }

  /* ---------------------------------------------------------------
     PRICING TOGGLE — subscription card: monthly (₹10,000) <-> annual
     (₹9,000). No Webflow IX2 runtime ships in this export, so the
     toggle (div-block-40, already cursor:pointer in style.css) has never
     done anything -- wire it up here. The CSS (knob slide, active-label
     opacity) lives in responsive.css under .div-block-40.is-annual.
     --------------------------------------------------------------- */
  function pricingToggle() {
    var toggle = q(".div-block-40");
    var card = q(".div-1");
    if (!toggle || !card) return;

    var priceEl = q(".heading-7", card);
    var monthlyLabel = q(".text-block-7", toggle);
    var annualLabel = q(".text-block-8", toggle);
    if (!priceEl) return;

    var MONTHLY_PRICE = "₹10,000";
    var ANNUAL_PRICE = "₹9,000";
    var isAnnual = false;

    function render() {
      priceEl.textContent = isAnnual ? ANNUAL_PRICE : MONTHLY_PRICE;
      toggle.classList.toggle("is-annual", isAnnual);
      if (monthlyLabel) monthlyLabel.classList.toggle("is-active", !isAnnual);
      if (annualLabel) annualLabel.classList.toggle("is-active", isAnnual);
    }

    toggle.addEventListener("click", function () {
      isAnnual = !isAnnual;
      render();
    });

    render(); // set the initial active label (monthly) on load
  }

  /* ---------------------------------------------------------------
     FAQ ACCORDION — collapse answers, click to expand, + rotates to x
     --------------------------------------------------------------- */
  function faqAccordion() {
    qa(".faq-item").forEach(function (item) {
      var rowEl = q(".faq-question-row", item);
      var answer = q(".faq-answer", item);
      if (!rowEl || !answer) return;

      gsap.set(answer, { height: 0, opacity: 0, overflow: "hidden", marginTop: 0 });
      var open = false;
      rowEl.addEventListener("click", function () {
        open = !open;
        item.classList.toggle("is-open", open);
        gsap.to(answer, {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          marginTop: open ? 16 : 0,
          duration: open ? 0.5 : 0.4,
          ease: open ? "power2.out" : "power2.in",
          onComplete: function () { if (hasST) ScrollTrigger.refresh(); }
        });
      });
    });
  }

})();
