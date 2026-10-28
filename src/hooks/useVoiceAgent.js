import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { TOKEN_ENDPOINT } from "../lib/config";
import { createLevelMeter } from "../lib/audioLevel";

// call = "idle" | "connecting" | "connected" | "error"
// within "connected", agentSpeaking / userSpeaking are derived from live
// audio levels rather than being separate states, so both can never
// contradict the underlying call status.

const SPEAKING_THRESHOLD = 0.08;

export function useVoiceAgent() {
  const [callState, setCallState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [agentLevel, setAgentLevel] = useState(0);
  const [transcript, setTranscript] = useState([]);
  // true while the agent plays the hold tune and looks the caller up
  // (only happens when a phone number was entered)
  const [onHold, setOnHold] = useState(false);

  const roomRef = useRef(null);
  const timerRef = useRef(null);
  const stopUserMeterRef = useRef(null);
  const stopAgentMeterRef = useRef(null);
  const agentAudioElRef = useRef(null);
  const decoderRef = useRef(new TextDecoder());

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const teardownMeters = useCallback(() => {
    if (stopUserMeterRef.current) {
      stopUserMeterRef.current();
      stopUserMeterRef.current = null;
    }
    if (stopAgentMeterRef.current) {
      stopAgentMeterRef.current();
      stopAgentMeterRef.current = null;
    }
    setUserLevel(0);
    setAgentLevel(0);
  }, []);

  const teardownAgentAudioEl = useCallback(() => {
    if (agentAudioElRef.current) {
      agentAudioElRef.current.pause();
      agentAudioElRef.current.srcObject = null;
      agentAudioElRef.current.remove();
      agentAudioElRef.current = null;
    }
  }, []);

  const resetForNextCall = useCallback(() => {
    stopTimer();
    teardownMeters();
    teardownAgentAudioEl();
    setSeconds(0);
    setMicMuted(false);
    setOnHold(false);
  }, [stopTimer, teardownMeters, teardownAgentAudioEl]);

  // `speaker` names who is talking on the hotel side (Kelly, or the
  // restaurant host after a transfer): a change starts a new bubble.
  const appendTranscriptDelta = useCallback((role, delta, speaker) => {
    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === role && (last.speaker || null) === (speaker || null)) {
        const updated = [...prev];
        const needsSpace =
          last.text &&
          !/\s$/.test(last.text) &&
          delta &&
          !/^\s/.test(delta);
        const joined = needsSpace ? " " + delta : delta;
        updated[updated.length - 1] = { ...last, text: last.text + joined };
        return updated;
      }
      const id = `${role}-${prev.length}-${Date.now()}`;
      return [...prev, { id, role, speaker: speaker || null, text: delta }];
    });
  }, []);

  // The agent sends the caller's words again once the pod has a cleaner
  // transcription of the whole turn: show those instead of the live guesses.
  const replaceLastTranscript = useCallback((role, text) => {
    setTranscript((prev) => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].role === role) {
          const updated = [...prev];
          updated[i] = { ...prev[i], text };
          return updated;
        }
      }
      return prev;
    });
  }, []);

  const disconnect = useCallback(async () => {
    const room = roomRef.current;
    roomRef.current = null;
    resetForNextCall();
    setCallState("idle");
    if (room) {
      try {
        await room.disconnect();
      } catch {
        /* already gone */
      }
    }
  }, [resetForNextCall]);

  const connect = useCallback(async (phone = "") => {
    if (callState === "connecting" || callState === "connected") return;

    setErrorMessage(null);
    setCallState("connecting");
    setTranscript([]);

    try {
      const trimmed = typeof phone === "string" ? phone.trim() : "";
      const tokenUrl = trimmed
        ? `${TOKEN_ENDPOINT}?phone=${encodeURIComponent(trimmed)}`
        : TOKEN_ENDPOINT;
      const resp = await fetch(tokenUrl);
      if (!resp.ok) {
        let detail = `Token request failed (${resp.status})`;
        try {
          const body = await resp.json();
          if (body?.detail) detail = body.detail;
        } catch {
          /* non-JSON error body */
        }
        throw new Error(detail);
      }
      const { token, url } = await resp.json();

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach();
          el.style.display = "none";
          document.body.appendChild(el);
          agentAudioElRef.current = el;

          const stop = createLevelMeter(track.mediaStreamTrack, setAgentLevel);
          stopAgentMeterRef.current = stop;
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove());
      });

      room.on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
        try {
          const message = JSON.parse(decoderRef.current.decode(payload));
          if (topic === "transcript") {
            if (typeof message.final === "string") {
              replaceLastTranscript(message.role, message.final);
            } else {
              appendTranscriptDelta(message.role, message.delta, message.speaker);
            }
          } else if (topic === "call_status") {
            setOnHold(message.state === "on_hold");
          }
        } catch {
          // ignore malformed frames
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        roomRef.current = null;
        resetForNextCall();
        setCallState((prev) => (prev === "error" ? prev : "idle"));
      });

      await room.connect(url, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      const micPub = room.localParticipant.getTrackPublication(
        Track.Source.Microphone
      );
      if (micPub?.track?.mediaStreamTrack) {
        stopUserMeterRef.current = createLevelMeter(
          micPub.track.mediaStreamTrack,
          setUserLevel
        );
      }

      setCallState("connected");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      const room = roomRef.current;
      roomRef.current = null;
      resetForNextCall();
      if (room) {
        room.disconnect().catch(() => { });
      }
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setCallState("error");
    }
  }, [callState, appendTranscriptDelta, replaceLastTranscript, resetForNextCall]);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room || callState !== "connected") return;
    const next = !micMuted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMicMuted(next);
  }, [micMuted, callState]);

  useEffect(() => {
    return () => {
      stopTimer();
      teardownMeters();
      teardownAgentAudioEl();
      roomRef.current?.disconnect().catch(() => { });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agentSpeaking = callState === "connected" && agentLevel > SPEAKING_THRESHOLD;
  const userSpeaking =
    callState === "connected" && !micMuted && userLevel > SPEAKING_THRESHOLD;

  return {
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
  };
}
