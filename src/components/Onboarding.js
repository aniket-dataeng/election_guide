/* ============================================================
   Onboarding Component
   ============================================================ */

export class Onboarding {
  constructor() {
    this.overlay = document.getElementById('onboard-overlay');
    this.steps = document.querySelectorAll('.onboard-step');
    this.title = document.getElementById('onboard-title');
    this.finishBtn = document.getElementById('onboard-finish');
    this.skipBtn = document.getElementById('onboard-skip');
    this.locSelect = document.getElementById('onboard-location');
    this.options = document.querySelectorAll('.onboard-opt');

    this.answers = {
      age: null,
      firstTime: null,
      location: null
    };

    if (this.overlay) {
      this.init();
    }
  }

  init() {
    this.options.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleOptionClick(e));
    });

    if (this.locSelect) {
      this.locSelect.addEventListener('change', (e) => {
        this.answers.location = e.target.value;
        this.checkValidity();
      });
    }

    if (this.finishBtn) {
      this.finishBtn.addEventListener('click', () => {
        this.close();
        document.getElementById('voting-journey').scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.close());
    }
  }

  handleOptionClick(e) {
    const step = e.target.closest('.onboard-step').id;
    const val = e.target.getAttribute('data-val');
    
    e.target.closest('.onboard-options').querySelectorAll('.onboard-opt').forEach(b => b.classList.remove('selected'));
    e.target.classList.add('selected');
    
    if (step === 'onboard-step-1') this.answers.age = val;
    if (step === 'onboard-step-2') this.answers.firstTime = val;
    
    this.checkValidity();
  }

  checkValidity() {
    if (this.answers.age === 'no') {
      alert("You must be 18 or older to vote.");
      this.answers.age = null;
      document.querySelectorAll('#onboard-step-1 .onboard-opt').forEach(b => b.classList.remove('selected'));
      return;
    }

    if (this.answers.age) {
        document.getElementById('onboard-step-1').classList.remove('active');
        document.getElementById('onboard-step-2').classList.add('active');
        this.title.textContent = "Almost there!";
    }
    
    if (this.answers.age && this.answers.firstTime) {
        document.getElementById('onboard-step-2').classList.remove('active');
        document.getElementById('onboard-step-3').classList.add('active');
        this.title.textContent = "Final Step";
    }

    if (this.finishBtn) {
      if (this.answers.age && this.answers.firstTime && this.answers.location) {
        this.finishBtn.removeAttribute('disabled');
      } else {
        this.finishBtn.setAttribute('disabled', 'true');
      }
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this.overlay.setAttribute('aria-hidden', 'true');
    }
  }
}
