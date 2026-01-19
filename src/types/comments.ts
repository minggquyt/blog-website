export interface CommentUserInfo {
  id: string;
  display_name: string;
  avatar_url: string;
}

export interface CommentCardData {
  id: string;
  user_profiles: CommentUserInfo;
  created_at: string;
  content: string;
  likes: number;
  canReply: boolean;
  parent_id: string;
  level: string,
  imageUrl?: string | undefined; 
  children: CommentCardData[];
}

export type CommentCardBuildTree = CommentCardData[];

export interface CommentToDb {
  content: string | null,
  author_id: string,
  post_id: string | undefined,
  parent_id: string | null,
  image: string | null
}