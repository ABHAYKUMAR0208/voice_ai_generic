import { useEffect, useRef } from "react";
import { AudioLines, CircleAlert, Mic, MicOff } from "lucide-react";
import { gsap, reducedMotion } from "../lib/gsap";
import BarRing from "./BarRing";

/**
 * The call orb. Colour follows the call state (violet idle, amber while
 * connecting or on hold, cyan when Kelly speaks, emerald when you speak,
 * rose on error); it swells with the live level and sends CSS ripples out
 * while either side is talking.
 *
 * `state`: idle | connecting | on-hold | connected | agent-speaking |
 * user-speaking | error
 */
export default function VoiceCore({ state, isLive, micMuted, level = 0 }) {
  const coreRef = useRef(null);
  const scaleTo = useRef(null);
  const speaking = state === "agent-speaking" || state === "user-speaking";
  const tone =
    state === "agent-speaking"
      ? "agent"
      : state === "user-speaking"
      ? "user"
      : state === "connecting" || state === "on-hold"
      ? "wait"
      : state === "error"
      ? "error"
      : "idle";

  useEffect(() => {
    if (reducedMotion()) return undefined;
    scaleTo.current = gsap.quickTo(coreRef.current, "scale", { duration: 0.35, ease: "power3" });
    return () => gsap.killTweensOf(coreRef.current);
  }, []);

  useEffect(() => {
    scaleTo.current?.(speaking ? 1 + Math.min(level, 1) * 0.12 : 1);
  }, [level, speaking]);

  const badgeState = micMuted ? "muted" : state === "user-speaking" ? "user" : "idle";

  return (
    <div className="core-wrap" data-tone={tone} data-speaking={speaking ? "true" : "false"}>
      <div className="core-ripples" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <BarRing level={level} active={speaking} tone={tone} />
      <div className="core" ref={coreRef}>
        <span className="core__sheen" aria-hidden="true" />
        <span className="core__icon">{state === "error" ? <CircleAlert strokeWidth={2} /> : <AudioLines strokeWidth={2} />}</span>
      </div>
      <div className="mic-badge" data-visible={isLive ? "true" : "false"} data-state={badgeState}>
        {micMuted ? <MicOff strokeWidth={2.2} /> : <Mic strokeWidth={2.2} />}
      </div>
    </div>
  );
}
