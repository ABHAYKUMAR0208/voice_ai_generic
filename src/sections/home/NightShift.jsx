import { useRef } from "react";
import { Check, Moon, Sunrise } from "lucide-react";
import { gsap, useGSAP, MQ } from "../../lib/gsap";
import { NIGHT_SHIFT } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";

const TOTAL = 480; // minutes from 11:00 PM to 7:00 AM
const CALLS = NIGHT_SHIFT.calls;

function formatMinute(m) {
  const total = 23 * 60 + m;
  let h = Math.floor(total / 60) % 24;
  const min = String(total % 60).padStart(2, "0");
  const mer = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${min} ${mer}`;
}

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

export default function NightShift() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const q = gsap.utils.selector(ref);
        const cards = q(".ns-call");
        const feed = q(".ns__feed")[0];
        const list = q(".ns__list")[0];
        const timeEl = q("[data-time]")[0];
        const countEl = q("[data-count]")[0];
        const staticTime = timeEl.textContent;
        const staticCount = countEl.textContent;
        timeEl.textContent = formatMinute(0);
        countEl.textContent = "0";
        let lastMinute = 0;
        let lastCount = 0;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate() {
            const t = this.time();
            const m = Math.min(TOTAL, Math.round(t));
            if (m !== lastMinute) {
              lastMinute = m;
              timeEl.textContent = formatMinute(m);
            }
            const answered = CALLS.reduce((n, c) => (c.minute + 14 <= t ? n + 1 : n), 0);
            if (answered !== lastCount) {
              lastCount = answered;
              countEl.textContent = String(answered);
            }
          },
          scrollTrigger: {
            trigger: ref.current,
            pin: q(".ns__pin")[0],
            start: "top top",
            end: "+=290%",
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(".ns__hand--hour", { rotation: 330 }, { rotation: 570, duration: TOTAL, svgOrigin: "60 60" }, 0)
          .fromTo(".ns__hand--min", { rotation: 0 }, { rotation: 2880, duration: TOTAL, svgOrigin: "60 60" }, 0)
          .fromTo(".ns__progress-fill", { scaleX: 0 }, { scaleX: 1, duration: TOTAL }, 0)
          .fromTo(".ns__layer--deep", { opacity: 0 }, { opacity: 1, duration: 200 }, 0)
          .fromTo(".ns__stars", { opacity: 0.9 }, { opacity: 0, duration: 150 }, 310)
          .fromTo(".ns__layer--dawn", { opacity: 0 }, { opacity: 1, duration: 170 }, 300)
          .fromTo(".ns__sun", { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 170, ease: "power1.out" }, 310)
          .fromTo(".ns__icon--moon", { opacity: 1 }, { opacity: 0.25, duration: 120 }, 330)
          .fromTo(".ns__icon--sun", { opacity: 0.25 }, { opacity: 1, duration: 120 }, 330);

        CALLS.forEach((call, i) => {
          const card = cards[i];
          tl.fromTo(card, { opacity: 0, x: 90, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 18, ease: "power3.out" }, call.minute)
            .fromTo(card.querySelector(".ns-call__result"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 8, ease: "power2.out" }, call.minute + 11)
            .fromTo(card.querySelector(".ns-call__check"), { scale: 0 }, { scale: 1, duration: 6, ease: "back.out(3)" }, call.minute + 14)
            .fromTo(card.querySelector(".ns-call__glow"), { opacity: 0 }, { opacity: 1, duration: 4 }, call.minute + 14)
            .to(card.querySelector(".ns-call__glow"), { opacity: 0, duration: 20 }, call.minute + 18);
          if (i >= 2) {
            tl.to(
              list,
              {
                y: () => -Math.max(0, card.offsetTop + card.offsetHeight - feed.clientHeight),
                duration: 16,
                ease: "power2.inOut",
              },
              call.minute - 4
            );
          }
        });

        tl.fromTo(".ns__outro", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 26, ease: "power2.out" }, TOTAL - 8).to(
          {},
          { duration: 60 }
        );

        return () => {
          timeEl.textContent = staticTime;
          countEl.textContent = staticCount;
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="ns" ref={ref} aria-labelledby="ns-heading">
      <div className="ns__pin">
        <div className="ns__sky" aria-hidden="true">
          <div className="ns__layer ns__layer--night" />
          <div className="ns__layer ns__layer--deep" />
          <div className="ns__stars" />
          <div className="ns__layer ns__layer--dawn" />
          <div className="ns__sun" />
          <div className="grain" />
        </div>

        <div className="shell ns__grid">
          <div className="ns__left">
            <Eyebrow accent="amber">{NIGHT_SHIFT.eyebrow}</Eyebrow>
            <SplitHeading id="ns-heading" className="t-h2 ns__heading">
              {NIGHT_SHIFT.heading}
            </SplitHeading>
            <p className="t-lead ns__sub">{NIGHT_SHIFT.sub}</p>

            <div className="ns__clock">
              <svg className="ns__dial" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="56" className="ns__dial-face" />
                {TICKS.map((deg) => (
                  <line
                    key={deg}
                    x1="60"
                    y1="9"
                    x2="60"
                    y2={deg % 90 === 0 ? 17 : 14}
                    className="ns__tick"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
                <line x1="60" y1="60" x2="60" y2="34" className="ns__hand ns__hand--hour" transform="rotate(330 60 60)" />
                <line x1="60" y1="60" x2="60" y2="20" className="ns__hand ns__hand--min" />
                <circle cx="60" cy="60" r="3.5" className="ns__pivot" />
              </svg>
              <div className="ns__readout">
                <span className="ns__time tabular" data-time aria-live="off">
                  {NIGHT_SHIFT.startLabel} – {NIGHT_SHIFT.endLabel}
                </span>
                <span className="ns__count t-mono">
                  <b data-count>{CALLS.length}</b> calls answered · <b>0</b> sent to voicemail
                </span>
              </div>
            </div>

            <div className="ns__progress" aria-hidden="true">
              <span className="ns__progress-label t-mono">
                <Moon className="ns__icon ns__icon--moon" strokeWidth={2} />
                {NIGHT_SHIFT.startLabel}
              </span>
              <span className="ns__progress-track">
                <span className="ns__progress-fill" />
              </span>
              <span className="ns__progress-label t-mono">
                {NIGHT_SHIFT.endLabel}
                <Sunrise className="ns__icon ns__icon--sun" strokeWidth={2} />
              </span>
            </div>
            <p className="ns__outro">{NIGHT_SHIFT.outro}</p>
          </div>

          <div className="ns__right">
            <div className="ns__feed">
              <ol className="ns__list">
                {CALLS.map(({ minute, who, kind, Icon, said, result }) => (
                  <li className="ns-call" key={minute}>
                    <span className="ns-call__glow" aria-hidden="true" />
                    <div className="ns-call__top">
                      <span className="ns-call__time t-mono tabular">{formatMinute(minute)}</span>
                      <span className="ns-call__kind">
                        <Icon strokeWidth={2} aria-hidden="true" />
                        {kind}
                      </span>
                    </div>
                    <p className="ns-call__who">{who}</p>
                    <p className="ns-call__said">“{said}”</p>
                    <p className="ns-call__result">
                      <span className="ns-call__check" aria-hidden="true">
                        <Check strokeWidth={3} />
                      </span>
                      {result}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
