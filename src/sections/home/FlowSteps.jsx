import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "../../lib/gsap";
import { FLOW } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";
import { TLink } from "../../components/Transition";

const STAR =
  "M100.00,12.00 L116.07,61.20 L162.23,37.77 L138.80,83.93 L188.00,100.00 L138.80,116.07 L162.23,162.23 L116.07,138.80 L100.00,188.00 L83.93,138.80 L37.77,162.23 L61.20,116.07 L12.00,100.00 L61.20,83.93 L37.77,37.77 L83.93,61.20Z";
const HEXAGON = "M100.00,12.00 L176.21,56.00 L176.21,144.00 L100.00,188.00 L23.79,144.00 L23.79,56.00Z";
const BOLT = "M118,12 L68,108 L96,108 L82,188 L132,92 L104,92 Z";
const ACCENTS = ["#e0712f", "#4450b0", "#2e8f82"];

export default function FlowSteps() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const labels = gsap.utils.toArray(".flow__step", ref.current);
        let active = -1;
        const setActive = (i) => {
          if (i === active) return;
          active = i;
          labels.forEach((el, j) => el.classList.toggle("is-active", j === i));
        };
        setActive(0);

        const caps = gsap.utils.toArray(".flow__caption", ref.current);
        gsap.set(caps.slice(1), { opacity: 0, yPercent: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ref.current,
            pin: ref.current.querySelector(".flow__pin"),
            start: "top top",
            end: "+=190%",
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3 + 0.08))),
          },
        });

        [HEXAGON, BOLT].forEach((shape, i) => {
          const at = i * 1 + 0.25;
          tl.to(".flow__path", { morphSVG: shape, fill: ACCENTS[i + 1], duration: 1 }, at)
            .to(".flow__stage", { rotate: (i + 1) * 60, duration: 1 }, at)
            .to(caps[i], { opacity: 0, yPercent: -40, duration: 0.45 }, at)
            .to(caps[i + 1], { opacity: 1, yPercent: 0, duration: 0.55 }, at + 0.35)
            .to(`.flow__glow--${i}`, { opacity: 0, duration: 1 }, at)
            .to(`.flow__glow--${i + 1}`, { opacity: 1, duration: 1 }, at);
        });
        tl.to(".flow__bar-fill", { scaleX: 1, duration: 2.5, ease: "none" }, 0).to({}, { duration: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="flow" ref={ref} aria-labelledby="flow-heading">
      <div className="flow__pin">
        <div className="flow__glows" aria-hidden="true">
          {ACCENTS.map((c, i) => (
            <span key={c} className={`flow__glow flow__glow--${i}`} style={{ "--glow": c }} />
          ))}
        </div>

        <div className="shell flow__inner">
          <div className="flow__head">
            <Eyebrow accent="cyan">{FLOW.eyebrow}</Eyebrow>
            <SplitHeading id="flow-heading" className="t-h2">
              {FLOW.heading}
            </SplitHeading>
          </div>

          <div className="flow__body">
            <div className="flow__stage-wrap" aria-hidden="true">
              <span className="flow__orbit" />
              <div className="flow__stage">
                <svg viewBox="0 0 200 200" className="flow__svg">
                  <path className="flow__path" d={STAR} fill={ACCENTS[0]} />
                </svg>
              </div>
            </div>

            <div className="flow__copy">
              <ol className="flow__steps">
                {FLOW.steps.map((s, i) => (
                  <li className={`flow__step${i === 0 ? " is-active" : ""}`} key={s.label}>
                    <span className="t-mono">0{i + 1}</span>
                    {s.label}
                  </li>
                ))}
              </ol>
              <div className="flow__captions">
                {FLOW.steps.map((s, i) => (
                  <p className="flow__caption" key={s.label}>
                    <span className="flow__caption-num t-mono">0{i + 1} — {s.label}</span>
                    {s.body}
                  </p>
                ))}
              </div>
              <div className="flow__bar" aria-hidden="true">
                <span className="flow__bar-fill" />
              </div>
              <TLink to={FLOW.teaser.to} className="tlink flow__teaser">
                {FLOW.teaser.label}
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </TLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
