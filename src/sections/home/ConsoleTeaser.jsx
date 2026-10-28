import { useRef } from "react";
import { Mic } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "../../lib/gsap";
import { TEASER } from "../../content/home";
import { Eyebrow, Pill, SplitHeading } from "../../components/ui";

const RING = 56;

export default function ConsoleTeaser() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(ref);
      const bars = q(".teaser__bar i");
      const timer = q("[data-timer]")[0];
      let seconds = 24;

      const wave = gsap.fromTo(
        bars,
        { scaleY: 0.25 },
        {
          scaleY: 1,
          duration: 0.55,
          ease: "sine.inOut",
          stagger: { each: 0.028, repeat: -1, yoyo: true },
          paused: true,
        }
      );
      const pulse = gsap.to(".teaser__core", {
        scale: 1.06,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      const clock = gsap.delayedCall(1, function tick() {
        seconds += 1;
        timer.textContent = `00:${String(seconds % 60).padStart(2, "0")}`;
        clock.restart(true);
      }).pause();

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          const on = self.isActive;
          [wave, pulse].forEach((a) => (on ? a.play() : a.pause()));
          on ? clock.restart(true) : clock.pause();
        },
      });

      const visual = q(".teaser__visual")[0];
      const fast = () => gsap.to(wave, { timeScale: 2.4, duration: 0.5 });
      const calm = () => gsap.to(wave, { timeScale: 1, duration: 0.8 });
      visual.addEventListener("pointerenter", fast);
      visual.addEventListener("pointerleave", calm);

      gsap.from(".teaser__orb", {
        scale: 0.7,
        opacity: 0,
        rotate: -40,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });

      return () => {
        visual.removeEventListener("pointerenter", fast);
        visual.removeEventListener("pointerleave", calm);
      };
    },
    { scope: ref }
  );

  return (
    <section className="section teaser" ref={ref} aria-labelledby="teaser-heading">
      <div className="shell">
        <div className="teaser__card" data-reveal="scale">
          <div className="teaser__copy">
            <Eyebrow accent="emerald">{TEASER.eyebrow}</Eyebrow>
            <SplitHeading id="teaser-heading">{TEASER.heading}</SplitHeading>
            <p className="t-lead">{TEASER.body}</p>
            <div className="cta-row">
              <Pill to={TEASER.primary.to}>{TEASER.primary.label}</Pill>
              <Pill to={TEASER.secondary.to} variant="outline">
                {TEASER.secondary.label}
              </Pill>
            </div>
          </div>

          <div className="teaser__visual" data-cursor="Talk" aria-hidden="true">
            <div className="teaser__orb">
              <div className="teaser__ring">
                {Array.from({ length: RING }, (_, i) => (
                  <span className="teaser__bar" key={i} style={{ transform: `rotate(${(360 / RING) * i}deg)` }}>
                    <i />
                  </span>
                ))}
              </div>
              <div className="teaser__core">
                <Mic strokeWidth={2} />
              </div>
            </div>
            <span className="teaser__status t-mono">
              <span className="live-dot" /> Live · <span data-timer className="tabular">00:24</span>
            </span>
            <p className="teaser__caption t-mono">Press connect and start talking</p>
          </div>
        </div>
      </div>
    </section>
  );
}
