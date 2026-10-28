import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { STATS } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";

const format = (v, decimals = 0) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export default function Stats() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const items = gsap.utils.toArray(".stat", ref.current);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current.querySelector(".stats__grid"), start: "top 82%", once: true },
      });
      items.forEach((item, i) => {
        const num = item.querySelector("[data-value]");
        const target = parseFloat(num.dataset.value);
        const decimals = parseInt(num.dataset.decimals || "0", 10);
        const counter = { v: 0 };
        num.textContent = format(0, decimals);
        tl.to(
          counter,
          {
            v: target,
            duration: 2.2,
            ease: "expo.out",
            onUpdate: () => (num.textContent = format(counter.v, decimals)),
          },
          i * 0.12
        )
          .fromTo(item.querySelector(".stat__bar i"), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "expo.out" }, i * 0.12)
          .from(item, { y: 30, opacity: 0, duration: 1, ease: "expo.out" }, i * 0.12);
      });
      return () =>
        items.forEach((item) => {
          const num = item.querySelector("[data-value]");
          num.textContent = format(parseFloat(num.dataset.value), parseInt(num.dataset.decimals || "0", 10));
        });
    },
    { scope: ref }
  );

  return (
    <section className="section stats" ref={ref} aria-labelledby="stats-heading">
      <div className="shell">
        <div className="stats__panel" data-reveal="scale">
          <div className="stats__glow" aria-hidden="true" />
          <div className="shead">
            <Eyebrow accent="violet">{STATS.eyebrow}</Eyebrow>
            <SplitHeading id="stats-heading">{STATS.heading}</SplitHeading>
          </div>
          <ul className="stats__grid">
            {STATS.items.map((s) => (
              <li className="stat" key={s.label}>
                <p className="stat__value">
                  <span data-value={s.value} data-decimals={s.decimals || 0} className="tabular">
                    {format(s.value, s.decimals || 0)}
                  </span>
                  <span className="stat__suffix">{s.suffix}</span>
                </p>
                <span className="stat__bar" aria-hidden="true">
                  <i />
                </span>
                <p className="stat__label">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
