Page Edit Feature
=================

## Purpose

This feature allows users to rename an existing page within a QCM. It
consists of a standalone Web Component (`x-page-edit`) that fetches a
page by its ID, displays the current name in a form, and sends
updates to the backend. It emits events on success or cancellation,
enabling parent components to react appropriately.

## Files

- `template.html` – Defines the structure of the rename form.
- `styles.css` – Scoped styling for the component.
- `x-page-edit.ts` – Implementation of the Web Component. Handles
  loading the page, validation, updating via API, and event
  dispatching.
- API service and plugins:
  - `apps/api/src/services/page/get.service.ts` – Retrieves a page.
  - `apps/api/src/services/page/update.service.ts` – Renames a page.
  - `apps/api/src/policies/page/edit.policy.ts` – Authorization policy for
    renaming pages.
  - `apps/api/src/plugins/page/get/index.ts` – GET route to fetch a page.
  - `apps/api/src/plugins/page/edit/index.ts` – PATCH route to rename a page.

## API Endpoints

- `GET /page/:id` – Returns a single page. Response conforms to
  `qcmPageReadSchema`. Returns 404 if not found.
- `PATCH /page/:id` – Updates the page name. Body must contain a
  `name` string. Requires roles `editor` or `admin`. Returns the
  updated page on success or 404 if not found.

## Events

The `x-page-edit` component emits:

- `page-updated` – Fired when the page is successfully renamed.
  `event.detail.page` contains the updated page object.
- `edit-cancel` – Fired when the user cancels editing. Use this to
  hide the editor or return to the previous view.

## DoD

- [x] Form loads existing page name.
- [x] User can modify the page name.
- [x] PATCH request updates the page; UI reflects changes.
- [x] Emits `page-updated` and `edit-cancel` events.
- [x] Backend enforces RBAC via the `canEditPage` policy.
- [x] Inline error messages are shown on validation or network errors.