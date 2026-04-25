/* ============================================================
   Assistant Component (Chat)
   ============================================================ */

import { escapeHTML, nowTime } from '../utils/helpers.js';

// Helper for chat time (was missing in previous helpers.js, added here or should update helpers.js)
const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export class Assistant {
  constructor(config) {
    this.body = document.getElementById(config.bodyId);
    this.form = document.getElementById(config.formId);
    this.input = document.getElementById(config.inputId);
    this.responses = config.responses;
    this.fallback = config.fallback;
    this.type = config.type; // 'main' or 'float'

    if (this.body && this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSend();
    });

    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          this.handleSend();
        }
      });
    }
  }

  handleSend() {
    const q = this.input.value.trim();
    if (!q) return;
    this.appendMessage(q, 'user');
    this.input.value = '';
    
    if (this.type === 'float') {
        const suggestions = document.getElementById('float-suggestions');
        if (suggestions) suggestions.style.display = 'none';
    }

    this.botReply(q);
  }

  appendMessage(text, role) {
    const msg = document.createElement('div');
    msg.className = this.type === 'main' ? `chat-msg chat-msg--${role}` : `fchat-msg fchat-msg--${role}`;

    const bubble = document.createElement('div');
    bubble.className = this.type === 'main' ? 'chat-msg__bubble' : 'fchat-msg__bubble';
    
    // SECURITY: Use textContent for user input, or carefully escape if using innerHTML
    if (role === 'user') {
        bubble.textContent = text;
    } else {
        bubble.innerHTML = text; // Bot responses can contain HTML bullets
    }

    const time = document.createElement('span');
    time.className = this.type === 'main' ? 'chat-msg__time' : 'fchat-msg__time';
    time.textContent = getTime();

    msg.appendChild(bubble);
    msg.appendChild(time);
    this.body.appendChild(msg);
    this.body.scrollTop = this.body.scrollHeight;
  }

  botReply(question) {
    const typing = this.showTyping();
    const delay = 600 + Math.random() * 400;

    setTimeout(() => {
      if (typing && typing.parentNode) {
        this.body.removeChild(typing);
      }

      // Check for ZIP search
      if (/^\d{6}$/.test(question.trim())) {
        this.handleZipSearch(question.trim());
        return;
      }

      const resp = this.responses[question] || this.fallback;
      const html = typeof resp === 'string' ? resp : this.buildBotHTML(resp);
      this.appendMessage(html, 'bot');
    }, delay);
  }

  showTyping() {
    const row = document.createElement('div');
    row.className = this.type === 'main' ? 'chat-msg chat-msg--bot chat-typing' : 'fchat-msg fchat-msg--bot fchat-typing';
    const bubble = document.createElement('div');
    bubble.className = this.type === 'main' ? 'chat-msg__bubble' : 'fchat-msg__bubble';
    bubble.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    row.appendChild(bubble);
    this.body.appendChild(row);
    this.body.scrollTop = this.body.scrollHeight;
    return row;
  }

  buildBotHTML(resp) {
    if (!resp.bullets) return resp.intro || resp;
    const bulletHtml = resp.bullets
      .map(b => `<li>${b}</li>`)
      .join('');
    let html = `<p>${resp.intro}</p><ul>${bulletHtml}</ul>`;
    if (resp.note) html += `<p style="margin-top:.45rem;font-size:.78rem;opacity:.7">ℹ️ ${resp.note}</p>`;
    return html;
  }

  handleZipSearch(zip) {
    import('../utils/helpers.js').then(({ isValidPin, escapeHTML }) => {
      if (!isValidPin(zip)) {
        this.appendMessage(`<p>Please enter a valid 6-digit Indian PIN code.</p>`, 'bot');
        return;
      }

      const data = window.DataStore && window.DataStore.booths ? window.DataStore.booths[zip] : null;
      if (data && data.length > 0) {
        const bullets = data.slice(0, 3).map(b => `<li><strong>${escapeHTML(b.name)}</strong><br/>${escapeHTML(b.address)} (${escapeHTML(b.distance)})</li>`).join('');
        const note = this.type === 'float' ? "I have updated your map below to highlight these locations! 📍" : "I have synced the Map to this location!";
        this.appendMessage(`<p>Here are the polling booths near ZIP ${escapeHTML(zip)}:</p><ul>${bullets}</ul><p style="font-size:0.8rem;opacity:0.8;">${note}</p>`, 'bot');
        if (typeof window.triggerMapSearch === 'function') setTimeout(() => window.triggerMapSearch(zip), 500);
      } else {
        this.appendMessage(`<p>We couldn't find any booths for ZIP ${escapeHTML(zip)}.</p><ul><li>Ensure the PIN is correct.</li><li>Call Election Helpline at 1950.</li></ul>`, 'bot');
      }
    });
  }
}
