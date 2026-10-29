// Single source of truth for copy, pricing and projects.
// Values marked TODO are placeholders — confirm before launch.
// Project specs are facts about what was built. Never add results that were not measured.

export const studio = {
  name: "Monark Studio",
  email: "krishna@monarkstudio.in",
  // Every booking is copied to these inboxes.
  notify: ["krishna@monarkstudio.in", "ks3920933@gmail.com"],
  phone: "+91 88172 55593",
  city: "Bhopal, India",
  timezone: "Asia/Kolkata",
  founded: 2026,
  availability: "Taking two projects for December",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/krishnasoni23/" },
    { label: "Instagram", href: "https://www.instagram.com/monark.studio.in/" },
    { label: "GitHub", href: "https://github.com/krishna8761" },
  ],
};

// Discovery call settings. Times are Bhopal (IST, UTC+5:30, no DST).
export const booking = {
  minutes: 20,
  stepMinutes: 30, // a slot every half hour leaves a 10-minute buffer
  dayStart: "10:00",
  dayEnd: "19:00",
  workdays: [1, 2, 3, 4, 5], // Mon–Fri
  daysAhead: 14,
  minNoticeHours: 12,
};

export type Chapter = { href: string; n: string; title: string };

// The guided path. Each page hands the visitor to the next one.
export const chapters: Chapter[] = [
  { href: "/", n: "00", title: "Index" },
  { href: "/work", n: "01", title: "Work" },
  { href: "/capabilities", n: "02", title: "Capabilities" },
  { href: "/process", n: "03", title: "Process" },
  { href: "/engagements", n: "04", title: "Engagements" },
  { href: "/contact", n: "05", title: "Book a call" },
];

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/process", label: "Process" },
  { href: "/engagements", label: "Engagements" },
  { href: "/studio", label: "Studio" },
];

/** Date shown at the top of the Privacy Policy and Terms. Update it whenever either page changes. */
export const LEGAL_UPDATED = "30 October 2026";

export const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const isLegal = (pathname: string) => legalLinks.some((l) => l.href === pathname);

export function chapterFor(pathname: string) {
  if (pathname.startsWith("/work/")) return chapters[1];
  if (pathname === "/studio") return { href: "/studio", n: "—", title: "Studio" };
  if (isLegal(pathname)) return { href: pathname, n: "—", title: "Legal" };
  return chapters.find((c) => c.href === pathname) ?? chapters[0];
}

export function nextChapterFor(pathname: string): Chapter | null {
  if (pathname === "/contact" || isLegal(pathname)) return null; // policy pages end the path; no "next chapter"
  if (pathname === "/studio") return chapters[5];
  if (pathname.startsWith("/work/")) return chapters[2];
  const i = chapters.findIndex((c) => c.href === pathname);
  return i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : chapters[1];
}

/* ───────────────────────── Work ───────────────────────── */

export type Discipline = "Platforms" | "Automation" | "Brand";

export type Media =
  | { kind: "video"; slug: string } // thumb: /work/thumb/<slug>-{desktop,mobile}.jpg · video: /work/video/<slug>-{desktop,mobile}.mp4
  | { kind: "flow"; steps: string[] }; // drawn system diagram for back-end work

export type Project = {
  slug: string;
  title: string;
  kind: "System" | "Site";
  status: string; // stated plainly: concept, prototype, where it was built
  sector: string;
  year: number;
  disciplines: Discipline[];
  scope: string[];
  summary: string;
  media: Media;
  /** Optional photograph for grid cards; overrides the site thumbnail there only. */
  cardImage?: { src: string; alt: string; focus?: string };
  live?: string;
  problem: string;
  interventions: { title: string; body: string }[];
  specs: { value: string; label: string }[]; // facts about the build, never invented results
};

const video = (slug: string): Media => ({ kind: "video", slug });

export const projects: Project[] = [
  {
    slug: "design-to-order",
    title: "Design-to-Order",
    kind: "System",
    status: "In development · for an architecture studio",
    sector: "Architecture · Client experience",
    year: 2026,
    disciplines: ["Automation", "Platforms"],
    scope: ["Client portal", "Mood boards", "WhatsApp automation", "Dashboard"],
    summary: "A client portal where buyers browse the catalogue, build a mood board and share it with the studio — and arrive to a visit that's already prepared.",
    media: {
      kind: "flow",
      steps: ["Browse the catalogue", "Build a mood board", "Share with the studio", "Visit booked + WhatsApp", "Follow-ups run themselves", "Client dashboard & report"],
    },
    problem:
      "An architecture studio's first meetings were spent working out taste: flipping through samples, guessing at references, rebooking when a client wasn't ready. The real design work started a visit too late.",
    interventions: [
      { title: "Browsable catalogue", body: "Finishes, furniture and materials organised so clients can explore on their own time." },
      { title: "Mood board builder", body: "Clients save what they like into a board that the studio sees exactly as they arranged it." },
      { title: "Visit, ready", body: "Sharing a board books the studio visit and sends an automatic WhatsApp confirmation." },
      { title: "Follow-ups and reporting", body: "Reminders and follow-ups run on their own, and the client dashboard shows the full project report." },
    ],
    specs: [
      { value: "6", label: "Steps, one flow" },
      { value: "1", label: "Board shared, visit booked" },
      { value: "0", label: "Manual follow-ups" },
    ],
  },
  {
    slug: "sanghmitra",
    title: "Sanghmitra",
    kind: "Site",
    status: "Concept site",
    sector: "Fashion · Heritage textiles",
    year: 2026,
    disciplines: ["Platforms", "Brand"],
    scope: ["Art direction", "Web design", "Development"],
    summary: "A heritage handloom house from Bhopal, given a storefront that sells the craft before the cloth.",
    media: video("sanghmitra"),
    live: "https://sanghmitra.netlify.app/",
    problem:
      "Sanghmitra's weaves take weeks of handwork, from Banarasi zari to Maheshwari cotton-silk. A template store would put them next to fast fashion and show a price, not a process.",
    interventions: [
      { title: "The weave comes first", body: "Each weave is introduced by its name, region and craft before any product appears." },
      { title: "Quiet luxury, in type", body: "An editorial serif, generous space and warm fabric photography set the price expectation before the price does." },
      { title: "Heritage in numbers", body: "Years of craft, loom clusters and artisan families are shown up front as proof of authenticity." },
    ],
    specs: [
      { value: "Mobile", label: "First, by design" },
      { value: "7", label: "Weaves showcased" },
      { value: "1", label: "Hand-built front end" },
    ],
  },
  {
    slug: "design-kaksh",
    title: "Design Kaksh",
    kind: "Site",
    status: "Concept site",
    sector: "Interior architecture",
    year: 2026,
    disciplines: ["Platforms", "Brand"],
    scope: ["Web design", "Development", "Portfolio system"],
    summary: "An interior studio in Bhopal and Ahmedabad that needed to look as considered as the rooms it builds.",
    media: video("design-kaksh"),
    live: "https://designkaksh.netlify.app/",
    problem:
      "Interior work sells on trust, and trust is built on how the work is shown. Thumbnails in a grid make every studio look the same.",
    interventions: [
      { title: "Projects as rooms", body: "Each project is presented with its type, city and story, not as a single thumbnail." },
      { title: "Before & after", body: "A drag-to-compare transformation shows the change itself, which no description can." },
      { title: "Clear services", body: "Interior design, turnkey execution and consultation, each with a plain scope a client can choose from." },
    ],
    specs: [
      { value: "4", label: "Projects presented" },
      { value: "2", label: "Cities, one studio" },
      { value: "3", label: "Ways to engage" },
    ],
  },
  {
    slug: "nixiv",
    title: "Nixiv",
    kind: "Site",
    status: "Concept site",
    sector: "Fashion · Direct to consumer",
    year: 2026,
    disciplines: ["Platforms"],
    scope: ["E-commerce", "Interface design", "Development"],
    summary: "A direct-to-consumer label with an editorial storefront built to move product.",
    media: video("nixiv"),
    live: "https://nixiv.netlify.app/",
    problem:
      "Fashion campaigns look like magazines; most stores look like spreadsheets. That gap costs trust at the exact moment of purchase.",
    interventions: [
      { title: "Editorial storefront", body: "Campaign imagery and the product grid share one layout system, so the store feels like the brand." },
      { title: "Collections by mood", body: "Outerwear, dresses and tops organised the way people actually shop for an occasion." },
      { title: "Prices in USD", body: "Built for an international audience from the first product card." },
    ],
    specs: [
      { value: "1", label: "Layout system" },
      { value: "USD", label: "Global pricing" },
      { value: "3", label: "Core collections" },
    ],
  },
  {
    slug: "choukhatt",
    title: "Choukhatt",
    kind: "Site",
    status: "Concept site",
    sector: "Jewellery · Handcrafted",
    year: 2026,
    disciplines: ["Platforms", "Brand"],
    scope: ["E-commerce", "Collection storytelling", "Development"],
    summary: "Handcrafted oxidised jewellery, given a store that carries the story behind every piece.",
    media: video("choukhatt"),
    cardImage: {
      src: "/work/thumb/choukhatt-campaign.jpg",
      alt: "Choukhatt campaign — gold filigree earrings, a face veiled in green silk",
      focus: "50% 45%",
    },
    live: "https://choukhatt.netlify.app/",
    problem:
      "Choukhatt sells at exhibitions and through Instagram DMs. Customers who discover them at a stall had nowhere to go afterwards except a chat window.",
    interventions: [
      { title: "Shop by category", body: "Necklaces, jhumkas, bangles, rings, anklets and pendants, each one tap away." },
      { title: "The Khass story", body: "The signature collection is told through the names and people behind each piece." },
      { title: "Exhibition calendar", body: "Upcoming exhibitions announced on the site, so the stall and the store work together." },
    ],
    specs: [
      { value: "6", label: "Shoppable categories" },
      { value: "1", label: "Signature collection" },
      { value: "DM", label: "Custom orders routed" },
    ],
  },
  {
    slug: "rezzzor",
    title: "Rezzzor",
    kind: "Site",
    status: "Concept site",
    sector: "Salon · Hair, makeup & skin",
    year: 2026,
    disciplines: ["Platforms"],
    scope: ["Web design", "Booking flow", "Development"],
    summary: "A Bhopal salon with sixteen years of reputation and two studios, finally online in a way that books appointments.",
    media: video("rezzzor"),
    live: "https://remarkable-bublanina-4835a6.netlify.app/",
    problem:
      "Rezzzor had sixteen years of word of mouth and two studios, but no website. New customers had to call to ask the price of a haircut.",
    interventions: [
      { title: "Prices, published", body: "A clear price list for hair, treatments, makeup and skin, so the first question is already answered." },
      { title: "Two studios, one site", body: "Address, hours, directions and a booking link for each location." },
      { title: "Book from anywhere", body: "A booking call-to-action in every section, including the first screen." },
    ],
    specs: [
      { value: "16", label: "Years, now online" },
      { value: "2", label: "Studios, one site" },
      { value: "1", label: "Tap to book" },
    ],
  },
  {
    slug: "petal-polish",
    title: "Petal & Polish",
    kind: "Site",
    status: "Demo · fictional studio",
    sector: "Nail studio · Booking",
    year: 2026,
    disciplines: ["Platforms"],
    scope: ["Web design", "Online booking", "Development"],
    summary: "A demo nail studio built to show what a modern salon site with online booking can feel like.",
    media: video("petal-polish"),
    live: "https://silly-gelato-7e0be4.netlify.app/",
    problem:
      "Most salon sites are a phone number and a gallery. This demo shows the alternative: a calm site that answers questions and takes the booking itself.",
    interventions: [
      { title: "Calm by design", body: "Soft palette, slow motion and plenty of space, matching the experience the studio sells." },
      { title: "Services and prices", body: "Extensions, nail art and everyday care with starting prices, laid out to scan in seconds." },
      { title: "Book or WhatsApp", body: "Two ways to book from every screen, plus amenities and FAQs that answer what people usually call to ask." },
    ],
    specs: [
      { value: "2", label: "Ways to book" },
      { value: "FAQ", label: "Questions pre-answered" },
      { value: "1", label: "Page, everything on it" },
    ],
  },
];

/* ───────────────────────── Problems we fix ───────────────────────── */

// Typical figures from comparable engagements — present them as typical, never as guarantees.
export const leaks = [
  { problem: "Enquiries answered hours late", fix: "Every enquiry captured and answered in seconds, on web, WhatsApp and email", result: "Replies in seconds" },
  { problem: "Leads nobody follows up", fix: "Follow-ups that run themselves until the lead replies or buys", result: "~10 hrs / week" },
  { problem: "Quotes typed by hand, sent late", fix: "Quotes built from the enquiry and sent the same day", result: "~5 hrs / week" },
  { problem: "Past customers never asked back", fix: "Automatic re-order, rebooking and review requests", result: "Repeat revenue" },
  { problem: "Invoices chased by hand", fix: "Reminders and reconciliation that run themselves", result: "~6 hrs / week" },
];

/* ───────────────────────── Capabilities ───────────────────────── */

export const practices = [
  {
    n: "01",
    title: "Lead Capture & Follow-up",
    promise: "Every enquiry caught, answered and followed up, so the leads you already pay for turn into customers.",
    items: ["Lead capture on web, WhatsApp & email", "Instant replies", "Automatic follow-up sequences", "CRM set-up & lead routing", "Booking & quoting flows"],
  },
  {
    n: "02",
    title: "Custom Systems & Automation",
    promise: "We find the repetitive work in your business and hand it to software. AI only where it earns its place.",
    items: ["Workflow automation", "Internal tools & dashboards", "CRM, ERP & API integrations", "Document & data processing", "AI agents, where they help"],
  },
  {
    n: "03",
    title: "Websites that Sell",
    promise: "Sites built to capture and convert, not just hold a logo.",
    items: ["Marketing sites", "E-commerce", "Customer portals", "Web applications", "Brand & interface design"],
  },
];

export const automatable = [
  { task: "Sorting and answering the shared inbox", hours: "8" },
  { task: "Copying order data between store and accounts", hours: "5" },
  { task: "Chasing unpaid invoices", hours: "6" },
  { task: "Booking and rescheduling calls", hours: "3" },
  { task: "Weekly sales and ops reports", hours: "4" },
  { task: "First-line customer support", hours: "12" },
  { task: "Qualifying inbound leads", hours: "7" },
  { task: "Generating quotes and proposals", hours: "5" },
  { task: "Onboarding new clients or staff", hours: "4" },
  { task: "Updating stock across channels", hours: "6" },
  { task: "Collecting reviews and testimonials", hours: "2" },
  { task: "Turning meeting notes into tasks", hours: "3" },
];

/* ───────────────────────── Process ───────────────────────── */

export const stages = [
  {
    n: "01",
    title: "Diagnose",
    duration: "5 days",
    happens: "We map how work actually moves through your business — the tools, the hand-offs, the hours. Two calls, a shared doc, and access to look around.",
    receive: ["Audit report", "Map of where hours are lost", "Ranked list of opportunities with cost and payback"],
    need: "Two hours of your time and read access to your main tools.",
  },
  {
    n: "02",
    title: "Blueprint",
    duration: "1–2 weeks",
    happens: "We turn the best opportunity into a plan you can sign: what gets built, how it connects, what it looks like, and a fixed price.",
    receive: ["Fixed scope and price", "System architecture", "Design direction"],
    need: "One decision-maker for sign-off.",
  },
  {
    n: "03",
    title: "Build",
    duration: "3–10 weeks",
    happens: "We design and build in weekly cycles. You see working software every Friday, not a big reveal at the end.",
    receive: ["Weekly demo", "Live staging link", "Shared progress tracker"],
    need: "Thirty minutes a week for feedback.",
  },
  {
    n: "04",
    title: "Launch",
    duration: "1 week",
    happens: "We go live, train your team, and hand over everything — code, accounts, documentation — in your name.",
    receive: ["Go-live and monitoring", "Team training", "Documentation and handover video"],
    need: "Your team, for one training session.",
  },
  {
    n: "05",
    title: "Run",
    duration: "Ongoing",
    happens: "Optional. We stay on to watch, fix and improve, and tell you each month what the system saved.",
    receive: ["Monitoring and fixes", "Monthly improvements", "Monthly savings report"],
    need: "Nothing. That's the point.",
  },
];

/* ───────────────────────── Engagements (USD) ───────────────────────── */

// TODO: confirm all prices before launch.
export const engagements = [
  {
    n: "01",
    title: "Diagnostic",
    price: "$750",
    unit: "fixed",
    note: "Five days. Fully credited to any Build started within 60 days.",
    includes: ["Operations audit", "Hours-lost map", "Ranked opportunity list", "Recommendation call"],
  },
  {
    n: "02",
    title: "Build",
    price: "from $2,500",
    unit: "per project",
    note: "Fixed price, agreed in the Blueprint. No hourly billing.",
    includes: ["Lead & automation systems — from $2,500","Websites & e-commerce — from $4,500", "Web apps & portals — from $9,000", "Brand systems — from $3,000"],
  },
  {
    n: "03",
    title: "Partnership",
    price: "from $1,800",
    unit: "per month",
    note: "A standing team for clients who want to keep building. Three-month minimum.",
    includes: ["Reserved build capacity", "Monitoring & maintenance", "Monthly savings report", "Priority response"],
  },
];

export const terms = [
  { q: "How do payments work?", a: "Diagnostic is paid upfront. Builds are 50% to start and 50% at launch. Partnerships are billed monthly in advance. We invoice in USD." },
  { q: "Who owns the work?", a: "You do. Code, accounts, designs and data are handed over in your name at launch, once the final payment is made." },
  { q: "Do you work outside India?", a: "Most of our work is remote. We overlap at least four hours with UK, EU and Gulf time zones, and schedule calls for the US." },
  { q: "What if we already have a team?", a: "Good. We plug into your tools and hand over to your people, and we can train the team that takes it forward." },
  { q: "What if the Diagnostic finds nothing worth building?", a: "Then we tell you, and you keep the report. Knowing what not to build is still worth $750." },
];

/* ───────────────────────── Studio ───────────────────────── */

export const principles = [
  { title: "Problems before projects", body: "We don't quote a website until we know what the website is for." },
  { title: "One team, end to end", body: "The people who design it build it. Nothing is lost between departments." },
  { title: "Measured, not admired", body: "Every engagement has a number attached — hours, leads, revenue — and we report against it." },
  { title: "You own everything", body: "No lock-in, no hostage hosting. Your code, your accounts, your data." },
];

export const founder = {
  name: "Krishna Soni",
  role: "Founder & Studio Lead",
  bio: "Krishna started Monark after watching small businesses lose customers to slow replies and forgotten follow-ups, while paying for software that looked good and changed nothing. Every engagement is led by Krishna personally — from the first diagnostic call to the last handover.",
  image: { src: "/studio/founder.jpg", w: 1254, h: 1254, alt: "Portrait of Krishna Soni" },
};

/* ───────────────────────── Contact brief ───────────────────────── */

export const brief = {
  pains: [
    "Leads slip through",
    "Slow replies and follow-ups",
    "Too much manual work",
    "Website doesn't convert",
    "Tools don't talk to each other",
    "Need a custom system built",
  ],
  budgets: ["Under $2,500", "$2,500 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"],
  timelines: ["As soon as possible", "Within 1–2 months", "This quarter", "Just exploring"],
};
