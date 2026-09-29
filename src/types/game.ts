export interface Game {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
}

export interface GamesResponse {
  data: Game[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    appliedFilter: {
      category: string;
      sort: string;
    };
  };
}
