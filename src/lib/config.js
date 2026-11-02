export const TOKEN_ENDPOINT =
  import.meta.env.VITE_TOKEN_ENDPOINT || "https://aivoice.gitsoftwaretech.in/token";

// The staff dashboard is a separate app with its own login (hotel-ops-dashboard).
// The site only links to it; sign-in and roles are enforced by the dashboard.
export const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "https://ops.aivoice.gitsoftwaretech.in";
