import assert from "node:assert";
import test from "node:test";
import { validateBookmark } from "./validate.js";
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
