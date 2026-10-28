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
                {group.items.map((item) =>
                  item.logo ? (
                    <li
                      className={`integ-logo${item.wide ? " integ-logo--wide" : ""}${item.live ? " integ-logo--live" : ""}`}
                      key={item.name}
                      title={item.live ? `${item.name} · Live` : item.name}
                      data-name={item.name}
                    >
                      <img src={item.logo} alt={item.name} loading="lazy" decoding="async" />
                      {item.live && (
                        <span className="integ-logo__live">
                          <span className="integ-chip__dot" aria-hidden="true" />
                          Live
                        </span>
                      )}
                    </li>
                  ) : (
                    <li className={`integ-chip${item.live ? " integ-chip--live" : ""}`} key={item.name}>
                      {item.Icon && <item.Icon className="integ-chip__icon" size={16} strokeWidth={1.9} aria-hidden="true" />}
                      <span>{item.name}</span>
                      {item.live && <span className="integ-chip__tag">Live</span>}
                    </li>
                  )
                )}
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
