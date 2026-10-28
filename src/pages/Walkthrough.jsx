import { useRef } from "react";
import { Check, Mic, MousePointer2, Phone, PhoneOff } from "lucide-react";
import { gsap, useGSAP, MQ } from "../lib/gsap";
import { useReveal } from "../hooks/useMotion";
import { WALKTHROUGH } from "../content/pages";
import { BRAND } from "../content/site";
import { CtaBlock, Eyebrow, PageHero, SplitHeading } from "../components/ui";
import "../styles/pages.css";

const STATUS = ["Ready to connect", "Connecting…", "You're speaking", "Live transcript", "Call ended · 00:42"];
const RING = 36;

function CallStory() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const q = gsap.utils.selector(ref);
        const caps = q(".wt-cap");
        const scenes = q(".wt-scene");
        const dots = q(".wt-rail__dot");
        const status = q("[data-status]")[0];
        const bars = q(".wt-ring i");
        const initialStatus = status.textContent;
        const section = ref.current;

        const wave = gsap.to(bars, {
          scaleY: () => gsap.utils.random(0.25, 1),
          duration: 0.16,
          ease: "sine.inOut",
          stagger: { each: 0.012, from: "random" },
          repeat: -1,
          repeatRefresh: true,
          paused: true,
        });

        let step = -1;
        const setStep = (i) => {
          if (i === step) return;
          step = i;
          section.dataset.step = String(i);
          status.textContent = STATUS[i];
          dots.forEach((d, j) => {
            d.classList.toggle("is-done", j < i);
            d.classList.toggle("is-active", j === i);
          });
          if (i === 2 || i === 3) wave.play();
          else {
            wave.pause();
            gsap.to(bars, { scaleY: 0.2, duration: 0.4, overwrite: "auto" });
          }
        };
        setStep(0);

        gsap.set(caps.slice(1), { opacity: 0, yPercent: 35 });
        gsap.set(scenes.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ref.current,
            pin: q(".wt__pin")[0],
            start: "top top",
            end: "+=420%",
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => setStep(Math.min(4, Math.floor(self.progress * 5))),
          },
        });

        // 1 — the cursor travels to the call button and clicks it.
        tl.fromTo(".wt-cursor", { x: 150, y: 110, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.55 }, 0.08)
          .fromTo(".wt-cursor__ripple", { scale: 0, opacity: 0.9 }, { scale: 2.8, opacity: 0, duration: 0.3, ease: "power2.out" }, 0.66)
          .to(".wt-callbtn", { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, 0.66);

        for (let i = 1; i < 5; i++) {
          tl.to(caps[i - 1], { opacity: 0, yPercent: -35, duration: 0.3 }, i - 0.16)
            .to(caps[i], { opacity: 1, yPercent: 0, duration: 0.36 }, i + 0.04)
            .to(scenes[i - 1], { autoAlpha: 0, duration: 0.28 }, i - 0.16)
            .to(scenes[i], { autoAlpha: 1, duration: 0.34 }, i + 0.04);
        }

        // 2 — the browser's mic prompt, then "Allow".
        tl.fromTo(".wt-perm", { y: 30, scale: 0.94 }, { y: 0, scale: 1, duration: 0.36, ease: "back.out(1.6)" }, 1.08)
          .to(".wt-perm__allow", { backgroundColor: "#5ccbbb", color: "#04120c", duration: 0.12 }, 1.62)
          .fromTo(".wt-callbtn", { rotate: 0 }, { rotate: 135, duration: 0.3 }, 1.72);

        // 4 — transcript lines stream in.
        q(".wt-line").forEach((line, j) => tl.fromTo(line, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.16 }, 3.12 + j * 0.18));

        // 5 — hang up, handoff chips land.
        tl.to(".wt-orb", { scale: 0.86, duration: 0.3 }, 4.05);
        q(".wt-handoff li").forEach((li, j) => tl.fromTo(li, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.16 }, 4.3 + j * 0.16));

        tl.fromTo(".wt-rail__fill", { scaleY: 0 }, { scaleY: 1, duration: 5, ease: "none" }, 0).to({}, { duration: 0.05 }, 5);

        // Gentle tilt on the device, following the pointer.
        const stage = q(".wt-stage")[0];
        const rx = gsap.quickTo(stage, "rotationX", { duration: 0.9, ease: "power3" });
        const ry = gsap.quickTo(stage, "rotationY", { duration: 0.9, ease: "power3" });
        gsap.set(stage, { transformPerspective: 1200 });
        const onMove = (e) => {
          ry((e.clientX / innerWidth - 0.5) * 10);
          rx((e.clientY / innerHeight - 0.5) * -8);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onMove);
          status.textContent = initialStatus;
          delete section.dataset.step;
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="wt" ref={ref} aria-label="How a call unfolds, step by step">
      <div className="wt__pin">
        <div className="wt__glow" aria-hidden="true" />
        <div className="shell wt__grid">
          <ol className="wt-rail" aria-hidden="true">
            <span className="wt-rail__track">
              <span className="wt-rail__fill" />
            </span>
            {WALKTHROUGH.steps.map((s, i) => (
              <li className={`wt-rail__dot${i === 0 ? " is-active" : ""}`} key={s.title}>
                {i + 1}
              </li>
            ))}
          </ol>

          <div className="wt-caps">
            {WALKTHROUGH.steps.map((s, i) => (
              <div className="wt-cap" key={s.title}>
                <span className="wt-cap__num t-mono">Step {i + 1} / 5</span>
                <h2 className="t-h2 wt-cap__title">{s.title}</h2>
                <p className="t-lead">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="wt-stage-wrap">
            <div className="wt-stage" aria-hidden="true">
              <div className="wt-stage__top">
                <span className="wt-stage__brand">
                  <img src={BRAND.mark} alt="" width="22" height="22" /> Live console
                </span>
                <span className="wt-status">
                  <span className="wt-status__dot" />
                  <span data-status>{STATUS[3]}</span>
                </span>
              </div>

              <div className="wt-stage__core">
                <div className="wt-orb">
                  <div className="wt-ring">
                    {Array.from({ length: RING }, (_, i) => (
                      <span key={i} style={{ transform: `rotate(${(360 / RING) * i}deg)` }}>
                        <i />
                      </span>
                    ))}
                  </div>
                  <div className="wt-orb__core">
                    <Mic strokeWidth={2} />
                  </div>
                </div>
                <div className="wt-callwrap">
                  <span className="wt-callbtn">
                    <Phone strokeWidth={2.2} />
                  </span>
                  <div className="wt-scene wt-scene--1">
                    <span className="wt-cursor">
                      <span className="wt-cursor__ripple" />
                      <MousePointer2 strokeWidth={1.8} fill="currentColor" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="wt-scene wt-scene--2">
                <div className="wt-perm">
                  <p className="wt-perm__title">
                    <Mic strokeWidth={2} /> {BRAND.product} wants to use your microphone
                  </p>
                  <p className="wt-perm__body">Allow access so you can talk to the agent.</p>
                  <div className="wt-perm__actions">
                    <span className="wt-perm__btn">Block</span>
                    <span className="wt-perm__btn wt-perm__allow">Allow</span>
                  </div>
                </div>
              </div>

              <div className="wt-scene wt-scene--3">
                <span className="wt-chip">
                  <span className="live-dot" /> Listening live — no queue
                </span>
              </div>

              <div className="wt-scene wt-scene--4">
                <div className="wt-transcript">
                  {WALKTHROUGH.transcript.map((l, i) => (
                    <p className={`wt-line wt-line--${l.role}`} key={i}>
                      <b>{l.role === "agent" ? "Agent" : "You"}</b>
                      {l.text}
                    </p>
                  ))}
                </div>
              </div>

              <div className="wt-scene wt-scene--5">
                <div className="wt-ended">
                  <span className="wt-ended__icon">
                    <PhoneOff strokeWidth={2} />
                  </span>
                  <p className="wt-ended__title">Call ended · 00:42</p>
                  <ul className="wt-handoff">
                    {WALKTHROUGH.handoff.map((h) => (
                      <li key={h}>
                        <span className="wt-handoff__check">
                          <Check strokeWidth={3} />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pipeline() {
  const ref = useRef(null);
  const { pipeline } = WALKTHROUGH;

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);
      mm.add({ desktop: MQ.desktop, motion: MQ.motion }, (ctx) => {
        if (!ctx.conditions.motion) return;
        const vertical = !ctx.conditions.desktop;
        const nodes = gsap.utils.toArray(".pipe-step", ref.current);
        gsap.fromTo(
          ".pipe__fill",
          vertical ? { scaleY: 0 } : { scaleX: 0 },
          {
            ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
            ease: "none",
            scrollTrigger: {
              trigger: ref.current.querySelector(".pipe__steps"),
              start: "top 70%",
              end: vertical ? "bottom 60%" : "top 25%",
              scrub: 0.6,
              onUpdate: (self) =>
                nodes.forEach((n, i) => n.classList.toggle("is-lit", self.progress >= i / (nodes.length - 1) - 0.02)),
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="section pipe" ref={ref} aria-labelledby="pipe-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="cyan">{pipeline.eyebrow}</Eyebrow>
            <SplitHeading id="pipe-heading">{pipeline.heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {pipeline.sub}
          </p>
        </div>
        <div className="pipe__track">
          <span className="pipe__line" aria-hidden="true">
            <span className="pipe__fill" />
          </span>
          <ol className="pipe__steps">
            {pipeline.steps.map(({ num, Icon, title, body, badge }) => (
              <li className="pipe-step" key={num} data-reveal>
                <span className="pipe-step__node">
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="pipe-step__num t-mono">{num}</span>
                <h3 className="pipe-step__title">{title}</h3>
                <p className="pipe-step__body">{body}</p>
                <code className="pipe-step__badge">{badge}</code>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function Walkthrough() {
  const ref = useRef(null);
  useReveal(ref);
  const { hero, cta } = WALKTHROUGH;

  return (
    <main id="main" ref={ref}>
      <PageHero {...hero} accent="cyan" glow="rgba(224, 113, 47, 0.2)" />
      <CallStory />
      <Pipeline />
      <CtaBlock {...cta} />
    </main>
  );
}
