/**
 * Purpose: Web Component for importing QCMs. Provides a file input and
 * format selection. Reads the selected file and sends its contents to
 * the backend API. Emits a 'qcm-imported' event on success and
 * 'import-cancel' when cancelled.
 * Inputs: None (uses file input and select for format).
 * Outputs: Dispatches custom events on completion or cancellation.
 * Errors: Displays inline error messages for validation or network
 * failures.
 */

import { QcmRead } from '@packages/schemas/src/qcm';

export class XQcmImport extends HTMLElement {
  private shadow: ShadowRoot;
  private file: File | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads template and styles, binds event listeners, and sets initial state.
   */
  private async initialize() {
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    const fileInput = this.shadow.getElementById('fileInput') as HTMLInputElement | null;
    const formatSelect = this.shadow.getElementById('formatSelect') as HTMLSelectElement | null;
    const importBtn = this.shadow.getElementById('importBtn') as HTMLButtonElement | null;
    const cancelBtn = this.shadow.getElementById('cancelBtn') as HTMLButtonElement | null;
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.file = target.files && target.files.length > 0 ? target.files[0] : null;
      });
    }
    if (importBtn) importBtn.addEventListener('click', () => this.handleImport());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.handleCancel());
  }

  /**
   * Handles the import action. Reads the selected file, determines the
   * format, and sends it to the API. Emits a 'qcm-imported' event on
   * success.
   */
  private async handleImport() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.file) {
      if (errorEl) errorEl.textContent = 'Please select a file to import.';
      return;
    }
    // Determine the format from the select or file extension
    const formatSelect = this.shadow.getElementById('formatSelect') as HTMLSelectElement | null;
    let format: 'json' | 'xml' | 'auto' = 'auto';
    if (formatSelect) format = formatSelect.value as any;
    let chosenFormat: 'json' | 'xml';
    if (format === 'auto') {
      const ext = this.file.name.split('.').pop()?.toLowerCase();
      if (ext === 'xml') chosenFormat = 'xml';
      else chosenFormat = 'json';
    } else {
      chosenFormat = format as 'json' | 'xml';
    }
    // Read file contents as text
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result?.toString() || '';
      try {
        const response = await fetch('http://localhost:3000/qcm/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ format: chosenFormat, data }),
        });
        if (!response.ok) {
          const msg = await response.text();
          throw new Error(msg);
        }
        const qcm = (await response.json()) as QcmRead;
        // Emit event to notify parent about the imported QCM
        this.dispatchEvent(
          new CustomEvent('qcm-imported', { detail: { qcm }, bubbles: true })
        );
      } catch (err) {
        console.error('Import error', err);
        if (errorEl) errorEl.textContent = 'Failed to import QCM. Please check the file.';
      }
    };
    reader.onerror = () => {
      if (errorEl) errorEl.textContent = 'Failed to read the file.';
    };
    reader.readAsText(this.file);
  }

  /**
   * Handles the cancel action. Emits an 'import-cancel' event to inform
   * the parent component that the user wants to exit the import view.
   */
  private handleCancel() {
    this.dispatchEvent(new CustomEvent('import-cancel', { detail: {}, bubbles: true }));
  }
}

customElements.define('x-qcm-import', XQcmImport);