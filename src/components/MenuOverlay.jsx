import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useLenis } from "./SmoothScroll";
import { TLink } from "./Transition";
import { BRAND, CONTACT, MENU } from "../content/site";

/**
 * Full-screen menu: the panel drops from the top with a rounded lower edge
 * (same motif as the loader and route curtain) and the big numbered labels
 * rise out of their masks in sequence.
 */
export default function MenuOverlay({ open, onClose, returnFocusTo, time }) {
  const { pathname } = useLocation();
  const root = useRef(null);
  const tl = useRef(null);
  const lenis = useLenis();
  const wasOpen = useRef(false);

  useGSAP(
    () => {
      const fast = reducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(root.current, { display: "block" })
        .to(".menu__scrim", { opacity: 1, duration: fast ? 0.01 : 0.5, ease: "power2.out" }, 0)
        .fromTo(".menu__panel", { yPercent: -100 }, { yPercent: 0, duration: fast ? 0.01 : 0.95, ease: "expo.inOut" }, 0)
        .from(".menu__label", { yPercent: 115, duration: fast ? 0.01 : 1, stagger: 0.06 }, fast ? 0 : 0.45)
        .from([".menu__index", ".menu__top > *", ".menu__bottom > *"], { opacity: 0, y: 12, duration: 0.6, stagger: 0.03 }, fast ? 0 : 0.55);
    },
    { scope: root }
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return undefined;
    if (open) {
      wasOpen.current = true;
      lenis?.stop();
      t.timeScale(1).play();
      const first = root.current.querySelector(".menu__item");
      const id = setTimeout(() => first?.focus({ preventScroll: true }), 350);
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(id);
        window.removeEventListener("keydown", onKey);
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      t.timeScale(1.7).reverse();
      // A route change started by a menu link restarts scrolling itself.
      if (!document.documentElement.classList.contains("is-transitioning")) lenis?.start();
      returnFocusTo?.current?.focus({ preventScroll: true });
    }
    return undefined;
  }, [open, lenis, onClose, returnFocusTo]);

  return (
    <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="menu__scrim" onClick={onClose} />
      <div className="menu__panel" data-lenis-prevent>
        <div className="menu__glow" aria-hidden="true" />
        <div className="shell menu__top">
          <span className="brand">
            <img className="brand__logo" src={BRAND.logo} alt={BRAND.name} width="203" height="63" />
          </span>
          <button className="menu-btn" onClick={onClose}>
            <X size={14} strokeWidth={2.4} aria-hidden="true" />
            Close
          </button>
        </div>

        <nav className="shell menu__nav" aria-label="Site">
          <ul className="menu__list">
            {MENU.map((item, i) => (
              <li key={item.to}>
                <TLink
                  to={item.to}
                  className={`menu__item${item.to === pathname ? " is-active" : ""}`}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="menu__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="menu__label-mask">
                    <span className="menu__label">{item.label}</span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shell menu__bottom">
          <span className="t-mono">Agent online · {time}</span>
          <a href={CONTACT.emailHref} tabIndex={open ? 0 : -1}>
            {CONTACT.email}
          </a>
          <a href={CONTACT.phoneHref} tabIndex={open ? 0 : -1}>
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
