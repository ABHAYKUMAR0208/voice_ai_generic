import { useRef } from "react";
import { Award, Mail, MapPin, Phone } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "../lib/gsap";
import { useReveal } from "../hooks/useMotion";
import { ACHIEVEMENTS, BRAND, CONTACT, FOOTER } from "../content/site";
import { TLink } from "./Transition";
import { Pill, SplitHeading } from "./ui";

const YEAR = new Date().getFullYear();

/** "Achievement unlocked" chip — cycles every 3 s, only while on screen. */
function Achievement() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const title = ref.current.querySelector(".achievement__title");
      let index = 0;

      const pop = () =>
        gsap
          .timeline()
          .fromTo(".achievement__badge", { scale: 0.55, rotate: -14 }, { scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" })
          .fromTo(".achievement__shine", { xPercent: -120 }, { xPercent: 120, duration: 0.9, ease: "power2.out" }, 0.1);

      const next = () => {
        index = (index + 1) % ACHIEVEMENTS.length;
        gsap
          .timeline()
          .to(title, { yPercent: -110, duration: 0.4, ease: "power2.in" })
          .add(() => {
            title.textContent = ACHIEVEMENTS[index];
          })
          .fromTo(title, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" })
          .add(pop(), "<");
        loop.restart(true);
      };

      const loop = gsap.delayedCall(3, next).pause();
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            pop();
            loop.restart(true);
          } else loop.pause();
        },
      });
    },
    { scope: ref }
  );

  return (
    <div className="achievement" ref={ref}>
      <span className="achievement__badge" aria-hidden="true">
        <span className="achievement__shine" />
        <Award strokeWidth={2} />
      </span>
      <span className="achievement__text">
        <span className="achievement__label t-mono">Achievement unlocked</span>
        <span className="achievement__title-mask">
          <span className="achievement__title" aria-live="polite">
            {ACHIEVEMENTS[0]}
          </span>
        </span>
      </span>
    </div>
  );
}

export default function Footer({ compact = false }) {
  return compact ? <CompactFooter /> : <FullFooter />;
}

function CompactFooter() {
  return (
    <footer className="footer footer--compact">
      <div className="shell footer__legal">
        <span>
          © {YEAR} {BRAND.company}. All rights reserved.
        </span>
        <span>Built with WebRTC &amp; LiveKit</span>
      </div>
    </footer>
  );
}

function FullFooter() {
  const ref = useRef(null);
  useReveal(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        ".footer__watermark",
        { yPercent: 40 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__glow" aria-hidden="true" />
      <div className="shell">
        <div className="footer__cta">
          <SplitHeading className="t-h1">{FOOTER.heading}</SplitHeading>
          <div className="footer__cta-side">
            <p className="t-lead" data-reveal>
              {FOOTER.sub}
            </p>
            <div className="cta-row" data-reveal>
              <Pill to="/console">Try the live demo</Pill>
              <Pill variant="outline" href={CONTACT.emailHref} icon="up">
                Book a meeting
              </Pill>
            </div>
          </div>
        </div>

        <div className="footer__grid">
          <div data-reveal>
            <TLink to="/" className="brand">
              <img className="brand__logo" src={BRAND.logo} alt={BRAND.name} width="203" height="63" />
            </TLink>
            <p className="footer__tagline">
              The AI voice agent from {BRAND.company} — one agent for every call, in any industry, day or night.
            </p>
            <Achievement />
          </div>

          {FOOTER.columns.map((col) => (
            <div key={col.title} data-reveal>
              <p className="footer__title t-mono">{col.title}</p>
              <ul className="footer__list">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <TLink to={l.to}>{l.label}</TLink>
                    ) : (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal>
            <p className="footer__title t-mono">Contact</p>
            <address className="footer__contact" style={{ fontStyle: "normal" }}>
              <a href={CONTACT.emailHref}>
                <Mail strokeWidth={1.8} aria-hidden="true" />
                {CONTACT.email}
              </a>
              {CONTACT.phones.map((p) => (
                <a href={p.href} key={p.label}>
                  <Phone strokeWidth={1.8} aria-hidden="true" />
                  {p.label} {p.phone}
                </a>
              ))}
              <span>
                <MapPin strokeWidth={1.8} aria-hidden="true" />
                {CONTACT.address}
              </span>
            </address>
          </div>
        </div>

        <div className="footer__legal">
          <span>
            © {YEAR} {BRAND.company}. All rights reserved.
          </span>
          <span>ISO 27001:2013 · ISO 9001:2015</span>
        </div>
      </div>
      <div className="footer__watermark" aria-hidden="true">
        GIT VOICE
      </div>
    </footer>
  );
}
