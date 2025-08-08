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
// Register the question edit component so it can be used dynamically
import '../question/edit/x-question-edit';

export class XPageEdit extends HTMLElement {
  private shadow: ShadowRoot;
  private pageId: string | null = null;
  private page: QcmPageRead | null = null;

  // Track the question currently being edited; if null and creatingQuestion is
  // false, the questions list will be shown. When set, the question
  // editor will be displayed instead.
  private editingQuestionId: string | null = null;
  // Flag indicating that a new question is being created. When true, the
  // question editor is shown without an existing question-id.
  private creatingQuestion: boolean = false;

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
    // Bind add question button
    const addBtn = this.shadow.getElementById('addQuestion') as HTMLButtonElement | null;
    if (addBtn) addBtn.addEventListener('click', () => this.handleAddQuestion());
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
      // Include auth token if available
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`http://localhost:3000/page/${this.pageId}`, { headers });
      if (!resp.ok) {
        throw new Error(`Failed to load page: ${resp.statusText}`);
      }
      this.page = (await resp.json()) as QcmPageRead;
      const nameInput = this.shadow.getElementById('pageName') as HTMLInputElement | null;
      if (nameInput) nameInput.value = this.page.name;
      if (errorEl) errorEl.textContent = '';

      // After loading, render questions list/editor
      this.renderQuestionsList();
      this.renderQuestionEditor();
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
      const token = localStorage.getItem('accessToken');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/page/${this.pageId}`, {
        method: 'PATCH',
        headers,
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
      // Refresh the questions list since updating the page metadata should
      // not affect the questions, but ensures consistency if needed.
      this.renderQuestionsList();
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

  /**
   * Renders the list of questions with edit and delete actions. If
   * editing or creating a question, the list is cleared.
   */
  private renderQuestionsList() {
    const listContainer = this.shadow.getElementById('questionsList');
    if (!listContainer) return;
    // Clear list when editing or creating
    if (this.editingQuestionId || this.creatingQuestion) {
      listContainer.innerHTML = '';
      return;
    }
    const questions = this.page?.questions ?? [];
    listContainer.innerHTML = '';
    questions.forEach((question, index) => {
      const row = document.createElement('div');
      row.className = 'question-row';
      // Question text
      const textSpan = document.createElement('span');
      textSpan.className = 'question-text';
      textSpan.textContent = question.text;
      row.appendChild(textSpan);
      // Actions container
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'question-actions';
      // Move up button
      const upBtn = document.createElement('button');
      upBtn.className = 'move-up-question-button';
      upBtn.textContent = '↑';
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', () => {
        this.handleMoveQuestion(question.id, 'up');
      });
      actionsDiv.appendChild(upBtn);
      // Move down button
      const downBtn = document.createElement('button');
      downBtn.className = 'move-down-question-button';
      downBtn.textContent = '↓';
      downBtn.disabled = index === questions.length - 1;
      downBtn.addEventListener('click', () => {
        this.handleMoveQuestion(question.id, 'down');
      });
      actionsDiv.appendChild(downBtn);
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-question-button';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        this.editingQuestionId = question.id;
        this.creatingQuestion = false;
        this.renderQuestionsList();
        this.renderQuestionEditor();
      });
      actionsDiv.appendChild(editBtn);
      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-question-button';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        this.handleDeleteQuestion(question.id);
      });
      actionsDiv.appendChild(delBtn);
      // Append actions container
      row.appendChild(actionsDiv);
      listContainer.appendChild(row);
    });
  }

  /**
   * Renders the question editor when editing or creating a question. If
   * neither editing nor creating, clears the editor container.
   */
  private renderQuestionEditor() {
    const container = this.shadow.getElementById('questionEditorContainer');
    if (!container) return;
    container.innerHTML = '';
    if (!this.pageId) return;
    if (!this.editingQuestionId && !this.creatingQuestion) {
      return;
    }
    const questionEdit = document.createElement('x-question-edit');
    if (this.editingQuestionId) {
      questionEdit.setAttribute('question-id', this.editingQuestionId);
    }
    questionEdit.setAttribute('page-id', this.pageId);
    questionEdit.addEventListener('question-updated', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const updated = detail.question as any;
      if (this.page) {
        const idx = this.page.questions.findIndex((q) => q.id === updated.id);
        if (idx !== -1) {
          this.page.questions[idx] = updated;
        }
      }
      this.editingQuestionId = null;
      this.creatingQuestion = false;
      this.renderQuestionsList();
      this.renderQuestionEditor();
    });
    questionEdit.addEventListener('question-created', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const created = detail.question as any;
      if (this.page) {
        this.page.questions.push(created);
      }
      this.editingQuestionId = null;
      this.creatingQuestion = false;
      this.renderQuestionsList();
      this.renderQuestionEditor();
    });
    questionEdit.addEventListener('edit-cancel', () => {
      this.editingQuestionId = null;
      this.creatingQuestion = false;
      this.renderQuestionsList();
      this.renderQuestionEditor();
    });
    container.appendChild(questionEdit);
  }

  /**
   * Initiates the creation of a new question. Sets flags and triggers
   * rendering of the question editor.
   */
  private handleAddQuestion() {
    this.creatingQuestion = true;
    this.editingQuestionId = null;
    this.renderQuestionsList();
    this.renderQuestionEditor();
  }

  /**
   * Handles deletion of a question. Confirms with the user, performs
   * the API call, updates local state and re-renders.
   */
  private async handleDeleteQuestion(questionId: string) {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`http://localhost:3000/question/${questionId}`, {
        method: 'DELETE',
        headers,
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(`Failed to delete question: ${msg}`);
      }
      if (this.page) {
        this.page.questions = this.page.questions.filter((q) => q.id !== questionId);
      }
      this.renderQuestionsList();
    } catch (err) {
      console.error('Error deleting question', err);
      const errorEl = this.shadow.getElementById('error');
      if (errorEl) errorEl.textContent = 'Error deleting question.';
    }
  }

  /**
   * Handles reordering of a question within the current page. Sends a
   * PATCH request to the backend specifying the direction ('up' or
   * 'down'). On success, updates the local array of questions to
   * reflect the new order and re-renders the list. Errors are
   * surfaced via the error element.
   *
   * @param questionId Identifier of the question to move
   * @param direction  'up' to move the question up, 'down' to move it down
   */
  private async handleMoveQuestion(questionId: string, direction: 'up' | 'down') {
    const errorEl = this.shadow.getElementById('error');
    if (!questionId || !direction) {
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`http://localhost:3000/question/${questionId}/reorder`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ direction }),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(`Failed to reorder question: ${msg}`);
      }
      // Locally reorder questions: find index and swap with neighbor
      if (this.page) {
        const idx = this.page.questions.findIndex((q) => q.id === questionId);
        if (idx !== -1) {
          const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (swapIdx >= 0 && swapIdx < this.page.questions.length) {
            const temp = this.page.questions[idx];
            this.page.questions[idx] = this.page.questions[swapIdx];
            this.page.questions[swapIdx] = temp;
          }
        }
      }
      this.renderQuestionsList();
    } catch (err) {
      console.error('Error reordering question', err);
      if (errorEl) errorEl.textContent = 'Error reordering question.';
    }
  }
}

customElements.define('x-page-edit', XPageEdit);