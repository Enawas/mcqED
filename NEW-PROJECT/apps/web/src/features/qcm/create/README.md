# QCM Create Feature

Provides a page or modal to create a new QCM.  The `x-qcm-create` custom
element encapsulates a form defined in `template.html` and styled by
`styles.css`.  On submission it sends a POST request to `/qcm` with the
form data using the API contract defined in `@schemas/qcm/qcm.write.ts`.  A
`qcm-created` event is dispatched upon success so that parent components
can refresh the list or navigate to the editor.  Future iterations will
extend this component to allow adding pages and questions inline and to
display validation errors to the user.