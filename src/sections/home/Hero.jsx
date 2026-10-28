import { useRef } from "react";
import { Check, PhoneIncoming, Zap } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP, reducedMotion } from "../../lib/gsap";
import { useIntro } from "../../hooks/useMotion";
import { HERO } from "../../content/home";
import Globe from "../../components/Globe";
import { Eyebrow, Pill } from "../../components/ui";
import { useLenis } from "../../components/SmoothScroll";

const BARS = 26;

/**
 * Two stacked glass cards replaying real request types: the live call types
 * out what the caller said while the waveform talks, then the resolved card
 * ticks off what the agent already sent to the team.
 */
function buildCallLoop(root) {
  const q = gsap.utils.selector(root);
  const room = q("[data-room]")[0];
  const said = q("[data-said]")[0];
  const rows = q(".hero-call__row");
  const bars = q(".hero-call__bar-fill");
  const checks = q(".hero-call__check");
  const texts = q("[data-done]");
  const waveBars = q(".hero-call__wave span");

  said.textContent = "“”";
  gsap.set(rows, { opacity: 0.28 });
  gsap.set(bars, { scaleX: 0 });
  gsap.set(checks, { scale: 0 });
  gsap.set(waveBars, { scaleY: 0.14 });

  const wave = gsap
    .to(waveBars, {
      scaleY: () => gsap.utils.random(0.2, 1),
      duration: 0.16,
      ease: "sine.inOut",
      stagger: { each: 0.015, from: "random" },
      repeat: -1,
      repeatRefresh: true,
      paused: true,
    });
  const quiet = () => {
    wave.pause();
    gsap.to(waveBars, { scaleY: 0.14, duration: 0.4, ease: "power2.out" });
  };

  const master = gsap.timeline({ repeat: -1, paused: true });
  HERO.scenarios.forEach((s) => {
    const typer = { n: 0 };
    master
      .to([room, said, ...rows], { opacity: 0, y: -6, duration: 0.35, ease: "power2.in" })
      .add(() => {
        room.textContent = s.room;
        said.textContent = "";
        texts.forEach((t, i) => (t.textContent = s.done[i]));
        gsap.set(bars, { scaleX: 0 });
        gsap.set(checks, { scale: 0 });
      })
      .set([room, said, ...rows], { y: 6 })
      .to(room, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" })
      .to(rows, { opacity: 0.28, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.06 }, "<")
      .set(said, { opacity: 1, y: 0 })
      .add(() => wave.play())
      .fromTo(
        typer,
        { n: 0 },
        {
          n: s.said.length,
          duration: s.said.length * 0.034,
          ease: "none",
          onUpdate: () => {
            said.textContent = `“${s.said.slice(0, Math.round(typer.n))}”`;
          },
        }
      )
      .add(quiet, "+=0.15");
    rows.forEach((row, i) => {
      master
        .to(row, { opacity: 1, duration: 0.45, ease: "power2.out" }, i ? "-=0.1" : "+=0.2")
        .to(bars[i], { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, "<")
        .to(checks[i], { scale: 1, duration: 0.55, ease: "back.out(2.6)" }, "-=0.15");
    });
    master.to({}, { duration: 2.4 });
  });

  return { master, wave };
}

export default function Hero() {
  const ref = useRef(null);
  const lenis = useLenis();

  useIntro(ref, (tl) => {
    const split = SplitText.create(ref.current.querySelector(".hero__title"), {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
    });
    const loop = buildCallLoop(ref.current.querySelector(".hero__calls"));

    tl.from(".hero__globe", { scale: 0.8, opacity: 0, duration: 2.2, ease: "expo.out" }, 0)
      .from(".hero__eyebrow", { y: 16, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.1)
      .from(split.lines, { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0.14)
      .from([".hero__lead", ".hero__ctas", ".hero__trust"], { y: 26, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.5)
      .from(".hero-call", { y: 50, rotateX: 12, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.16, transformPerspective: 900 }, 0.55)
      .from(".hero__status > *", { y: 12, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, 0.9)
      .from(".hero__watermark", { yPercent: 35, opacity: 0, duration: 2, ease: "expo.out" }, 0.2)
      .add(() => split.revert())
      .add(() => loop.master.play(), 0.9);

    // Only replay the call cards while the hero is actually on screen.
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) loop.master.resume();
        else {
          loop.master.pause();
          loop.wave.pause();
        }
      },
    });
  });

  // Scroll-out parallax and pointer tilt run independently of the intro.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".hero__globe-wrap", { yPercent: 16, scale: 0.9, opacity: 0.2, ease: "none" }, 0)
        .to(".hero__content", { yPercent: -14, opacity: 0, ease: "none" }, 0)
        .to(".hero__calls-wrap", { yPercent: -24, opacity: 0, ease: "none" }, 0)
        .to(".hero__watermark-wrap", { yPercent: -45, ease: "none" }, 0);

      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const hero = ref.current;
      const calls = hero.querySelector(".hero__calls");
      const rx = gsap.quickTo(calls, "rotationX", { duration: 0.9, ease: "power3" });
      const ry = gsap.quickTo(calls, "rotationY", { duration: 0.9, ease: "power3" });
      gsap.set(calls, { transformPerspective: 1100 });
      const onMove = (e) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        ry(px * 12);
        rx(py * -10);
      };
      hero.addEventListener("pointermove", onMove);
      return () => hero.removeEventListener("pointermove", onMove);
    },
    { scope: ref }
  );

  const scrollNext = () => {
    const next = ref.current.nextElementSibling;
    if (!next) return;
    if (lenis) lenis.scrollTo(next, { duration: 1.4 });
    else next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__aurora" />
        <div className="grain" />
      </div>

      <div className="hero__globe-wrap">
        <Globe className="hero__globe" />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__watermark-wrap" aria-hidden="true">
        <div className="hero__watermark">VOICE</div>
      </div>

      <div className="shell hero__grid">
        <div className="hero__content">
          <Eyebrow accent="emerald" className="hero__eyebrow" data-intro>
            {HERO.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" className="t-display hero__title" data-intro>
            The voice agent
            <br />
            that <span className="grad-text">never sleeps.</span>
          </h1>
          <p className="t-lead hero__lead" data-intro>
            {HERO.lead}
          </p>
          <div className="cta-row hero__ctas" data-intro>
            <Pill to={HERO.primary.to}>{HERO.primary.label}</Pill>
            <Pill to={HERO.secondary.to} variant="outline">
              {HERO.secondary.label}
            </Pill>
          </div>
          <p className="hero__trust" data-intro>
            <span className="live-dot" aria-hidden="true" />
            {HERO.trust}
          </p>
        </div>

        <div className="hero__calls-wrap">
          <div className="hero__calls" aria-hidden="true">
            <article className="hero-call hero-call--live" data-intro>
              <header className="hero-call__head">
                <span className="icon-tile icon-tile--violet">
                  <PhoneIncoming strokeWidth={2} />
                </span>
                <div className="hero-call__meta">
                  <p className="hero-call__title">Incoming call</p>
                  <p className="hero-call__sub" data-room>
                    {HERO.scenarios[0].room}
                  </p>
                </div>
                <span className="hero-call__status">
                  <span className="live-dot" />
                  Live
                </span>
              </header>
              <div className="hero-call__wave">
                {Array.from({ length: BARS }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <p className="hero-call__said" data-said>
                “{HERO.scenarios[0].said}”
              </p>
            </article>

            <article className="hero-call hero-call--done" data-intro>
              <header className="hero-call__head">
                <span className="icon-tile icon-tile--emerald">
                  <Zap strokeWidth={2} />
                </span>
                <div className="hero-call__meta">
                  <p className="hero-call__title">Handled by your agent</p>
                  <p className="hero-call__sub">Logged in your CRM</p>
                </div>
              </header>
              <ul className="hero-call__list">
                {HERO.scenarios[0].done.map((item, i) => (
                  <li className="hero-call__row" key={i}>
                    <span className="hero-call__row-top">
                      <span data-done>{item}</span>
                      <span className="hero-call__check">
                        <Check strokeWidth={3} />
                      </span>
                    </span>
                    <span className="hero-call__bar">
                      <span className="hero-call__bar-fill" />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>

      <div className="shell hero__status t-mono">
        <span>{HERO.status[0]}</span>
        <span className="hero__status-mid">{HERO.status[1]}</span>
        <button type="button" className="hero__scroll" onClick={scrollNext}>
          {HERO.status[2]} <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}
