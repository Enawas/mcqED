Theme Switcher Feature
======================

## Purpose

This feature introduces a reusable Web Component (`x-theme-switcher`) that
allows users to toggle the application between light and dark modes and
enable or disable a colourblind (high‑contrast) mode. Preferences are
persisted in `localStorage` under the keys `mcqed_theme` and
`mcqed_colorblind`, ensuring the chosen settings survive page reloads.

## Files

- `template.html` – Defines the structure of the switcher with two
  labelled checkboxes.
- `styles.css` – Encapsulated styles for the component, ensuring the
  toggles align neatly within the toolbar.
- `x-theme-switcher.ts` – Implements the custom element, handling
  persistence, applying data attributes (`data-theme` and
  `data-colorblind`) to the root element, and synchronising toggle
  states.

## API

This component has no public methods or attributes. It reads and writes
preferences from `localStorage` and directly updates the DOM. To use it,
simply include `<x-theme-switcher></x-theme-switcher>` in your HTML.

## Behaviour

On initialisation, the switcher:

1. Loads the HTML template and styles into its Shadow DOM.
2. Reads the persisted `mcqed_theme` (`'light'` or `'dark'`) and
   `mcqed_colorblind` (`'true'` or `'false'`) values from `localStorage`.
3. Sets the `data-theme` and `data-colorblind` attributes on
   `document.documentElement` accordingly.
4. Synchronises the checkboxes to reflect the current settings.
5. Listens for `change` events on the checkboxes to update
   preferences, apply the changes to the DOM and persist them.

## Integration

Include the switcher component within the application’s toolbar (for
example, in the list view of `qcm-app`). The component operates
independently and emits no custom events. Other components can listen
for changes by observing the `data-theme` and `data-colorblind`
attributes on the root element.