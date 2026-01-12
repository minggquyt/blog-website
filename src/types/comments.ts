export interface CommentUserInfo {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface CommentCardData {
  id: string;
  user: CommentUserInfo;
  createdAt: string;
  content: string;
  likes: number;
  canReply: boolean;
  imageUrl?: string | undefined;
}

export interface CommnetToDb {
  content: string | null,
  author_id: string,
  post_id: string | undefined,
  parent_id: string | null,
  image: string | null
}