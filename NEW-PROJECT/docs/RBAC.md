# Role‑Based Access Control (RBAC)

This document explains how roles and permissions are implemented in the
MCQED monorepo. It complements the setup guide in the README and
should be consulted when configuring users or adding new features.

## Roles

The system defines three roles:

| Role    | Capabilities                                                     |
|---------|------------------------------------------------------------------|
| viewer  | View QCM lists, play quizzes. Cannot create, edit, import,
export or access audit logs.                                            |
| editor  | All viewer capabilities plus the ability to create, edit,
import/export QCMs, pages and questions. Editors can view audit logs.
| admin   | All editor capabilities plus user management and other
administrative tasks.                                                   |

Roles are stored in the `users` table (`role` column) and encoded in
the JWT access token issued during login. The front‑end decodes the
token to determine which controls to display, and the back‑end
policies enforce these permissions for each route.

## Permissions Matrix

| Action                       | viewer | editor | admin |
|-----------------------------|:------:|:------:|:-----:|
| List QCMs                   |   ✓    |   ✓    |   ✓   |
| Play QCMs                   |   ✓    |   ✓    |   ✓   |
| Create QCM                  |        |   ✓    |   ✓   |
| Edit QCM metadata           |        |   ✓    |   ✓   |
| Add/Delete/Reorder pages    |        |   ✓    |   ✓   |
| Rename page                 |        |   ✓    |   ✓   |
| Add/Delete/Reorder questions|        |   ✓    |   ✓   |
| Edit question               |        |   ✓    |   ✓   |
| Import/Export QCM           |        |   ✓    |   ✓   |
| View Audit Logs             |        |   ✓    |   ✓   |
| Manage Users                |        |        |   ✓   |

## Front‑End behaviour

The Web UI hides or disables controls based on the current user’s
role. The root component (`qcm-app`) decodes the access token to
determine the role and only renders buttons for allowed actions. For
example, the “Create QCM”, “Import QCM”, “Export JSON/XML” and
“Audit Logs” buttons are hidden for viewers. Additionally, editors
and admins see page/question editing controls, while viewers see
read‑only displays.

## Back‑End enforcement

All mutating API endpoints are guarded by policies defined in
`apps/api/src/policies`. Each policy exposes a function that
checks the requester’s role (extracted by the JWT plugin) and
returns `true` or `false`. Routes register these policies and
return `403 Forbidden` when access is denied. Audit logs are
generated on every mutation via the `recordAudit` helper in
`apps/api/src/observability/auditWriter.ts`.

## Testing RBAC

Unit tests and end‑to‑end tests should cover the scenarios where
permissions are enforced. See `apps/api/tests/rbac.spec.ts` and
`apps/web/tests/rbac.ui.spec.ts` for examples. When writing tests
ensure that:

* Operations forbidden to viewers result in `403` responses.
* UI elements are not rendered for roles lacking permission.
* Editors can perform all QCM modifications but cannot manage
  users.
* Admins have full control.

With these guidelines, you can safely extend the application
while preserving a secure, role‑aware experience.