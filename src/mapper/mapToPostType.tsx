import type { Post } from "../types";

export function mapToPostType(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    createdAt: row.created_at,
    content: row.content,
    background: row.cover_image,

    author: {
      id: row.user_profile?.id,
      name: row.user_profile?.display_name,
      avatar: row.user_profile?.avatar_url
    },

    tags: row.posts_tags?.map((pt: any) => pt.tags.tag_slug) ?? [],

    commentsCount: row.comments?.[0]?.count ?? 0,

    totalReacts: row.users_posts_like?.[0]?.count ?? 0,

    reactions: [],

    roles: [],

    numberBookmarked: 0 
  };
}
