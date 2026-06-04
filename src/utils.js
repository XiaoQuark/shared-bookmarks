export function createNewBookmark(bookmarkData) {
	const bookmark = {};
	bookmark.id = crypto.randomUUID();
	bookmark.title = bookmarkData.get("title");
	bookmark.url = bookmarkData.get("url");
	bookmark.description = bookmarkData.get("description");
	bookmark.createdAt = new Date().toISOString();
	bookmark.likes = 0;
	return bookmark;
}
export function formatDate(date) {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(date).toLocaleDateString(undefined, options);
}
export function sortBookmarksByNewest(bookmarks) {
	return bookmarks.toSorted((a, b) => {
		if (b.createdAt > a.createdAt) return 1;
		if (b.createdAt < a.createdAt) return -1;
		return 0;
	});
}
