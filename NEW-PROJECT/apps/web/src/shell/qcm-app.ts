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
import '../features/auth/login/x-auth-login';
import '../features/audit/list/x-audit-list';
import '../features/theme/switcher/x-theme-switcher';

// Import utilities for role handling and authenticated fetches
import { getUserRole } from '../utils/jwt';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export class QcmApp extends HTMLElement {
  private shadow: ShadowRoot;
  // Track the current view ('list' or 'edit') and the ID of the QCM being edited.
  private currentView: 'list' | 'edit' | 'create' | 'player' | 'import' | 'audit' = 'list';
  private editingQcmId: string | null = null;
  private playingQcmId: string | null = null;

  // Track whether the user is logged in. Determined by presence of an access token.
  private loggedIn = false;

  // Track the current user's role (e.g. 'admin', 'editor', 'user'). Null if not logged in
  private userRole: string | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Determine login state based on localStorage token
    this.loggedIn = !!localStorage.getItem('accessToken');
    // Determine user role if logged in
    this.userRole = this.loggedIn ? getUserRole() : null;
    this.render();
    this.bindEvents();
  }

  private render() {
    // If not logged in, show login view regardless of currentView
    if (!this.loggedIn) {
      this.shadow.innerHTML = `<x-auth-login></x-auth-login>`;
      return;
    }
    // Render different views based on currentView. The list view
    // includes buttons for create, import and logout.
    if (this.currentView === 'list') {
      // Only show import and audit buttons for admin or editor roles
      const showAdmin = this.userRole === 'admin' || this.userRole === 'editor';
      const importBtnHtml = showAdmin ? '<button id="import-button">Import QCM</button>' : '';
      const auditBtnHtml = showAdmin ? '<button id="audit-button">Audit Logs</button>' : '';
      // Only allow creating new QCMs for users with editing rights
      const showCreate = showAdmin;
      const createBtnHtml = showCreate
        ? '<button id="create-button">Create QCM</button>'
        : '';
      this.shadow.innerHTML = `
        <div class="toolbar">
          ${createBtnHtml}
          ${importBtnHtml}
          ${auditBtnHtml}
          <button id="logout-button">Logout</button>
          <x-theme-switcher></x-theme-switcher>
        </div>
        <x-qcm-list></x-qcm-list>
      `;
    } else if (this.currentView === 'edit') {
      const idAttr = this.editingQcmId ? ` qcm-id="${this.editingQcmId}"` : '';
      this.shadow.innerHTML = `<x-qcm-edit${idAttr}></x-qcm-edit>`;
    } else if (this.currentView === 'create') {
      this.shadow.innerHTML = `<x-qcm-create></x-qcm-create>`;
    } else if (this.currentView === 'player') {
      const idAttr2 = this.playingQcmId ? ` qcm-id="${this.playingQcmId}"` : '';
      this.shadow.innerHTML = `<x-qcm-player${idAttr2}></x-qcm-player>`;
    } else if (this.currentView === 'import') {
      this.shadow.innerHTML = `<x-qcm-import></x-qcm-import>`;
    } else if (this.currentView === 'audit') {
      this.shadow.innerHTML = `<x-audit-list></x-audit-list>`;
    }
  }

  /**
   * Bind to events emitted by child components (e.g. launch, edit, fav).
   * For now, simply logs or navigates via window.location; proper routing
   * will be added later.
   */
  private bindEvents() {
    // If not logged in, bind login events
    if (!this.loggedIn) {
      const loginComp = this.shadow.querySelector('x-auth-login');
      if (loginComp) {
        loginComp.addEventListener('login-success', () => {
          this.loggedIn = true;
          // Determine and store the user role after successful login
          this.userRole = getUserRole();
          this.currentView = 'list';
          this.render();
          this.bindEvents();
        });
      }
      return;
    }
    // Bind events based on the current view when logged in
    if (this.currentView === 'list') {
      // Create button
      const createBtn = this.shadow.getElementById('create-button');
      if (createBtn) {
        createBtn.addEventListener('click', () => {
          this.currentView = 'create';
          this.render();
          this.bindEvents();
        });
      }
      // Import button
      const importBtn = this.shadow.getElementById('import-button');
      if (importBtn) {
        importBtn.addEventListener('click', () => {
          this.currentView = 'import';
          this.render();
          this.bindEvents();
        });
      }
      // Audit button
      const auditBtn = this.shadow.getElementById('audit-button');
      if (auditBtn) {
        auditBtn.addEventListener('click', () => {
          this.currentView = 'audit';
          this.render();
          this.bindEvents();
        });
      }
      // Logout button
      const logoutBtn = this.shadow.getElementById('logout-button');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          // Clear tokens and return to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.loggedIn = false;
          this.userRole = null;
          this.currentView = 'list';
          this.render();
          this.bindEvents();
        });
      }
      // Bind list events
      const list = this.shadow.querySelector('x-qcm-list');
      if (list) {
        list.addEventListener('qcm-launch', (e: Event) => {
          const id = (e as CustomEvent).detail.id;
          this.playingQcmId = id;
          this.currentView = 'player';
          this.render();
          this.bindEvents();
        });
        list.addEventListener('qcm-edit', (e: Event) => {
          const id = (e as CustomEvent).detail.id;
          this.editingQcmId = id;
          this.currentView = 'edit';
          this.render();
          this.bindEvents();
        });
      }
    } else if (this.currentView === 'edit') {
      const edit = this.shadow.querySelector('x-qcm-edit');
      if (edit) {
        edit.addEventListener('qcm-updated', () => {
          this.currentView = 'list';
          this.editingQcmId = null;
          this.render();
          this.bindEvents();
          const list = this.shadow.querySelector('x-qcm-list');
          if (list && typeof (list as any).refresh === 'function') {
            (list as any).refresh();
          }
        });
        edit.addEventListener('edit-cancel', () => {
          this.currentView = 'list';
          this.editingQcmId = null;
          this.render();
          this.bindEvents();
        });
      }
    } else if (this.currentView === 'create') {
      const create = this.shadow.querySelector('x-qcm-create');
      if (create) {
        create.addEventListener('qcm-created', () => {
          this.currentView = 'list';
          this.render();
          this.bindEvents();
          const list = this.shadow.querySelector('x-qcm-list');
          if (list && typeof (list as any).refresh === 'function') {
            (list as any).refresh();
          }
        });
      }
    } else if (this.currentView === 'player') {
      const player = this.shadow.querySelector('x-qcm-player');
      if (player) {
        player.addEventListener('quiz-finished', async (e: Event) => {
          const detail = (e as CustomEvent).detail || {};
          const qcmId = detail.qcmId;
          const score = detail.score;
          const elapsedSeconds = detail.elapsedSeconds;
          // Update stats; use fetchWithAuth to include token and refresh if needed
          if (qcmId) {
            try {
              await fetchWithAuth(`http://localhost:3000/qcm/${qcmId}/stats`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, time: elapsedSeconds }),
              });
            } catch (err) {
              console.error('Error updating stats', err);
            }
          }
          this.currentView = 'list';
          this.playingQcmId = null;
          this.render();
          this.bindEvents();
          const list = this.shadow.querySelector('x-qcm-list');
          if (list && typeof (list as any).refresh === 'function') {
            (list as any).refresh();
          }
        });
      }
    } else if (this.currentView === 'import') {
      const importComp = this.shadow.querySelector('x-qcm-import');
      if (importComp) {
        importComp.addEventListener('qcm-imported', () => {
          this.currentView = 'list';
          this.render();
          this.bindEvents();
          const list = this.shadow.querySelector('x-qcm-list');
          if (list && typeof (list as any).refresh === 'function') {
            (list as any).refresh();
          }
        });
        importComp.addEventListener('import-cancel', () => {
          this.currentView = 'list';
          this.render();
          this.bindEvents();
        });
      }
    }
    else if (this.currentView === 'audit') {
      const auditComp = this.shadow.querySelector('x-audit-list');
      if (auditComp) {
        auditComp.addEventListener('audit-cancel', () => {
          this.currentView = 'list';
          this.render();
          this.bindEvents();
        });
      }
    }
  }
}

// Register the root application element
customElements.define('qcm-app', QcmApp);