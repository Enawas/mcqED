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

export class QcmApp extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.shadow.innerHTML = `
      <x-qcm-list></x-qcm-list>
    `;
  }

  /**
   * Bind to events emitted by child components (e.g. launch, edit, fav).
   * For now, simply logs or navigates via window.location; proper routing
   * will be added later.
   */
  private bindEvents() {
    const list = this.shadow.querySelector('x-qcm-list');
    if (!list) return;
    list.addEventListener('qcm-launch', (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      // TODO: implement routing to player, e.g., using a router.
      console.log('Launch QCM', id);
    });
    list.addEventListener('qcm-edit', (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      console.log('Edit QCM', id);
    });
    list.addEventListener('qcm-fav-toggle', (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      console.log('Toggle favourite', id);
    });
  }
}

// Register the root application element
customElements.define('qcm-app', QcmApp);