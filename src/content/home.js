import {
  Banknote,
  Boxes,
  Building2,
  Car,
  Database,
  Hotel,
  House,
  Link2,
  Mail,
  MessageSquareText,
  MousePointerClick,
  PhoneCall,
  Plane,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Webhook,
  CalendarCheck,
  BellRing,
  ConciergeBell,
  GraduationCap,
  Headset,
  Landmark,
  Languages,
  MessagesSquare,
  Package,
  PhoneOutgoing,
  Receipt,
  Repeat,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

export const HERO = {
  eyebrow: "AI voice agents for every industry · live 24/7",
  lead:
    "One phone number, one AI colleague. It answers every call on the first ring — in the caller's own language — and does the work behind the conversation: bookings, orders, tickets and follow-ups, logged straight into your CRM.",
  primary: { to: "/console", label: "Try the live demo" },
  secondary: { to: "/walkthrough", label: "Watch a call" },
  trust: "Answering now · speaks 11 languages",
  status: ["Built by GIT Software Technologies", "Phone lines & the web — one agent", "Scroll to explore"],
  scenarios: [
    {
      room: "Clinic · Appointment",
      said: "Can I move my appointment to Thursday morning?",
      done: ["Booked for Thursday · 10:00 AM", "Confirmation sent by SMS"],
    },
    {
      room: "Online store · Order #4821",
      said: "Where's my order? It was due yesterday.",
      done: ["Order found · out for delivery", "Tracking link sent by SMS"],
    },
    {
      room: "Hotel · Room 304",
      said: "Could we get extra towels and a late checkout?",
      done: ["Towels dispatched to 304", "Checkout moved to 2:00 PM"],
    },
    {
      room: "University · Admissions",
      said: "What are the fees for the evening MBA batch?",
      done: ["Fee details sent by email", "Counsellor callback booked"],
    },
  ],
};

export const TRUST = {
  label: "One voice agent, configured for every industry",
  // Rendered as icons in the marquee; names are kept for screen readers and tooltips.
  sectors: [
    { name: "Hospitality", Icon: Hotel, color: "#e0712f" },
    { name: "Healthcare", Icon: Stethoscope, color: "#c2407a" },
    { name: "Education & Training", Icon: GraduationCap, color: "#4450b0" },
    { name: "E-commerce & Retail", Icon: ShoppingCart, color: "#2e8f82" },
    { name: "Banking & Insurance", Icon: Banknote, color: "#d99a2b" },
    { name: "Real Estate", Icon: House, color: "#e0712f" },
    { name: "Travel & Transport", Icon: Plane, color: "#4450b0" },
    { name: "Logistics", Icon: Truck, color: "#2e8f82" },
    { name: "Public Services", Icon: Landmark, color: "#c2407a" },
    { name: "Automotive", Icon: Car, color: "#d99a2b" },
  ],
};

export const STATEMENT = {
  label: "Why a voice agent",
  lead: "Every unanswered call is a customer, patient or student who goes somewhere else.",
  tail:
    "Your agent picks up on the first ring, understands the caller in their own language and gets it done — so your team can look up from the phone and back at the person in front of them.",
};

export const NIGHT_SHIFT = {
  eyebrow: "Around the clock",
  heading: "While your team sleeps.",
  sub: "Scroll through one night. Every call here is a different business — and one agent handles them all.",
  startLabel: "11:00 PM",
  endLabel: "7:00 AM",
  // minute = minutes after 11:00 PM (0 … 480)
  calls: [
    { minute: 42, who: "Patient · City Clinic", kind: "Appointments", Icon: CalendarCheck, said: "I need to see a doctor tomorrow morning.", result: "Slot held · reminder scheduled" },
    { minute: 135, who: "Customer · Online store", kind: "Order support", Icon: Package, said: "Where is my order? It was due yesterday.", result: "Status shared · tracking sent by SMS" },
    { minute: 210, who: "Guest · Room 508", kind: "Hotel service", Icon: ConciergeBell, said: "The AC is making a rattling noise.", result: "Ticket created · flagged urgent" },
    { minute: 305, who: "Parent · Admissions", kind: "Education", Icon: GraduationCap, said: "What are the fees for the evening batch?", result: "Details sent · counsellor callback booked" },
    { minute: 370, who: "Account holder · Bank", kind: "Banking", Icon: Landmark, said: "I've lost my card — what should I do?", result: "Escalated to the cards team · logged" },
    { minute: 450, who: "Agent → Patient", kind: "Reminder", Icon: PhoneOutgoing, said: "Good morning — a reminder of your 10 AM appointment today.", result: "Confirmed · logged in your CRM" },
    { minute: 468, who: "Agent → Customer", kind: "Delivery update", Icon: Truck, said: "Your order is out for delivery — will someone be home?", result: "Delivery slot confirmed" },
  ],
  outro: "7:00 AM. Seven calls answered across seven industries, none sent to voicemail — every request already waiting in your CRM.",
};

export const FLOW = {
  eyebrow: "How it works",
  heading: "From their voice to done, in three steps.",
  steps: [
    {
      label: "Speak",
      body: "Callers ring your number or tap connect on your website. Audio streams live — no app to install, no hold queue, no “press 1”.",
    },
    {
      label: "Understand",
      body: "The agent recognises returning callers, follows the request mid-sentence in their own language, and checks it against your services, prices and policies.",
    },
    {
      label: "Act",
      body: "It confirms out loud, then does the work — books, orders, logs, notifies — in your CRM and tools before the caller hangs up.",
    },
  ],
  teaser: { to: "/walkthrough", label: "Watch a full call" },
};

export const INSIDE_CALL = {
  eyebrow: "Inside the call",
  heading: "Warm on the phone. Precise in your systems.",
  blocks: [
    {
      tag: "Caller recognition",
      title: "It knows who's calling before it says hello.",
      body: "When a caller rings from a number in your CRM, the agent looks them up while a hold tune plays — then greets them by name and picks up anything still open from their last conversation.",
      points: ["Recognises returning patients, customers and students", "Remembers open requests and past orders", "Never reveals a record to the wrong caller"],
    },
    {
      tag: "Recap & confirm",
      title: "Every detail read back once, before anything is sent.",
      body: "The agent collects the whole request, then confirms it in one clear recap. Misheard names are matched to your records, and if something is missing it asks instead of guessing.",
      points: ["One recap: “Just to confirm…”", "“dr row” becomes Dr. Rao automatically", "Asks for missing details, never invents them"],
    },
    {
      tag: "Straight to your systems",
      title: "The call becomes the record.",
      body: "Appointments, orders, tickets and enquiries land in your CRM while the caller is still on the line — HubSpot today; Salesforce, Microsoft Dynamics or another CRM on request. The caller gets a confirmation by SMS and email.",
      points: ["Bookings, orders, tickets, payment links and callbacks", "Complaints and urgent cases escalated to a person", "Nothing for your team to retype"],
    },
  ],
};

export const USE_CASES = {
  eyebrow: "Industries & use cases",
  heading: "One voice agent. Every industry.",
  sub: "Train it on your scripts, your tone, your services. Put it on your main line, a department number or your website — inbound or outbound.",
  groups: [
    {
      label: "Inbound calls",
      cases: [
        { Icon: CalendarCheck, tone: "orange", tag: "Healthcare · Salons · Services", title: "Appointment booking", copy: "Checks availability, books or reschedules, and sends a confirmation — no hold music." },
        { Icon: Package, tone: "teal", tag: "E-commerce · Retail", title: "Order status & returns", copy: "Looks up an order, explains delivery, starts a return or exchange and sends the tracking link." },
        { Icon: GraduationCap, tone: "indigo", tag: "Education & training", title: "Admissions & course enquiries", copy: "Answers fees, batches and eligibility, then books a counsellor callback and sends the brochure." },
        { Icon: ConciergeBell, tone: "amber", tag: "Hospitality", title: "Front desk & reservations", copy: "Room service, housekeeping, spa, tables and cabs — routed to the right team instantly." },
        { Icon: ShieldCheck, tone: "pink", tag: "Banking · Insurance", title: "Policy, claims & account queries", copy: "Handles routine questions after a quiet identity check and escalates sensitive cases to a person." },
        { Icon: Headset, tone: "teal", tag: "Any industry", title: "Support triage", copy: "Asks the right questions, updates the record and escalates only what needs a human." },
      ],
    },
    {
      label: "Outbound calls",
      cases: [
        { Icon: BellRing, tone: "orange", tag: "Clinics · Salons · Services", title: "Appointment reminders", copy: "Calls ahead to confirm, reschedule or fill a cancelled slot." },
        { Icon: Receipt, tone: "indigo", tag: "Finance · Education · Utilities", title: "Payment & renewal reminders", copy: "A courteous call with a payment link by SMS — never changes a price or offers a discount." },
        { Icon: Truck, tone: "teal", tag: "Logistics · E-commerce", title: "Delivery updates & COD confirmation", copy: "Confirms the address and delivery window, and flags failed attempts to your team." },
        { Icon: Building2, tone: "amber", tag: "Real estate · Sales", title: "Lead follow-up", copy: "Rings new enquiries within minutes, qualifies interest and books a site visit or demo." },
        { Icon: Star, tone: "pink", tag: "Every industry", title: "Feedback & survey calls", copy: "Collects ratings and comments by voice and writes them straight into your CRM." },
        { Icon: Languages, tone: "orange", tag: "Every industry", title: "Language callbacks", copy: "Follows up in the caller's own language when a request needs a human touch." },
      ],
    },
  ],
};

const ICONIFY = "https://api.iconify.design";
const FRESHWORKS_LOGO = "https://dam.freshworks.com/asset/4a736cb7-c1d8-4fba-8e1a-e4aa65d5ba5e/Freshworks-Logo.webp";

export const INTEGRATIONS = {
  eyebrow: "Integrations",
  heading: "Plugs into the tools you already run.",
  sub: "Every call ends as a record in your own systems. HubSpot is live today — Salesforce, Microsoft Dynamics and other CRMs connect through the same layer, so you never change tools to add a voice agent.",
  // Items with a `logo` render as a brand logo (name shown on hover / to screen readers).
  // `wide: true` marks wordmark logos, which are drawn a little shorter than square marks.
  groups: [
    {
      label: "CRM",
      items: [
        { name: "HubSpot", logo: `${ICONIFY}/logos/hubspot.svg`, wide: true, live: true },
        { name: "Salesforce", logo: `${ICONIFY}/logos/salesforce.svg` },
        { name: "Microsoft Dynamics 365", logo: `${ICONIFY}/thesvg-color/microsoft-dynamics-365.svg` },
        { name: "Freshsales", logo: FRESHWORKS_LOGO, wide: true },
      ],
    },
    {
      label: "Helpdesk & ticketing",
      items: [
        { name: "Zendesk", logo: `${ICONIFY}/logos/zendesk.svg`, wide: true },
        { name: "Freshdesk", logo: FRESHWORKS_LOGO, wide: true },
        { name: "ServiceNow", logo: `${ICONIFY}/thesvg-color/servicenow.svg` },
      ],
    },
    {
      label: "Calendars & booking",
      items: [
        { name: "Google Calendar", logo: `${ICONIFY}/logos/google-calendar.svg` },
        { name: "Microsoft 365 / Outlook", logo: `${ICONIFY}/thesvg-color/microsoft-outlook.svg` },
        { name: "Calendly", logo: `${ICONIFY}/thesvg-color/calendly.svg` },
      ],
    },
    {
      label: "Messaging & payments",
      items: [
        { name: "SMS", Icon: MessageSquareText, live: true },
        { name: "Email", Icon: Mail, live: true },
        { name: "Payment links", Icon: Link2, live: true },
        { name: "WhatsApp", logo: `${ICONIFY}/logos/whatsapp-icon.svg` },
      ],
    },
    {
      label: "Phone & web",
      items: [
        { name: "Phone lines (SIP)", Icon: PhoneCall, live: true },
        { name: "Web call button", Icon: MousePointerClick, live: true },
        { name: "Manager phones", Icon: Smartphone, live: true },
      ],
    },
    {
      label: "Your own stack",
      items: [
        { name: "REST APIs & webhooks", Icon: Webhook },
        { name: "ERP / HIS / PMS", Icon: Boxes },
        { name: "Custom databases", Icon: Database },
      ],
    },
  ],
  note: "“Live” means in production today. Everything else is scoped with you during setup — if your system has an API, it can be connected.",
};

export const GO_LIVE = {
  eyebrow: "Going live",
  heading: "From your details to a live line in four steps.",
  steps: [
    { num: "01", title: "Discover", body: "Your services, prices, policies and the questions callers ask." },
    { num: "02", title: "Configure", body: "Teams, agent names, voices, manager numbers and opening hours." },
    { num: "03", title: "Pilot", body: "Test calls with your staff; we tune the wording and flows." },
    { num: "04", title: "Go live", body: "Your number reaches the agent; we monitor and keep improving it." },
  ],
  note: "Typical timeline: 1 week from kickoff to go-live.",
  cta: { to: "/console", label: "Hear it first" },
};

export const TEASER = {
  eyebrow: "The live console",
  heading: "This isn't a demo video.",
  body: "Press connect and start talking — for real. The console opens a live microphone connection and Kelly, our hospitality demo agent, answers out loud in real time. Your own agent will carry your business's name, voice and knowledge.",
  primary: { to: "/console", label: "Open the live console" },
  secondary: { to: "/walkthrough", label: "Watch a call first" },
};

export const PLATFORM = {
  eyebrow: "Platform",
  heading: "Built to sound like your best team member.",
  sub: "Four pieces work together so callers feel heard — and never have to repeat themselves.",
  features: [
    { Icon: Repeat, title: "Always improving", copy: "Anything unclear is flagged for your staff to review, and your agent is tuned from what it learns." },
    { Icon: MessagesSquare, title: "Contextual understanding", copy: "Tracks intent across the whole call — interruptions, corrections, mid-sentence reroutes — without losing the thread." },
    { Icon: Languages, title: "Speaks 11 languages", copy: "English, Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil and Telugu — switching mid-call, with Hindi–English mixing understood." },
    { Icon: ShieldCheck, title: "Built to behave", copy: "Fixed prices, verified phone numbers, quiet identity checks, and a human manager one ring away." },
  ],
};

export const STATS = {
  eyebrow: "By the numbers",
  heading: "The agent, by the numbers.",
  items: [
    { value: 11, label: "Languages in one conversation" },
    { value: 24, suffix: "/7", label: "Always answering" },
    { value: 1, suffix: " week", label: "Typical kickoff to go-live" },
    { value: 20, suffix: "+", label: "Enterprise clients served by GIT" },
  ],
};

export const FAQ = {
  eyebrow: "FAQ",
  heading: "Questions, answered.",
  items: [
    {
      q: "Which industries is it for?",
      a: "Any business that takes calls: hospitals and clinics, hotels and restaurants, schools and training providers, e-commerce and retail, banks and insurers, real estate, travel, logistics and public services. We set up names, voices and knowledge for your business.",
    },
    {
      q: "How fast can we go live?",
      a: "Typically one week from kickoff: we discover your services and policies, configure the agent, pilot it with your staff, then point your number at it.",
    },
    {
      q: "Which CRMs and tools does it work with?",
      a: "HubSpot is live today. Salesforce, Microsoft Dynamics and other CRMs — plus helpdesks, calendars and your own systems — connect through the same layer, scoped with you during setup. If it has an API, it can be connected.",
    },
    {
      q: "Can callers just dial a normal phone number?",
      a: "Yes. The agent answers real phone lines as well as the web console — same voice, same understanding, same handover to your team.",
    },
    {
      q: "Which languages does it speak?",
      a: "Eleven: English, Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil and Telugu. It switches with the caller mid-call and understands Hindi–English mixing, and gives your staff an English translation of every call.",
    },
    {
      q: "What happens when it can't help?",
      a: "It asks the caller first, then rings the right team's manager. If nobody answers, a callback is scheduled and confirmed by email and SMS. Anything unclear is flagged for your staff to review.",
    },
    {
      q: "How is data handled?",
      a: "GIT Software Technologies is ISO 9001 and ISO 27001 certified. Call records land in your own CRM, and we can share our security documentation and agree data handling with your team.",
    },
    {
      q: "How does pricing work?",
      a: "It depends on your call volume, languages and integrations. Talk to us and we'll scope a pilot.",
    },
  ],
};
