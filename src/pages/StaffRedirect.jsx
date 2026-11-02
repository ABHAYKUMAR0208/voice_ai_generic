import { useEffect } from "react";
import { DASHBOARD_URL } from "../lib/config";

/** /staff (and /dashboard) forward to the staff dashboard, which asks for a login. */
export default function StaffRedirect() {
  useEffect(() => {
    window.location.replace(DASHBOARD_URL);
  }, []);
  return (
    <main className="bd-check" aria-busy="true" aria-live="polite">
      <p>
        Opening the staff dashboard… <a href={DASHBOARD_URL}>Continue</a>
      </p>
    </main>
  );
}
