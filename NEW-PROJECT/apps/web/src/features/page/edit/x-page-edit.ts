/**
 * Purpose: Web Component for renaming an existing page. It loads
 * the page from the backend via GET /page/:id, displays the current
 * name, and allows the user to change it. On save, it sends a
 * PATCH request to /page/:id with the new name and emits
 * 'page-updated'. On cancel, it emits 'edit-cancel'.
 * Inputs: Attribute `page-id` specifying the page to edit.
 * Outputs: Custom events 'page-updated' and 'edit-cancel'.
 * Errors: Displays an error message when loading or updating fails.
 */

import { QcmPageRead } from '@packages/schemas/src/qcm';

export class XPageEdit extends HTMLElement {
  private shadow: ShadowRoot;
  private pageId: string | null = null;
  private page: QcmPageRead | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['page-id'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'page-id' && newValue !== oldValue) {
      this.pageId = newValue;
      if (this.isConnected) {
        this.loadPage();
      }
    }
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads template and styles, binds events, and triggers page load if ID exists.
   */
  private async initialize() {
    // Load template and styles
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    // Bind buttons
    const saveBtn = this.shadow.getElementById('save') as HTMLButtonElement | null;
    if (saveBtn) saveBtn.addEventListener('click', () => this.handleSave());
    const cancelBtn = this.shadow.getElementById('cancel') as HTMLButtonElement | null;
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.handleCancel());
    // Load page if ID provided
    await this.loadPage();
  }

  /**
   * Fetches the page data from the API and populates the form.
   */
  private async loadPage() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.pageId) {
      if (errorEl) errorEl.textContent = 'No page ID provided.';
      return;
    }
    try {
      const resp = await fetch(`http://localhost:3000/page/${this.pageId}`);
      if (!resp.ok) {
        throw new Error(`Failed to load page: ${resp.statusText}`);
      }
      this.page = (await resp.json()) as QcmPageRead;
      const nameInput = this.shadow.getElementById('pageName') as HTMLInputElement | null;
      if (nameInput) nameInput.value = this.page.name;
      if (errorEl) errorEl.textContent = '';
    } catch (err) {
      console.error('Error loading page', err);
      if (errorEl) errorEl.textContent = 'Error loading page.';
    }
  }

  /**
   * Handles the Save button click: validates the new name, sends
   * update request to the API, updates local state and emits event.
   */
  private async handleSave() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.pageId) {
      if (errorEl) errorEl.textContent = 'No page ID provided.';
      return;
    }
    const nameInput = this.shadow.getElementById('pageName') as HTMLInputElement | null;
    const newName = nameInput?.value.trim() || '';
    if (!newName) {
      if (errorEl) errorEl.textContent = 'Page name is required.';
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/page/${this.pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(`Failed to update page: ${msg}`);
      }
      const updated = (await response.json()) as QcmPageRead;
      this.page = updated;
      if (nameInput) nameInput.value = updated.name;
      if (errorEl) errorEl.textContent = '';
      this.dispatchEvent(
        new CustomEvent('page-updated', { detail: { page: updated }, bubbles: true }),
      );
    } catch (err) {
      console.error('Error updating page', err);
      if (errorEl) errorEl.textContent = 'Error updating page.';
    }
  }

  /**
   * Handles the Cancel button by emitting an edit-cancel event.
   */
  private handleCancel() {
    this.dispatchEvent(new CustomEvent('edit-cancel', { detail: {}, bubbles: true }));
  }
}

customElements.define('x-page-edit', XPageEdit);