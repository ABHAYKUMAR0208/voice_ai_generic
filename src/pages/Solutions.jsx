import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "../lib/gsap";
import { useReveal } from "../hooks/useMotion";
import { SOLUTIONS } from "../content/pages";
import { CtaBlock, Eyebrow, PageHero, SplitHeading, Art } from "../components/ui";
import TiltCard from "../components/TiltCard";
import "../styles/pages.css";

const AREAS = ["room", "cab", "laundry", "checkin", "house", "wake", "maint", "rest", "lang", "spa", "checkout"];

function Services() {
  const ref = useRef(null);
  const { services } = SOLUTIONS;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const cards = gsap.utils.toArray(".bento-card", ref.current);
      gsap.set(cards, { opacity: 0, y: 50 });
      gsap.set(cards.map((c) => c.querySelector(".art")), { scale: 1.3 });
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.09 });
          gsap.to(
            batch.map((c) => c.querySelector(".art")),
            { scale: 1, duration: 1.8, ease: "expo.out", stagger: 0.09 }
          );
        },
      });
    },
    { scope: ref }
  );

  return (
    <section className="section bento-sec" ref={ref} aria-labelledby="services-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="emerald">{services.eyebrow}</Eyebrow>
            <SplitHeading id="services-heading">{services.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {services.sub}
          </p>
        </div>

        <div className="bento">
          {services.items.map(({ Icon, tone, title, copy, badge, tags }, i) => (
            <article className={`bento-card bento-card--${AREAS[i]}`} key={title}>
              <div className="bento-card__media">
                <Art tone={tone} Icon={Icon} />
              </div>
              <span className="bento-card__shade" aria-hidden="true" />
              <div className="bento-card__content">
                <div className="bento-card__head">
                  <span className="icon-tile bento-card__icon">
                    <Icon strokeWidth={2} aria-hidden="true" />
                  </span>
                  {badge && <span className="chip bento-card__badge">{badge}</span>}
                  {tags && (
                    <span className="bento-card__tags" aria-label="Languages">
                      {tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  )}
                </div>
                <div className="bento-card__body">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Scenarios() {
  const { scenarios } = SOLUTIONS;
  return (
    <section className="section scen" aria-labelledby="scen-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="violet">{scenarios.eyebrow}</Eyebrow>
            <SplitHeading id="scen-heading">{scenarios.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {scenarios.sub}
          </p>
        </div>
        <div className="scen__grid">
          {scenarios.items.map(({ Icon, tag, title, body }, i) => (
            <TiltCard className="scen-card" key={title} data-reveal>
              <div className="scen-card__top">
                <span className="icon-tile">
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="t-mono scen-card__num">0{i + 1}</span>
              </div>
              <h3 className="scen-card__title">{title}</h3>
              <p className="scen-card__body">{body}</p>
              <span className="chip scen-card__tag">{tag}</span>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Solutions() {
  const ref = useRef(null);
  useReveal(ref);
  const { hero, cta } = SOLUTIONS;

  return (
    <main id="main" ref={ref}>
      <PageHero {...hero} accent="emerald" glow="rgba(46, 143, 130, 0.2)" />
      <Services />
      <Scenarios />
      <CtaBlock {...cta} />
    </main>
  );
}
