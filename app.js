/* ============================================================
   Election Guide — app.js
   Lightweight UI interactivity only (no heavy logic)
   ============================================================ */

'use strict';

// ============================================================
// ONBOARDING FLOW
// ============================================================
const onboardOverlay = document.getElementById('onboard-overlay');
const onboardSteps = document.querySelectorAll('.onboard-step');
const startJourneyCta = document.getElementById('start-journey-cta');
const onboardTitle = document.getElementById('onboard-title');

const answers = {
  age: null,
  firstTime: null,
  location: null
};

// ============================================================
// CENTRAL DATA STORE (MOCK API DB)
// ============================================================
window.DataStore = {
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


// Start logic
function initOnboarding() {
  document.querySelectorAll('.onboard-opt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const step = e.target.closest('.onboard-step').id;
      const val = e.target.getAttribute('data-val');
      
      e.target.closest('.onboard-options').querySelectorAll('.onboard-opt').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
      
      if (step === 'onboard-step-1') answers.age = val;
      if (step === 'onboard-step-2') answers.firstTime = val;
      
      checkOnboardValidity();
    });
  });

  const locSelect = document.getElementById('onboard-location');
  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      answers.location = e.target.value;
      checkOnboardValidity();
    });
  }

  const finishBtn = document.getElementById('onboard-finish');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      closeOnboarding();
      document.getElementById('voting-journey').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const skipBtn = document.getElementById('onboard-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', closeOnboarding);
  }
}

function checkOnboardValidity() {
  const finishBtn = document.getElementById('onboard-finish');
  
  if (answers.age && answers.age !== 'no') { // Just a quick logic that prevents under 18 progressing. Not standard but to cover flow
      document.getElementById('onboard-step-1').classList.remove('active');
      document.getElementById('onboard-step-2').classList.add('active');
      onboardTitle.textContent = "Almost there!";
  } else if (answers.age === 'no') {
      alert("You must be 18 or older to vote.");
      answers.age = null;
      document.querySelectorAll('#onboard-step-1 .onboard-opt').forEach(b => b.classList.remove('selected'));
  }
  
  if (answers.age && answers.firstTime) {
      document.getElementById('onboard-step-2').classList.remove('active');
      document.getElementById('onboard-step-3').classList.add('active');
      onboardTitle.textContent = "Final Step";
  }

  if (finishBtn) {
    if (answers.age && answers.firstTime && answers.location) {
      finishBtn.removeAttribute('disabled');
    } else {
      finishBtn.setAttribute('disabled', 'true');
    }
  }
}

function closeOnboarding() {
  if (onboardOverlay) {
    onboardOverlay.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', initOnboarding);

// ============================================================
// VOTING JOURNEY STEPPER
// ============================================================

const STEPS = [
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
    cta: { label: 'Know Your Candidate →', href: 'javascript:window.viewCandidates()' },
  },
  {
    title: 'Voting Day Process & Ballot',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="20 6 9 17 4 12"/></svg>`,
    bullets: [
      'Carry your <strong>Voter ID / e-EPIC</strong> or any of the 12 approved alternate photo IDs.',
      'Polling hours are <strong>7:00 AM – 6:00 PM</strong>; join any queue before 6 PM to vote.',
      'Press the button next to your candidate on the <strong>EVM</strong> — the VVPAT will display your choice. You can view a sample ballot paper.',
    ],
    cta: { label: 'View Ballot Paper →', href: 'javascript:window.viewBallots()' },
  },
];

// Global mocks for specific features
window.viewCandidates = function() {
  const query = document.getElementById("locator-input") ? document.getElementById("locator-input").value.trim() || "110022" : "110022";
  const data = window.DataStore.candidates[query];
  if(data) {
     alert("CANDIDATES IN YOUR CONSTITUENCY (" + query + "):\n\n" + data.map(c => `• ${c.name} (${c.party})`).join("\n"));
  } else {
     alert("No candidate data found for " + query + ". Try 110022.");
  }
}

window.viewBallots = function() {
  const query = document.getElementById("locator-input") ? document.getElementById("locator-input").value.trim() || "110022" : "110022";
  const data = window.DataStore.ballots[query];
  if(data) {
     alert("SAMPLE BALLOT PAPER (" + query + "):\n\n" + data.map(b => `${b.position}. ${b.name} | ${b.party}`).join("\n"));
  } else {
     alert("No ballot data found for " + query + ". Try 110022.");
  }
}

let currentStep = 0;

const stepperCard     = document.getElementById('stepper-card');
const stepperBar      = document.getElementById('stepper-bar');
const progressLabel   = document.getElementById('stepper-progress-label');
const backBtn         = document.getElementById('stepper-back');
const nextBtn         = document.getElementById('stepper-next');

function renderStep(index) {
  const step  = STEPS[index];
  const total = STEPS.length;

  // Update progress bar
  const pct = Math.round(((index + 1) / total) * 100);
  stepperBar.style.width = `${pct}%`;
  stepperBar.setAttribute('aria-valuenow', index + 1);
  progressLabel.textContent = `Step ${index + 1} of ${total}`;

  // Update nav indicator states
  document.querySelectorAll('.stepper-nav__item').forEach((item, i) => {
    item.classList.remove('stepper-nav__item--active', 'stepper-nav__item--done');
    if (i === index) item.classList.add('stepper-nav__item--active');
    else if (i < index) item.classList.add('stepper-nav__item--done');

    // Replace number with check icon for done steps
    const circle = item.querySelector('.stepper-nav__circle');
    if (i < index) {
      circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else {
      circle.textContent = i + 1;
    }
  });

  // Render card content
  stepperCard.className = 'stepper-card';
  stepperCard.innerHTML = `
    <div class="stepper-card__header">
      <div class="stepper-card__icon-wrap" aria-hidden="true">${step.icon}</div>
      <div>
        <p class="stepper-card__step-label">Step ${index + 1} of ${total}</p>
        <h3 class="stepper-card__title">${step.title}</h3>
      </div>
    </div>
    <ul class="stepper-card__bullets" aria-label="Key points">
      ${step.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
    <a href="${step.cta.href}" class="stepper-card__cta" id="stepper-cta-${index}">${step.cta.label}</a>
  `;

  // Button states
  backBtn.disabled = index === 0;
  nextBtn.textContent = index === total - 1 ? '✓ I\'m Ready to Vote!' : 'Next Step →';
}

function goTo(index) {
  currentStep = index;
  renderStep(currentStep);
}

function showComplete() {
  stepperBar.style.width = '100%';
  progressLabel.textContent = 'All steps complete!';
  stepperCard.className = 'stepper-card stepper-card--complete';
  stepperCard.innerHTML = `
    <div class="stepper-card__done-icon" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <h3>You're All Set!</h3>
    <p>You've completed all 5 steps of your voting journey.<br/>Head to your polling booth on election day and make your vote count. 🇮🇳</p>
  `;
  backBtn.disabled = false;
  nextBtn.textContent = 'Next Step →';
  nextBtn.disabled = true;

  // Mark all nav items done
  document.querySelectorAll('.stepper-nav__item').forEach(item => {
    item.classList.remove('stepper-nav__item--active');
    item.classList.add('stepper-nav__item--done');
    const circle = item.querySelector('.stepper-nav__circle');
    circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
  });
}

nextBtn.addEventListener('click', () => {
  if (currentStep < STEPS.length - 1) {
    goTo(currentStep + 1);
  } else {
    showComplete();
  }
});

backBtn.addEventListener('click', () => {
  if (nextBtn.disabled) nextBtn.disabled = false;  // re-enable after complete
  if (currentStep > 0) goTo(currentStep - 1);
});

// Allow clicking nav items directly
document.getElementById('stepper-nav').addEventListener('click', (e) => {
  const item = e.target.closest('.stepper-nav__item');
  if (!item) return;
  const step = parseInt(item.dataset.step, 10);
  if (!isNaN(step)) { nextBtn.disabled = false; goTo(step); }
});

// Initialise
renderStep(0);


const FAQ_RESPONSES = {
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

// ── DOM refs ──────────────────────────────────────────────────────────────────
const chatBody   = document.getElementById('chat-body');
const chatForm   = document.getElementById('chat-form');
const chatInput  = document.getElementById('chat-input');
const faqList    = document.getElementById('faq-list');

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(text, role) {
  const msg = document.createElement('div');
  msg.className = `chat-msg chat-msg--${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-msg__bubble';
  bubble.innerHTML = text;

  const time = document.createElement('span');
  time.className = 'chat-msg__time';
  time.textContent = formatTime(new Date());

  msg.appendChild(bubble);
  msg.appendChild(time);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(question) {
  // Feature 5/6: Check for Zip code search
  if (/^\d{6}$/.test(question.trim())) {
    const q = question.trim();
    const data = window.DataStore && window.DataStore.booths ? window.DataStore.booths[q] : null;
    
    setTimeout(() => {
      if (data && data.length > 0) {
        const bullets = data.slice(0,3).map(b => `<li><strong>${b.name}</strong><br/>${b.address} (${b.distance})</li>`).join('');
        appendMessage(`<p>Here are the polling booths near ZIP ${q}:</p><ul>${bullets}</ul><p style="font-size:0.8rem;opacity:0.8;">📍 I have synced the Map to this location!</p>`, 'bot');
        if(typeof window.triggerMapSearch === 'function') window.triggerMapSearch(q);
      } else {
        appendMessage(`<p>We couldn't find any booths for ZIP ${q}.</p><ul><li>Ensure it is an Indian 6-digit PIN.</li><li>Call Election Helpline at 1950.</li></ul>`, 'bot');
      }
    }, 600);
    return;
  }

  const answer = FAQ_RESPONSES[question] ||
    "I don't have a specific answer for that right now. Please call the Election Helpline at <b>1950</b> for personalised assistance.";

  // Simulate a short typing delay
  setTimeout(() => {
    appendMessage(answer, 'bot');
  }, 600);
}

// ── Chat send ─────────────────────────────────────────────────────────────────
chatForm.addEventListener('submit', () => {
  const q = chatInput.value.trim();
  if (!q) return;
  appendMessage(q, 'user');
  chatInput.value = '';
  botReply(q);
});

// Allow Enter key (form submit handles it, but keep for safety)
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    chatForm.dispatchEvent(new Event('submit'));
  }
});

// ── FAQ chip clicks ───────────────────────────────────────────────────────────
faqList.addEventListener('click', (e) => {
  const chip = e.target.closest('.faq-chip');
  if (!chip) return;
  const question = chip.dataset.question;
  appendMessage(question, 'user');
  botReply(question);
  // Scroll chat into view on mobile
  chatBody.scrollTop = chatBody.scrollHeight;
});

// ── Language selector (UI only — no i18n logic yet) ──────────────────────────
const langSelect = document.getElementById('language-select');
langSelect.addEventListener('change', () => {
  const lang = langSelect.value;
  const langNames = { en:'English', hi:'Hindi', mr:'Marathi', ta:'Tamil', te:'Telugu', bn:'Bengali' };
  appendMessage(
    `Language changed to <b>${langNames[lang] || lang}</b>. Full translation coming soon!`,
    'bot'
  );
});

// ── Help button ───────────────────────────────────────────────────────────────
document.getElementById('help-btn').addEventListener('click', () => {
  document.getElementById('ask-assistant').scrollIntoView({ behavior: 'smooth' });
  chatInput.focus();
});

// ============================================================
// FLOATING CHATBOT MODULE (AskDISHA Style)
// ============================================================

const FLOAT_RESPONSES = {
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

// Fallback bullet response for unknown questions
const FLOAT_FALLBACK = {
  intro: "I couldn't find an exact answer, but here's what you can do:",
  bullets: [
    "Call the <strong>Election Helpline: 1950</strong> (toll-free, 24×7).",
    "Visit <strong>eci.gov.in</strong> for official election information.",
    "Check the <em>FAQ section</em> on the NVSP portal.",
  ],
  note: null,
};

// ── DOM refs ──
const fabBtn         = document.getElementById('fab-chat-btn');
const fabBadge       = document.getElementById('fab-badge');
const floatChat      = document.getElementById('float-chat');
const floatBody      = document.getElementById('float-chat-body');
const floatForm      = document.getElementById('float-chat-form');
const floatInput     = document.getElementById('float-chat-input');
const floatClose     = document.getElementById('float-close');
const floatMinimize  = document.getElementById('float-minimize');
const floatSuggestions = document.getElementById('float-suggestions');

let floatOpen      = false;
let floatMinimized = false;

// ── Helpers ──
function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function floatAppendMsg(htmlContent, role) {
  const row = document.createElement('div');
  row.className = `fchat-msg fchat-msg--${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'fchat-msg__bubble';
  bubble.innerHTML = htmlContent;

  const time = document.createElement('span');
  time.className = 'fchat-msg__time';
  time.textContent = nowTime();

  row.appendChild(bubble);
  row.appendChild(time);
  floatBody.appendChild(row);
  floatBody.scrollTop = floatBody.scrollHeight;
  return row;
}

function buildBotHTML(resp) {
  const bulletHtml = resp.bullets
    .map(b => `<li>${b}</li>`)
    .join('');
  let html = `<p>${resp.intro}</p><ul>${bulletHtml}</ul>`;
  if (resp.note) html += `<p style="margin-top:.45rem;font-size:.78rem;opacity:.7">ℹ️ ${resp.note}</p>`;
  return html;
}

// Show typing indicator, return the node so we can remove it
function showTyping() {
  const row = document.createElement('div');
  row.className = 'fchat-msg fchat-msg--bot fchat-typing';
  row.innerHTML = `<div class="fchat-msg__bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  floatBody.appendChild(row);
  floatBody.scrollTop = floatBody.scrollHeight;
  return row;
}

function floatBotReply(question) {
  const typing = showTyping();
  const delay  = 850 + Math.random() * 400;

  setTimeout(() => {
    floatBody.removeChild(typing);

    // Sync Feature via zip search
    if (/^\d{6}$/.test(question.trim())) {
      const q = question.trim();
      const data = window.DataStore && window.DataStore.booths ? window.DataStore.booths[q] : null;
      if (data && data.length > 0) {
        floatAppendMsg(buildBotHTML({
          intro: `Here are the polling booths near ZIP ${q}:`,
          bullets: data.slice(0,3).map(b => `<strong>${b.name}</strong><br/>${b.address} (${b.distance})`),
          note: "I have updated your map below to highlight these locations! 📍"
        }), 'bot');
        if (typeof window.triggerMapSearch === 'function') setTimeout(() => window.triggerMapSearch(q), 500);
      } else {
         floatAppendMsg(buildBotHTML({
            intro: `We couldn't find any polling booths for ZIP ${q} in our system.`,
            bullets: ["Please check if the ZIP is correct.", "Contact the Election Helpline at 1950", "Use the state search tool."],
            note: "No results matched."
         }), 'bot');
      }
      return;
    }

    const resp = FLOAT_RESPONSES[question] || FLOAT_FALLBACK;
    floatAppendMsg(buildBotHTML(resp), 'bot');
  }, delay);
}

// ── Open / close ──
function openChat() {
  floatOpen = true;
  floatMinimized = false;
  floatChat.classList.add('float-chat--open');
  floatChat.classList.remove('float-chat--minimized');
  floatChat.setAttribute('aria-hidden', 'false');
  fabBtn.setAttribute('aria-expanded', 'true');
  fabBtn.classList.add('fab--open');
  // Toggle icons
  fabBtn.querySelector('.fab__icon--chat').style.display  = 'none';
  fabBtn.querySelector('.fab__icon--close').style.display = 'flex';
  // Dismiss badge
  fabBadge.classList.add('fab__badge--hidden');
  // Focus input
  setTimeout(() => floatInput.focus(), 280);
}

function closeChat() {
  floatOpen = false;
  floatChat.classList.remove('float-chat--open', 'float-chat--minimized');
  floatChat.setAttribute('aria-hidden', 'true');
  fabBtn.setAttribute('aria-expanded', 'false');
  fabBtn.classList.remove('fab--open');
  fabBtn.querySelector('.fab__icon--chat').style.display  = 'flex';
  fabBtn.querySelector('.fab__icon--close').style.display = 'none';
  fabBtn.focus();
}

function minimizeChat() {
  floatMinimized = !floatMinimized;
  floatChat.classList.toggle('float-chat--minimized', floatMinimized);
}

// ── Initialise welcome message ──
floatAppendMsg(
  `<p>👋 <strong>Namaste!</strong> I'm your ECI Election Assistant.</p><p>Ask me anything about <em>voter registration</em>, <em>polling booths</em>, or <em>election day</em>.</p>`,
  'bot'
);

// ── Event listeners ──
fabBtn.addEventListener('click', () => {
  floatOpen ? closeChat() : openChat();
});

floatClose.addEventListener('click', closeChat);
floatMinimize.addEventListener('click', minimizeChat);

floatForm.addEventListener('submit', () => {
  const q = floatInput.value.trim();
  if (!q) return;
  floatAppendMsg(q, 'user');
  floatInput.value = '';
  // Hide suggestions after first user message
  floatSuggestions.style.display = 'none';
  floatBotReply(q);
});

floatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    floatForm.dispatchEvent(new Event('submit'));
  }
});

// Handle preloaded chip clicks
floatSuggestions.addEventListener('click', (e) => {
  const chip = e.target.closest('.float-chip');
  if (!chip) return;
  const q = chip.dataset.q;
  chip.classList.add('float-chip--used');
  floatAppendMsg(q, 'user');
  floatBotReply(q);
  // Hide suggestions after first chip click
  setTimeout(() => { floatSuggestions.style.display = 'none'; }, 200);
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && floatOpen) closeChat();
});

// ============================================================
// BOTTOM NAVIGATION
// ============================================================
const bottomNavItems = document.querySelectorAll('.bottom-nav__item');

bottomNavItems.forEach(item => {
  item.addEventListener('click', function(e) {
    if(this.getAttribute('href') !== '#ask-assistant') {
      bottomNavItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    } else {
      e.preventDefault();
      floatOpen ? closeChat() : openChat();
    }
  });
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash || '#dashboard';
  bottomNavItems.forEach(nav => {
    if(nav.getAttribute('href') === hash) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });
});

