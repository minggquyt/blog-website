export interface CreatePostFormData {
  title: string;
  content: string;
  tagIds: number[]; // Changed from tags to tagIds
  coverImage?: File | null;
  coverImageUrl?: string;
}

export interface CreatePostSubmission {
  title: string;
  content: any; // Allow any type for debugging
  slug: string;
  author_id: string;
  tagIds?: number[]; // Add tagIds back
  cover_image?: string | null; // Add cover_image field
}

export interface PostToDatabase {
  title: string;
  content: string;
  slug: string;
  author_id: string;
}