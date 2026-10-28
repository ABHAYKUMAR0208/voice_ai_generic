import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

const TOTAL = 48;

/**
 * Circular waveform of thin bars around the orb. Each bar eases toward the
 * live audio level with its own sine jitter, written straight to its
 * transform from GSAP's ticker — and the ticker callback removes itself once
 * the call goes quiet and the bars have settled.
 */
export default function BarRing({ level = 0, active = false, tone = "idle" }) {
  const ref = useRef(null);
  const levelRef = useRef(level);
  const activeRef = useRef(active);
  const wake = useRef(() => {});

  levelRef.current = level;
  activeRef.current = active;

  useEffect(() => {
    const bars = Array.from(ref.current.querySelectorAll("i"));
    const smoothed = new Float32Array(TOTAL);
    let running = false;

    const tick = () => {
      const on = activeRef.current;
      const base = on ? Math.min(1, levelRef.current) : 0;
      const t = performance.now();
      let energy = 0;
      for (let i = 0; i < TOTAL; i++) {
        const jitter = on ? Math.sin(t / 170 + i * 1.7) * 0.35 : 0;
        const target = on ? Math.max(0.14, base + jitter * base) : 0;
        smoothed[i] += (target - smoothed[i]) * 0.22;
        energy += smoothed[i];
        bars[i].style.transform = `scaleY(${(0.1 + smoothed[i] * 0.9).toFixed(3)})`;
      }
      if (!on && energy < 0.01) {
        gsap.ticker.remove(tick);
        running = false;
      }
    };

    wake.current = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    if (activeRef.current) wake.current();

    return () => {
      gsap.ticker.remove(tick);
      running = false;
    };
  }, []);

  useEffect(() => {
    wake.current();
  }, [active]);

  return (
    <div ref={ref} className={`bar-ring bar-ring--${tone}`} data-active={active ? "true" : "false"} aria-hidden="true">
      {Array.from({ length: TOTAL }, (_, i) => (
        <span key={i} style={{ transform: `rotate(${(360 / TOTAL) * i}deg)` }}>
          <i />
        </span>
      ))}
    </div>
  );
}
