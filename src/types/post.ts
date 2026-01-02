import type { Author } from "./author";
import type { Reaction } from "./reaction";

export interface Post {
  id: number;
  title: string;
  slug: string;
  author: Author;
  createdAt: string;
  roles: string[];
  tags: string[];
  reactions: Reaction[];
  commentsCount: number;
  isBookmarked: boolean;
}

export type Posts = Post[];
