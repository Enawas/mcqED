Question Edit Feature
====================

## Purpose

This feature provides a dedicated Web Component (`x-question-edit`) and
corresponding API endpoints to edit an existing question. The editor
allows users to modify the question text, change the type (single or
multiple choice), manage answer options, select the correct answers,
and update the explanation. All changes are persisted via the backend
API.

## Files

- `template.html` – Defines the structure of the edit form.
- `styles.css` – Scoped styles for the component.
- `x-question-edit.ts` – Web Component implementation. Handles
  loading the question, dynamic option management, validation,
  updating via API and emitting events.
- `apps/api/src/services/question/get.service.ts` – Service to
  retrieve a question.
- `apps/api/src/services/question/update.service.ts` – Service to
  update a question.
- `apps/api/src/plugins/question/get/index.ts` – API route to fetch a
  question.
- `apps/api/src/plugins/question/edit/index.ts` – API route to edit
  a question.
- `apps/api/src/policies/question/edit.policy.ts` – RBAC policy for
  editing questions.

## Endpoints

- `GET /question/:id` – Retrieve a single question by ID. Response
  body matches `questionReadSchema`.
- `PATCH /question/:id` – Update a question. Request body must
  conform to `questionUpdateSchema` (without the `id` field). Requires
  role `editor` or `admin`.

## Events

The `x-question-edit` component emits:

- `question-updated` – Dispatched when the question is successfully
  updated. The updated question is included in `event.detail.question`.
- `edit-cancel` – Dispatched when the user cancels editing. Parent
  components should listen for this to hide the editor.

## DoD

- [x] UI component loads existing question and displays fields.
- [x] User can edit question text, type, options, correct answers,
      and explanation.
- [x] At least two options and one correct answer are required.
- [x] PATCH request updates question; UI refreshes with updated data.
- [x] Emits `question-updated` and `edit-cancel` events.
- [x] API enforces RBAC (editor or admin only).
- [x] Errors are surfaced to the user via inline messages.