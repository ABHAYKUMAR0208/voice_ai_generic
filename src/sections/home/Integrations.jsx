import { INTEGRATIONS } from "../../content/home";
import { Eyebrow, SplitHeading } from "../../components/ui";

export default function Integrations() {
  const { eyebrow, heading, sub, groups, note } = INTEGRATIONS;
  return (
    <section className="section integ" aria-labelledby="integ-heading">
      <div className="shell">
        <div className="shead shead--split">
          <div className="shead">
            <Eyebrow accent="cyan">{eyebrow}</Eyebrow>
            <SplitHeading id="integ-heading">{heading}</SplitHeading>
          </div>
          <p className="t-lead" data-reveal>
            {sub}
          </p>
        </div>

        <div className="integ__grid">
          {groups.map((group) => (
            <article className="integ-card" key={group.label} data-reveal>
              <h3 className="integ-card__label t-mono">{group.label}</h3>
              <ul className="integ-card__list">
                {group.items.map((item) => (
                  <li className={`integ-chip${item.live ? " integ-chip--live" : ""}`} key={item.name}>
                    {item.live && <span className="integ-chip__dot" aria-hidden="true" />}
                    <span>{item.name}</span>
                    {item.live && <span className="integ-chip__tag">Live</span>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="integ__note t-small" data-reveal>
          {note}
        </p>
      </div>
    </section>
  );
}
