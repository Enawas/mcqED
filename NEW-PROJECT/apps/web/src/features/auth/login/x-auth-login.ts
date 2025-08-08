/**
 * Purpose: Web Component for user authentication. Presents a simple
 * login form, submits credentials to the backend API, stores the
 * returned JWT tokens in localStorage, and emits events on success
 * or failure. The component is self-contained: template and styles
 * are loaded dynamically and attached to a Shadow DOM.
 * Inputs: None (fields are captured via DOM elements).
 * Outputs: Emits 'login-success' on successful login.
 * Events: 'login-success', 'login-failure'.
 * Errors: Displays inline error messages for invalid credentials or
 * network failures.
 */

import { LoginInput, LoginResponse } from '@packages/schemas/src/users';

export class XAuthLogin extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.initialize();
  }

  private async initialize() {
    // Fetch template and styles
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    const loginBtn = this.shadow.getElementById('login') as HTMLButtonElement | null;
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }
  }

  /**
   * Reads form fields, validates inputs, sends login request to API,
   * stores tokens on success, and dispatches a custom event. Errors
   * are shown inline in the form.
   */
  private async handleLogin() {
    const emailInput = this.shadow.getElementById('email') as HTMLInputElement | null;
    const passwordInput = this.shadow.getElementById('password') as HTMLInputElement | null;
    const errorEl = this.shadow.getElementById('error');
    if (!emailInput || !passwordInput) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      if (errorEl) errorEl.textContent = 'Email and password are required.';
      return;
    }
    try {
      const body: LoginInput = { email, password };
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        // Attempt to parse error body
        const msg = await response.text();
        if (errorEl) errorEl.textContent = 'Invalid credentials.';
        this.dispatchEvent(new CustomEvent('login-failure', { detail: { message: msg }, bubbles: true }));
        return;
      }
      const data: LoginResponse = await response.json();
      // Store tokens in localStorage for later authenticated requests
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      // Clear error message
      if (errorEl) errorEl.textContent = '';
      // Emit success event
      this.dispatchEvent(new CustomEvent('login-success', { detail: {}, bubbles: true }));
    } catch (err) {
      console.error('Login error', err);
      if (errorEl) errorEl.textContent = 'Error logging in. Please try again.';
      this.dispatchEvent(new CustomEvent('login-failure', { detail: { message: 'Network error' }, bubbles: true }));
    }
  }
}

customElements.define('x-auth-login', XAuthLogin);