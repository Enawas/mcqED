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
// Import page edit component to ensure it is registered
import '../../page/edit/x-page-edit';
// Import fetchWithAuth utility for authenticated requests with auto-refresh
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export class XQcmEdit extends HTMLElement {
  private shadow: ShadowRoot;
  private qcmId: string | null = null;
  private qcm: QcmRead | null = null;

  // Track the page being edited, if any. When not null, the page
  // edit component is displayed instead of the pages list.
  private editingPageId: string | null = null;

  /**
   * Moves a page up or down in the order. Sends a PATCH request to the
   * backend to reorder the page, then updates the local pages array and
   * re-renders the list. If the API call fails, logs the error and
   * displays a message in the component.
   */
  private async handleMovePage(pageId: string, direction: 'up' | 'down') {
    try {
      const resp = await fetchWithAuth(`http://localhost:3000/page/${pageId}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(`Failed to reorder page: ${msg}`);
      }
      // Update local pages order by swapping the positions in the array
      if (this.qcm) {
        const idx = this.qcm.pages.findIndex((p) => p.id === pageId);
        if (idx === -1) return;
        if (direction === 'up' && idx > 0) {
          const tmp = this.qcm.pages[idx - 1];
          this.qcm.pages[idx - 1] = this.qcm.pages[idx];
          this.qcm.pages[idx] = tmp;
        } else if (direction === 'down' && idx < this.qcm.pages.length - 1) {
          const tmp = this.qcm.pages[idx + 1];
          this.qcm.pages[idx + 1] = this.qcm.pages[idx];
          this.qcm.pages[idx] = tmp;
        }
      }
      this.renderPagesList();
    } catch (err) {
      console.error('Error reordering page', err);
      const errorEl = this.shadow.getElementById('error');
      if (errorEl) errorEl.textContent = 'Error reordering page.';
    }
  }

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
    // Bind add page button
    const addPageBtn = this.shadow.getElementById('addPage') as HTMLButtonElement | null;
    if (addPageBtn) {
      addPageBtn.addEventListener('click', () => this.handleAddPage());
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
      const response = await fetchWithAuth(
        `http://localhost:3000/qcm/${this.qcmId}`,
      );
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

    // Render the list of pages and the page editor (if any)
    this.renderPagesList();
    this.renderPageEditor();
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
      const response = await fetchWithAuth(`http://localhost:3000/qcm/${this.qcmId}`, {
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

  /**
   * Renders the list of pages in the QCM edit form. Each page is
   * displayed with its name and a rename button. Clicking the rename
   * button switches to the page editing mode.
   */
  private renderPagesList() {
    const listContainer = this.shadow.getElementById('pagesList');
    if (!listContainer) return;
    // Only render list if not currently editing a page
    if (this.editingPageId) {
      listContainer.innerHTML = '';
      return;
    }
    // Ensure qcm and pages exist
    const pages = this.qcm?.pages ?? [];
    // Build HTML for each page row
    listContainer.innerHTML = '';
    pages.forEach((page, index) => {
      const row = document.createElement('div');
      row.className = 'page-row';
      // Name element
      const nameSpan = document.createElement('span');
      nameSpan.className = 'page-name';
      nameSpan.textContent = page.name;
      row.appendChild(nameSpan);
      // Container for action buttons (move up/down, rename, delete)
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'page-actions';
      // Move up button (disabled for first)
      const upBtn = document.createElement('button');
      upBtn.className = 'move-up-button';
      upBtn.textContent = '↑';
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', () => {
        this.handleMovePage(page.id, 'up');
      });
      actionsContainer.appendChild(upBtn);
      // Move down button (disabled for last)
      const downBtn = document.createElement('button');
      downBtn.className = 'move-down-button';
      downBtn.textContent = '↓';
      downBtn.disabled = index === pages.length - 1;
      downBtn.addEventListener('click', () => {
        this.handleMovePage(page.id, 'down');
      });
      actionsContainer.appendChild(downBtn);
      // Rename button
      const renameBtn = document.createElement('button');
      renameBtn.className = 'rename-button';
      renameBtn.textContent = 'Rename';
      renameBtn.addEventListener('click', () => {
        this.editingPageId = page.id;
        this.renderPagesList();
        this.renderPageEditor();
      });
      actionsContainer.appendChild(renameBtn);
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-button';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        this.handleDeletePage(page.id);
      });
      actionsContainer.appendChild(deleteBtn);
      row.appendChild(actionsContainer);
      listContainer.appendChild(row);
    });
  }

  /**
   * Renders the page editing component when editingPageId is set.
   * Attaches event listeners for page-updated and edit-cancel to
   * handle updates and cancellations.
   */
  private renderPageEditor() {
    const editorContainer = this.shadow.getElementById('pageEditorContainer');
    if (!editorContainer) return;
    // Clear container first
    editorContainer.innerHTML = '';
    if (!this.editingPageId) {
      return;
    }
    // Create and insert the page edit component
    const pageEdit = document.createElement('x-page-edit');
    pageEdit.setAttribute('page-id', this.editingPageId);
    // Attach listeners for update and cancel
    pageEdit.addEventListener('page-updated', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const updatedPage = detail.page as any;
      // Update the local qcm pages with the new name
      if (this.qcm) {
        const idx = this.qcm.pages.findIndex((p) => p.id === updatedPage.id);
        if (idx !== -1) {
          this.qcm.pages[idx].name = updatedPage.name;
        }
      }
      // Exit editing mode and re-render list
      this.editingPageId = null;
      this.renderPagesList();
      this.renderPageEditor();
    });
    pageEdit.addEventListener('edit-cancel', () => {
      // Exit editing mode without changes
      this.editingPageId = null;
      this.renderPagesList();
      this.renderPageEditor();
    });
    editorContainer.appendChild(pageEdit);
  }

  /**
   * Handles the Add Page button click. Creates a new page via
   * the API with a default name (Page N) where N is the next number.
   * Updates local QCM state and re-renders the pages list.
   */
  private async handleAddPage() {
    if (!this.qcmId) return;
    // Determine default name based on current number of pages
    const num = (this.qcm?.pages.length ?? 0) + 1;
    const defaultName = `Page ${num}`;
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/qcm/${this.qcmId}/page`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: defaultName }),
        },
      );
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(`Failed to create page: ${msg}`);
      }
      const newPage = (await response.json()) as any;
      // Append to local QCM pages
      if (this.qcm) {
        this.qcm.pages.push({ id: newPage.id, name: newPage.name, questions: [] });
      }
      this.renderPagesList();
    } catch (err) {
      console.error('Error creating page', err);
      const errorEl = this.shadow.getElementById('error');
      if (errorEl) errorEl.textContent = 'Error creating page.';
    }
  }

  /**
   * Handles deletion of a page. Prompts the user for confirmation,
   * then calls the API to delete the page. Updates local state and
   * re-renders the pages list. If the page being deleted is currently
   * open in the editor, editing mode is cancelled.
   */
  private async handleDeletePage(pageId: string) {
    // Simple confirmation dialog
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }
    try {
      const resp = await fetchWithAuth(`http://localhost:3000/page/${pageId}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(`Failed to delete page: ${msg}`);
      }
      // Remove from local state
      if (this.qcm) {
        this.qcm.pages = this.qcm.pages.filter((p) => p.id !== pageId);
      }
      // If this page was being edited, cancel editing
      if (this.editingPageId === pageId) {
        this.editingPageId = null;
      }
      this.renderPagesList();
      this.renderPageEditor();
    } catch (err) {
      console.error('Error deleting page', err);
      const errorEl = this.shadow.getElementById('error');
      if (errorEl) errorEl.textContent = 'Error deleting page.';
    }
  }
}

// Register custom element
customElements.define('x-qcm-edit', XQcmEdit);