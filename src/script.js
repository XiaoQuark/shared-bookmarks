// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData } from "./storage.js";

window.onload = function () {
  const users = getUserIds();
  populateUserDropdown(users);
  const userSelect = document.getElementById("user-select");
  userSelect.addEventListener("change", handleUserChange)
};

function populateUserDropdown(users) {
  const userSelect = document.getElementById("user-select");

  for (const user of users) {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `User ${user}`;
    userSelect.appendChild(option);
  }
}

function handleUserChange (event) {
	const userId = event.target.value;
	const form = document.getElementById("add-bookmark");
	const statusMessage = document.getElementById("status-message");

	if(!userId) return;

	form.hidden = false;

	const bookmarks = getData(userId);

	if (!bookmarks || bookmarks.length === 0) {
		statusMessage.textContent = `No bookmarks yet for User ${userId}`;
	} else {
		statusMessage.textContent = "";
	}
}