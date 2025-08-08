/**
 * Purpose: Web Component that allows editing the metadata of an existing
 * QCM. Loads the QCM by its ID, populates the form fields, and
 * persists changes via the API. Emits events on save or cancel.
 * Inputs: Attribute `qcm-id` specifying the QCM to edit.
 * Outputs: Dispatches events:
 *  - 'qcm-updated' detail: { qcm: QcmRead }
 *  - 'edit-cancel' detail: {}
 * Events: See above.
 * Errors: Displays an error message within the component on failure.
 */

import { QcmRead, QcmUpdateInput } from '@packages/schemas/src/qcm';

export class XQcmEdit extends HTMLElement {
  private shadow: ShadowRoot;
  private qcmId: string | null = null;
  private qcm: QcmRead | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Observe changes to the qcm-id attribute so that the component can
   * reload when the identifier changes.
   */
  static get observedAttributes() {
    return ['qcm-id'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'qcm-id' && newValue !== oldValue) {
      this.qcmId = newValue;
      if (this.isConnected) {
        this.loadQcm();
      }
    }
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads template and styles, then fetches the QCM and populates the form.
   */
  private async initialize() {
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    // Bind button click handlers
    const saveBtn = this.shadow.getElementById('save') as HTMLButtonElement | null;
    const cancelBtn = this.shadow.getElementById('cancel') as HTMLButtonElement | null;
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.handleSave());
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.handleCancel());
    }
    // Attempt to load QCM if ID is already provided
    await this.loadQcm();
  }

  /**
   * Loads the QCM data from the API based on the qcmId attribute. Populates
   * the form fields with the loaded data. Displays an error if the fetch
   * fails or if qcmId is not set.
   */
  private async loadQcm() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.qcmId) {
      if (errorEl) errorEl.textContent = 'No QCM ID provided.';
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/qcm/${this.qcmId}`);
      if (!response.ok) {
        throw new Error(`Failed to load QCM: ${response.statusText}`);
      }
      this.qcm = (await response.json()) as QcmRead;
      this.populateForm();
      if (errorEl) errorEl.textContent = '';
    } catch (err: any) {
      console.error('Error loading QCM', err);
      if (errorEl) errorEl.textContent = 'Error loading QCM.';
    }
  }

  /**
   * Fills the form inputs with the loaded QCM data.
   */
  private populateForm() {
    if (!this.qcm) return;
    const titleInput = this.shadow.getElementById('title') as HTMLInputElement | null;
    const descTextarea = this.shadow.getElementById('description') as HTMLTextAreaElement | null;
    const iconInput = this.shadow.getElementById('icon') as HTMLInputElement | null;
    const statusSelect = this.shadow.getElementById('status') as HTMLSelectElement | null;
    const diffSelect = this.shadow.getElementById('difficulty') as HTMLSelectElement | null;
    const thresholdInput = this.shadow.getElementById('passingThreshold') as HTMLInputElement | null;
    if (titleInput) titleInput.value = this.qcm.title;
    if (descTextarea) descTextarea.value = this.qcm.description ?? '';
    if (iconInput) iconInput.value = this.qcm.iconClass ?? '';
    if (statusSelect) statusSelect.value = this.qcm.status;
    if (diffSelect) diffSelect.value = this.qcm.difficultyLevel ?? '';
    if (thresholdInput) thresholdInput.value = this.qcm.passingThreshold?.toString() ?? '';
  }

  /**
   * Gathers form values into a QcmUpdateInput-like object (excluding id and
   * pages) for sending to the server.
   */
  private gatherInput(): Omit<QcmUpdateInput, 'id' | 'pages'> {
    const titleInput = this.shadow.getElementById('title') as HTMLInputElement | null;
    const descTextarea = this.shadow.getElementById('description') as HTMLTextAreaElement | null;
    const iconInput = this.shadow.getElementById('icon') as HTMLInputElement | null;
    const statusSelect = this.shadow.getElementById('status') as HTMLSelectElement | null;
    const diffSelect = this.shadow.getElementById('difficulty') as HTMLSelectElement | null;
    const thresholdInput = this.shadow.getElementById('passingThreshold') as HTMLInputElement | null;
    const input: any = {};
    if (titleInput && titleInput.value.trim().length > 0) input.title = titleInput.value.trim();
    if (descTextarea) input.description = descTextarea.value.trim();
    if (iconInput) input.iconClass = iconInput.value.trim();
    if (statusSelect) input.status = statusSelect.value as any;
    if (diffSelect && diffSelect.value) input.difficultyLevel = diffSelect.value as any;
    if (thresholdInput && thresholdInput.value !== '')
      input.passingThreshold = parseInt(thresholdInput.value, 10);
    return input as Omit<QcmUpdateInput, 'id' | 'pages'>;
  }

  /**
   * Handles the save button click. Validates inputs, sends a PATCH
   * request to the API, and dispatches a 'qcm-updated' event with the
   * updated QCM on success.
   */
  private async handleSave() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.qcmId) {
      if (errorEl) errorEl.textContent = 'No QCM ID provided.';
      return;
    }
    const body = this.gatherInput();
    try {
      const response = await fetch(`http://localhost:3000/qcm/${this.qcmId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to update QCM: ${response.statusText}`);
      }
      const updated = (await response.json()) as QcmRead;
      this.qcm = updated;
      this.populateForm();
      if (errorEl) errorEl.textContent = '';
      this.dispatchEvent(
        new CustomEvent('qcm-updated', { detail: { qcm: updated }, bubbles: true }),
      );
    } catch (err: any) {
      console.error('Error updating QCM', err);
      if (errorEl) errorEl.textContent = 'Error updating QCM.';
    }
  }

  /**
   * Handles the cancel button click by dispatching an 'edit-cancel'
   * event to notify parent components. No changes are persisted.
   */
  private handleCancel() {
    this.dispatchEvent(new CustomEvent('edit-cancel', { detail: {}, bubbles: true }));
  }
}

// Register custom element
customElements.define('x-qcm-edit', XQcmEdit);