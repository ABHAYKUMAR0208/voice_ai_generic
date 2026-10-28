import { useEffect, useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap, ScrollTrigger, reducedMotion } from "../../lib/gsap";
import { FAQ } from "../../content/home";
import { CONTACT } from "../../content/site";
import { Eyebrow, Pill, SplitHeading } from "../../components/ui";

export default function Faq() {
  const [open, setOpen] = useState(0);
  const panels = useRef([]);
  const prev = useRef(null);
  const uid = useId();

  useEffect(() => {
    const instant = prev.current === null || reducedMotion();
    panels.current.forEach((el, i) => {
      if (!el) return;
      const isOpen = i === open;
      const wasOpen = i === prev.current;
      if (instant) {
        gsap.set(el, { height: isOpen ? "auto" : 0 });
        return;
      }
      if (isOpen) {
        gsap.fromTo(
          el,
          { height: 0 },
          {
            height: "auto",
            duration: 0.7,
            ease: "expo.out",
            onComplete: () => {
              gsap.set(el, { height: "auto" });
              ScrollTrigger.refresh();
            },
          }
        );
        gsap.fromTo(el.firstElementChild, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", delay: 0.08 });
      } else if (wasOpen) {
        gsap.to(el, { height: 0, duration: 0.5, ease: "expo.inOut", onComplete: () => ScrollTrigger.refresh() });
      }
    });
    prev.current = open;
  }, [open]);

  return (
    <section className="section faq" aria-labelledby="faq-heading">
      <div className="shell faq__grid">
        <div className="faq__side">
          <Eyebrow accent="amber">{FAQ.eyebrow}</Eyebrow>
          <SplitHeading id="faq-heading">{FAQ.heading}</SplitHeading>
          <p className="t-body" data-reveal>
            Still curious? Our team answers within one business day.
          </p>
          <div data-reveal>
            <Pill variant="outline" href={CONTACT.emailHref} icon="up">
              Ask the team
            </Pill>
          </div>
        </div>

        <ul className="faq__list">
          {FAQ.items.map((item, i) => {
            const isOpen = open === i;
            const qid = `${uid}-q${i}`;
            const aid = `${uid}-a${i}`;
            return (
              <li className={`faq-item${isOpen ? " is-open" : ""}`} key={item.q} data-reveal>
                <h3>
                  <button
                    id={qid}
                    className="faq-item__q"
                    aria-expanded={isOpen}
                    aria-controls={aid}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-item__icon" aria-hidden="true">
                      <Plus strokeWidth={2} />
                    </span>
                  </button>
                </h3>
                <div
                  id={aid}
                  role="region"
                  aria-labelledby={qid}
                  className="faq-item__a"
                  ref={(el) => (panels.current[i] = el)}
                >
                  <p>{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
