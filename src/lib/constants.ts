export const SITE = {
  name: "ShikshaSetu Surat",
  short: "ShikshaSetu",
  tagline: "Surat's trusted home & online tuition network",
  phone: "+91 98250 44120",
  phoneHref: "tel:+919825044120",
  whatsapp: "https://wa.me/919825044120",
  email: "hello@shikshasetusurat.in",
  address: "2nd Floor, Silver Trade Centre, VIP Road, Vesu, Surat, Gujarat 395007",
  timezone: "Asia/Calcutta",
};

export const SOCIALS = [
  { name: "WhatsApp", href: "https://wa.me/919825044120" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

export const STANDARDS = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 11 - Humanities",
  "Class 12 - Science",
  "Class 12 - Commerce",
  "Class 12 - Humanities",
];

export const BOARDS = ["GSEB", "CBSE", "ICSE", "NCERT Based", "Other"];

export const MODES = ["Home Tuition", "Online Tuition", "Either Works"];

export const CONTACT_TOPICS = [
  "Home tuition enquiry",
  "Online tuition enquiry",
  "Board exam preparation",
  "Tutor registration",
  "Fees & schedule",
  "Something else",
];

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "1 – 2 years",
  "3 – 5 years",
  "6 – 10 years",
  "10+ years",
];

export const CLASS_RANGES = [
  "Classes 1 – 5",
  "Classes 6 – 8",
  "Classes 9 – 10",
  "Classes 11 – 12 Science",
  "Classes 11 – 12 Commerce",
  "Classes 11 – 12 Humanities",
];

export const TIME_SLOTS = ["14:30", "16:30", "17:30", "18:30", "19:30"];

export const SLOT_CAPACITY = 4;

export const AREAS = [
  "Vesu",
  "Adajan",
  "City Light",
  "Pal",
  "Athwa",
  "Piplod",
  "Althan",
  "Varachha",
  "Katargam",
  "Dumas",
  "Nanpura",
  "Bhatar",
];

export const SUBJECT_POOL = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Gujarati",
  "Hindi",
  "Social Science",
  "Accountancy",
  "Business Studies",
  "Economics",
  "Statistics",
  "History",
  "Political Science",
  "Geography",
  "Psychology",
  "Computer Science",
];

export const PROGRAMS = [
  {
    slug: "classes-1-8",
    eyebrow: "Foundation Years",
    title: "Classes 1 – 8",
    blurb:
      "Strong basics in Maths, Science, English and languages with GSEB, CBSE, ICSE and NCERT-aligned lesson plans, activity worksheets and weekly parent updates.",
    points: [
      "Concept-first teaching, no rote learning",
      "Handwriting, reading & spoken English support",
      "Monthly progress card shared with parents",
    ],
    accent: "from-[#3381fb] to-[#164ddc]",
    icon: "foundation" as const,
  },
  {
    slug: "classes-9-10",
    eyebrow: "Board Years",
    title: "Classes 9 – 10",
    blurb:
      "Board-focused coaching with chapter tests, previous-year paper drills and a written score-improvement plan for every student.",
    points: [
      "GSEB / CBSE / ICSE board pattern practice",
      "Weekly tests + doubt-solving sessions",
      "Pre-board crash revision in January",
    ],
    accent: "from-[#ff7a18] to-[#ed5d00]",
    icon: "boards" as const,
  },
  {
    slug: "classes-11-12-science",
    eyebrow: "Higher Secondary",
    title: "Classes 11 – 12 Science",
    blurb:
      "Physics, Chemistry, Biology and Maths taught by subject specialists, with JEE/NEET foundation layering on top of the board syllabus.",
    points: [
      "Separate specialist tutor per subject",
      "Numerical & derivation mastery drills",
      "NEET / JEE foundation add-on available",
    ],
    accent: "from-[#0ea5a5] to-[#0f766e]",
    icon: "science" as const,
  },
  {
    slug: "classes-11-12-commerce-humanities",
    eyebrow: "Higher Secondary",
    title: "Classes 11 – 12 Commerce & Humanities",
    blurb:
      "Accounts, Economics, Statistics, BA, along with History, Political Science, Psychology and Geography — taught by experienced stream teachers.",
    points: [
      "Ledger-to-balance-sheet practical training",
      "Answer-writing technique for theory papers",
      "CA / CS / CUET foundation guidance",
    ],
    accent: "from-[#8b5cf6] to-[#6d28d9]",
    icon: "commerce" as const,
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Share your learning needs",
    text: "Tell us the class, board, subjects, preferred timing and whether you want a tutor at home or online. Takes two minutes.",
    icon: "form" as const,
  },
  {
    step: "02",
    title: "Review your tutor match",
    text: "Our academic team shortlists screened tutors from your part of Surat and shares their profile, qualification and teaching style.",
    icon: "match" as const,
  },
  {
    step: "03",
    title: "Attend a free demo class",
    text: "Watch the tutor teach your child a real chapter — completely free, no commitment. Not convinced? We rematch you.",
    icon: "demo" as const,
  },
  {
    step: "04",
    title: "Start your learning plan",
    text: "Lock the schedule, get a written syllabus roadmap, monthly tests and regular progress reports on WhatsApp.",
    icon: "plan" as const,
  },
];

export const SCREENING = [
  {
    title: "Identity verification",
    text: "Government photo ID, current Surat address proof and an in-person or video verification before any tutor is listed.",
    icon: "identity" as const,
  },
  {
    title: "Qualification check",
    text: "Degree certificates, B.Ed / M.Sc / M.Com credentials and prior teaching records are collected and verified.",
    icon: "qualification" as const,
  },
  {
    title: "Subject knowledge test",
    text: "A written and oral subject test per board and class range. Tutors only teach what they clear.",
    icon: "knowledge" as const,
  },
  {
    title: "Communication round",
    text: "A mock teaching demo checks clarity, patience, language comfort and how well the tutor handles a nervous student.",
    icon: "communication" as const,
  },
];

export const FAQS = [
  {
    q: "Is the demo class really free?",
    a: "Yes. Your first demo lecture with a matched tutor is completely free and there is no obligation to continue. If the fit is not right, we arrange a second match at no cost.",
  },
  {
    q: "Which areas of Surat do you cover for home tuition?",
    a: "We currently serve Vesu, Adajan, City Light, Pal, Athwa, Piplod, Althan, Varachha, Katargam, Dumas, Nanpura and Bhatar. Online tuition is available anywhere.",
  },
  {
    q: "Which boards and classes do you support?",
    a: "Classes 1 to 12 across GSEB, CBSE, ICSE and NCERT-based syllabi, including Science, Commerce and Humanities streams in Classes 11 and 12.",
  },
  {
    q: "How are tutors screened?",
    a: "Every tutor clears identity verification, qualification checks, a subject knowledge test and a communication and mock-teaching round before being matched with a student.",
  },
  {
    q: "Can we change the tutor later?",
    a: "Absolutely. If the learning equation is not working, tell your relationship manager and we will rematch you — usually within 72 hours.",
  },
  {
    q: "How are fees decided?",
    a: "Fees depend on class, board, number of subjects and sessions per week. You always get a transparent monthly quote before the demo, with no hidden charges.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ruchika D. Ray",
    area: "Vesu, Surat",
    role: "Parent of Class 9 student",
    quote:
      "The demo lecture let us see exactly how the teacher explains before we paid anything. The matching was spot on — my daughter's Maths went from 48 to 81 in two terms.",
  },
  {
    name: "Gayatri Patel",
    area: "Adajan, Surat",
    role: "Parent of Class 7 student",
    quote:
      "My son needed patience more than speed. ShikshaSetu understood that and sent a tutor who rebuilt his basics. His confidence in class has completely changed.",
  },
  {
    name: "Mihir Shah",
    area: "City Light, Surat",
    role: "Class 12 Commerce student",
    quote:
      "Accounts used to terrify me. My tutor did daily ledger practice and past papers with me. I scored 92 in the GSEB board paper.",
  },
  {
    name: "Dr. Sneha Kapadia",
    area: "Piplod, Surat",
    role: "Parent of Class 11 Science student",
    quote:
      "Separate specialists for Physics and Chemistry made a real difference. The monthly report on WhatsApp keeps us informed without constant follow-up.",
  },
  {
    name: "Rakesh Jariwala",
    area: "Varachha, Surat",
    role: "Parent of Class 10 student",
    quote:
      "We tried three tuition classes before this. One-to-one at home was the only thing that worked for my son. Punctual, verified and genuinely caring teachers.",
  },
];

export const STATS = [
  { value: 1800, suffix: "+", label: "Students taught in Surat" },
  { value: 420, suffix: "+", label: "Verified tutors on panel" },
  { value: 12, suffix: "", label: "Surat localities served" },
  { value: 96, suffix: "%", label: "Parents renew after term 1" },
];
