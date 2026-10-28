import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { STATEMENT } from "../../content/home";
import { Eyebrow } from "../../components/ui";

const words = (text, tail) =>
  text.split(" ").map((w, i) => (
    <span key={`${tail ? "t" : "l"}${i}`} className={`statement__word${tail ? " is-tail" : ""}`}>
      {w}{" "}
    </span>
  ));

export default function Statement() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const text = ref.current.querySelector(".statement__text");
      gsap.fromTo(
        ".statement__word",
        { opacity: 0.12 },
        {
          opacity: (_, el) => (el.classList.contains("is-tail") ? 0.62 : 1),
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".statement__rule",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 42%", scrub: 0.6 } }
      );
    },
    { scope: ref }
  );

  return (
    <section className="section statement" ref={ref}>
      <div className="shell statement__grid">
        <div className="statement__aside">
          <Eyebrow accent="violet">{STATEMENT.label}</Eyebrow>
          <span className="statement__rule" aria-hidden="true" />
        </div>
        <p className="statement__text">
          {words(STATEMENT.lead, false)}
          {words(STATEMENT.tail, true)}
        </p>
      </div>
    </section>
  );
}
