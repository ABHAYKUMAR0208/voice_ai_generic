import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap, ScrollTrigger, reducedMotion } from "../lib/gsap";
import { useLenis } from "./SmoothScroll";

const LABELS = {
  "/": "Home",
  "/walkthrough": "How a call works",
  "/solutions": "Industries",
  "/about": "Company",
  "/console": "Live demo",
};

const TransitionContext = createContext({
  ready: true,
  go: () => {},
  releaseIntro: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/** True once the current page is visible and its intro should play. */
export function usePageReady() {
  return useContext(TransitionContext).ready;
}

/**
 * Owns route changes: a curtain rises over the page, the route swaps
 * underneath it, then the curtain lifts off the top while the new page's
 * hero intro plays. `ready` gates those intros (and the first-load loader
 * releases it once on boot).
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  const [ready, setReady] = useState(() => pathname === "/console" || reducedMotion());

  const releaseIntro = useCallback(() => setReady(true), []);

  const go = useCallback(
    (to, label) => {
      const target = new URL(to, window.location.origin);
      if (target.pathname === pathname) {
        if (lenis) lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (busy.current) return;
      if (reducedMotion()) {
        navigate(to);
        return;
      }

      busy.current = true;
      document.documentElement.classList.add("is-transitioning");
      lenis?.stop();
      labelRef.current.textContent = label || LABELS[target.pathname] || "Loading";

      gsap
        .timeline()
        .set(curtainRef.current, { display: "flex", yPercent: 100, borderRadius: "2.5rem 2.5rem 0 0" })
        .set(labelRef.current, { yPercent: 110 })
        .to(curtainRef.current, { yPercent: 0, borderRadius: "0rem 0rem 0 0", duration: 0.8, ease: "expo.inOut" })
        .to(labelRef.current, { yPercent: 0, duration: 0.65, ease: "expo.out" }, "-=0.3")
        .add(() => {
          setReady(false);
          navigate(to);
        }, "+=0.05");
    },
    [pathname, lenis, navigate]
  );

  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return undefined;
    }

    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });

    // The persistent footer's triggers were created before this page's pins,
    // so re-sort by position before re-measuring or they'd miss the spacing.
    const remeasure = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    if (!busy.current) {
      // Back/forward navigation: no curtain, just re-measure the new page.
      const id = requestAnimationFrame(remeasure);
      return () => cancelAnimationFrame(id);
    }

    const id = requestAnimationFrame(() => {
      remeasure();
      setReady(true);
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            document.documentElement.classList.remove("is-transitioning");
            lenis?.start();
            gsap.set(curtainRef.current, { display: "none" });
          },
        })
        .to(labelRef.current, { yPercent: -110, duration: 0.45, ease: "expo.in" })
        .to(
          curtainRef.current,
          { yPercent: -100, borderRadius: "0 0 2.5rem 2.5rem", duration: 0.9, ease: "expo.inOut" },
          "-=0.1"
        );
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const value = useMemo(() => ({ ready, go, releaseIntro }), [ready, go, releaseIntro]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="curtain__mask">
          <span className="curtain__label" ref={labelRef} />
        </div>
        <div className="curtain__meta t-mono">
          <span className="live-dot" />
          GIT Software Technologies
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** Drop-in for react-router's Link that routes through the curtain. */
export const TLink = forwardRef(function TLink({ to, label, onClick, children, ...rest }, ref) {
  const { go } = usePageTransition();
  return (
    <Link
      ref={ref}
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(to, label);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
});
