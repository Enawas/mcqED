/**
 * Purpose: Web Component that runs a QCM quiz for a given QCM ID.
 * Fetches the QCM from the backend, displays pages and questions,
 * records user answers, tracks elapsed time, computes the final
 * score, and displays a summary. Emits events on finish so the
 * parent component can navigate away or refresh the list.
 * Inputs: Attribute `qcm-id` specifying the QCM to play.
 * Outputs: Custom events `quiz-finished` and `quiz-exit`.
 */

import { QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';
import { QuestionRead } from '@packages/schemas/src/question';
// Import authenticated fetch utility to automatically attach tokens and refresh on 401
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export class XQcmPlayer extends HTMLElement {
  private shadow: ShadowRoot;
  private qcmId: string | null = null;
  private qcm: QcmRead | null = null;
  private currentPageIndex = 0;
  // Map of questionId to array of selected option IDs
  private userAnswers: Record<string, string[]> = {};
  private startTime: number = 0;
  private timerInterval: any = null;
  private finished = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['qcm-id'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'qcm-id' && newValue !== oldValue) {
      this.qcmId = newValue;
      if (this.isConnected) {
        this.initialize();
      }
    }
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads template and styles, fetches the QCM, starts the timer, and
   * renders the first page.
   */
  private async initialize() {
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    // Bind navigation buttons
    const prevBtn = this.shadow.getElementById('prev-page') as HTMLButtonElement | null;
    const nextBtn = this.shadow.getElementById('next-page') as HTMLButtonElement | null;
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());
    // Start over
    await this.loadQcm();
    if (this.qcm) {
      this.currentPageIndex = 0;
      this.userAnswers = {};
      this.startTimer();
      this.renderPage();
    }
  }

  /**
   * Fetches the QCM from the backend and assigns it to the local state.
   */
  private async loadQcm() {
    const resultContainer = this.shadow.getElementById('result-container');
    if (!this.qcmId) {
      if (resultContainer) resultContainer.textContent = 'No QCM ID provided.';
      return;
    }
    try {
      const resp = await fetchWithAuth(`http://localhost:3000/qcm/${this.qcmId}`);
      if (!resp.ok) {
        throw new Error(`Failed to load QCM: ${resp.statusText}`);
      }
      this.qcm = (await resp.json()) as QcmRead;
      // Ensure pages are sorted if positions used
      this.qcm.pages.sort((a: any, b: any) => {
        if ((a as any).position !== undefined && (b as any).position !== undefined) {
          return (a as any).position - (b as any).position;
        }
        return 0;
      });
    } catch (err) {
      console.error('Error loading QCM', err);
      if (resultContainer) resultContainer.textContent = 'Error loading quiz.';
    }
  }

  /**
   * Starts the timer. Updates the timer display every second.
   */
  private startTimer() {
    this.startTime = Date.now();
    const timerEl = this.shadow.getElementById('timer');
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      if (timerEl) timerEl.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  /**
   * Stops the timer. Returns the elapsed time in seconds.
   */
  private stopTimer(): number {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    return elapsed;
  }

  /**
   * Renders the current page of the QCM. Displays each question with
   * its options. Handles user input by updating the userAnswers map.
   */
  private renderPage() {
    if (!this.qcm) return;
    const page = this.qcm.pages[this.currentPageIndex];
    if (!page) return;
    // Update page title
    const pageNameEl = this.shadow.getElementById('page-name');
    if (pageNameEl) pageNameEl.textContent = page.name;
    // Render questions
    const qContainer = this.shadow.getElementById('questions-container');
    if (!qContainer) return;
    qContainer.innerHTML = '';
    page.questions.forEach((question) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      const qTitle = document.createElement('h3');
      qTitle.textContent = question.text;
      questionDiv.appendChild(qTitle);
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';
      const isSingle = question.type === 'single';
      // Pre-populate selected options from userAnswers
      const selected = this.userAnswers[question.id] || [];
      question.options.forEach((opt) => {
        const label = document.createElement('label');
        label.style.display = 'block';
        const input = document.createElement('input');
        input.type = isSingle ? 'radio' : 'checkbox';
        input.name = question.id;
        input.value = opt.id;
        input.checked = selected.includes(opt.id);
        input.addEventListener('change', () => {
          if (isSingle) {
            this.userAnswers[question.id] = [opt.id];
            // Uncheck other radios (browser handles automatically)
          } else {
            // For multiple, update array of checked options
            const arr = this.userAnswers[question.id] || [];
            if (input.checked) {
              if (!arr.includes(opt.id)) arr.push(opt.id);
            } else {
              const idx = arr.indexOf(opt.id);
              if (idx !== -1) arr.splice(idx, 1);
            }
            this.userAnswers[question.id] = arr;
          }
        });
        label.appendChild(input);
        const textNode = document.createTextNode(' ' + opt.text);
        label.appendChild(textNode);
        optionsDiv.appendChild(label);
      });
      questionDiv.appendChild(optionsDiv);
      qContainer.appendChild(questionDiv);
    });
    // Update navigation button states
    const prevBtn = this.shadow.getElementById('prev-page') as HTMLButtonElement | null;
    const nextBtn = this.shadow.getElementById('next-page') as HTMLButtonElement | null;
    if (prevBtn) prevBtn.disabled = this.currentPageIndex === 0;
    if (nextBtn) nextBtn.textContent = this.currentPageIndex === this.qcm.pages.length - 1 ? 'Finish' : 'Next';
  }

  /**
   * Navigates to the previous page if possible.
   */
  private prevPage() {
    if (!this.qcm) return;
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.renderPage();
    }
  }

  /**
   * Navigates to the next page or finishes the quiz when on the last
   * page.
   */
  private nextPage() {
    if (!this.qcm) return;
    if (this.currentPageIndex < this.qcm.pages.length - 1) {
      this.currentPageIndex++;
      this.renderPage();
    } else {
      // Finish the quiz
      this.finishQuiz();
    }
  }

  /**
   * Computes the final score, stops the timer, displays a summary,
   * and emits a 'quiz-finished' event. Optionally could update
   * server with lastScore/time.
   */
  private finishQuiz() {
    if (this.finished) return;
    this.finished = true;
    const elapsedSeconds = this.stopTimer();
    const totalQuestions = this.qcm?.pages.reduce((sum, p) => sum + p.questions.length, 0) || 0;
    let correctCount = 0;
    if (this.qcm) {
      this.qcm.pages.forEach((page) => {
        page.questions.forEach((question) => {
          const selected = this.userAnswers[question.id] || [];
          // Compare arrays: correct if same length and contain same ids
          if (
            selected.length === question.correctAnswers.length &&
            selected.every((id) => question.correctAnswers.includes(id))
          ) {
            correctCount++;
          }
        });
      });
    }
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    // Render result summary
    const pageContainer = this.shadow.getElementById('page-container');
    const resultContainer = this.shadow.getElementById('result-container');
    if (pageContainer) pageContainer.classList.add('hidden');
    if (resultContainer) {
      resultContainer.classList.remove('hidden');
      resultContainer.innerHTML = '';
      const h2 = document.createElement('h2');
      h2.textContent = 'Quiz Summary';
      resultContainer.appendChild(h2);
      const p1 = document.createElement('p');
      p1.textContent = `Score: ${correctCount} / ${totalQuestions} (${score}%)`;
      resultContainer.appendChild(p1);
      // Display pass/fail message if passingThreshold is defined
      if (this.qcm && typeof this.qcm.passingThreshold === 'number') {
        const threshold = this.qcm.passingThreshold;
        const passed = score >= threshold;
        const pf = document.createElement('p');
        pf.textContent = passed
          ? `Result: Passed (threshold ${threshold}%)`
          : `Result: Failed (threshold ${threshold}%)`;
        resultContainer.appendChild(pf);
      }
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;
      const p2 = document.createElement('p');
      p2.textContent = `Time: ${minutes}m ${seconds}s`;
      resultContainer.appendChild(p2);
      const finishBtn = document.createElement('button');
      finishBtn.textContent = 'Close';
      finishBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('quiz-finished', {
            detail: {
              qcmId: this.qcmId,
              score,
              correct: correctCount,
              total: totalQuestions,
              elapsedSeconds,
            },
            bubbles: true,
          }),
        );
      });
      resultContainer.appendChild(finishBtn);
    }
  }
}

customElements.define('x-qcm-player', XQcmPlayer);