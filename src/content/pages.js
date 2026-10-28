import {
  AudioLines,
  Bot,
  Building2,
  CalendarDays,
  Car,
  Cloud,
  ClipboardList,
  Code,
  Cpu,
  Database,
  GraduationCap,
  Headset,
  Landmark,
  Languages,
  Plane,
  Radio,
  ConciergeBell,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* /walkthrough                                                        */
/* ------------------------------------------------------------------ */
export const WALKTHROUGH = {
  hero: {
    eyebrow: "The walkthrough",
    title: ["Watch exactly", "how a call unfolds."],
    lead: "Five moments, from the first click to hanging up — scroll through a whole conversation before you ever press connect yourself.",
    primary: { to: "/console", label: "Try it live" },
    secondary: { to: "/solutions", label: "See the use cases" },
    watermark: "CALL",
  },
  steps: [
    { title: "Click connect", body: "One button. No sign-up, no setup. Press connect and you're live." },
    { title: "Allow the mic", body: "Your browser asks for the microphone — the only permission it ever needs." },
    { title: "Talk — it listens live", body: "The moment you speak, the waveform reacts in real time. No queue, no “press 1”." },
    { title: "Watch the transcript stream in", body: "Every word appears as it's spoken — yours and the agent's, side by side." },
    { title: "Hang up. It's already handled.", body: "One tap to end the call. The request is already with your team." },
  ],
  transcript: [
    { role: "you", text: "Hi — could I move my appointment to Thursday?" },
    { role: "agent", text: "Of course. Dr. Rao has 10 AM on Thursday. Shall I book it?" },
    { role: "you", text: "Yes, please." },
    { role: "agent", text: "Done — you'll get a confirmation by SMS. Anything else?" },
  ],
  handoff: ["Scheduling · Thursday 10:00 AM booked", "CRM · note added to the record"],
  pipeline: {
    eyebrow: "Under the hood",
    heading: "Four layers. No black boxes.",
    sub: "Each layer is inspectable and replaceable. Phone calls take the same path — SIP lines route straight into a LiveKit room.",
    steps: [
      { num: "01", Icon: Radio, title: "Browser WebRTC", body: "Your microphone streams to the agent over a WebRTC connection the moment you connect.", badge: "getUserMedia → RTCPeerConnection" },
      { num: "02", Icon: Workflow, title: "LiveKit room", body: "LiveKit handles the media layer — publishing, subscribing, and the data channel for live transcript events.", badge: "livekit-client SDK" },
      { num: "03", Icon: Cpu, title: "Agent worker", body: "A Python worker joins the room, transcribes speech, reasons over the request and speaks the reply.", badge: "STT → LLM → TTS" },
      { num: "04", Icon: AudioLines, title: "Audio reply", body: "The reply streams back into the room and plays automatically — no play button, no waiting for text.", badge: "AudioTrack → HTMLAudioElement" },
    ],
  },
  cta: {
    heading: "That's the whole call.",
    body: "No app to install, no account to create. The console is one page and one button away — try it with your own voice.",
    primary: { to: "/console", label: "Try it live" },
  },
};

/* ------------------------------------------------------------------ */
/* /solutions                                                          */
/* ------------------------------------------------------------------ */
export const SOLUTIONS = {
  hero: {
    eyebrow: "Industries",
    title: ["Every conversation,", "handled by voice."],
    lead: "Built for any business that takes calls — from hotels and hospitals to classrooms and checkouts — and flexible enough for the conversations you haven't automated yet.",
    primary: { to: "/console", label: "Try it live" },
    secondary: { to: "/walkthrough", label: "See the walkthrough" },
    watermark: "VOICE",
  },
  services: {
    eyebrow: "Built for every industry",
    heading: "One agent. Your industry.",
    sub: "The same real-time voice pipeline, configured with your services, tone, languages and tools. No holds, no waiting — and every call ends as a record in your CRM.",
    items: [
      { size: "large", Icon: ConciergeBell, tone: "orange", title: "Hospitality", copy: "Room service, housekeeping, spa, tables, cabs and late checkouts — every guest request handled on one line.", badge: "In production" },
      { Icon: Stethoscope, tone: "teal", title: "Healthcare & clinics", copy: "Appointments, reminders and doctor availability, with urgent cases passed straight to staff." },
      { Icon: GraduationCap, tone: "indigo", title: "Education & training", copy: "Admissions enquiries, fee and batch details, counsellor callbacks and class reminders." },
      { size: "tall", Icon: ShoppingBag, tone: "amber", title: "E-commerce & retail", copy: "Order status, returns and exchanges, COD confirmation and delivery updates — without queueing for a human." },
      { Icon: Landmark, tone: "pink", title: "Banking & insurance", copy: "Policy and account queries, EMI and renewal reminders, with quiet identity checks." },
      { Icon: Building2, tone: "orange", title: "Real estate", copy: "Instant callbacks on new enquiries, qualification and site-visit booking." },
      { Icon: Plane, tone: "teal", title: "Travel & transport", copy: "Bookings, rescheduling, delay updates and pickup coordination." },
      { size: "wide", Icon: Truck, tone: "indigo", title: "Logistics & delivery", copy: "Pickup scheduling, delivery windows and failed-attempt follow-ups, logged for your operations team." },
      { size: "wide", Icon: Languages, tone: "amber", title: "Native in 11 languages", copy: "Every caller is answered in their own language, switching mid-call — with an English translation of every call for your staff.", tags: ["EN", "HI", "TA", "+8"] },
      { Icon: ClipboardList, tone: "pink", title: "Public services", copy: "Citizen helplines, status checks, grievance logging and appointment slots." },
      { Icon: Car, tone: "orange", title: "Automotive & field service", copy: "Service bookings, pickup reminders, breakdown triage and technician dispatch." },
    ],
  },
  scenarios: {
    eyebrow: "Beyond the front line",
    heading: "Where else your agent fits in.",
    sub: "The same real-time voice pipeline, configured for the other conversations your business already has.",
    items: [
      { Icon: Headset, tag: "Support", title: "Customer support triage", body: "Route and resolve inbound calls before they reach a human. The agent asks the right questions, updates records, and escalates only when needed." },
      { Icon: Users, tag: "Recruiting", title: "AI phone interview", body: "Screen candidates at scale with a natural back-and-forth voice interview. Transcripts and summaries land in your ATS automatically." },
      { Icon: CalendarDays, tag: "Scheduling", title: "Appointment scheduling", body: "Let patients, clients or customers book and reschedule by speaking naturally. No hold music, no forms, no frustration." },
      { Icon: TrendingUp, tag: "Sales", title: "Sales qualification", body: "Engage inbound leads the moment they arrive — qualify intent, answer objections, and hand warm opportunities to your team." },
      { Icon: Wrench, tag: "Operations", title: "Field operations dispatch", body: "Technicians call in updates, request parts and log job status by voice — no app, no screen, no stopping what they're doing." },
      { Icon: Code, tag: "Platform", title: "Developer platform", body: "A self-hostable WebRTC + LiveKit stack you can fork, instrument and ship under your own brand — full source, no vendor lock-in." },
    ],
  },
  cta: {
    heading: "Ready to hear it for yourself?",
    body: "One button, no sign-up. The console is live — press connect and you're talking to a live agent in seconds.",
    primary: { to: "/console", label: "Launch the console" },
    secondary: { to: "/walkthrough", label: "Watch the walkthrough" },
  },
};

/* ------------------------------------------------------------------ */
/* /about                                                              */
/* ------------------------------------------------------------------ */
export const ABOUT = {
  hero: {
    eyebrow: "About GIT",
    title: ["The team behind", "GIT Voice AI Agent."],
    lead: "GIT Voice AI Agent is built by GIT Software Technologies — an IT services company shipping data, AI and cloud systems for enterprise clients across the UK, UAE and India.",
    primary: { to: "/console", label: "Try the voice agent" },
    secondary: { href: "https://gitsoftwaretech.com", label: "Visit gitsoftwaretech.com" },
    watermark: "GIT",
  },
  intro: {
    eyebrow: "Who we are",
    heading: "An IT services company.",
    paragraphs: [
      "GIT Software Technologies works across database management, analytics and application development, drawing on deep industry experience to deliver IT solutions tailored to each client's needs, timeline and budget.",
      "Its services span cloud consulting, technology advisory, implementation, integration and managed services — backed by ISO 27001:2013 (information security) and ISO 9001:2015 (quality management) certification.",
      "GIT Voice AI Agent is one output of GIT's AI, ML & GenAI practice: a self-hostable WebRTC + LiveKit voice pipeline that answers calls in eleven languages and logs the work into your CRM. You can try it right now from the console.",
    ],
  },
  stats: [
    { text: "2022", label: "Incorporated" },
    { text: "20+", label: "Clients" },
    { text: "50+", label: "Certified experts" },
    { text: "3", label: "Offices · UK, UAE, India" },
  ],
  pillars: {
    eyebrow: "What GIT does",
    heading: "Six practices, one team.",
    sub: "The disciplines GIT Software Technologies works across for its enterprise clients.",
    items: [
      { Icon: Database, title: "Data engineering & analytics", body: "Data warehousing, ETL pipelines, BI tooling and real-time dashboards that turn raw data into decisions." },
      { Icon: Sparkles, title: "AI, ML & GenAI", body: "Model development, deep learning for NLP and vision, and generative AI — including voice agents that work in any industry." },
      { Icon: Bot, title: "Robotics & intelligent automation", body: "AI-powered industrial robotics, ROS-based solutions and robotic process automation for physical and digital workflows." },
      { Icon: TrendingUp, title: "Digital transformation", body: "Business process re-engineering, legacy modernisation, and cloud or SaaS adoption strategy for growing teams." },
      { Icon: Workflow, title: "Enterprise systems & database", body: "ERP and CRM implementation, migration and upgrades (Oracle, SAP, Salesforce), identity management and managed support." },
      { Icon: Cloud, title: "Cloud infrastructure & services", body: "Cloud consulting across AWS, Azure, GCP and OCI, plus security, cost optimisation, MLOps and DevOps." },
    ],
  },
  products: {
    eyebrow: "Products",
    heading: "What GIT has shipped.",
    sub: "A few of the products built under the GIT Software Technologies umbrella.",
    items: [
      { name: "GIT Voice AI Agent", tag: "This product", body: "The real-time voice agent on this site — answering calls for any industry on phone lines and in the browser, in eleven languages.", to: "/console", cta: "Open the console", current: true },
      { name: "Fintegra", tag: "Product", body: "One of GIT Software Technologies' product-line platforms. See gitsoftwaretech.com for full details.", href: "https://gitsoftwaretech.com/fintegra/", cta: "Learn more" },
      { name: "AstroJyotish", tag: "Product", body: "One of GIT Software Technologies' product-line platforms. See gitsoftwaretech.com for full details.", href: "https://gitsoftwaretech.com/astrojyotish/", cta: "Learn more" },
    ],
  },
  certs: {
    eyebrow: "Certifications",
    heading: "Held to a higher standard.",
    items: [
      { title: "ISO 27001:2013", body: "Information security management, applied across GIT's client data and delivery processes." },
      { title: "ISO 9001:2015", body: "Quality management standards covering how GIT plans, builds and supports its solutions." },
    ],
  },
  cta: {
    heading: "Built by GIT. Ready when you are.",
    body: "Press connect and talk to a live agent yourself — or head to GIT Software Technologies for the rest of what the team builds.",
    primary: { to: "/console", label: "Launch the console" },
    secondary: { href: "https://gitsoftwaretech.com", label: "Visit GIT Software Technologies" },
  },
};
