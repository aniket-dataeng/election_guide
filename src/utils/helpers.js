/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validates if the input is a valid 6-digit Indian PIN code.
 * @param {string} pin 
 * @returns {boolean}
 */
export function isValidPin(pin) {
  return /^\d{6}$/.test(String(pin).trim());
}

/**
 * Debounce function to limit the rate of function execution.
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Gets current time in HH:MM format (24hr or locale dependent).
 * @returns {string}
 */
export function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
