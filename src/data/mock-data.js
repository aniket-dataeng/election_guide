/* ============================================================
   Election Guide — Mock Data Store
   ============================================================ */

export const DataStore = {
  booths: {
    "110022": [
      { id: 1, name: "Govt. Boys Senior Secondary School", address: "Sector 4, R.K. Puram, New Delhi", lat: 28.5678, lng: 77.1724, distance: "0.4 km" },
      { id: 2, name: "Kendriya Vidyalaya", address: "Sector 8, R.K. Puram, New Delhi", lat: 28.5701, lng: 77.1698, distance: "0.8 km" }
    ],
    "400001": [
      { id: 3, name: "Elphinstone College", address: "Fort, Mumbai", lat: 18.9272, lng: 72.8306, distance: "0.5 km" },
      { id: 4, name: "St. Xavier's High School", address: "Fort, Mumbai", lat: 18.9405, lng: 72.8335, distance: "1.1 km" }
    ]
  },
  candidates: {
    "110022": [
      { id: "c1", name: "Ramesh Kumar", party: "National Democratic Party", symbol: "Lotus" },
      { id: "c2", name: "Sunita Sharma", party: "United Progressive Front", symbol: "Hand" }
    ],
    "400001": [
      { id: "c3", name: "Milind Deora", party: "Maha Vikas Front", symbol: "Bow & Arrow" }
    ]
  },
  ballots: {
    "110022": [
      { position: 1, name: "Ramesh Kumar", party: "NDP" },
      { position: 2, name: "Sunita Sharma", party: "UPF" },
      { position: 3, name: "NOTA", party: "None" }
    ]
  }
};

export const STEPS = [
  {
    title: 'Check Eligibility',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    bullets: [
      'Must be a citizen of India and at least <strong>18 years of age</strong>.',
      'Must be an ordinary resident of the constituency where you wish to register.',
      'You must <strong>not</strong> be disqualified under any law relating to elections.',
    ],
    cta: { label: 'Check eligibility criteria →', href: '#' },
  },
  {
    title: 'Register as Voter',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    bullets: [
      'Visit <strong>voters.eci.gov.in</strong> and fill <strong>Form 6</strong> online — free of cost.',
      'Upload proof of age, address proof, and a recent photograph.',
      'Track your application status via the NVSP portal using your reference number.',
    ],
    cta: { label: 'Go to NVSP registration →', href: '#' },
  },
  {
    title: 'Verify Your Voter ID',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
    bullets: [
      'Check your name in the <strong>Electoral Roll</strong> at electoralsearch.eci.gov.in.',
      'Download your <strong>e-EPIC</strong> (digital Voter ID) once registration is approved.',
      'Report any errors in your details using <strong>Form 8</strong> on the same portal.',
    ],
    cta: { label: 'Search the Electoral Roll →', href: '#' },
  },
  {
    title: 'Find Your Polling Booth & Candidates',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    bullets: [
      'Log in to NVSP and use <strong>"Know Your Booth"</strong> to find your assigned polling station.',
      'Research the candidates standing in your constituency before arriving.',
      'Plan your route in advance — consider travel time and local transport.',
    ],
    cta: { label: 'Know Your Candidate →', href: '#' },
  },
  {
    title: 'Voting Day Process & Ballot',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="20 6 9 17 4 12"/></svg>`,
    bullets: [
      'Carry your <strong>Voter ID / e-EPIC</strong> or any of the 12 approved alternate photo IDs.',
      'Polling hours are <strong>7:00 AM – 6:00 PM</strong>; join any queue before 6 PM to vote.',
      'Press the button next to your candidate on the <strong>EVM</strong> — the VVPAT will display your choice.',
    ],
    cta: { label: 'View Ballot Paper →', href: '#' },
  },
];

export const FAQ_RESPONSES = {
  "How do I register to vote?":
    "To register, visit <b>voters.eci.gov.in</b> and fill Form-6. You must be 18+ and an Indian citizen. Registration is free and takes about 5 minutes online.",
  "What documents do I need on election day?":
    "Carry your <b>Voter ID (EPIC) card</b>. Alternatively, any of these 12 approved IDs work: Aadhaar, Passport, Driving License, PAN Card, MNREGA Job Card, or Bank Passbook with photo.",
  "Where is my polling booth?":
    "Find your booth at <b>electoralsearch.eci.gov.in</b> using your name, EPIC number, or mobile number registered with NVSP.",
  "What is EVM and how does it work?":
    "An <b>Electronic Voting Machine (EVM)</b> is a simple device with a ballot unit and control unit. Press the button next to your candidate's symbol. The vote is recorded instantly and securely.",
  "Can I vote if I have moved to a new address?":
    "If you've moved within the same constituency, you can update your address via <b>Form 8A</b>. If you moved to a new constituency, submit a fresh <b>Form 6</b>.",
  "What are the voting hours on election day?":
    "Polling booths are open from <b>7:00 AM to 6:00 PM</b> on election day. If you are in the queue before 6:00 PM, you are entitled to vote.",
};

export const FLOAT_RESPONSES = {
  "How do I register to vote?": {
    intro: "Here's how to register as a voter:",
    bullets: [
      "Visit <strong>voters.eci.gov.in</strong> and click <em>Register as New Voter</em>.",
      "Fill <strong>Form 6</strong> online — it's free and takes ~5 minutes.",
      "Upload: proof of age, address proof, and a recent photo.",
      "Submit and note the <strong>reference number</strong> to track status.",
    ],
    note: "You must be 18+ and an Indian citizen.",
  },
  "What documents are required on election day?": {
    intro: "Carry <strong>any one</strong> of these valid photo IDs:",
    bullets: [
      "Voter ID card (EPIC) — the preferred document.",
      "Aadhaar Card, Passport, or Driving License.",
      "PAN Card, MNREGA Job Card, or Bank Passbook with photo.",
      "A government employee photo ID or pension document.",
    ],
    note: "12 approved IDs are accepted. Original must be carried.",
  },
  "How to find my polling booth?": {
    intro: "Find your booth in 3 easy steps:",
    bullets: [
      "Go to <strong>electoralsearch.eci.gov.in</strong>.",
      "Search by your name, EPIC number, or registered mobile.",
      "Your booth name, address, and polling date will appear.",
    ],
    note: "You can also use the <strong>Voter Helpline App</strong> on your smartphone.",
  },
};
