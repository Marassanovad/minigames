export interface Category {
  slug: string;
  label: string;
  isDefault: boolean;
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    totalItems: number;
    description: string;
  };
}
