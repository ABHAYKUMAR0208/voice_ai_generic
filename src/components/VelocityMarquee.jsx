import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "../lib/gsap";

/**
 * Infinite marquee whose speed, direction and skew follow scroll velocity,
 * then ease back to a calm drift. Paused whenever it's off screen.
 */
export default function VelocityMarquee({ label, items }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const track = ref.current.querySelector(".vmarquee__track");
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
      let settle;

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = v < 0 ? -1 : 1;
          gsap.to(loop, {
            timeScale: dir * gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 600),
            duration: 0.25,
            overwrite: true,
          });
          skewTo(gsap.utils.clamp(-7, 7, v / -350));
          settle?.kill();
          settle = gsap.delayedCall(0.2, () => {
            gsap.to(loop, { timeScale: dir, duration: 1, ease: "power2.out", overwrite: true });
            skewTo(0);
          });
        },
      });
    },
    { scope: ref }
  );

  const row = (copy) =>
    items.map((item) => (
      <Fragment key={`${copy}-${item}`}>
        <span className="vmarquee__item">{item}</span>
        <span className="vmarquee__sep" aria-hidden="true" />
      </Fragment>
    ));

  return (
    <section className="vmarquee" ref={ref} aria-label={label}>
      {label && <p className="vmarquee__label t-mono">{label}</p>}
      <div className="vmarquee__viewport">
        <div className="vmarquee__track">
          {row("a")}
          <span aria-hidden="true" style={{ display: "contents" }}>
            {row("b")}
          </span>
        </div>
      </div>
    </section>
  );
}
