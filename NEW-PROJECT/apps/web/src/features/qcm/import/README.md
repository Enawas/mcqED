QCM Import Feature
==================

## Purpose

This feature allows users to import a QCM from a JSON or XML file. It
provides a Web Component (`x-qcm-import`) that reads a local file,
detects or allows the user to specify the format, and sends the
contents to the backend API (`POST /qcm/import`). On successful import,
it emits a `qcm-imported` event containing the newly created QCM.

## Files

- `template.html` – Defines the markup for the import form (file input,
  format select, buttons).
- `styles.css` – Scoped styles for the form and buttons.
- `x-qcm-import.ts` – Web Component implementation. Reads the file,
  determines the format, posts to the API, handles errors, and
  dispatches events (`qcm-imported`, `import-cancel`).
- `README.md` – This documentation.

## API Endpoint

- `POST /qcm/import` – Accepts a JSON body `{ format: 'json'|'xml', data: string }` and returns the imported QCM.

## Events

- `qcm-imported` – Emitted when a QCM has been successfully imported. The event
  detail contains the `qcm` object.
- `import-cancel` – Emitted when the user cancels the import. Parent
  components should listen for this to return to the previous view.

## DoD

- [x] File input supports `.json` and `.xml` extensions.
- [x] Auto-detects format by file extension if `Auto detect` is chosen.
- [x] Sends the file contents to the API and handles success or error.
- [x] Emits `qcm-imported` with the created QCM on success.
- [x] Emits `import-cancel` on cancellation.