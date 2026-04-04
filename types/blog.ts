export interface BlogArticle {
  id: number;
  cat_id: number;
  author_id: number;
  title: string;
  alias: string;
  description: string;
  featured_image: string;
  featured_image_alt_text?: string;
  primary_is_featured?: number;
  is_featured?: number;
  tags_id?: string;
  read_time: number;
  created: string;
  state: number;
}

export interface BlogCategory {
  id: number;
  title: string;
  description: string;
  created: string;
  state: number;
}

export interface BlogAuthor {
  id: number;
  title: string;
  author_bio: string;
  designation: string;
  profile_image: string;
  state: number;
}

export interface BlogApiResponse<T> {
  data: T[];
}
