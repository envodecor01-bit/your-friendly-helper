import Lenis from "lenis";

let _lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  _lenis = l;
}

export function getLenis() {
  return _lenis;
}

/** Smoothly scroll to an element id, using Lenis if available. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (_lenis) {
    _lenis.scrollTo(el, { offset: -32, duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
