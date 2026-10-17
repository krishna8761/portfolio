/**
 * Low-power mode for weak machines and constrained connections.
 *
 * The same rule runs in two places:
 *  - `lowPowerScript` (inline in <head>) adds `html.lp` before first paint, for CSS.
 *  - `isLowPower()` for JS decisions after hydration.
 * When it applies: smooth scrolling, parallax and clip-path reveals are switched off,
 * videos stay on their poster, and looping CSS animations stop.
 */

const rule = `(function(){var n=navigator,c=n.connection||{};return (n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||c.saveData===true||/(^|-)2g$/.test(c.effectiveType||"")||matchMedia("(prefers-reduced-data: reduce)").matches})()`;

export const lowPowerScript = `try{if(${rule})document.documentElement.classList.add('lp')}catch(e){}`;

export function isLowPower() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("lp");
}
