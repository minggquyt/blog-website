import type { Posts, PostList } from "../types";
import { mapPostToPostCard } from "./mapPostToPostCard";

export function mapPostsToPostList(posts: Posts): PostList {
  return posts.map(post => mapPostToPostCard(post));
}