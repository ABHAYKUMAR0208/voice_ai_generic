import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Award, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useReveal } from "../hooks/useMotion";
import { ABOUT } from "../content/pages";
import { CONTACT } from "../content/site";
import { CtaBlock, Eyebrow, PageHero, SplitHeading } from "../components/ui";
import { TLink } from "../components/Transition";
import TiltCard from "../components/TiltCard";
import "../styles/pages.css";

function Intro() {
  const ref = useRef(null);
  const { intro, stats } = ABOUT;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const counters = gsap.utils.toArray("[data-count]", ref.current);
      counters.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        const from = el.dataset.plain ? target - 14 : 0;
        const o = { v: from };
        el.textContent = String(from);
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      return () => counters.forEach((el) => (el.textContent = el.dataset.count));
    },
    { scope: ref }
  );

  return (
    <section className="section about-intro" ref={ref} aria-labelledby="intro-heading">
      <div className="shell about-intro__grid">
        <div className="about-intro__copy">
          <Eyebrow accent="violet">{intro.eyebrow}</Eyebrow>
          <SplitHeading id="intro-heading">{intro.heading}</SplitHeading>
          {intro.paragraphs.map((p) => (
            <p className="t-body" key={p.slice(0, 20)} data-reveal>
              {p}
            </p>
          ))}
        </div>
        <ul className="about-stats">
          {stats.map((s) => (
            <li className="about-stat" key={s.label} data-reveal>
              <span className="about-stat__value tabular">
                {s.text ? (
                  s.text
                ) : (
                  <span data-count={s.value} data-plain={s.plain ? "1" : undefined}>
                    {s.value}
                  </span>
                )}
              </span>
              <span className="about-stat__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pillars() {
  const { pillars } = ABOUT;
  return (
    <section className="section pillars" aria-labelledby="pillars-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="cyan">{pillars.eyebrow}</Eyebrow>
            <SplitHeading id="pillars-heading">{pillars.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {pillars.sub}
          </p>
        </div>
        <div className="pillars__grid">
          {pillars.items.map(({ Icon, title, body }, i) => (
            <TiltCard className="pillar" key={title} data-reveal>
              <div className="pillar__top">
                <span className="icon-tile">
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="t-mono pillar__num">0{i + 1}</span>
              </div>
              <h3 className="pillar__title">{title}</h3>
              <p className="pillar__body">{body}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products() {
  const { products } = ABOUT;
  return (
    <section className="section products" aria-labelledby="products-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="amber">{products.eyebrow}</Eyebrow>
            <SplitHeading id="products-heading">{products.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {products.sub}
          </p>
        </div>
        <div className="products__grid">
          {products.items.map((p) => {
            const inner = (
              <>
                <span className="chip product__tag">{p.tag}</span>
                <h3 className="product__name">{p.name}</h3>
                <p className="product__body">{p.body}</p>
                <span className="product__cta">
                  {p.cta}
                  {p.to ? <ArrowRight strokeWidth={2} aria-hidden="true" /> : <ArrowUpRight strokeWidth={2} aria-hidden="true" />}
                </span>
              </>
            );
            return p.to ? (
              <TLink to={p.to} className={`product${p.current ? " product--current" : ""}`} key={p.name} data-reveal>
                {inner}
              </TLink>
            ) : (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="product" key={p.name} data-reveal>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CertsContact() {
  const { certs } = ABOUT;
  const icons = [ShieldCheck, Award];
  return (
    <section className="section certs" aria-labelledby="certs-heading">
      <div className="shell certs__grid">
        <div className="certs__list">
          <Eyebrow accent="emerald">{certs.eyebrow}</Eyebrow>
          <SplitHeading id="certs-heading">{certs.heading}</SplitHeading>
          {certs.items.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div className="cert" key={c.title} data-reveal>
                <span className="cert__badge">
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="cert__title">{c.title}</h3>
                  <p className="cert__body">{c.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="contact-card" data-reveal="scale">
          <span className="contact-card__glow" aria-hidden="true" />
          <h3 className="contact-card__title">Get in touch with GIT</h3>
          <a className="contact-card__row" href={CONTACT.emailHref}>
            <Mail strokeWidth={1.8} aria-hidden="true" />
            {CONTACT.email}
          </a>
          {CONTACT.phones.map((p) => (
            <a className="contact-card__row" href={p.href} key={p.label}>
              <Phone strokeWidth={1.8} aria-hidden="true" />
              {p.label} {p.phone}
            </a>
          ))}
          <p className="contact-card__row">
            <MapPin strokeWidth={1.8} aria-hidden="true" />
            {CONTACT.address}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const ref = useRef(null);
  useReveal(ref);
  const { hero, cta } = ABOUT;

  return (
    <main id="main" ref={ref}>
      <PageHero {...hero} accent="violet" />
      <Intro />
      <Pillars />
      <Products />
      <CertsContact />
      <CtaBlock {...cta} />
    </main>
  );
}
