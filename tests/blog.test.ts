import { test } from "node:test";
import assert from "node:assert/strict";
import { getAdjacentPosts, posts } from "../src/lib/blog";

test("the first post has a previous post and no next post", () => {
  const { prev, next } = getAdjacentPosts(posts[0].slug);
  assert.equal(prev?.slug, posts[1].slug);
  assert.equal(next, null);
});

test("the last post has a next post and no previous post", () => {
  const { prev, next } = getAdjacentPosts(posts[posts.length - 1].slug);
  assert.equal(prev, null);
  assert.equal(next?.slug, posts[posts.length - 2].slug);
});

test("an unknown slug has no neighbours", () => {
  assert.deepEqual(getAdjacentPosts("tidak-ada"), { prev: null, next: null });
});
