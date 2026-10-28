import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "../lib/gsap";
import { usePageReady } from "../components/Transition";

/**
 * Batch-reveals every `[data-reveal]` inside `scope` as it scrolls in
 * (fade + rise, once). The hidden start state lives in CSS so there is no
 * flash before JS runs, and nothing is hidden at all under reduced motion.
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      if (reducedMotion() || !scope.current) return;
      const els = gsap.utils.toArray("[data-reveal]", scope.current);
      if (!els.length) return;
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            overwrite: "auto",
          }),
      });
    },
    { scope }
  );
}

/**
 * Runs a page's hero intro once the page is actually visible (after the
 * first-load loader or while the route curtain lifts). `build(tl, els)`
 * receives a fresh timeline and the scope's `[data-intro]` elements, which
 * CSS keeps hidden until then.
 */
export function useIntro(scope, build) {
  const ready = usePageReady();
  const buildRef = useRef(build);
  buildRef.current = build;

  useGSAP(
    (_, contextSafe) => {
      if (!ready) return;
      const els = gsap.utils.toArray("[data-intro]", scope.current);
      if (reducedMotion()) {
        gsap.set(els, { visibility: "visible" });
        return;
      }
      const run = contextSafe(() => {
        gsap.set(els, { visibility: "visible" });
        buildRef.current(gsap.timeline({ delay: 0.05 }), els);
      });
      if (!document.fonts || document.fonts.status === "loaded") run();
      else document.fonts.ready.then(run);
    },
    { scope, dependencies: [ready], revertOnUpdate: true }
  );
}

/** Pulls an element toward the pointer and springs it back on leave. */
export function useMagnetic(strength = 0.3, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || reducedMotion()) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    let rect = null;

    const enter = () => {
      rect = el.getBoundingClientRect();
    };
    const move = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * strength);
      yTo((e.clientY - rect.top - rect.height / 2) * strength);
    };
    const leave = () => {
      rect = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, enabled]);

  return ref;
}

function formatClock(d) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const mer = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${mer}`;
}

/** Local wall-clock time, refreshed each minute boundary. */
export function useClock() {
  const [now, setNow] = useState(() => formatClock(new Date()));
  useEffect(() => {
    let id;
    const schedule = () => {
      const d = new Date();
      setNow(formatClock(d));
      id = setTimeout(schedule, (60 - d.getSeconds()) * 1000 + 50);
    };
    schedule();
    return () => clearTimeout(id);
  }, []);
  return now;
}
