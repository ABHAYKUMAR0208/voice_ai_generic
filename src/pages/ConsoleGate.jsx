import { useBackendStatus } from "../hooks/useBackendStatus";
import BookDemo from "./BookDemo";
import "../styles/book-demo.css";

/**
 * Sits in front of the live console. Backend up -> the console.
 * Backend down -> the "book a demo" page.
 */
export default function ConsoleGate({ Console }) {
  const { status, retry } = useBackendStatus();

  if (status === "checking") {
    return (
      <main className="bd-check" aria-busy="true" aria-live="polite">
        <span className="bd-check__dot" aria-hidden="true" />
        <p>Connecting to the voice agent…</p>
      </main>
    );
  }

  if (status === "online") return <Console />;

  return <BookDemo onRetry={retry} />;
}