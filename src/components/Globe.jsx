import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import createGlobe from "cobe";
import { gsap, reducedMotion } from "../lib/gsap";

export const HUB = [28.6139, 77.209];
export const CITIES = [
  [40.7128, -74.006],
  [51.5074, -0.1278],
  [1.3521, 103.8198],
  [25.2048, 55.2708],
  [-33.8688, 151.2093],
  [35.6762, 139.6503],
  [-23.5505, -46.6333],
];

const VIOLET = [0.878, 0.443, 0.184]; // deck orange
const CYAN = [0.18, 0.56, 0.51]; // deck teal

export const defaultMarkers = () => [
  { location: HUB, size: 0.09, color: CYAN },
  ...CITIES.map((location) => ({ location, size: 0.045, color: VIOLET })),
];

/**
 * cobe v2 renders one frame per `update()` call and has no loop of its own,
 * so rotation is stepped from GSAP's ticker — and skipped entirely while the
 * globe is off screen. cobe also wraps its canvas in a div, so the canvas is
 * created imperatively inside a container React never reconciles.
 */
const Globe = forwardRef(function Globe({ className = "", theta = 0.26, speed = 0.0026, options, ...rest }, ref) {
  const host = useRef(null);
  const api = useRef(null);

  useImperativeHandle(ref, () => ({ update: (state) => api.current?.update(state) }), []);

  useEffect(() => {
    const el = host.current;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "width:100%;height:100%;opacity:0;transition:opacity 1.4s ease";
    el.appendChild(canvas);

    let size = el.offsetWidth;
    let lastSize = size;
    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: size,
      height: size,
      phi: 0,
      theta,
      dark: 0,
      diffuse: 1.1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 0.98, 0.94],
      markerColor: CYAN,
      glowColor: [0.96, 0.86, 0.72],
      markers: defaultMarkers(),
      arcs: CITIES.map((to) => ({ from: HUB, to, color: CYAN })),
      arcColor: CYAN,
      arcWidth: 0.9,
      arcHeight: 0.3,
      markerElevation: 0.02,
      ...options,
    });
    api.current = globe;
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    const still = reducedMotion();
    const state = { phi: 0, drag: 0, dragTarget: 0, pointerX: null, visible: true };

    const ro = new ResizeObserver(() => {
      size = el.offsetWidth;
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
    });
    io.observe(el);

    const down = (e) => {
      state.pointerX = e.clientX;
    };
    const move = (e) => {
      if (state.pointerX === null) return;
      state.dragTarget += (e.clientX - state.pointerX) / 160;
      state.pointerX = e.clientX;
    };
    const up = () => {
      state.pointerX = null;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    const tick = () => {
      if (!state.visible) return;
      if (!still && state.pointerX === null) state.phi += speed;
      state.drag += (state.dragTarget - state.drag) * 0.08;
      const frame = { phi: state.phi + state.drag };
      // Setting canvas.width clears and reallocates the buffer, so only
      // pass the size through when it actually changed.
      if (size !== lastSize && size > 0) {
        frame.width = size;
        frame.height = size;
        lastSize = size;
      }
      globe.update(frame);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      globe.destroy();
      api.current = null;
      el.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={`globe ${className}`} data-cursor="Drag" {...rest} />;
});

export default Globe;
