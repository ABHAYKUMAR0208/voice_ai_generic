import { useState } from "react";
import { Mail, Phone, RefreshCw, CheckCircle2 } from "lucide-react";
import { CONTACT } from "../content/site";
import { Eyebrow } from "../components/ui";
import "../styles/book-demo.css";

/**
 * Submission:
 *  - If VITE_WEB3FORMS_KEY is set, the form posts to Web3Forms (free; the
 *    submission lands in your inbox).
 *  - Otherwise it opens the visitor's email app with a pre-filled mailto:.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const VOLUMES = [
  "Under 5,000 minutes",
  "5,000 – 25,000 minutes",
  "25,000 – 1,00,000 minutes",
  "More than 1,00,000 minutes",
  "Not sure yet",
];
const SOURCES = ["Google search", "LinkedIn", "Referral", "Event or conference", "Other"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  volume: "",
  source: "",
  website: "",
  reason: "",
  consent: false,
  botcheck: "", // honeypot: real people leave it empty
};

function buildMailto(f) {
  const body = [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Phone: ${f.phone}`,
    `Monthly minutes: ${f.volume}`,
    `Heard about us via: ${f.source}`,
    `Website: ${f.website}`,
    "",
    "What I'd like to automate:",
    f.reason,
  ].join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    "GIT Voice AI Agent - demo request"
  )}&body=${encodeURIComponent(body)}`;
}

function Field({ label, required, children, wide }) {
  return (
    <label className={`bd-field${wide ? " bd-field--wide" : ""}`}>
      <span className="bd-field__label">
        {label}
        {required && <b aria-hidden="true"> *</b>}
      </span>
      {children}
    </label>
  );
}

export default function BookDemo({ onRetry }) {
  const [f, setF] = useState(EMPTY);
  const [state, setState] = useState("idle"); // idle | sending | sent | mailto | error
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setF((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  async function onSubmit(e) {
    e.preventDefault();
    if (f.botcheck) return; // bot

    if (!WEB3FORMS_KEY) {
      window.location.href = buildMailto(f);
      setState("mailto");
      return;
    }

    setState("sending");
    setError("");
    try {
      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "GIT Voice AI Agent - demo request",
          from_name: f.name,
          name: f.name,
          email: f.email,
          phone: f.phone,
          monthly_minutes: f.volume,
          heard_about_us: f.source,
          website: f.website,
          reason: f.reason,
          botcheck: f.botcheck,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.message || "Submission failed");
      setState("sent");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setState("error");
    }
  }

  const done = state === "sent" || state === "mailto";

  return (
    <main id="main" className="bd">
      <div className="shell bd__shell">
        <header className="bd__head">
          <Eyebrow accent="violet">Book a demo</Eyebrow>
          <h1 className="t-h1">
            Your voice AI journey <em>starts here.</em>
          </h1>
          <p className="t-lead">
            Our live console is offline right now. Tell us what you'd like to automate and
            we'll walk you through the agent personally.
          </p>
          {onRetry && (
            <button type="button" className="bd__retry" onClick={onRetry}>
              <RefreshCw size={15} aria-hidden="true" /> Check if the live demo is back
            </button>
          )}
        </header>

        <div className="bd__grid">
          {done ? (
            <section className="bd-card bd-done" aria-live="polite">
              <CheckCircle2 size={44} aria-hidden="true" />
              <h2>{state === "sent" ? "Request received." : "Almost there."}</h2>
              <p>
                {state === "sent"
                  ? "Thanks — we'll get back to you shortly to set up your demo."
                  : `Your email app should have opened with your details. Just press send. No email app? Write to ${CONTACT.email}.`}
              </p>
            </section>
          ) : (
            <form className="bd-card bd-form" onSubmit={onSubmit}>
              {/* honeypot */}
              <input
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                value={f.botcheck}
                onChange={set("botcheck")}
                className="bd-hp"
                aria-hidden="true"
              />

              <Field label="Full name" required wide>
                <input required type="text" autoComplete="name" placeholder="Your name" value={f.name} onChange={set("name")} />
              </Field>

              <Field label="Email" required>
                <input required type="email" autoComplete="email" placeholder="you@company.com" value={f.email} onChange={set("email")} />
              </Field>
              <Field label="Phone number" required>
                <input required type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={f.phone} onChange={set("phone")} />
              </Field>

              <Field label="Monthly minutes to automate" required>
                <select required value={f.volume} onChange={set("volume")}>
                  <option value="" disabled>Select an estimated volume</option>
                  {VOLUMES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="How did you hear about us?" required>
                <select required value={f.source} onChange={set("source")}>
                  <option value="" disabled>Select a source</option>
                  {SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Company website" required wide>
                <input required type="url" autoComplete="url" placeholder="https://company.com" value={f.website} onChange={set("website")} />
              </Field>

              <Field label="Why are you booking this call?" required wide>
                <textarea required rows={3} placeholder="A line or two on what you'd like to automate" value={f.reason} onChange={set("reason")} />
              </Field>

              <label className="bd-consent">
                <input required type="checkbox" checked={f.consent} onChange={set("consent")} />
                <span>I agree to let GIT Software use my details to contact me about this demo and related services.</span>
              </label>

              {state === "error" && <p className="bd-error" role="alert">{error}</p>}

              <button type="submit" className="bd-submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Book demo request"}
              </button>
            </form>
          )}

          <aside className="bd-card bd-side">
            <h2>What happens next</h2>
            <ol>
              <li>We review your request within one working day.</li>
              <li>We reach out to find a time that suits you.</li>
              <li>You see the agent handle a real call in your language.</li>
            </ol>
            <div className="bd-side__contact">
              <a href={CONTACT.emailHref}><Mail size={16} aria-hidden="true" /> {CONTACT.email}</a>
              {CONTACT.phones.map((p) => (
                <a key={p.label} href={p.href}>
                  <Phone size={16} aria-hidden="true" /> {p.label} · {p.phone}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}