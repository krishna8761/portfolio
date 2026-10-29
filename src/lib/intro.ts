/**
 * First-load intro (see components/Loader).
 *
 * `introScript` runs inline in <head> before first paint. It skips the intro with
 * `html.no-intro` for reduced motion and for visitors arriving from another page of
 * this site; otherwise it marks `html.intro`. Nothing is stored in the browser.
 *
 * The loader is pure CSS and starts its exit at INTRO_MS, so page reveals that would
 * otherwise play behind it wait until then.
 */

export const INTRO_MS = 2200;

export const introScript = `try{var d=document.documentElement,r=document.referrer;if(matchMedia('(prefers-reduced-motion: reduce)').matches||(r&&new URL(r).host===location.host))d.classList.add('no-intro');else d.classList.add('intro')}catch(e){document.documentElement.classList.add('no-intro')}`;

/** Seconds left until the intro uncovers the page. Only the first call can be non-zero. */
export function takeIntroDelay() {
  const d = document.documentElement;
  if (!d.classList.contains("intro")) return 0;
  d.classList.remove("intro");
  return Math.max(0, (INTRO_MS - performance.now()) / 1000);
}
