import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../lib/gsap";

const INTERACTIVE = "[data-cursor], a, button, input, textarea, select, summary, [role='button']";

/**
 * A trailing ring that follows fine pointers, grows over interactive
 * elements and fills with a label over `[data-cursor="…"]` targets. The
 * native cursor stays visible; this is an accent, not a replacement.
 */
export default function Cursor() {
  const root = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    const el = root.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    let shown = false;
    let current = null;
    let base = 1;

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
    };

    const over = (e) => {
      const target = e.target.closest?.(INTERACTIVE) || null;
      if (target === current) return;
      current = target;
      const text = target?.getAttribute("data-cursor") || "";
      el.classList.toggle("is-label", Boolean(text));
      label.current.textContent = text;
      base = text ? 2.9 : target ? 1.55 : 1;
      gsap.to(ring.current, { scale: base, duration: 0.5, ease: "expo.out" });
    };

    const hide = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };

    const down = () => gsap.to(ring.current, { scale: base * 0.8, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: base, duration: 0.4, ease: "back.out(3)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      gsap.killTweensOf([el, ring.current]);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <span className="cursor__ring" ref={ring} />
      <span className="cursor__label" ref={label} />
    </div>
  );
}
