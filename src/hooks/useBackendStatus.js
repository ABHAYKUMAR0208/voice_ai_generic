import { useCallback, useEffect, useState } from "react";
import { TOKEN_ENDPOINT } from "../lib/config";

/**
 * Is the voice backend reachable?
 *
 * We send a HEAD request (it never mints a LiveKit token). Any HTTP answer
 * below 500 means the server is up -- even a 405/404 -- because we only care
 * that something answered. A network error, a timeout, or a 5xx (what a proxy
 * or tunnel returns when the server behind it is down) counts as offline.
 *
 * Set VITE_HEALTH_ENDPOINT if you add a dedicated /health route.
 */
const PING_URL = import.meta.env.VITE_HEALTH_ENDPOINT || TOKEN_ENDPOINT;
const TIMEOUT_MS = 4000;
const CACHE_MS = 20000; // don't re-ping on every navigation

let cache = { at: 0, status: null };
const isFresh = () => cache.status && Date.now() - cache.at < CACHE_MS;

async function ping() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(PING_URL, {
      method: "HEAD",
      cache: "no-store",
      signal: ctrl.signal,
    });
    return resp.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** @returns {{ status: "checking" | "online" | "offline", retry: () => void }} */
export function useBackendStatus() {
  const [status, setStatus] = useState(() => (isFresh() ? cache.status : "checking"));
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (run === 0 && isFresh()) return undefined;
    let alive = true;
    setStatus("checking");
    ping().then((ok) => {
      cache = { at: Date.now(), status: ok ? "online" : "offline" };
      if (alive) setStatus(cache.status);
    });
    return () => {
      alive = false;
    };
  }, [run]);

  const retry = useCallback(() => {
    cache = { at: 0, status: null };
    setRun((n) => n + 1);
  }, []);

  return { status, retry };
}