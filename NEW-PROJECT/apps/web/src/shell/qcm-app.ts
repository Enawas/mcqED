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

export class QcmApp extends HTMLElement {
  private shadow: ShadowRoot;
  // Track the current view ('list' or 'edit') and the ID of the QCM being edited.
  private currentView: 'list' | 'edit' | 'create' = 'list';
  private editingQcmId: string | null = null;

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
        </div>
        <x-qcm-list></x-qcm-list>
      `;
    } else if (this.currentView === 'edit') {
      const idAttr = this.editingQcmId ? ` qcm-id="${this.editingQcmId}"` : '';
      this.shadow.innerHTML = `<x-qcm-edit${idAttr}></x-qcm-edit>`;
    } else {
      // create view
      this.shadow.innerHTML = `<x-qcm-create></x-qcm-create>`;
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
      const list = this.shadow.querySelector('x-qcm-list');
      if (!list) return;
      list.addEventListener('qcm-launch', (e: Event) => {
        const id = (e as CustomEvent).detail.id;
        // TODO: implement routing to player, e.g., using a router.
        console.log('Launch QCM', id);
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
      // currentView === 'create'
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
    }
  }
}

// Register the root application element
customElements.define('qcm-app', QcmApp);