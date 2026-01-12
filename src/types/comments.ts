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
