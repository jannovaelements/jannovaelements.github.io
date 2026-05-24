/**
 * Google Form connection for the site newsletter signup.
 *
 * Setup (one time):
 * 1. Create a Google Form with "Short answer" questions: "Your name" and "Email address".
 * 2. Open the form → Send → link icon → copy the form URL.
 * 3. From the URL, copy the form ID (between /d/e/ and /viewform), e.g.
 *    https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform  →  1FAIpQLSc...
 * 4. Set formAction below to:
 *    https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
 * 5. Find each field entry id (name="entry.123456789" on the input, or via prefill link):
 *    - nameEntry  → "Your name" question
 *    - emailEntry → "Email address" question
 * 6. Link the form to a Google Sheet (Responses tab) to export subscribers.
 */
window.JANNOVA_NEWSLETTER = {
  formAction: "https://docs.google.com/forms/d/e/1FAIpQLScZNc6OSTKpDzhTaok7u3Fx7ywgHlWohiqcQg2v2jfaYkri8g/formResponse",
  nameEntry: "",
  emailEntry: "entry.1691793274",
};
