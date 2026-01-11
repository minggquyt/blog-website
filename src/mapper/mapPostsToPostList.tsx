import type { Post, PostList } from "../types";
import { mapPostToPostCard } from "./mapPostToPostCard";

export function mapPostsToPostList(posts: Post[]): PostList{
    return posts.map(post => mapPostToPostCard(post));
}