import { getUserIds, getData, setData } from "./storage.js";
import {
	createNewBookmark,
	formatDate,
	sortBookmarksByNewest,
} from "./utils.js";
import { validateBookmark } from "./validate.js";

const state = {
	selectedUserId: null,
	bookmarks: [],
};

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

	elements.userSelect = document.getElementById("user-select");
	elements.bookmarkForm = document.getElementById("add-bookmark");
	elements.titleInput = document.getElementById("title");
	elements.urlInput = document.getElementById("url");
	elements.descriptionInput = document.getElementById("description");
	elements.statusMessage = document.getElementById("status-message");
	elements.bookmarkList = document.getElementById("bookmarks");
	elements.bookmarkTemplate = document.getElementById("bookmark-template");

	elements.statusMessage.textContent =
		"Please Select a User to see their bookmarks";

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

	if (!state.selectedUserId || state.selectedUserId === null) {
		state.bookmarks = [];
		elements.bookmarkForm.hidden = true;
		elements.bookmarkList.textContent = "";
		elements.statusMessage.hidden = false;
		elements.statusMessage.textContent =
			"Please Select a User to see their bookmarks";
		return;
	}

	elements.titleInput.value = "";
	elements.urlInput.value = "";
	elements.descriptionInput.value = "";

	elements.bookmarkForm.hidden = false;

	state.bookmarks = getData(state.selectedUserId) || [];

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

	const error = validateBookmark(bookmarkData.get("url"), state.bookmarks);
	if (error) {
		elements.statusMessage.hidden = false;
		elements.statusMessage.textContent = error;
		return;
	}

	const newBookmark = createNewBookmark(bookmarkData);
	addBookmarkToUser(newBookmark);

	elements.titleInput.value = "";
	elements.urlInput.value = "";
	elements.descriptionInput.value = "";

	renderBookmarks(state.selectedUserId);
}

function addBookmarkToUser(newBookmark) {
	state.bookmarks = [...state.bookmarks, newBookmark];
	setData(state.selectedUserId, state.bookmarks);
}

function handleCopy(bookmark) {
	navigator.clipboard.writeText(bookmark.url);
}

function handleLikes(bookmark) {
	state.bookmarks = state.bookmarks.map((b) =>
		b.id === bookmark.id ? { ...b, likes: b.likes + 1 } : b,
	);
	setData(state.selectedUserId, state.bookmarks);
	const likedBookmark = state.bookmarks.find((b) => b.id === bookmark.id);
	return likedBookmark.likes;
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
	const tooltip = template.querySelector("[tooltip]");
	const copyFeedback = template.querySelector("[copy-feedback]");
	template.querySelector("[copy-link]").addEventListener("click", () => {
		handleCopy(bookmark);
		tooltip.textContent = "Link Copied!";
		copyFeedback.textContent = "Link copied to clipboard";
		setTimeout(() => {
			tooltip.textContent = "Copy Link";
			copyFeedback.textContent = "";
		}, 2000);
	});
	template.querySelector("[like-button]").addEventListener("click", () => {
		const newLikes = handleLikes(bookmark);
		likesCounter.textContent = `${newLikes} Likes`;
	});
	return template;
}

function renderBookmarks(userId) {
	elements.statusMessage.hidden = false;
	elements.bookmarkList.textContent = "";
	if (!state.bookmarks || state.bookmarks.length === 0) {
		elements.statusMessage.textContent = `No bookmarks yet for User ${userId}`;
		return;
	}
	elements.statusMessage.hidden = true;
	const sortedBookmarks = sortBookmarksByNewest(state.bookmarks);
	for (const bookmark of sortedBookmarks) {
		const newCard = createBookmarkCard(bookmark);
		elements.bookmarkList.appendChild(newCard);
	}
}
