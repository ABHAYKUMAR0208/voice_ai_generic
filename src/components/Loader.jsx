import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { usePageTransition } from "./Transition";
import { useLenis } from "./SmoothScroll";
import { BRAND } from "../content/site";

/**
 * First-visit loader: brand, a 000 → 100 counter and a gradient line, then
 * the panel lifts away with a rounded bottom edge while the hero intro
 * starts underneath. Skipped on /console (a tool page) and under reduced
 * motion.
 */
export default function Loader() {
  const { pathname } = useLocation();
  const { releaseIntro } = usePageTransition();
  const lenis = useLenis();
  const [done, setDone] = useState(() => pathname === "/console" || reducedMotion());
  const root = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (done || !lenis) return undefined;
    lenis.stop();
    return () => lenis.start();
  }, [done, lenis]);

  useGSAP(
    () => {
      if (done) return;
      // Hold the node itself: a ref is already null by the time an unmount
      // reverts this timeline (which renders the counter tween once more).
      const count = countRef.current;
      const counter = { v: 0 };
      gsap
        .timeline({ onComplete: () => setDone(true) })
        .from(".loader__content > *", { y: 18, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 })
        .to(".loader__fill", { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.4,
            ease: "power2.inOut",
            onUpdate: () => {
              count.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.15
        )
        .to([".loader__content", ".loader__progress"], { y: -24, opacity: 0, duration: 0.55, ease: "expo.in" }, "+=0.1")
        .add(releaseIntro, "-=0.1")
        .to(root.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: root, dependencies: [] }
  );

  if (done) return null;

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__content">
        <div className="loader__brand">
          <img src={BRAND.logo} alt={BRAND.name} width="203" height="63" />
        </div>
        <p className="loader__tag">The voice agent that never sleeps.</p>
      </div>
      <div className="loader__progress">
        <div className="loader__track">
          <div className="loader__fill" />
        </div>
        <div className="loader__meta t-mono">
          <span>Connecting your agent</span>
          <span className="loader__count" ref={countRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
