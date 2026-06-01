// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData, clearData } from "./storage.js";

const state = {
	selectedUserId: null,
};

// to avoid having to pass DOM elements between functions, we can access them once in window.onload and save them in this elements object. This way they will be accessible everywhere in the code.
const elements = {
	userSelect: null,
	bookmarkForm: null,
	titleInput: null,
	urlInput: null,
	descriptionInput: null,
	statusMessage: "",
};

window.onload = function () {
	const users = getUserIds();

	// accessing DOM and saving everything in elements object
	elements.userSelect = document.getElementById("user-select");
	elements.bookmarkForm = document.getElementById("add-bookmark");
	elements.titleInput = document.getElementById("title");
	elements.urlInput = document.getElementById("url");
	elements.descriptionInput = document.getElementById("description");
	elements.statusMessage = document.getElementById("status-message");

	elements.statusMessage.textContent = "Please Select a User";

	populateUserDropdown(users);

	elements.userSelect.addEventListener("change", handleUserChange);
	elements.bookmarkForm.addEventListener("submit", submitBookmark);
};

function populateUserDropdown(users) {
	for (const user of users) {
		const option = document.createElement("option");
		option.value = user;
		option.textContent = `User ${user}`;
		elements.userSelect.appendChild(option);
	}
}

function handleUserChange(event) {
	state.selectedUserId = event.target.value;

	const statusMessage = document.getElementById("status-message");

	if (!state.selectedUserId || state.selectedUserId === null) return;

	elements.titleInput.value = "";
	elements.urlInput.value = "";
	elements.descriptionInput.value = "";

	elements.bookmarkForm.hidden = false;

	const bookmarks = getData(state.selectedUserId);

	renderBookmarks(state.selectedUserId)
}
function submitBookmark(event) {
	event.preventDefault();

	if (!state.selectedUserId) {
		elements.statusMessage.textContent =
			"Please select a user before adding a bookmark";
		return;
	}

	const bookmarkData = new FormData(elements.bookmarkForm);
	const newBookmark = createNewBookmark(bookmarkData);
	addBookmarkToUser(newBookmark);

	elements.titleInput.value = "";
	elements.urlInput.value = "";
	elements.descriptionInput.value = "";
  renderBookmarks(state.selectedUserId);
}

function createNewBookmark(bookmarkData) {
	const bookmark = {};
	bookmark.id = crypto.randomUUID();
	bookmark.title = bookmarkData.get("title");
	bookmark.url = bookmarkData.get("url");
	bookmark.description = bookmarkData.get("description");
	bookmark.createdAt = new Date().toISOString();
	bookmark.likes = 0;
	return bookmark;
}

function addBookmarkToUser(newBookmark) {
	const existingBookmarks = getData(state.selectedUserId) || [];
	const updatedBookmarks = [...existingBookmarks, newBookmark];

	setData(state.selectedUserId, updatedBookmarks);
}
// create helper createBookmarkCard function
function createBookmarkCard (bookmark) {
  const card = document.createElement("article");
  const titleLink = document.createElement("a");
  titleLink.href = bookmark.url;
  titleLink.textContent = bookmark.title;
  const description = document.createElement("p");
  description.textContent = bookmark.description;
  const timeStamp = document.createElement("p");
  timeStamp.textContent = bookmark.createdAt;
  card.appendChild(titleLink);
  card.appendChild(description);
  card.appendChild(timeStamp);
  return card;
}

function renderBookmarks (userId) {
  const bookmarks = getData (userId);
  element.bookmarkList.textContent = "";
  if (!bookmarks || bookmarks.length === 0) {
    elements.statusMessage.textContent = `No bookmarks yet for User ${userId}`;
    return;
  }
  elements.statusMessage.textContent =  "";
  for (bookmark of bookmarks) {
    const newCard =createBookmarkCard(bookmark);
    elements.bookmarkList.appendChild(newCard);
  }
}
