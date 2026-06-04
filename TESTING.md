# TESTING.md

## The website must contain a drop-down which lists five users

- Verified that the dropdown contains five user options, one for each available user.
- Confirmed that all users can be selected in the browser.

## Selecting a user must display the list of bookmarks for the relevant user

- Verified that selecting a user updates the displayed bookmarks.
- Used browser console logging during development to confirm that the correct user's bookmarks were being retrieved.
- Confirmed that the bookmarks rendered on the page match the bookmarks stored for that user in localStorage.

## If there are no bookmarks for the selected user, a message is displayed to explain this

- Verified that a message is displayed when selecting a user with no bookmarks.
- Verified that the message is hidden when bookmarks exist.
- Cleared localStorage and refreshed the page to confirm the empty-state message appears correctly.

## The list of bookmarks must be shown in reverse chronological order

- Created multiple bookmarks in succession and confirmed that the newest bookmark appears first in the list.
- Compared bookmark timestamps to verify the order is newest to oldest.
- Unit tests in `script.test.js` verify that `sortBookmarksByNewest()` returns bookmarks in reverse chronological order and does not mutate the original array.

## Each bookmark has a title, description and created at timestamp displayed

- Verified that each rendered bookmark displays a title, description, and creation date.
- Confirmed that the displayed information matches the bookmark data stored in localStorage.

## Each bookmark’s title is a link to the bookmark’s URL

- Verified that bookmark titles are rendered as links.
- Clicked bookmark titles and confirmed that they navigate to the correct URL.

## Each bookmark's "Copy to clipboard" button must copy the URL of the bookmark

- Tested the copy button for multiple bookmarks.
- Pasted the copied value into the browser address bar and confirmed it matches the bookmark URL.
- Verified that visual and screen-reader feedback are provided after copying.

## Each bookmark's like counter works independently, and persists data across sessions

- Verified that clicking a bookmark's like button only updates that bookmark's like count.
- Added likes to multiple bookmarks and confirmed that each counter updates independently.
- Refreshed the page and confirmed that like counts persist in localStorage and remain correctly displayed after rendering.
- Verified that newly created bookmarks start with 0 likes.

## The website must contain a form with inputs for a URL, a title, and a description. The form should have a submit button

- Verified that the form contains a text input for title.
- Verified that the form contains a URL input for the bookmark URL.
- Verified that the form contains a textarea field for description.
- Verified that the form contains a button of type submit.
- Confirmed that all fields are displayed correctly in the browser.
- Attempted to submit the form with empty required fields and confirmed that the browser prevented submission.
- Confirmed that the form is displayed only when a user is selected.

## Submitting the form adds a new bookmark for the relevant user only

- Added bookmarks for multiple users.
- Verified that bookmarks are stored only under the selected user in localStorage.
- Switched between users and confirmed that bookmarks are not shared between users.

## After creating a new bookmark, the list of bookmarks for the current user is shown, including the new bookmark

- Verified that submitting the form immediately updates the displayed bookmark list.
- Confirmed that the newly created bookmark appears in the rendered list.
- Confirmed that existing bookmarks remain visible after adding a new bookmark.

## Duplicate URLs are prevented for a user

- Attempted to add a bookmark using a URL that already existed for the selected user.
- Verified that the bookmark was not added.
- Verified that an error message was displayed to the user.
- Unit tests in `script.test.js`.

## The website must score 100 for accessibility in Lighthouse

- Ran Lighthouse accessibility audits throughout development.
- Confirmed a final Lighthouse accessibility score of 100.
- Tested keyboard navigation to ensure all interactive elements can be reached and operated without a mouse.

## Unit tests must be written for at least one non-trivial function

- Unit tests were written in `script.test.js`.
- Tests verify bookmark validation and duplicate URL prevention.
- Additional tests verify bookmark sorting behaviour.
