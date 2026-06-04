export function validateBookmark(url, existingBookmarks) {
  try {
    new URL(url);
  } catch {
    return "Invalid URL";
  }
  const isDuplicate = existingBookmarks.some((b) => b.url === url);
  if (isDuplicate) {
    return "URL already exists for this user";
  }
  return null;
}
