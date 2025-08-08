QCM Player Feature
==================

## Purpose

This feature provides a Web Component (`x-qcm-player`) that allows
users to run a quiz for a given QCM. It fetches the QCM from the
backend, displays questions page by page, records user answers,
tracks elapsed time, computes a final score, and presents a summary.
After completion, it emits a `quiz-finished` event so the parent
component can respond (e.g. navigate back to the list).

## Files

- `template.html` – Defines the base structure of the player (timer,
  page container, navigation, result container).
- `styles.css` – Styles specific to the quiz player.
- `x-qcm-player.ts` – Web Component logic. Handles loading the QCM,
  rendering pages and questions, storing user answers, timing, scoring
  and dispatching events.

## Behavior

1. **Loading**: When a `qcm-id` attribute is provided, the component
   fetches the QCM from `GET /qcm/:id` and stores it locally.
2. **Timer**: A timer starts when the quiz is ready. The elapsed
   time is displayed at the top.
3. **Navigation**: Users can navigate with “Previous” and “Next”
   buttons. On the last page, the “Next” button becomes “Finish”.
4. **Answering**: For each question, users select one or multiple
   options (depending on question type). Answers are stored in
   memory.
5. **Completion**: On finishing the last page, the component
   calculates the number of correct answers and total questions,
   computes a percentage score, stops the timer, and displays a
   summary (score and time). A “Close” button emits a
   `quiz-finished` event with details.
6. **Events**: The parent component can listen for `quiz-finished`
   (payload: { qcmId, score, correct, total, elapsedSeconds }) to
   update the list or navigate away.

## DoD

- [x] Fetches QCM by ID and displays pages with questions and options.
- [x] Tracks user answers and computes the final score.
- [x] Includes a timer with elapsed minutes and seconds.
- [x] Provides navigation between pages and finish action on last page.
- [x] Shows a summary with score and time upon completion.
- [x] Emits `quiz-finished` event so the parent can react.