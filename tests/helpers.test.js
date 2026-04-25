import { describe, it, expect } from 'vitest';
import { escapeHTML, isValidPin } from '../src/utils/helpers.js';

describe('Utility Helpers', () => {
  describe('escapeHTML', () => {
    it('should escape biological tags', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      expect(escapeHTML(input)).toBe(expected);
    });

    it('should escape special characters', () => {
      const input = '" & < >';
      const expected = '" &amp; &lt; &gt;'; // Note: innerHTML might not escape quotes sometimes depending on browser/jsdom
      // Actually textContent -> innerHTML escapes < > &
      expect(escapeHTML(input)).toContain('&amp;');
      expect(escapeHTML(input)).toContain('&lt;');
      expect(escapeHTML(input)).toContain('&gt;');
    });
  });

  describe('isValidPin', () => {
    it('should return true for valid 6-digit PIN', () => {
      expect(isValidPin('110022')).toBe(true);
      expect(isValidPin(' 400001 ')).toBe(true);
    });

    it('should return false for invalid PINs', () => {
      expect(isValidPin('12345')).toBe(false);
      expect(isValidPin('1234567')).toBe(false);
      expect(isValidPin('abc123')).toBe(false);
      expect(isValidPin('110 22')).toBe(false);
    });
  });
});
