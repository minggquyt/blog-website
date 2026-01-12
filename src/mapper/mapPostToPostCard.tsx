import type { Post, PostCard} from "../types";

export const mapPostToPostCard = (post: Post): PostCard => {
  return {
    postId: post.id,
    postTitle: post.title,
    postCreateTime: post.createdAt,

    postRoles: post.roles,

    postTotalReacts: post.totalReacts,
    postTotalComments: post.commentsCount,
    postTotalSave: post.numberBookmarked,

    postAuthorId: post.author.id,
    postAuthorName: post.author.name,
    postAuthorAvatar: post.author.avatar,
  };
};

