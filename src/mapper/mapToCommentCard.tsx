// import type { CommentCardData } from "../types/comments";

// export function mapToCommentCard(db: any): CommentCardData {
//   return {
//     id: db.id,
//     content: db.content,

//     user: {
//       id: db.user_profiles?.id ?? "",
//       name: db.user_profiles?.display_name ?? "Unknown user",
//       avatarUrl: db.user_profiles?.avatar_url ?? "/images/users/default.png",
//     },

//     createdAt: db.created_at,
//     likes: db.likes_count ?? 0, 

//     canReply: db.level <= 3,     

//     imageUrl: db.image ?? undefined,
//   };
// }
