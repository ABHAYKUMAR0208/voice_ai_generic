import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "../lib/gsap";

// How close to the bottom (px) still counts as "reading the latest".
const PIN_SLACK = 48;

function TranscriptPanel({ transcript, callState }) {
  const bodyRef = useRef(null);
  const count = useRef(0);
  // Follow new text only while the reader is at the bottom; scrolling up to
  // reread something must not be yanked back down by the next word.
  const pinned = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const isLive = callState === "connected" || callState === "agent-speaking";

  // A new speaker turn slides in; text streaming into an existing turn doesn't.
  useLayoutEffect(() => {
    const lines = bodyRef.current?.querySelectorAll(".line");
    if (lines && transcript.length > count.current && !reducedMotion()) {
      gsap.from(lines[lines.length - 1], { y: 14, opacity: 0, duration: 0.6, ease: "expo.out" });
    }
    count.current = transcript.length;
  }, [transcript.length]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (transcript.length === 0) {
      pinned.current = true;
      setShowJump(false);
    } else if (pinned.current) {
      el.scrollTop = el.scrollHeight;
    } else {
      setShowJump(true);
    }
  }, [transcript]);

  const onScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= PIN_SLACK;
    pinned.current = atBottom;
    if (atBottom) setShowJump(false);
  };

  const jumpToLatest = () => {
    const el = bodyRef.current;
    if (!el) return;
    pinned.current = true;
    setShowJump(false);
    el.scrollTop = el.scrollHeight;
  };

  return (
    <section className="panel transcript" aria-label="Conversation transcript">
      <div className="panel__head">
        <h2 className="panel__title">Transcript</h2>
        <span className={`transcript__live${isLive ? " is-live" : ""}`}>
          <i />
          LIVE
        </span>
      </div>
      <div className="panel__body transcript__body" ref={bodyRef} onScroll={onScroll} data-lenis-prevent>
        {transcript.length === 0 ? (
          <p className="transcript__empty">
            Nothing said yet. Connect and start talking — what you and Kelly say will appear here as it happens.
          </p>
        ) : (
          <div className="transcript__list">
            {transcript.map((line) => (
              <div className={`line line--${line.role === "user" ? "you" : "agent"}`} key={line.id}>
                <span className="line__role">{line.role === "user" ? "You" : line.speaker || "Kelly"}</span>
                <span className="line__text">{line.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {showJump && (
        <button type="button" className="transcript__jump" onClick={jumpToLatest}>
          Jump to latest <span aria-hidden="true">↓</span>
        </button>
      )}
    </section>
  );
}

export default memo(TranscriptPanel);
