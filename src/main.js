/* ============================================================
   Election Guide — main.js
   ============================================================ */

import { DataStore, STEPS, FAQ_RESPONSES, FLOAT_RESPONSES } from './data/mock-data.js';
import { Onboarding } from './components/Onboarding.js';
import { Stepper } from './components/Stepper.js';
import { Assistant } from './components/Assistant.js';
import { PollingMap } from './components/Map.js';

// Expose DataStore globally for backward compatibility or cross-module access if needed
window.DataStore = DataStore;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Onboarding
    const onboarding = new Onboarding();

    // 2. Initialize Voting Journey Stepper
    const stepper = new Stepper(STEPS);

    // 3. Initialize Main Chat Assistant
    const mainAssistant = new Assistant({
        bodyId: 'chat-body',
        formId: 'chat-form',
        inputId: 'chat-input',
        responses: FAQ_RESPONSES,
        fallback: "I don't have a specific answer for that right now. Please call the Election Helpline at <b>1950</b> for personalised assistance.",
        type: 'main'
    });

    // 4. Initialize Polling Map
    const pollingMap = new PollingMap();
    window.initBoothMap = () => pollingMap.initGoogleMap();
    window.triggerMapSearch = (zip) => pollingMap.triggerMapSearch ? pollingMap.triggerMapSearch(zip) : pollingMap.input.value = zip; // simple fallback

    // 5. Initialize Floating Assistant
    const floatAssistant = new Assistant({
        bodyId: 'float-chat-body',
        formId: 'float-chat-form',
        inputId: 'float-chat-input',
        responses: FLOAT_RESPONSES,
        fallback: {
            intro: "I couldn't find an exact answer, but here's what you can do:",
            bullets: [
                "Call the <strong>Election Helpline: 1950</strong> (toll-free, 24×7).",
                "Visit <strong>eci.gov.in</strong> for official election information.",
                "Check the <em>FAQ section</em> on the NVSP portal.",
            ],
            note: null,
        },
        type: 'float'
    });

    // 6. Floating Chat UI Logic (Fab, Minimize, Close)
    const fabBtn = document.getElementById('fab-chat-btn');
    const floatChat = document.getElementById('float-chat');
    const floatClose = document.getElementById('float-close');
    const floatMinimize = document.getElementById('float-minimize');
    const fabBadge = document.getElementById('fab-badge');

    const toggleChat = () => {
        const isOpen = floatChat.classList.toggle('float-chat--open');
        floatChat.setAttribute('aria-hidden', !isOpen);
        fabBtn.setAttribute('aria-expanded', isOpen);
        fabBtn.classList.toggle('fab--open', isOpen);
        fabBtn.querySelector('.fab__icon--chat').style.display = isOpen ? 'none' : 'flex';
        fabBtn.querySelector('.fab__icon--close').style.display = isOpen ? 'flex' : 'none';
        if (isOpen) {
            fabBadge.classList.add('fab__badge--hidden');
            document.getElementById('float-chat-input').focus();
        }
    };

    if (fabBtn) fabBtn.addEventListener('click', toggleChat);
    if (floatClose) floatClose.addEventListener('click', toggleChat);
    if (floatMinimize) floatMinimize.addEventListener('click', () => floatChat.classList.toggle('float-chat--minimized'));

    // 7. Language Selector
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            const lang = langSelect.value;
            const langNames = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali' };
            mainAssistant.appendMessage(`Language changed to <b>${langNames[lang] || lang}</b>. Full translation coming soon!`, 'bot');
        });
    }

    // 8. Bottom Nav & Hash Routing
    const bottomNavItems = document.querySelectorAll('.bottom-nav__item');
    const updateActiveNav = () => {
        const hash = window.location.hash || '#dashboard';
        bottomNavItems.forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('href') === hash);
        });
    };

    bottomNavItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#ask-assistant') {
                e.preventDefault();
                toggleChat();
            }
        });
    });

    window.addEventListener('hashchange', updateActiveNav);
    updateActiveNav();
});
