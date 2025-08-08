/**
 * Purpose: Web Component that allows editing an existing question. It
 * loads the question from the API, renders a form with dynamic option
 * rows, and sends updates via the API. Emits events on save or
 * cancel so that parent components can react accordingly.
 * Inputs: Attribute `question-id` specifying the question to edit.
 * Outputs: Dispatches 'question-updated' and 'edit-cancel' events.
 * Events: See outputs.
 * Errors: Displays inline error messages for validation or network
 * failures.
 */

import {
  QuestionRead,
  QuestionUpdateInput,
  QuestionType,
} from '@packages/schemas/src/question';

interface OptionState {
  id: string;
  text: string;
  correct: boolean;
}

export class XQuestionEdit extends HTMLElement {
  private shadow: ShadowRoot;
  private questionId: string | null = null;
  private question: QuestionRead | null = null;
  private options: OptionState[] = [];

  // The page identifier to which this question belongs. When present
  // and questionId is not provided, a new question will be created
  // using POST /page/:pageId/question.
  private pageId: string | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['question-id', 'page-id'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'question-id' && newValue !== oldValue) {
      this.questionId = newValue;
      if (this.isConnected) {
        // Load question only if an ID is provided (editing); skip when undefined (creating)
        if (newValue) {
          this.loadQuestion();
        } else {
          // Clear any existing question state when switching to creation
          this.question = null;
          this.options = [];
        }
      }
    }
    if (name === 'page-id' && newValue !== oldValue) {
      this.pageId = newValue;
    }
  }

  async connectedCallback() {
    await this.initialize();
  }

  /**
   * Initializes the component by loading template and styles, binding
   * event handlers, and loading the question if an ID is provided.
   */
  private async initialize() {
    // Load and apply template and styles
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    // Bind button handlers
    const saveBtn = this.shadow.getElementById('save') as HTMLButtonElement | null;
    if (saveBtn) saveBtn.addEventListener('click', () => this.handleSave());
    const cancelBtn = this.shadow.getElementById('cancel') as HTMLButtonElement | null;
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.handleCancel());
    const addOptionBtn = this.shadow.getElementById('addOption') as HTMLButtonElement | null;
    if (addOptionBtn) addOptionBtn.addEventListener('click', () => this.addOption());
    const typeSelect = this.shadow.getElementById('questionType') as HTMLSelectElement | null;
    if (typeSelect) typeSelect.addEventListener('change', () => this.onTypeChange());
    // Load question if an ID is already set (editing). For creation,
    // initialize an empty options list with two empty options by default.
    if (this.questionId) {
      await this.loadQuestion();
    } else {
      // When creating a new question, start with two empty options
      this.options = [
        { id: 'A', text: '', correct: false },
        { id: 'B', text: '', correct: false },
      ];
      // Render options so the user can start filling them
      this.renderOptions();
    }
  }

  /**
   * Fetches the question from the API and populates the form. If no
   * questionId is provided, displays an error.
   */
  private async loadQuestion() {
    const errorEl = this.shadow.getElementById('error');
    if (!this.questionId) {
      if (errorEl) errorEl.textContent = 'No question ID provided.';
      return;
    }
    try {
      const resp = await fetch(`http://localhost:3000/question/${this.questionId}`);
      if (!resp.ok) {
        throw new Error(`Failed to load question: ${resp.statusText}`);
      }
      this.question = (await resp.json()) as QuestionRead;
      // Initialize options state from loaded question
      this.options = this.question.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        correct: this.question!.correctAnswers.includes(opt.id),
      }));
      this.populateForm();
      if (errorEl) errorEl.textContent = '';
    } catch (err) {
      console.error('Error loading question', err);
      if (errorEl) errorEl.textContent = 'Error loading question.';
    }
  }

  /**
   * Populates the form fields with the loaded question data and
   * renders option rows.
   */
  private populateForm() {
    if (!this.question) return;
    const textInput = this.shadow.getElementById('questionText') as HTMLInputElement | null;
    const typeSelect = this.shadow.getElementById('questionType') as HTMLSelectElement | null;
    const explanationArea = this.shadow.getElementById('explanation') as HTMLTextAreaElement | null;
    if (textInput) textInput.value = this.question.text;
    if (typeSelect) typeSelect.value = this.question.type;
    if (explanationArea) explanationArea.value = this.question.explanation ?? '';
    this.renderOptions();
  }

  /**
   * Renders the dynamic list of option input rows based on the current
   * options state. Each row includes a text input, a radio/checkbox
   * for marking correct answers, and a remove button.
   */
  private renderOptions() {
    const container = this.shadow.getElementById('optionsContainer');
    if (!container) return;
    container.innerHTML = '';
    const typeSelect = this.shadow.getElementById('questionType') as HTMLSelectElement | null;
    const isSingle = typeSelect?.value === 'single';
    this.options.forEach((opt, index) => {
      const row = document.createElement('div');
      row.className = 'option-row';
      // Correct input (radio for single, checkbox for multiple)
      const correctInput = document.createElement('input');
      correctInput.type = isSingle ? 'radio' : 'checkbox';
      correctInput.name = 'correct';
      correctInput.checked = opt.correct;
      correctInput.addEventListener('change', () => {
        if (isSingle) {
          // If single, set all others to false
          this.options.forEach((o) => (o.correct = false));
          opt.correct = true;
        } else {
          opt.correct = correctInput.checked;
        }
        this.renderOptions();
      });
      row.appendChild(correctInput);
      // Text input for the option text
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = opt.text;
      textInput.addEventListener('input', () => {
        opt.text = textInput.value;
      });
      row.appendChild(textInput);
      // Remove button (allowed if more than 2 options)
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-option';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        if (this.options.length > 2) {
          this.options.splice(index, 1);
          // Reassign IDs sequentially (A, B, C...)
          this.options.forEach((o, idx) => {
            o.id = String.fromCharCode(65 + idx);
          });
          this.renderOptions();
        }
      });
      row.appendChild(removeBtn);
      container.appendChild(row);
    });
  }

  /**
   * Adds a new empty option to the list. Ensures IDs remain sequential
   * letters (A, B, C, ...). Always appends at the end.
   */
  private addOption() {
    const nextIndex = this.options.length;
    const nextId = String.fromCharCode(65 + nextIndex);
    this.options.push({ id: nextId, text: '', correct: false });
    this.renderOptions();
  }

  /**
   * Handler for changing the question type. Re-renders options so the
   * correct inputs switch between radio and checkbox. If switching to
   * single choice, ensures only the first correct option remains
   * selected.
   */
  private onTypeChange() {
    const typeSelect = this.shadow.getElementById('questionType') as HTMLSelectElement | null;
    const newType = typeSelect?.value as QuestionType | undefined;
    if (newType === 'single') {
      // Ensure only one option is marked correct
      let firstSet = false;
      this.options.forEach((opt) => {
        if (opt.correct && !firstSet) {
          firstSet = true;
        } else {
          opt.correct = false;
        }
      });
    }
    this.renderOptions();
  }

  /**
   * Gathers form values into a QuestionUpdateInput-like object. Does
   * basic validation and returns undefined if validation fails.
   */
  private gatherInput(): Omit<QuestionUpdateInput, 'id'> | undefined {
    const textInput = this.shadow.getElementById('questionText') as HTMLInputElement | null;
    const typeSelect = this.shadow.getElementById('questionType') as HTMLSelectElement | null;
    const explanationArea = this.shadow.getElementById('explanation') as HTMLTextAreaElement | null;
    const errorEl = this.shadow.getElementById('error');
    if (!textInput || !typeSelect) return undefined;
    const text = textInput.value.trim();
    if (!text) {
      if (errorEl) errorEl.textContent = 'Question text is required.';
      return undefined;
    }
    // Validate options: at least 2 options
    if (this.options.length < 2) {
      if (errorEl) errorEl.textContent = 'At least two options are required.';
      return undefined;
    }
    // Validate at least one correct answer
    const correctIds = this.options.filter((o) => o.correct).map((o) => o.id);
    if (correctIds.length === 0) {
      if (errorEl) errorEl.textContent = 'At least one correct answer must be selected.';
      return undefined;
    }
    // Validate all option texts are non-empty
    for (const opt of this.options) {
      if (!opt.text.trim()) {
        if (errorEl) errorEl.textContent = 'All options must have text.';
        return undefined;
      }
    }
    // Construct input object
    const input: any = {
      text,
      type: typeSelect.value as QuestionType,
      options: this.options.map((opt) => ({ id: opt.id, text: opt.text })),
      correctAnswers: correctIds,
    };
    const explanation = explanationArea?.value.trim();
    if (explanation) input.explanation = explanation;
    if (errorEl) errorEl.textContent = '';
    return input;
  }

  /**
   * Handles the save button click. Gathers input, performs validation,
   * sends a PATCH request to the API, and emits 'question-updated' on
   * success.
   */
  private async handleSave() {
    const errorEl = this.shadow.getElementById('error');
    const body = this.gatherInput();
    if (!body) return;
    // If questionId is set, perform update; otherwise, perform create using pageId
    if (this.questionId) {
      try {
        const response = await fetch(`http://localhost:3000/question/${this.questionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const msg = await response.text();
          throw new Error(`Failed to update question: ${msg}`);
        }
        const updated = (await response.json()) as QuestionRead;
        this.question = updated;
        // Update local state from the updated question
        this.options = updated.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          correct: updated.correctAnswers.includes(opt.id),
        }));
        this.populateForm();
        if (errorEl) errorEl.textContent = '';
        this.dispatchEvent(
          new CustomEvent('question-updated', { detail: { question: updated }, bubbles: true }),
        );
      } catch (err) {
        console.error('Error updating question', err);
        if (errorEl) errorEl.textContent = 'Error updating question.';
      }
    } else {
      // Creating a new question requires a page-id
      if (!this.pageId) {
        if (errorEl) errorEl.textContent = 'No page ID provided.';
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/page/${this.pageId}/question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const msg = await response.text();
          throw new Error(`Failed to create question: ${msg}`);
        }
        const created = (await response.json()) as QuestionRead;
        this.question = created;
        // Reset local state to updated state (id and options)
        this.questionId = created.id;
        this.options = created.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          correct: created.correctAnswers.includes(opt.id),
        }));
        this.populateForm();
        if (errorEl) errorEl.textContent = '';
        this.dispatchEvent(
          new CustomEvent('question-created', { detail: { question: created }, bubbles: true }),
        );
      } catch (err) {
        console.error('Error creating question', err);
        if (errorEl) errorEl.textContent = 'Error creating question.';
      }
    }
  }

  /**
   * Handles the cancel button click. Dispatches an 'edit-cancel'
   * event to notify parent components.
   */
  private handleCancel() {
    this.dispatchEvent(new CustomEvent('edit-cancel', { detail: {}, bubbles: true }));
  }
}

customElements.define('x-question-edit', XQuestionEdit);