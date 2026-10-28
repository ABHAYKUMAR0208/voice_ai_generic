import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { PLATFORM } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";

export default function Platform() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.utils.toArray(".cap", ref.current).forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
          .fromTo(row.querySelector(".cap__rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" })
          .from(row.querySelectorAll(".cap__index, .cap__icon, .cap__title, .cap__copy"), {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
          }, 0.2);
      });
    },
    { scope: ref }
  );

  return (
    <section className="section platform" ref={ref} aria-labelledby="platform-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="cyan">{PLATFORM.eyebrow}</Eyebrow>
            <SplitHeading id="platform-heading">{PLATFORM.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {PLATFORM.sub}
          </p>
        </div>

        <ul className="caps">
          {PLATFORM.features.map(({ Icon, title, copy }, i) => (
            <li className="cap" key={title}>
              <span className="cap__rule" aria-hidden="true" />
              <span className="cap__fill" aria-hidden="true" />
              <div className="cap__row">
                <span className="cap__index t-mono">0{i + 1}</span>
                <span className="icon-tile cap__icon">
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="cap__title">{title}</h3>
                <p className="cap__copy">{copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
