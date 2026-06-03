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
	bookmarkList: null,
	bookmarkTemplate: null,
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
	elements.bookmarkList = document.getElementById("bookmarks");
	elements.bookmarkTemplate = document.getElementById("bookmark-template");

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

	if (!state.selectedUserId || state.selectedUserId === null) return;

	elements.titleInput.value = "";
	elements.urlInput.value = "";
	elements.descriptionInput.value = "";

	elements.bookmarkForm.hidden = false;

	const bookmarks = getData(state.selectedUserId);

	renderBookmarks(state.selectedUserId);
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

function handleCopy(bookmark) {
	navigator.clipboard.writeText(bookmark.url);
}

function handleLikes(bookmark, likesCounter) {
	const bookmarks = getData(state.selectedUserId);
	const likedBookmark = bookmarks.find((b) => b.id === bookmark.id);
	likedBookmark.likes++;
	setData(state.selectedUserId, bookmarks);
	likesCounter.textContent = `${likedBookmark.likes} Likes`;
	return likesCounter;
}

function formatDate(date) {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(date).toLocaleDateString(undefined, options);
}

// create helper createBookmarkCard function
function createBookmarkCard(bookmark) {
	const template = elements.bookmarkTemplate.content.cloneNode(true);
	const card = template.querySelector("article");
	card.id = bookmark.id;
	template.querySelector("[bookmark-title]").textContent = bookmark.title;
	template.querySelector("[bookmark-title]").href = bookmark.url;
	template.querySelector("[bookmark-description]").textContent =
		bookmark.description;
	template.querySelector("[created-at]").textContent = formatDate(
		bookmark.createdAt,
	);
	const likesCounter = template.querySelector("[likes-counter]");
	likesCounter.textContent = `${bookmark.likes} Likes`;
	template
		.querySelector("[copy-link]")
		.addEventListener("click", () => handleCopy(bookmark));
	template
		.querySelector("[like-button]")
		.addEventListener("click", () => handleLikes(bookmark, likesCounter));
	return template;
}

function renderBookmarks(userId) {
	const bookmarks = getData(userId);
	elements.statusMessage.hidden = false;
	elements.bookmarkList.textContent = "";
	if (!bookmarks || bookmarks.length === 0) {
		elements.statusMessage.textContent = `No bookmarks yet for User ${userId}`;
		return;
	}
	elements.statusMessage.hidden = true;
	const sortedBookmarks = bookmarks.toSorted((a, b) => {
		if (b.createdAt > a.createdAt) return 1;
		if (b.createdAt < a.createdAt) return -1;
		return 0;
	});
	for (const bookmark of sortedBookmarks) {
		const newCard = createBookmarkCard(bookmark);
		elements.bookmarkList.appendChild(newCard);
	}
}
