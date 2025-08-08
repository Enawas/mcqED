Audit Log List Feature
======================

## Purpose

This feature provides a Web Component (`x-audit-list`) that displays
audit logs captured by the system. Only users with appropriate
permissions (typically administrators) can access this view. The
component allows filtering logs by entity, entity ID, user ID and
limit, and displays before/after snapshots of the audited objects.

## Files

* `template.html` – Defines the structure of the filter form and log display.
* `styles.css` – Scoped styles for the component.
* `x-audit-list.ts` – Web Component implementation. Handles loading
  logs from the backend, applying filters, and rendering results.
* `README.md` – This documentation file.

## API Endpoint

* `GET /audit?entity=&entityId=&userId=&limit=` – Returns an array of
  audit events as defined by `AuditEvent` schema. Requires role
  `'admin'` by default.

## Usage

1. Navigate to the audit view (e.g. via toolbar button).
2. Optionally enter filter criteria in the form and click **Filter**.
3. The list will update with matching logs. Each entry shows:
   - Timestamp and event type.
   - Entity and optional entity/user IDs.
   - JSON snapshots of the object before and after the operation.
4. Click **Back** to return to the previous view.

## Events

* `audit-cancel` – Dispatched when the user clicks the **Back**
  button. Parent components should handle this event to navigate
  away from the audit view.

## DoD

* [x] Displays list of audit logs with before/after snapshots.
* [x] Allows filtering by entity, entity ID, user ID and limit.
* [x] Shows an error message when access is forbidden.
* [x] Emits `audit-cancel` when the user leaves the audit view.