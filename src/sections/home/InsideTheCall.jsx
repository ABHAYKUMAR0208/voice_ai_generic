import { useRef } from "react";
import { ArrowRight, BellRing, CalendarCheck, Check, PhoneIncoming, Receipt, Send } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../../lib/gsap";
import { INSIDE_CALL } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";

const WAVE = 18;

function Bubble({ who, agent, children, typed }) {
  return (
    <div className={`cu-bubble ${agent ? "cu-bubble--agent" : "cu-bubble--guest"}`} data-line>
      <span className="cu-bubble__who">{who}</span>
      <span className="cu-bubble__text" data-typed={typed ? "" : undefined}>
        {children}
      </span>
    </div>
  );
}

function StateRecognition() {
  return (
    <>
      <div className="cu-line cu-caller" data-line>
        <PhoneIncoming strokeWidth={2} aria-hidden="true" />
        <span className="cu-caller__num tabular" data-typed="">
          +91 98765 43210
        </span>
      </div>
      <div className="cu-line cu-lookup" data-line>
        <span className="cu-eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="cu-lookup__text">Hold tune playing · looking up caller…</span>
      </div>
      <div className="cu-guest" data-line>
        <span className="cu-avatar">AM</span>
        <span className="cu-guest__info">
          <b>Aarav Mehta</b>
          <span>Returning patient · last visit 12 Sep</span>
        </span>
        <span className="cu-found">
          <Check strokeWidth={3} aria-hidden="true" /> Match
        </span>
      </div>
      <div className="cu-open" data-line>
        <span className="chip chip--amber">
          <Receipt strokeWidth={2} aria-hidden="true" /> Open request · invoice copy requested
        </span>
      </div>
      <Bubble who="Agent" agent typed>
        Hello, welcome back to City Clinic, this is your assistant. Am I speaking with Aarav?
      </Bubble>
    </>
  );
}

function StateRecap() {
  return (
    <>
      <Bubble who="Caller">
        Can I move my appointment to Thursday at ten, with <mark className="cu-miss">dr row</mark>?
      </Bubble>
      <div className="cu-match" data-line>
        <span className="cu-match__from">“dr row”</span>
        <ArrowRight strokeWidth={2} aria-hidden="true" />
        <span className="cu-match__to">
          <Check strokeWidth={3} aria-hidden="true" /> Dr. Rao · Cardiology
        </span>
      </div>
      <Bubble who="Agent" agent typed>
        Just to confirm, Thursday at 10 am with Dr. Rao. Is that right?
      </Bubble>
      <Bubble who="Caller">Yes, perfect.</Bubble>
    </>
  );
}

const CRM_ROWS = [
  { Icon: CalendarCheck, title: "Appointment · Thu 10:00 AM", sub: "Dr. Rao · rescheduled" },
  { Icon: BellRing, title: "Reminder · Wed evening", sub: "SMS scheduled" },
  { Icon: Send, title: "SMS & email confirmation", sub: "Delivered to the caller" },
];

function StateHandoff() {
  return (
    <>
      <Bubble who="Agent" agent typed>
        Perfect, I'm updating that now.
      </Bubble>
      <div className="cu-crm" data-line>
        <div className="cu-crm__head">
          <span className="t-mono">Your CRM · HubSpot</span>
          <span className="cu-crm__live">
            <span className="live-dot" /> Synced mid-call
          </span>
        </div>
        <ul className="cu-crm__list">
          {CRM_ROWS.map(({ Icon, title, sub }) => (
            <li className="cu-crm__row" key={title}>
              <span className="icon-tile">
                <Icon strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="cu-crm__text">
                <b>{title}</b>
                <span>{sub}</span>
              </span>
              <span className="cu-crm__check" aria-hidden="true">
                <Check strokeWidth={3} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const STATES = [StateRecognition, StateRecap, StateHandoff];

function Device({ only, sticky }) {
  const shown = only === undefined ? STATES.map((_, i) => i) : [only];
  return (
    <div className={`cu-device${sticky ? " cu-device--sticky" : " cu-device--inline"}`} aria-hidden="true">
      <div className="cu-device__top">
        <span className="cu-device__title">
          <span className="live-dot" /> Live call · City Clinic
        </span>
        <span className="cu-device__time t-mono tabular">00:42</span>
      </div>
      <div className="cu-device__wave">
        {Array.from({ length: WAVE }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="cu-device__states">
        {shown.map((i) => {
          const View = STATES[i];
          return (
            <div className="cu-state" data-state={i} key={i}>
              <View />
            </div>
          );
        })}
      </div>
      {sticky && (
        <div className="cu-device__steps">
          {INSIDE_CALL.blocks.map((b, i) => (
            <span className={`cu-device__step${i === 0 ? " is-active" : ""}`} key={b.tag}>
              {b.tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Restores the full text of every typed line inside `root`. */
function restoreTyped(root) {
  root.querySelectorAll("[data-typed]").forEach((el) => {
    if (el.dataset.full) el.textContent = el.dataset.full;
  });
}

/**
 * Builds the paused micro-timeline that plays one call state from empty.
 * The start state is applied immediately so nothing flashes before it plays.
 */
function buildStateTimeline(state) {
  const q = gsap.utils.selector(state);
  const lines = q("[data-line]");
  const typed = q("[data-typed]");
  typed.forEach((el) => {
    if (!el.dataset.full) el.dataset.full = el.textContent;
    el.textContent = "";
  });
  gsap.set(lines, { opacity: 0, y: 14 });

  const tl = gsap.timeline({ paused: true });
  tl.set(lines, { opacity: 0, y: 14 }).add(() => typed.forEach((el) => (el.textContent = "")));

  lines.forEach((line) => {
    tl.to(line, { opacity: 1, y: 0, duration: 0.55, ease: "expo.out" }, "+=0.12");

    const t = typed.find((el) => line.contains(el));
    if (t) {
      const text = t.dataset.full;
      const o = { n: 0 };
      tl.fromTo(
        o,
        { n: 0 },
        {
          n: text.length,
          duration: Math.min(1.6, text.length * 0.028),
          ease: "none",
          onUpdate: () => (t.textContent = text.slice(0, Math.round(o.n))),
        }
      );
    }

    const eq = line.querySelectorAll(".cu-eq i");
    if (eq.length) {
      tl.fromTo(eq, { scaleY: 0.3 }, { scaleY: 1, duration: 0.2, stagger: { each: 0.05, repeat: 5, yoyo: true }, ease: "sine.inOut" })
        .to(line.querySelector(".cu-lookup__text"), { opacity: 0.45, duration: 0.3 });
    }

    line.querySelectorAll(".cu-found, .cu-match__to").forEach((el) => {
      tl.fromTo(el, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.4)" }, "+=0.1");
    });

    line.querySelectorAll(".cu-crm__row").forEach((row) => {
      tl.fromTo(row, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }, "+=0.15").fromTo(
        row.querySelector(".cu-crm__check"),
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.4)" },
        "-=0.1"
      );
    });

    const miss = line.querySelector(".cu-miss");
    if (miss) tl.fromTo(miss, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.5 }, "+=0.2");
  });
  return tl;
}

export default function InsideTheCall() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const device = ref.current.querySelector(".cu-device--sticky");
        const states = gsap.utils.toArray(".cu-state", device);
        const steps = gsap.utils.toArray(".cu-device__step", device);
        const timelines = states.map(buildStateTimeline);
        const wave = gsap.to(device.querySelectorAll(".cu-device__wave span"), {
          scaleY: () => gsap.utils.random(0.25, 1),
          duration: 0.2,
          stagger: { each: 0.02, from: "random" },
          repeat: -1,
          repeatRefresh: true,
          paused: true,
        });
        let current = -1;
        gsap.set(states, { autoAlpha: 0 });

        const activate = (i) => {
          if (i === current) return;
          const prev = current;
          current = i;
          steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
          if (prev >= 0) {
            timelines[prev].pause();
            gsap.to(states[prev], { autoAlpha: 0, y: prev < i ? -24 : 24, duration: 0.45, ease: "power2.in", overwrite: true });
          }
          gsap.fromTo(
            states[i],
            { autoAlpha: 0, y: prev < i ? 24 : -24 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", delay: prev >= 0 ? 0.25 : 0, overwrite: true }
          );
          timelines[i].restart(true);
        };

        gsap.utils.toArray(".cu-block", ref.current).forEach((block, i) => {
          ScrollTrigger.create({
            trigger: block,
            start: "top 62%",
            end: "bottom 62%",
            onToggle: (self) => self.isActive && activate(i),
          });
        });

        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? wave.play() : wave.pause()),
        });

        return () => restoreTyped(device);
      });

      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        const root = ref.current;
        gsap.utils.toArray(".cu-device--inline .cu-state", root).forEach((state) => {
          const tl = buildStateTimeline(state);
          ScrollTrigger.create({ trigger: state, start: "top 85%", once: true, onEnter: () => tl.play() });
        });
        return () => restoreTyped(root);
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="section inside" ref={ref} aria-labelledby="inside-heading">
      <div className="shell">
        <div className="shead inside__head">
          <Eyebrow accent="violet">{INSIDE_CALL.eyebrow}</Eyebrow>
          <SplitHeading id="inside-heading">{INSIDE_CALL.heading}</SplitHeading>
        </div>

        <div className="inside__grid">
          <div className="inside__blocks">
            {INSIDE_CALL.blocks.map((b, i) => (
              <article className="cu-block" key={b.tag}>
                <span className="cu-block__tag t-mono">
                  0{i + 1} · {b.tag}
                </span>
                <h3 className="t-h2 cu-block__title">{b.title}</h3>
                <p className="t-body cu-block__body">{b.body}</p>
                <ul className="cu-block__points">
                  {b.points.map((p) => (
                    <li key={p}>
                      <Check strokeWidth={2.6} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Device only={i} />
              </article>
            ))}
          </div>
          <div className="inside__visual">
            <Device sticky />
          </div>
        </div>
      </div>
    </section>
  );
}
