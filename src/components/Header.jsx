import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useClock } from "../hooks/useMotion";
import { BRAND, NAV } from "../content/site";
import { TLink } from "./Transition";
import { Pill } from "./ui";
import MenuOverlay from "./MenuOverlay";

export default function Header({ variant = "default" }) {
  const { pathname } = useLocation();
  const root = useRef(null);
  const nav = useRef(null);
  const pill = useRef(null);
  const menuBtn = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useClock();
  const isConsole = variant === "console";

  // Solid glass after a few px; hide on the way down, return on the way up.
  useGSAP(
    () => {
      const header = root.current;
      const show = gsap
        .from(header, { yPercent: -110, duration: 0.5, ease: "power3.out", paused: true })
        .progress(1);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.classList.toggle("is-solid", y > 24);
          if (y < 140 || self.direction === -1) show.play();
          else show.reverse();
        },
      });
    },
    { scope: root }
  );

  const movePill = useCallback((target, instant = false) => {
    const el = pill.current;
    if (!el) return;
    if (!target) {
      gsap.to(el, { opacity: 0, duration: 0.3 });
      return;
    }
    gsap.to(el, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: instant ? 0 : 0.6,
      ease: "expo.out",
    });
  }, []);

  const activeLink = useCallback(
    () => nav.current?.querySelector(".nav__link.is-active") || null,
    []
  );

  useEffect(() => {
    if (!nav.current) return undefined;
    movePill(activeLink(), true);
    const onResize = () => movePill(activeLink(), true);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, movePill, activeLink]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="header" ref={root} data-variant={variant}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="shell header__inner">
          <TLink to="/" className="brand" aria-label={`${BRAND.product} — home`}>
            <img className="brand__logo" src={BRAND.logo} alt={BRAND.name} width="203" height="63" />
          </TLink>

          {!isConsole && (
            <nav
              className="nav"
              aria-label="Primary"
              ref={nav}
              onPointerLeave={() => movePill(activeLink())}
            >
              <span className="nav__pill" ref={pill} aria-hidden="true" />
              {NAV.map((link) => {
                const active = link.to === pathname;
                return (
                  <TLink
                    key={link.to}
                    to={link.to}
                    className={`nav__link${active ? " is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onPointerEnter={(e) => movePill(e.currentTarget)}
                  >
                    {link.label}
                  </TLink>
                );
              })}
            </nav>
          )}

          <div className="header__right">
            {isConsole ? (
              <TLink to="/" className="back-link">
                <ArrowLeft strokeWidth={2} />
                Back to site
              </TLink>
            ) : (
              <>
                <span className="clock t-mono" aria-label={`Agent online, local time ${time}`}>
                  Agent online <b>{time}</b>
                </span>
                <Pill to="/console" size="sm" className="header__cta">
                  Book a demo
                </Pill>
              </>
            )}
            <button
              ref={menuBtn}
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="menu-btn__bars" aria-hidden="true" />
              Menu
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={closeMenu} returnFocusTo={menuBtn} time={time} />
    </>
  );
}
