Auth Login Feature
==================

## Purpose

This feature provides a Web Component (`x-auth-login`) for user
authentication. It presents a simple email/password form and submits
credentials to the backend API. On success, it stores JWT tokens in
localStorage and emits a `login-success` event. On failure, it displays
an inline error message and emits a `login-failure` event.

## Files

- `template.html` – Contains the structure of the login form.
- `styles.css` – Scoped styles for the form.
- `x-auth-login.ts` – Implements the Web Component.
- `README.md` – You are reading it.

## API Endpoint

- `POST /auth/login` – Authenticates a user. Body must conform to
  `loginInputSchema`. Returns a JSON object with `accessToken` and
  optionally `refreshToken` on success. Returns 401 on invalid
  credentials.

## Events

- `login-success` – Fired when login is successful. The component
  stores tokens in `localStorage` and parent components can listen
  to this event to change the application state (e.g. hide the
  login form and display the main app).
- `login-failure` – Fired when login fails (invalid credentials or
  network error). The event detail may contain an error message.

## DoD

- [x] Form fields for email and password.
- [x] Validates required fields.
- [x] Sends POST request to `/auth/login` and handles responses.
- [x] Stores tokens in `localStorage` on success.
- [x] Emits `login-success` and `login-failure` events.
- [x] Displays inline error message.