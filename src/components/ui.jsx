import { Fragment, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, SplitText, useGSAP, reducedMotion } from "../lib/gsap";
import { useIntro, useMagnetic } from "../hooks/useMotion";
import { TLink } from "./Transition";

/**
 * Pill button — the lumora pill with a circular arrow badge that swaps its
 * arrow on hover, wrapped in a magnetic span. Renders a route link (`to`),
 * an external/anchor link (`href`) or a button.
 */
export function Pill({
  to,
  href,
  label,
  variant = "light",
  size,
  icon = "arrow",
  external,
  magnetic = true,
  className = "",
  children,
  ...rest
}) {
  const magnet = useMagnetic(0.28, magnetic);
  const Icon = icon === "up" ? ArrowUpRight : ArrowRight;
  const cls = [
    "btn",
    `btn--${variant}`,
    icon && "btn--badge",
    icon === "up" && "btn--up",
    size === "sm" && "btn--sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {icon && (
        <span className="btn__badge" aria-hidden="true">
          <Icon strokeWidth={2.2} />
          <Icon strokeWidth={2.2} />
        </span>
      )}
    </>
  );

  let el;
  if (to) {
    el = (
      <TLink to={to} label={label} className={cls} {...rest}>
        {inner}
      </TLink>
    );
  } else if (href) {
    el = (
      <a
        href={href}
        className={cls}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {inner}
      </a>
    );
  } else {
    el = (
      <button type="button" className={cls} {...rest}>
        {inner}
      </button>
    );
  }

  return (
    <span className="magnet" ref={magnet}>
      {el}
    </span>
  );
}

export function Eyebrow({ accent, pill = true, className = "", children, ...rest }) {
  return (
    <span className={`eyebrow${pill ? " eyebrow--pill" : ""} ${className}`} data-accent={accent} {...rest}>
      {children}
    </span>
  );
}

/**
 * Heading that rises line by line out of clipped masks when scrolled into
 * view. SplitText measures the real rendered lines and re-splits on resize or
 * font load, replaying the tween at its saved progress so finished headings
 * stay finished.
 */
export function SplitHeading({ as: Tag = "h2", className = "t-h2", start = "top 86%", delay = 0, children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.15,
            ease: "expo.out",
            stagger: 0.09,
            delay,
            scrollTrigger: { trigger: ref.current, start, once: true },
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** Shared hero for the inner pages (Product, Use cases, Company). */
export function PageHero({ eyebrow, accent = "violet", title, lead, primary, secondary, watermark, glow }) {
  const ref = useRef(null);

  useIntro(ref, (tl) => {
    const split = SplitText.create(ref.current.querySelector(".phero__title"), {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
    });
    tl.from(".phero__eyebrow", { y: 16, opacity: 0, duration: 0.9, ease: "expo.out" }, 0)
      .from(split.lines, { yPercent: 115, duration: 1.25, ease: "expo.out", stagger: 0.1 }, 0.08)
      .from([".phero__lead", ".phero__ctas"], { y: 26, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.4)
      .from(".phero__watermark", { yPercent: 45, opacity: 0, duration: 1.8, ease: "expo.out" }, 0.15)
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, 0.9)
      .add(() => split.revert());
  });

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".phero__inner", { yPercent: -18, opacity: 0.1, ease: "none" }, 0)
        .to(".phero__watermark-wrap", { yPercent: 35, ease: "none" }, 0)
        .to(".phero__glow", { yPercent: 25, scale: 1.15, ease: "none" }, 0);
    },
    { scope: ref }
  );

  return (
    <section className="phero" ref={ref} style={glow ? { "--phero-accent": glow } : undefined}>
      <div className="phero__bg" aria-hidden="true">
        <div className="phero__glow" />
        <div className="phero__grid" />
        <div className="grain" />
      </div>
      <div className="shell phero__inner">
        <Eyebrow accent={accent} className="phero__eyebrow" data-intro>
          {eyebrow}
        </Eyebrow>
        <h1 className="t-h1 phero__title" data-intro>
          {title.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < title.length - 1 && <br />}
            </Fragment>
          ))}
        </h1>
        {lead && (
          <p className="t-lead phero__lead" data-intro>
            {lead}
          </p>
        )}
        {(primary || secondary) && (
          <div className="cta-row phero__ctas" data-intro>
            {primary && (
              <Pill to={primary.to} href={primary.href} external={!!primary.href}>
                {primary.label}
              </Pill>
            )}
            {secondary && (
              <Pill
                variant="outline"
                to={secondary.to}
                href={secondary.href}
                external={!!secondary.href}
                icon={secondary.href ? "up" : "arrow"}
              >
                {secondary.label}
              </Pill>
            )}
          </div>
        )}
      </div>
      {watermark && (
        <div className="phero__watermark-wrap" aria-hidden="true">
          <div className="phero__watermark" data-intro>
            {watermark}
          </div>
        </div>
      )}
      <div className="scroll-cue t-mono" aria-hidden="true" data-intro>
        <span className="scroll-cue__line" />
      </div>
    </section>
  );
}

/** Closing call-to-action card used at the end of the inner pages. */
export function CtaBlock({ heading, body, primary, secondary }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        ".cta-block__orb",
        { rotate: 0, scale: 0.85 },
        {
          rotate: 140,
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section className="section cta-section" ref={ref}>
      <div className="shell">
        <div className="cta-block" data-reveal="scale">
          <div className="cta-block__orb" aria-hidden="true" />
          <div className="grain" aria-hidden="true" />
          <SplitHeading>{heading}</SplitHeading>
          <p className="t-lead">{body}</p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            {primary && (
              <Pill to={primary.to} href={primary.href} external={!!primary.href}>
                {primary.label}
              </Pill>
            )}
            {secondary && (
              <Pill
                variant="outline"
                to={secondary.to}
                href={secondary.href}
                external={!!secondary.href}
                icon={secondary.href ? "up" : "arrow"}
              >
                {secondary.label}
              </Pill>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Brand-colour art tile used instead of photography: gradient, rings and a big line icon. */
export function Art({ Icon, tone = "orange", noIcon = false, className = "" }) {
  return (
    <div className={`art art--${tone} ${className}`} aria-hidden="true">
      <span className="art__ring art__ring--1" />
      <span className="art__ring art__ring--2" />
      {Icon && !noIcon && <Icon className="art__icon" strokeWidth={1.35} />}
    </div>
  );
}
