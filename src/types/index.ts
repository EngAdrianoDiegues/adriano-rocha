export type ShelfStatus = 'want_to_read' | 'reading' | 'read' | 'abandoned';

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  translator?: string;
  coverUrl: string;
  publishedYear: number;
  pages: number;
  genres: string[];
  synopsis: string;
  publisher: string;
  isbn: string;
  rating: number; // 0 to 5.0 (or out of 10)
  ratingCount: number;
  ratingsDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  featuredQuote?: {
    text: string;
    speaker?: string;
    page?: number;
  };
  edition?: string;
  rank?: number;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  rating: number; // 0.5 to 5.0
  content: string;
  containsSpoilers: boolean;
  createdAt: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  commentsCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface FeedActivity {
  id: string;
  type: 'review' | 'status_update' | 'quote' | 'shelf_add';
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  timestamp: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  rating?: number;
  progress?: {
    currentPage: number;
    totalPages: number;
    percentage: number;
  };
  content?: string;
  quote?: string;
  shelfStatus?: ShelfStatus;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export interface ShelfItem {
  bookId: string;
  status: ShelfStatus;
  userRating?: number;
  progressPages: number;
  dateStarted?: string;
  dateFinished?: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface BookClub {
  id: string;
  name: string;
  tagline: string;
  category: string;
  currentBookId: string;
  membersCount: number;
  nextMeeting: string;
  discussionTopic: string;
  discussionsCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  readingGoalYear: {
    target: number;
    current: number;
  };
  favoriteBookIds: string[];
  followersCount: number;
  followingCount: number;
  joinedDate: string;
}
