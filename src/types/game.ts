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

export interface GameDetailsRecord {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}

export interface GameDetailsSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface GameDetails {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: GameDetailsSpecs;
  topRecords: GameDetailsRecord[];
}

export interface GameDetailsResponse {
  data: GameDetails;
}
