import assert from "node:assert";
import test from "node:test";
import { validateBookmark } from "../src/validate.js";
import { sortBookmarksByNewest } from "../src/utils.js";

// validateBookmark tests
test("Valid URL returns null", () => {
	assert.equal(validateBookmark("https://codeyourfuture.io/", []), null);
});
test("Invalid URL", () => {
	assert.equal(validateBookmark("codeyourfuture/io", []), "Invalid URL");
});
test("duplicate URL", () => {
	const existing = [{ url: "https://developer.mozilla.org/en-US/" }];
	assert.equal(
		validateBookmark("https://developer.mozilla.org/en-US/", existing),
		"URL already exists for this user",
	);
});

// sortBookmarksByNewest tests
const testBookmarks = [
	{
		id: "1",
		title: "Oldest bookmark",
		createdAt: "2025-01-01T10:00:00.000Z",
	},
	{
		id: "2",
		title: "Newest bookmark",
		createdAt: "2025-01-03T10:00:00.000Z",
	},
	{
		id: "3",
		title: "Middle bookmark",
		createdAt: "2025-01-02T10:00:00.000Z",
	},
];

test("sortBookmarksByNewest returns bookmarks in reverse chronological order", () => {
	const sortedBookmarks = sortBookmarksByNewest(testBookmarks);

	assert.deepEqual(
		sortedBookmarks.map((bookmark) => bookmark.title),
		["Newest bookmark", "Middle bookmark", "Oldest bookmark"],
	);
});

test("sortBookmarksByNewest does not mutate the original bookmarks array", () => {
	const controlBookmarks = [
		{
			id: "1",
			title: "Oldest bookmark",
			createdAt: "2025-01-01T10:00:00.000Z",
		},
		{
			id: "2",
			title: "Newest bookmark",
			createdAt: "2025-01-03T10:00:00.000Z",
		},
		{
			id: "3",
			title: "Middle bookmark",
			createdAt: "2025-01-02T10:00:00.000Z",
		},
	];

	sortBookmarksByNewest(testBookmarks);

	assert.deepEqual(testBookmarks, controlBookmarks);
});

test("sortBookmarksByNewest returns a new empty array when passed an empty array", () => {
	const bookmarks = [];

	const sortedBookmarks = sortBookmarksByNewest(bookmarks);

	assert.deepEqual(sortedBookmarks, []);
	assert.notEqual(sortedBookmarks, bookmarks);
});
