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

export class QcmApp extends HTMLElement {
  private shadow: ShadowRoot;
  // Track the current view ('list' or 'edit') and the ID of the QCM being edited.
  private currentView: 'list' | 'edit' = 'list';
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
    // Render the appropriate component based on the current view. When in
    // edit mode, pass the QCM ID as an attribute to the edit component.
    if (this.currentView === 'list') {
      this.shadow.innerHTML = `<x-qcm-list></x-qcm-list>`;
    } else {
      const idAttr = this.editingQcmId ? ` qcm-id="${this.editingQcmId}"` : '';
      this.shadow.innerHTML = `<x-qcm-edit${idAttr}></x-qcm-edit>`;
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
    } else {
      const edit = this.shadow.querySelector('x-qcm-edit');
      if (!edit) return;
      edit.addEventListener('qcm-updated', (e: Event) => {
        // When a QCM is updated, return to the list and refresh it
        const updatedQcm = (e as CustomEvent).detail.qcm;
        this.currentView = 'list';
        this.editingQcmId = null;
        this.render();
        this.bindEvents();
        // Optionally, refresh the list to reflect updates.
        const list = this.shadow.querySelector('x-qcm-list');
        (list as any)?.loadQcms?.();
      });
      edit.addEventListener('edit-cancel', () => {
        // Simply return to the list view without saving
        this.currentView = 'list';
        this.editingQcmId = null;
        this.render();
        this.bindEvents();
      });
    }
  }
}

// Register the root application element
customElements.define('qcm-app', QcmApp);