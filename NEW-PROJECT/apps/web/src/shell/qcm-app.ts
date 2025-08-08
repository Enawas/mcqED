/**
 * Purpose: Root Web Component for the QCM application. Hosts top-level
 * navigation and layouts, and initially displays the QCM list feature.
 * In later iterations this shell can manage routing and theme toggles.
 * Inputs: None.
 * Outputs: None (renders nested components).
 * Events: Listens for events emitted by child components and delegates
 * navigation or state updates as needed.
 * Errors: None.
 */

import '../features/qcm/list/x-qcm-list';
import '../features/qcm/edit/x-qcm-edit';
import '../features/qcm/create/x-qcm-create';
import '../features/qcm/player/x-qcm-player';
import '../features/qcm/import/x-qcm-import';

export class QcmApp extends HTMLElement {
  private shadow: ShadowRoot;
  // Track the current view ('list' or 'edit') and the ID of the QCM being edited.
  private currentView: 'list' | 'edit' | 'create' | 'player' | 'import' = 'list';
  private editingQcmId: string | null = null;
  private playingQcmId: string | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    // Render different views: list, edit, or create. The list view
    // includes a button to trigger creation of a new QCM. Edit view
    // passes the QCM ID to the edit component. Create view renders
    // the creation form component.
    if (this.currentView === 'list') {
      this.shadow.innerHTML = `
        <div class="toolbar">
          <button id="create-button">Create QCM</button>
          <button id="import-button">Import QCM</button>
        </div>
        <x-qcm-list></x-qcm-list>
      `;
    } else if (this.currentView === 'edit') {
      const idAttr = this.editingQcmId ? ` qcm-id="${this.editingQcmId}"` : '';
      this.shadow.innerHTML = `<x-qcm-edit${idAttr}></x-qcm-edit>`;
    } else {
      // create view
      if (this.currentView === 'create') {
        this.shadow.innerHTML = `<x-qcm-create></x-qcm-create>`;
      } else {
        if (this.currentView === 'player') {
          const idAttr2 = this.playingQcmId ? ` qcm-id="${this.playingQcmId}"` : '';
          this.shadow.innerHTML = `<x-qcm-player${idAttr2}></x-qcm-player>`;
        } else {
          // import view
          this.shadow.innerHTML = `<x-qcm-import></x-qcm-import>`;
        }
      }
    }
  }

  /**
   * Bind to events emitted by child components (e.g. launch, edit, fav).
   * For now, simply logs or navigates via window.location; proper routing
   * will be added later.
   */
  private bindEvents() {
    // Bind events based on the current view. When in list view, listen
    // for launch/edit/fav events. When in edit view, listen for
    // save/cancel events to return to the list.
    if (this.currentView === 'list') {
      // Bind create button
      const createBtn = this.shadow.getElementById('create-button');
      if (createBtn) {
        createBtn.addEventListener('click', () => {
          this.currentView = 'create';
          this.render();
          this.bindEvents();
        });
      }
      const importBtn = this.shadow.getElementById('import-button');
      if (importBtn) {
        importBtn.addEventListener('click', () => {
          this.currentView = 'import';
          this.render();
          this.bindEvents();
        });
      }
      const list = this.shadow.querySelector('x-qcm-list');
      if (!list) return;
      list.addEventListener('qcm-launch', (e: Event) => {
        const id = (e as CustomEvent).detail.id;
        // TODO: implement routing to player, e.g., using a router.
        // Switch to player view with the specified QCM ID
        this.playingQcmId = id;
        this.currentView = 'player';
        this.render();
        this.bindEvents();
      });
      list.addEventListener('qcm-edit', (e: Event) => {
        const id = (e as CustomEvent).detail.id;
        // Switch to edit view with the specified QCM ID
        this.editingQcmId = id;
        this.currentView = 'edit';
        this.render();
        this.bindEvents();
      });
    } else if (this.currentView === 'edit') {
      const edit = this.shadow.querySelector('x-qcm-edit');
      if (!edit) return;
      edit.addEventListener('qcm-updated', (e: Event) => {
        // When a QCM is updated, return to the list and refresh it
        this.currentView = 'list';
        this.editingQcmId = null;
        this.render();
        this.bindEvents();
        // Refresh list to show updated data
        const list = this.shadow.querySelector('x-qcm-list');
        if (list && typeof (list as any).refresh === 'function') {
          (list as any).refresh();
        }
      });
      edit.addEventListener('edit-cancel', () => {
        // Return to list view without saving
        this.currentView = 'list';
        this.editingQcmId = null;
        this.render();
        this.bindEvents();
      });
    } else {
      // create or player view
      if (this.currentView === 'create') {
        const create = this.shadow.querySelector('x-qcm-create');
        if (!create) return;
        create.addEventListener('qcm-created', () => {
          // Return to list view and refresh after creation
          this.currentView = 'list';
          this.render();
          this.bindEvents();
          const list = this.shadow.querySelector('x-qcm-list');
          if (list && typeof (list as any).refresh === 'function') {
            (list as any).refresh();
          }
        });
      } else {
        if (this.currentView === 'player') {
          const player = this.shadow.querySelector('x-qcm-player');
          if (!player) return;
          player.addEventListener('quiz-finished', async (e: Event) => {
            const detail = (e as CustomEvent).detail || {};
            const qcmId = detail.qcmId;
            const score = detail.score;
            const elapsedSeconds = detail.elapsedSeconds;
            // Attempt to update lastScore and lastTime via API
            if (qcmId) {
              try {
                await fetch(`http://localhost:3000/qcm/${qcmId}/stats`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ score, time: elapsedSeconds }),
                });
              } catch (err) {
                console.error('Error updating stats', err);
              }
            }
            // Return to list view and refresh the list
            this.currentView = 'list';
            this.playingQcmId = null;
            this.render();
            this.bindEvents();
            const list = this.shadow.querySelector('x-qcm-list');
            if (list && typeof (list as any).refresh === 'function') {
              (list as any).refresh();
            }
          });
        } else {
          // import view
          const importComp = this.shadow.querySelector('x-qcm-import');
          if (!importComp) return;
          importComp.addEventListener('qcm-imported', (e: Event) => {
            // Return to list view and refresh the list after import
            this.currentView = 'list';
            this.render();
            this.bindEvents();
            const list = this.shadow.querySelector('x-qcm-list');
            if (list && typeof (list as any).refresh === 'function') {
              (list as any).refresh();
            }
          });
          importComp.addEventListener('import-cancel', () => {
            // Return to list view on cancel
            this.currentView = 'list';
            this.render();
            this.bindEvents();
          });
        }
      }
    }
  }
}

// Register the root application element
customElements.define('qcm-app', QcmApp);