import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../lib/gsap";

/**
 * Card that tilts toward the pointer and carries a soft spotlight under it.
 * Rotation goes through GSAP quickTo; the spotlight position is two CSS
 * custom properties read by a small radial-gradient layer.
 */
export default function TiltCard({ as: Tag = "article", className = "", strength = 7, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
    let rect = null;

    const enter = () => {
      rect = el.getBoundingClientRect();
    };
    const move = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      ry((px - 0.5) * strength);
      rx((0.5 - py) * strength);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    };
    const leave = () => {
      rect = null;
      rx(0);
      ry(0);
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <Tag ref={ref} className={`tilt ${className}`} {...rest}>
      <span className="tilt__spot" aria-hidden="true" />
      {children}
    </Tag>
  );
}
