/**
 * Purpose: Web Component that displays a filterable list of QCMs fetched from
 * the API. Handles search, filtering by difficulty and icon, shows summary
 * statistics, and renders each QCM card with basic actions.
 * Inputs: None. Fetches QCM data from the API endpoint on connection.
 * Outputs: Emits custom events when user interacts with actions (e.g. launch,
 * edit, favourite).
 * Events:
 *  - 'qcm-launch' detail: { id: string }
 *  - 'qcm-edit'   detail: { id: string }
 *  - 'qcm-fav-toggle' detail: { id: string }
 * Errors: Logs to console if fetching fails.
 */

import { QcmRead } from '@packages/schemas/src/qcm';

export class XQcmList extends HTMLElement {
  private qcms: QcmRead[] = [];
  private filtered: QcmRead[] = [];
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Lifecycle hook called when element is inserted into the DOM. Loads the
   * template and styles, binds UI events and fetches the initial QCM data.
   */
  connectedCallback() {
    this.initialize();
  }

  private async initialize() {
    // Fetch and apply template and styles.
    const templateUrl = new URL('./template.html', import.meta.url);
    const styleUrl = new URL('./styles.css', import.meta.url);
    const [templateHtml, styleCss] = await Promise.all([
      fetch(templateUrl).then((res) => res.text()),
      fetch(styleUrl).then((res) => res.text()),
    ]);
    this.shadow.innerHTML = `<style>${styleCss}</style>${templateHtml}`;

    // Bind event listeners for filters.
    const searchInput = this.shadow.getElementById('search') as HTMLInputElement | null;
    const difficultySelect = this.shadow.getElementById('difficulty') as HTMLSelectElement | null;
    const iconSelect = this.shadow.getElementById('icon') as HTMLSelectElement | null;
    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }
    if (difficultySelect) {
      difficultySelect.addEventListener('change', () => this.applyFilters());
    }
    if (iconSelect) {
      iconSelect.addEventListener('change', () => this.applyFilters());
    }

    // Fetch QCM data.
    await this.loadQcms();
    this.populateIconOptions();
    this.applyFilters();
  }

  /**
   * Loads QCM data from the API. Adjust the base URL as needed for your
   * environment (e.g. use environment variable or Vite config).
   */
  private async loadQcms() {
    try {
      // Include authorization header if a token exists in localStorage
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch('http://localhost:3000/qcm', { headers });
      if (!response.ok) {
        throw new Error(`Failed to load QCMs: ${response.statusText}`);
      }
      const data = await response.json();
      this.qcms = data as QcmRead[];
    } catch (err) {
      console.error('Error loading QCMs:', err);
      this.qcms = [];
    }
  }

  /**
   * Public method to refresh the list by reloading QCMs from the API and
   * reapplying filters. Can be called by parent components when
   * underlying data may have changed.
   */
  public async refresh() {
    await this.loadQcms();
    this.populateIconOptions();
    this.applyFilters();
  }

  /**
   * Recomputes the filtered list based on search, difficulty and icon
   * criteria. Updates the UI accordingly.
   */
  private applyFilters() {
    const searchInput = this.shadow.getElementById('search') as HTMLInputElement | null;
    const difficultySelect = this.shadow.getElementById('difficulty') as HTMLSelectElement | null;
    const iconSelect = this.shadow.getElementById('icon') as HTMLSelectElement | null;
    const searchTerm = searchInput?.value.trim().toLowerCase() ?? '';
    const diffFilter = difficultySelect?.value ?? '';
    const iconFilter = iconSelect?.value ?? '';

    this.filtered = this.qcms.filter((qcm) => {
      const matchesSearch =
        !searchTerm ||
        qcm.title.toLowerCase().includes(searchTerm) ||
        (qcm.description?.toLowerCase().includes(searchTerm) ?? false);
      const matchesDifficulty = !diffFilter || (qcm.difficultyLevel ?? '') === diffFilter;
      const matchesIcon = !iconFilter || (qcm.iconClass ?? '') === iconFilter;
      return matchesSearch && matchesDifficulty && matchesIcon;
    });

    this.renderStats();
    this.renderList();
  }

  /**
   * Populates the icon filter select with unique icons from loaded QCMs.
   */
  private populateIconOptions() {
    const iconSelect = this.shadow.getElementById('icon') as HTMLSelectElement | null;
    if (!iconSelect) return;
    // Collect unique icon classes, excluding undefined/null
    const icons = Array.from(
      new Set(
        this.qcms
          .map((q) => q.iconClass)
          .filter((cls): cls is string => typeof cls === 'string' && cls.length > 0),
      ),
    );
    // Remove any existing options beyond the default
    iconSelect.innerHTML = '<option value="">All icons</option>';
    icons.forEach((icon) => {
      const opt = document.createElement('option');
      opt.value = icon;
      opt.textContent = icon;
      iconSelect.appendChild(opt);
    });
  }

  /**
   * Renders summary statistics (total, draft, published, favourite) to the UI.
   */
  private renderStats() {
    const statsEl = this.shadow.getElementById('stats');
    if (!statsEl) return;
    const total = this.filtered.length;
    const draft = this.filtered.filter((q) => q.status === 'draft').length;
    const published = this.filtered.filter((q) => q.status === 'published').length;
    const favourite = this.filtered.filter((q) => q.isFavorite).length;
    statsEl.innerHTML = `
      <span>Total: ${total}</span>
      <span>Draft: ${draft}</span>
      <span>Published: ${published}</span>
      <span>Favourites: ${favourite}</span>
    `;
  }

  /**
   * Renders the list of QCM cards into the DOM.
   */
  private renderList() {
    const listEl = this.shadow.getElementById('qcm-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    this.filtered.forEach((qcm) => {
      const card = document.createElement('div');
      card.className = 'qcm-card';
      const title = document.createElement('h3');
      title.textContent = qcm.title;
      card.appendChild(title);

      if (qcm.description) {
        const desc = document.createElement('p');
        desc.textContent = qcm.description;
        card.appendChild(desc);
      }

      const info = document.createElement('p');
      info.textContent = `Status: ${qcm.status} • Difficulty: ${qcm.difficultyLevel ?? 'N/A'}`;
      card.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'actions';

      // Launch button
      const launchBtn = document.createElement('button');
      launchBtn.className = 'primary';
      launchBtn.textContent = 'Launch';
      launchBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('qcm-launch', { detail: { id: qcm.id } }));
      });
      actions.appendChild(launchBtn);

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'secondary';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('qcm-edit', { detail: { id: qcm.id } }));
      });
      actions.appendChild(editBtn);

      // Favourite toggle button
      const favBtn = document.createElement('button');
      favBtn.className = 'secondary';
      favBtn.textContent = qcm.isFavorite ? 'Unfavourite' : 'Favourite';
      favBtn.addEventListener('click', async () => {
        await this.toggleFavorite(qcm.id);
      });
      actions.appendChild(favBtn);

      // Export JSON button
      const exportJsonBtn = document.createElement('button');
      exportJsonBtn.className = 'secondary';
      exportJsonBtn.textContent = 'Export JSON';
      exportJsonBtn.addEventListener('click', async () => {
        await this.exportQcm(qcm.id, 'json');
      });
      actions.appendChild(exportJsonBtn);

      // Export XML button
      const exportXmlBtn = document.createElement('button');
      exportXmlBtn.className = 'secondary';
      exportXmlBtn.textContent = 'Export XML';
      exportXmlBtn.addEventListener('click', async () => {
        await this.exportQcm(qcm.id, 'xml');
      });
      actions.appendChild(exportXmlBtn);

      card.appendChild(actions);
      listEl.appendChild(card);
    });
  }

  /**
   * Toggles the favourite status of a QCM by invoking the API. Upon
   * successful update, replaces the corresponding entry in the internal
   * qcms array and reapplies filters to refresh the display.
   */
  private async toggleFavorite(id: string) {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/qcm/${id}/favorite`, {
        method: 'PATCH',
        headers,
      });
      if (!response.ok) {
        console.error('Failed to toggle favourite:', await response.text());
        return;
      }
      const updated = (await response.json()) as QcmRead;
      const idx = this.qcms.findIndex((q) => q.id === id);
      if (idx !== -1) {
        this.qcms[idx] = updated;
      }
      this.applyFilters();
    } catch (err) {
      console.error('Error toggling favourite', err);
    }
  }

  /**
   * Exports a QCM in the specified format by invoking the API and
   * triggering a file download in the browser. Supports JSON and XML
   * formats. If the API call fails, logs an error to the console.
   */
  private async exportQcm(id: string, format: 'json' | 'xml') {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/qcm/${id}/export?format=${format}`, { headers });
      if (!response.ok) {
        console.error('Failed to export QCM:', await response.text());
        return;
      }
      const data = await response.text();
      // Determine file name and MIME type
      const mime = format === 'json' ? 'application/json' : 'application/xml';
      const fileExt = format === 'json' ? 'json' : 'xml';
      const filename = `qcm-${id}.${fileExt}`;
      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting QCM', err);
    }
  }
}

// Register the custom element
customElements.define('x-qcm-list', XQcmList);