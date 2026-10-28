import { useRef } from "react";
import { useVoiceAgent } from "../hooks/useVoiceAgent";
import CallConsole from "../components/CallConsole";
import MenuPanel from "../components/MenuPanel";
import TranscriptPanel from "../components/TranscriptPanel";
import { useIntro } from "../hooks/useMotion";
import "../styles/console.css";

export default function Console() {
  const {
    callState,
    errorMessage,
    seconds,
    micMuted,
    userLevel,
    agentLevel,
    agentSpeaking,
    userSpeaking,
    transcript,
    onHold,
    connect,
    disconnect,
    toggleMic,
  } = useVoiceAgent();

  const ref = useRef(null);
  useIntro(ref, (tl) => {
    tl.from(".console__intro > *", { y: 20, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0)
      .from(".console__stage", { y: 40, opacity: 0, scale: 0.97, duration: 1.2, ease: "expo.out" }, 0.1)
      .from(".console__side", { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.25);
  });

  return (
    <main id="main" className="console" ref={ref}>
      <div className="console__bg" aria-hidden="true">
        <span className="console__orb console__orb--a" />
        <span className="console__orb console__orb--b" />
        <span className="grain" />
      </div>

      <div className="shell console__intro" data-intro>
        <span className="eyebrow eyebrow--pill" data-accent="emerald">
          Live console · real microphone, real replies
        </span>
        <h1 className="console__title">Talk to Kelly.</h1>
        <p className="console__sub">
          Kelly is our live demo agent, set up for a hotel. Your own agent carries your business's name, voice and knowledge.
        </p>
      </div>

      <div className="shell console__grid">
        <div className="console__stage" data-intro>
          <CallConsole
            callState={callState}
            errorMessage={errorMessage}
            seconds={seconds}
            micMuted={micMuted}
            userLevel={userLevel}
            agentLevel={agentLevel}
            agentSpeaking={agentSpeaking}
            userSpeaking={userSpeaking}
            onHold={onHold}
            connect={connect}
            disconnect={disconnect}
            toggleMic={toggleMic}
          />
        </div>
        <div className="console__side console__side--menu" data-intro>
          <MenuPanel />
        </div>
        <div className="console__side console__side--transcript" data-intro>
          <TranscriptPanel transcript={transcript} callState={callState} />
        </div>
      </div>
    </main>
  );
}
