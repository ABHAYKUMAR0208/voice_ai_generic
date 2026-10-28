export const BRAND = {
  name: "GIT Software Technologies",
  product: "GIT Voice AI Agent",
  company: "GIT Software Technologies",
  agent: "Kelly",
  logo: `${import.meta.env.BASE_URL}images/logo.png`,
  mark: `${import.meta.env.BASE_URL}images/logo-mark.png`,
};


export const NAV = [
  { to: "/", label: "Home" },
  { to: "/walkthrough", label: "Product" },
  { to: "/solutions", label: "Industries" },
  { to: "/about", label: "Company" },
];

export const MENU = [
  { to: "/", label: "Home" },
  { to: "/walkthrough", label: "Product" },
  { to: "/solutions", label: "Industries" },
  { to: "/about", label: "Company" },
  { to: "/console", label: "Live demo" },
];

export const CONTACT = {
  address: "71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
  phone: "+44 7442 678628",
  phoneHref: "tel:+447442678628",
  phones: [
    { label: "UK", phone: "+44 74426 78628", href: "tel:+447442678628" },
    { label: "UAE", phone: "+971 5851 01282", href: "tel:+971585101282" },
    { label: "India", phone: "+91 97292 04294", href: "tel:+919729204294" },
  ],
  email: "sales@gitsoftwaretech.com",
  emailHref:
    "mailto:sales@gitsoftwaretech.com?subject=GIT%20Voice%20AI%20Agent%20%E2%80%94%20book%20a%20meeting",
  website: "https://gitsoftwaretech.com",
};

export const FOOTER = {
  heading: "Never send a caller to voicemail again.",
  sub: "No app. No sign-up. Press connect and talk to a live agent right now.",
  columns: [
    {
      title: "Product",
      links: [
        { to: "/console", label: "Live console" },
        { to: "/walkthrough", label: "How a call works" },
        { to: "/solutions", label: "Industries" },
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/about", label: "About GIT" },
        { href: "https://gitsoftwaretech.com", label: "gitsoftwaretech.com" },
      ],
    },
  ],
};

// Auto-cycling "achievement unlocked" chip in the footer (every 3s).
export const ACHIEVEMENTS = [
  "Answered on the first ring",
  "Appointment booked · Thu 10:00 AM",
  "Order #4821 · tracking sent by SMS",
  "Admissions call · brochure emailed",
  "Speaks 11 languages",
  "Zero calls sent to voicemail",
];
