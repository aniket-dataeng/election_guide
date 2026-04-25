/* ============================================================
   Stepper Component
   ============================================================ */

export class Stepper {
  constructor(steps) {
    this.steps = steps;
    this.currentStep = 0;
    
    this.card = document.getElementById('stepper-card');
    this.bar = document.getElementById('stepper-bar');
    this.label = document.getElementById('stepper-progress-label');
    this.backBtn = document.getElementById('stepper-back');
    this.nextBtn = document.getElementById('stepper-next');
    this.nav = document.getElementById('stepper-nav');

    if (this.card) {
      this.init();
    }
  }

  init() {
    this.renderStep(0);

    this.nextBtn.addEventListener('click', () => {
      if (this.currentStep < this.steps.length - 1) {
        this.goTo(this.currentStep + 1);
      } else {
        this.showComplete();
      }
    });

    this.backBtn.addEventListener('click', () => {
      if (this.nextBtn.disabled) this.nextBtn.disabled = false;
      if (this.currentStep > 0) this.goTo(this.currentStep - 1);
    });

    if (this.nav) {
      this.nav.addEventListener('click', (e) => {
        const item = e.target.closest('.stepper-nav__item');
        if (!item) return;
        const step = parseInt(item.dataset.step, 10);
        if (!isNaN(step)) {
          this.nextBtn.disabled = false;
          this.goTo(step);
        }
      });
    }
  }

  renderStep(index) {
    const step = this.steps[index];
    const total = this.steps.length;

    // Update progress bar
    const pct = Math.round(((index + 1) / total) * 100);
    this.bar.style.width = `${pct}%`;
    this.bar.setAttribute('aria-valuenow', index + 1);
    this.label.textContent = `Step ${index + 1} of ${total}`;

    // Update nav indicator states
    document.querySelectorAll('.stepper-nav__item').forEach((item, i) => {
      item.classList.remove('stepper-nav__item--active', 'stepper-nav__item--done');
      if (i === index) item.classList.add('stepper-nav__item--active');
      else if (i < index) item.classList.add('stepper-nav__item--done');

      const circle = item.querySelector('.stepper-nav__circle');
      if (i < index) {
        circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        circle.textContent = i + 1;
      }
    });

    // Render card content - Using textContent for security where possible, innerHTML for controlled SVG/markup
    this.card.className = 'stepper-card';
    this.card.innerHTML = '';
    
    const header = document.createElement('div');
    header.className = 'stepper-card__header';
    header.innerHTML = `
      <div class="stepper-card__icon-wrap" aria-hidden="true">${step.icon}</div>
      <div>
        <p class="stepper-card__step-label">Step ${index + 1} of ${total}</p>
        <h3 class="stepper-card__title">${step.title}</h3>
      </div>
    `;
    
    const bulletList = document.createElement('ul');
    bulletList.className = 'stepper-card__bullets';
    bulletList.setAttribute('aria-label', 'Key points');
    step.bullets.forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = b; // Be careful here, but these are controlled bullets
      bulletList.appendChild(li);
    });

    const cta = document.createElement('a');
    cta.href = step.cta.href;
    cta.className = 'stepper-card__cta';
    cta.id = `stepper-cta-${index}`;
    cta.textContent = step.cta.label;
    if (step.cta.href.startsWith('javascript:')) {
        cta.addEventListener('click', (e) => {
            // e.preventDefault();
            // Handle javascript: hrefs via logic if needed
        });
    }

    this.card.appendChild(header);
    this.card.appendChild(bulletList);
    this.card.appendChild(cta);

    // Button states
    this.backBtn.disabled = index === 0;
    this.nextBtn.textContent = index === total - 1 ? '✓ I\'m Ready to Vote!' : 'Next Step →';
  }

  goTo(index) {
    this.currentStep = index;
    this.renderStep(this.currentStep);
  }

  showComplete() {
    this.bar.style.width = '100%';
    this.label.textContent = 'All steps complete!';
    this.card.className = 'stepper-card stepper-card--complete';
    this.card.innerHTML = `
      <div class="stepper-card__done-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3>You're All Set!</h3>
      <p>You've completed all 5 steps of your voting journey.<br/>Head to your polling booth on election day and make your vote count. 🇮🇳</p>
    `;
    this.backBtn.disabled = false;
    this.nextBtn.textContent = 'Next Step →';
    this.nextBtn.disabled = true;

    // Mark all nav items done
    document.querySelectorAll('.stepper-nav__item').forEach(item => {
      item.classList.remove('stepper-nav__item--active');
      item.classList.add('stepper-nav__item--done');
      const circle = item.querySelector('.stepper-nav__circle');
      circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    });
  }
}
