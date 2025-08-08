/**
 * Purpose: Web Component for creating a new QCM.  This custom element
 * encapsulates a form defined in `template.html` and handles submission
 * to the backend API.  Upon successful creation it emits a
 * `qcm-created` event which can be used by parent components to refresh
 * the list or navigate elsewhere.
 * Inputs: Form fields for title, description, iconClass, difficulty and
 * passingThreshold.  Additional pages and questions are not included in
 * this initial implementation.
 * Outputs: Dispatches a 'qcm-created' CustomEvent on success.
 * Events: 'qcm-created'.
 * Errors: Logs errors to the console and does not emit the event if the
 * request fails.
 */

export class XQcmCreate extends HTMLElement {
  private shadow: ShadowRoot;
  private form: HTMLFormElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Load template HTML
    const template = document.createElement('template');
    template.innerHTML = (await this.fetchTemplate());
    this.shadow.appendChild(template.content.cloneNode(true));
    // Apply scoped styles
    const styleEl = document.createElement('style');
    styleEl.textContent = await this.fetchStyles();
    this.shadow.appendChild(styleEl);
    // Attach form handler
    this.form = this.shadow.querySelector<HTMLFormElement>('#qcm-create-form');
    if (this.form) {
      this.form.addEventListener('submit', this.onSubmit.bind(this));
    }
  }

  /**
   * Fetches the HTML template from the sibling template file.  In a real
   * build setup, you might import the template as a string or use a
   * bundler plugin.
   */
  private async fetchTemplate(): Promise<string> {
    // When using Vite or another bundler, this can be replaced with an
    // import statement such as `import template from './template.html?raw';`.
    const resp = await fetch(new URL('./template.html', import.meta.url));
    return await resp.text();
  }

  /**
   * Fetches the CSS styles from the sibling stylesheet.  See note above
   * regarding bundler support.
   */
  private async fetchStyles(): Promise<string> {
    const resp = await fetch(new URL('./styles.css', import.meta.url));
    return await resp.text();
  }

  private async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.form) return;
    const formData = new FormData(this.form);
    const title = (formData.get('title') || '').toString();
    if (!title) {
      // Basic validation for required title field
      console.warn('Le titre est obligatoire');
      return;
    }
    const body: Record<string, any> = {
      title,
    };
    const description = formData.get('description');
    if (description) body.description = description.toString();
    const iconClass = formData.get('iconClass');
    if (iconClass) body.iconClass = iconClass.toString();
    const difficulty = formData.get('difficulty');
    if (difficulty) body.difficultyLevel = difficulty.toString();
    const passingThreshold = formData.get('passingThreshold');
    if (passingThreshold) {
      const num = Number(passingThreshold);
      if (!Number.isNaN(num)) body.passingThreshold = num;
    }
    // For now we create an empty pages array.  Page creation will be
    // implemented in a future iteration.
    body.pages = [];
    try {
      const token = localStorage.getItem('accessToken');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch('http://localhost:3000/qcm', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('Erreur lors de la création du QCM', await response.text());
        return;
      }
      // Emit event to notify success
      this.dispatchEvent(new CustomEvent('qcm-created', { bubbles: true }));
      // Optionally reset the form
      this.form.reset();
    } catch (err) {
      console.error('Échec de la requête', err);
    }
  }
}

// Define the custom element when loaded in the browser
customElements.define('x-qcm-create', XQcmCreate);