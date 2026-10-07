export interface Comment {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
}

export interface CommentsResponse {
  data: Comment[];
  meta: {
    totalComments: number;
    returnedCount: number;
    sort: 'newest' | 'oldest';
  };
}

export interface GetCommentsParameters {
  limit?: number;
  sort?: 'newest' | 'oldest';
  userEmail?: string;
}

export interface PostCommentParameters {
  userEmail: string;
  authorName: string;
  text: string;
}

export interface PostCommentResponse {
  data: {
    commentId: string;
    authorName: string;
    text: string;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    createdAt: string;
  };
}

export interface PostCommentLikeResponse {
  data: {
    isLikedByCurrentUser: boolean;
    likesCount: number;
  };
}
