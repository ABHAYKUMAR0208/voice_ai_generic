import { GO_LIVE } from "../../content/home";
import { Eyebrow, Pill, SplitHeading } from "../../components/ui";

export default function GoLive() {
  const { eyebrow, heading, steps, note, cta } = GO_LIVE;
  return (
    <section className="section golive" aria-labelledby="golive-heading">
      <div className="shell">
        <div className="shead">
          <Eyebrow accent="violet">{eyebrow}</Eyebrow>
          <SplitHeading id="golive-heading">{heading}</SplitHeading>
        </div>

        <ol className="golive__steps">
          {steps.map((step, i) => (
            <li className={`golive-step${i === steps.length - 1 ? " golive-step--final" : ""}`} key={step.num} data-reveal>
              <span className="golive-step__num t-mono">{step.num}</span>
              <h3 className="golive-step__title">{step.title}</h3>
              <p className="golive-step__body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="golive__foot" data-reveal>
          <span className="chip chip--amber">{note}</span>
          <Pill to={cta.to} variant="outline">
            {cta.label}
          </Pill>
        </div>
      </div>
    </section>
  );
}
