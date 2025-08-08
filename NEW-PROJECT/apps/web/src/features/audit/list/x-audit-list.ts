/**
 * Purpose: Web Component for displaying audit logs. Allows an admin
 * user to filter logs by entity, entityId, userId and limit.
 * Fetches data from the API endpoint `/audit` and displays each
 * entry with metadata and before/after snapshots. Emits an
 * `audit-cancel` event when the back button is clicked. Handles
 * authentication via Bearer token stored in localStorage.
 * Inputs: None (query parameters come from form fields).
 * Outputs: Emits 'audit-cancel' when user wants to exit the audit
 * view.
 * Errors: Displays error messages for network errors or 403 (forbidden).
 */

import { AuditEvent } from '@packages/schemas/src/audit';

export class XAuditList extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initialize();
  }

  /**
   * Loads template and styles, binds event handlers and fetches
   * audit logs initially.
   */
  private async initialize() {
    const [templateHtml, styleCss] = await Promise.all([
      fetch(new URL('./template.html', import.meta.url)).then((res) => res.text()),
      fetch(new URL('./styles.css', import.meta.url)).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;
    // Bind form submit
    const form = this.shadow.getElementById('filterForm') as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loadLogs();
      });
    }
    // Bind back button
    const backBtn = this.shadow.getElementById('back') as HTMLButtonElement | null;
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('audit-cancel', { bubbles: true }));
      });
    }
    // Load logs initially
    await this.loadLogs();
  }

  /**
   * Fetches audit logs from the API using query parameters from
   * filter inputs and renders them in the log container.
   */
  private async loadLogs() {
    const errorEl = this.shadow.getElementById('error');
    const logsEl = this.shadow.getElementById('logs');
    if (!logsEl) return;
    if (errorEl) errorEl.textContent = '';
    // Build query parameters
    const entityInput = this.shadow.getElementById('entity') as HTMLInputElement | null;
    const entityIdInput = this.shadow.getElementById('entityId') as HTMLInputElement | null;
    const userIdInput = this.shadow.getElementById('userId') as HTMLInputElement | null;
    const limitInput = this.shadow.getElementById('limit') as HTMLInputElement | null;
    const params = new URLSearchParams();
    if (entityInput && entityInput.value.trim()) params.append('entity', entityInput.value.trim());
    if (entityIdInput && entityIdInput.value.trim()) params.append('entityId', entityIdInput.value.trim());
    if (userIdInput && userIdInput.value.trim()) params.append('userId', userIdInput.value.trim());
    if (limitInput && limitInput.value.trim()) params.append('limit', limitInput.value.trim());
    // Set up headers with token
    const token = localStorage.getItem('accessToken');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const url = `http://localhost:3000/audit${params.toString() ? '?' + params.toString() : ''}`;
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        if (resp.status === 403) {
          throw new Error('Forbidden');
        }
        throw new Error(`HTTP ${resp.status}`);
      }
      const logs = (await resp.json()) as AuditEvent[];
      this.renderLogs(logs);
    } catch (err: any) {
      console.error('Failed to load audit logs', err);
      if (errorEl) {
        if (err.message === 'Forbidden') {
          errorEl.textContent = 'Access denied: you do not have permission to view audit logs.';
        } else {
          errorEl.textContent = 'Failed to load audit logs.';
        }
      }
      logsEl.innerHTML = '';
    }
  }

  /**
   * Renders a list of audit logs. Each entry displays its metadata
   * and the before/after snapshots as JSON if available.
   */
  private renderLogs(logs: AuditEvent[]) {
    const logsEl = this.shadow.getElementById('logs');
    if (!logsEl) return;
    logsEl.innerHTML = '';
    logs.forEach((log) => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      const meta = document.createElement('div');
      meta.className = 'log-meta';
      meta.textContent = `${log.createdAt} | ${log.event} | entity=${log.entity}` + (log.entityId ? ` | entityId=${log.entityId}` : '') + (log.userId ? ` | userId=${log.userId}` : '');
      entry.appendChild(meta);
      // Show before/after JSON if present
      if (log.before !== undefined || log.after !== undefined) {
        const beforeEl = document.createElement('div');
        beforeEl.className = 'log-json';
        beforeEl.textContent = 'Before:\n' + JSON.stringify(log.before, null, 2);
        entry.appendChild(beforeEl);
        const afterEl = document.createElement('div');
        afterEl.className = 'log-json';
        afterEl.textContent = 'After:\n' + JSON.stringify(log.after, null, 2);
        entry.appendChild(afterEl);
      }
      logsEl.appendChild(entry);
    });
  }
}

customElements.define('x-audit-list', XAuditList);