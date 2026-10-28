import { memo, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MENU_SECTIONS, HOUSE_SPECIALS_ID } from "../lib/menuData";
import { gsap, reducedMotion } from "../lib/gsap";

function formatPrice(price) {
  if (!price) return "Free";
  return `₹${price.toLocaleString("en-IN")}`;
}

function MenuSection({ section, showLabel, onSelectItem }) {
  return (
    <div className="menu-section">
      {showLabel && <div className="menu-section__label">{section.label}</div>}
      <ul className="menu-section__list">
        {section.items.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              className="menu-item__row"
              onClick={onSelectItem ? () => onSelectItem(item) : undefined}
            >
              <span className="menu-item__name">{item.name}</span>
              <span className="menu-item__dots" aria-hidden="true" />
              <span className="menu-item__price tabular">{formatPrice(item.price)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuPanel({ onSelectItem }) {
  const [expanded, setExpanded] = useState(false);
  const bodyRef = useRef(null);
  const first = useRef(true);

  const houseSpecials = MENU_SECTIONS.find((s) => s.id === HOUSE_SPECIALS_ID);
  const otherSections = MENU_SECTIONS.filter((s) => s.id !== HOUSE_SPECIALS_ID);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion()) return;
    const extra = bodyRef.current.querySelectorAll(".menu-section:not(:first-child)");
    if (expanded && extra.length) {
      gsap.from(extra, { y: 18, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 });
    }
    if (!expanded) bodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [expanded]);

  return (
    <section className="panel menu-panel" aria-label="Menu">
      <div className="panel__head">
        <div>
          <h2 className="panel__title">Menu</h2>
          <span className="menu-panel__subtitle">{expanded ? "Full menu" : "House specials"}</span>
        </div>

        <button
          type="button"
          className="menu-panel__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Less" : "More"}
          <ChevronDown strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <div className="panel__body menu-panel__body" ref={bodyRef} data-lenis-prevent>
        <MenuSection section={houseSpecials} showLabel={expanded} onSelectItem={onSelectItem} />
        {expanded &&
          otherSections.map((section) => (
            <MenuSection key={section.id} section={section} showLabel onSelectItem={onSelectItem} />
          ))}
      </div>

      {!expanded && (
        <p className="menu-panel__hint">Say the dish name during your call to order — tap “More” for the full menu.</p>
      )}
    </section>
  );
}

export default memo(MenuPanel);
