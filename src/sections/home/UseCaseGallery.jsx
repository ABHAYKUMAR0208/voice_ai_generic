import { Fragment, useRef } from "react";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { gsap, useGSAP, MQ } from "../../lib/gsap";
import { USE_CASES } from "../../content/home";
import { Eyebrow, SplitHeading, Art } from "../../components/ui";

const ALL = USE_CASES.groups.flatMap((g) => g.cases);
const INBOUND = USE_CASES.groups[0].cases.length;

export default function UseCaseGallery() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(ref.current);
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const q = gsap.utils.selector(ref);
        const track = q(".ucg__track")[0];
        const cards = q(".ucg-card");
        const countEl = q("[data-count]")[0];
        const groupEl = q("[data-group]")[0];
        const fill = q(".ucg__progress-fill")[0];
        const distance = () => track.scrollWidth - track.parentElement.clientWidth;
        let lastIndex = -1;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: q(".ucg__pin")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              gsap.set(fill, { scaleX: self.progress });
              const i = Math.min(ALL.length - 1, Math.round(self.progress * (ALL.length - 1)));
              if (i === lastIndex) return;
              lastIndex = i;
              countEl.textContent = String(i + 1).padStart(2, "0");
              groupEl.textContent = i < INBOUND ? USE_CASES.groups[0].label : USE_CASES.groups[1].label;
              groupEl.dataset.dir = i < INBOUND ? "in" : "out";
            },
          },
        });

        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector(".ucg-card__img"),
            { xPercent: -9 },
            {
              xPercent: 9,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            }
          );
          gsap.fromTo(
            card,
            { rotate: 3, y: 40 },
            {
              rotate: 0,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left 105%", end: "left 60%", scrub: true },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="ucg" ref={ref} aria-labelledby="ucg-heading">
      <div className="ucg__pin">
        <div className="shell ucg__head">
          <div className="shead">
            <Eyebrow accent="emerald">{USE_CASES.eyebrow}</Eyebrow>
            <SplitHeading id="ucg-heading">{USE_CASES.heading}</SplitHeading>
          </div>
          <p className="t-lead ucg__sub">{USE_CASES.sub}</p>
        </div>

        <div className="ucg__viewport" data-lenis-prevent-touch>
          <div className="ucg__track">
            {USE_CASES.groups.map((group, gi) => (
              <Fragment key={group.label}>
                <div className="ucg__divider" aria-hidden="true">
                  {gi === 0 ? <PhoneIncoming strokeWidth={2} /> : <PhoneOutgoing strokeWidth={2} />}
                  <span className="t-mono">{group.label}</span>
                </div>
                {group.cases.map(({ Icon, tone, tag, title, copy }, ci) => {
                  const n = gi * INBOUND + ci + 1;
                  return (
                    <article className="ucg-card" key={title}>
                      <div className="ucg-card__media">
                        <div className="ucg-card__img">
                          <Art Icon={Icon} tone={tone} />
                        </div>
                        <span className="ucg-card__num t-mono">{String(n).padStart(2, "0")}</span>
                      </div>
                      <div className="ucg-card__body">
                        <span className="ucg-card__dir t-mono">{tag}</span>
                        <h3 className="ucg-card__title">{title}</h3>
                        <p className="ucg-card__copy">{copy}</p>
                      </div>
                    </article>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="shell ucg__foot" aria-hidden="true">
          <span className="ucg__group t-mono" data-group data-dir="in">
            {USE_CASES.groups[0].label}
          </span>
          <span className="ucg__progress">
            <span className="ucg__progress-fill" />
          </span>
          <span className="ucg__count t-mono tabular">
            <b data-count>01</b> / {ALL.length}
          </span>
        </div>
      </div>
    </section>
  );
}
