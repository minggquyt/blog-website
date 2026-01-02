export type ReactionType =
  | "like"
  | "love"
  | "sad"
  | "wow"
  | "angry";

export interface Reaction {
  type: ReactionType;
  emoji: string;
  count: number;
}
