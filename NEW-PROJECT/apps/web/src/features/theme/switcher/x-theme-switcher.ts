/**
 * Purpose: Web Component to toggle dark mode and colourblind mode on
 * the QCM application. It reads and writes preferences from
 * localStorage (`mcqed_theme` and `mcqed_colorblind`) and applies
 * them via data attributes on the document.documentElement.
 * Inputs: None (behaviour controlled via UI and localStorage).
 * Outputs: None (directly manipulates DOM and localStorage).
 * Events: None. Consumers listen for DOM changes if needed.
 * Errors: None.
 */

export class XThemeSwitcher extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads the template and styles, binds event handlers, and applies
   * the current theme and colourblind settings.
   */
  private async initialize() {
    // Fetch template and stylesheet relative to this module
    const templateUrl = new URL('./template.html', import.meta.url);
    const styleUrl = new URL('./styles.css', import.meta.url);
    const [html, css] = await Promise.all([
      fetch(templateUrl).then((res) => res.text()),
      fetch(styleUrl).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${css}</style>${html}`;
    // Initialise toggles based on stored preferences
    const darkToggle = this.shadow.getElementById('darkToggle') as HTMLInputElement | null;
    const cbToggle = this.shadow.getElementById('cbToggle') as HTMLInputElement | null;
    // Load theme from localStorage (default to light)
    const storedTheme = localStorage.getItem('mcqed_theme') || 'light';
    if (darkToggle) {
      darkToggle.checked = storedTheme === 'dark';
      darkToggle.addEventListener('change', () => this.toggleDarkMode());
    }
    // Load colourblind from localStorage (default to false)
    const storedCb = localStorage.getItem('mcqed_colorblind') === 'true';
    if (cbToggle) {
      cbToggle.checked = storedCb;
      cbToggle.addEventListener('change', () => this.toggleColourblind());
    }
    // Apply settings to the document
    this.applyTheme();
    this.applyColourblind();
  }

  /**
   * Toggles between dark and light themes and persists the new value.
   */
  private toggleDarkMode() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mcqed_theme', next);
    this.applyTheme();
  }

  /**
   * Toggles the colourblind mode and persists the new value.
   */
  private toggleColourblind() {
    const current = document.documentElement.getAttribute('data-colorblind') === 'true';
    const next = !current;
    localStorage.setItem('mcqed_colorblind', String(next));
    this.applyColourblind();
  }

  /**
   * Applies the saved theme to the root element and synchronises
   * the toggle state.
   */
  private applyTheme() {
    const theme = localStorage.getItem('mcqed_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const darkToggle = this.shadow.getElementById('darkToggle') as HTMLInputElement | null;
    if (darkToggle) {
      darkToggle.checked = theme === 'dark';
    }
  }

  /**
   * Applies the saved colourblind setting to the root element and
   * synchronises the toggle state.
   */
  private applyColourblind() {
    const colourblind = localStorage.getItem('mcqed_colorblind') === 'true';
    document.documentElement.setAttribute('data-colorblind', String(colourblind));
    const cbToggle = this.shadow.getElementById('cbToggle') as HTMLInputElement | null;
    if (cbToggle) {
      cbToggle.checked = colourblind;
    }
  }
}

// Register the custom element only if not already defined (avoid double
// registration during hot module replacement in development).
if (!customElements.get('x-theme-switcher')) {
  customElements.define('x-theme-switcher', XThemeSwitcher);
}