export interface Tag {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface TagSupababase {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null; 
  tag_slug: string;
}