import type { Author } from "./author";
import type { Reaction } from "./reaction";

// Posts = post[]
export interface PostContent {
  id: number;
  value: string;
}

export interface Post {
  id: number; // sửa thành string
  title: string;
  slug: string;
  author: Author;
  createdAt: string;
  roles: string[];
  tags: string[];
  reactions: Reaction[];
  totalReacts: number;
  numberBookmarked: number;
  commentsCount: number;
  content: PostContent[];
  background: string;
}

export type Posts = Post[];

// PostList == PostCard()
export interface PostCard {
  postId: Post["id"];
  postTitle: Post["title"];
  postCreateTime: Post["createdAt"];

  postRoles: Post["roles"];

  postTotalReacts: Post["totalReacts"];
  postTotalComments: Post["commentsCount"];
  postTotalSave: Post["numberBookmarked"];

  postAuthorId: Post["author"]["id"];
  postAuthorName: Post["author"]["name"];
  postAuthorAvatar: Post["author"]["avatar"];
}

export type PostList = PostCard[];

// PostFilterProps
export type PostFilter = {
  type: "tag" | "author";
  value: string;
}

// PostDetailParams
export type PostDetailParams = {
  userId: string;
  postId: string;
}
