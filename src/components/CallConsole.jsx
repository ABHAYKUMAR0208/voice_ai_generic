import { useState } from "react";
import { CircleAlert, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import VoiceCore from "./VoiceCore";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDuration(s) {
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

const STATUS_LABELS = {
  idle: "Idle",
  connecting: "Connecting…",
  "on-hold": "Please hold…",
  connected: "Live",
  "agent-speaking": "Kelly is speaking",
  "user-speaking": "You're speaking",
  error: "Connection error",
};

// Props and call-state logic are unchanged from the original console; only
// the markup and styling around them changed.
export default function CallConsole({
  callState,
  errorMessage,
  seconds,
  micMuted,
  userLevel,
  agentLevel,
  agentSpeaking,
  userSpeaking,
  onHold,
  connect,
  disconnect,
  toggleMic,
}) {
  const isLive = callState === "connected" || callState === "agent-speaking";
  const isIdle = callState === "idle";
  const isConnecting = callState === "connecting";
  const isError = callState === "error";
  const [phone, setPhone] = useState("");

  const uiState = isError
    ? "error"
    : isConnecting
    ? "connecting"
    : onHold
    ? "on-hold"
    : agentSpeaking
    ? "agent-speaking"
    : userSpeaking
    ? "user-speaking"
    : isLive
    ? "connected"
    : "idle";

  const activeLevel = agentSpeaking ? agentLevel : userSpeaking ? userLevel : 0;

  function handleCallClick() {
    if (isLive) {
      disconnect();
    } else {
      connect(phone);
    }
  }

  const buttonAriaLabel = isLive ? "End call" : isError ? "Retry connection" : "Connect call";

  return (
    <section className="call" aria-label="Call console" data-state={uiState}>
      <div className="call__glow" aria-hidden="true" />

      <div className="status-pill" data-state={uiState} role="status" aria-live="polite">
        <span className="status-pill__dot" />
        <span>{STATUS_LABELS[uiState] ?? uiState}</span>
      </div>

      <VoiceCore state={uiState} isLive={isLive} micMuted={micMuted} level={activeLevel} />

      {!isLive && (
        <div className="call-phone">
          <label className="call-phone__label" htmlFor="call-phone-input">
            Phone number <span>(optional)</span>
          </label>
          <input
            id="call-phone-input"
            className="call-phone__input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isConnecting) connect(phone);
            }}
            disabled={isConnecting}
            maxLength={20}
          />
          <p className="call-phone__hint">Enter your phone number and Kelly will recognise you if you have called before.</p>
        </div>
      )}

      <div className={`call-timer tabular${isLive ? " is-live" : ""}`}>{formatDuration(seconds)}</div>

      <div className="call-controls">
        <button
          className="mute-toggle"
          data-muted={micMuted ? "true" : "false"}
          onClick={toggleMic}
          disabled={!isLive}
          aria-pressed={micMuted}
          aria-label={micMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {micMuted ? <MicOff strokeWidth={2.2} /> : <Mic strokeWidth={2.2} />}
          {micMuted ? "Unmute" : "Mute"}
        </button>

        <button
          className="call-button"
          data-state={uiState}
          onClick={handleCallClick}
          disabled={isConnecting}
          aria-label={buttonAriaLabel}
          data-cursor={isLive ? "End" : "Call"}
        >
          <span className="call-button__halo" aria-hidden="true" />
          {isError ? <CircleAlert strokeWidth={2.2} /> : isLive ? <PhoneOff strokeWidth={2.2} /> : <Phone strokeWidth={2.2} />}
        </button>
      </div>

      {isIdle && <p className="call-help">Your browser will ask for microphone access when you connect.</p>}

      {isError && errorMessage && (
        <p className="call-error">
          <CircleAlert strokeWidth={2.2} aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      )}
    </section>
  );
}
