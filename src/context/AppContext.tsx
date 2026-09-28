import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Review,
  FeedActivity,
  ShelfItem,
  UserProfile,
  ShelfStatus,
  BookClub,
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_REVIEWS,
  INITIAL_FEED,
  INITIAL_SHELVES,
  INITIAL_USER,
  INITIAL_CLUBS,
} from '../data/initialData';

interface AppContextType {
  books: Book[];
  reviews: Review[];
  feed: FeedActivity[];
  shelves: ShelfItem[];
  user: UserProfile;
  clubs: BookClub[];
  activeTab: 'catalog' | 'top100' | 'feed' | 'shelves' | 'clubs' | 'profile';
  setActiveTab: (tab: 'catalog' | 'top100' | 'feed' | 'shelves' | 'clubs' | 'profile') => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  selectedBookId: string | null;
  openBookDetail: (bookId: string) => void;
  closeBookDetail: () => void;
  
  // Shelf actions
  getUserShelfStatus: (bookId: string) => ShelfStatus | null;
  getUserRating: (bookId: string) => number | undefined;
  getUserShelfItem: (bookId: string) => ShelfItem | undefined;
  updateShelfStatus: (bookId: string, status: ShelfStatus) => void;
  updateReadingProgress: (bookId: string, page: number, note?: string) => void;
  rateBook: (bookId: string, rating: number, reviewContent?: string, containsSpoilers?: boolean, tags?: string[]) => void;
  toggleFavorite: (bookId: string) => void;
  
  // Social feed actions
  likeActivity: (activityId: string) => void;
  addActivityComment: (activityId: string, text: string) => void;
  createPost: (content: string, type: 'status_update' | 'quote', bookId?: string, quote?: string) => void;
  likeReview: (reviewId: string) => void;
  
  // Book catalogue
  addNewBook: (newBook: Omit<Book, 'id' | 'rating' | 'ratingCount' | 'ratingsDistribution' | 'rank'>) => Book;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals state
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewTargetBook: Book | null;
  openReviewModal: (book: Book) => void;
  
  isAddBookModalOpen: boolean;
  setIsAddBookModalOpen: (open: boolean) => void;
  
  isProgressModalOpen: boolean;
  setIsProgressModalOpen: (open: boolean) => void;
  progressTargetBook: Book | null;
  openProgressModal: (book: Book) => void;

  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('libris_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('libris_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [feed, setFeed] = useState<FeedActivity[]>(() => {
    const saved = localStorage.getItem('libris_feed');
    return saved ? JSON.parse(saved) : INITIAL_FEED;
  });

  const [shelves, setShelves] = useState<ShelfItem[]>(() => {
    const saved = localStorage.getItem('libris_shelves');
    return saved ? JSON.parse(saved) : INITIAL_SHELVES;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('libris_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [clubs] = useState<BookClub[]>(INITIAL_CLUBS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'top100' | 'feed' | 'shelves' | 'clubs' | 'profile'>('catalog');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetBook, setReviewTargetBook] = useState<Book | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressTargetBook, setProgressTargetBook] = useState<Book | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('libris_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('libris_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('libris_feed', JSON.stringify(feed));
  }, [feed]);

  useEffect(() => {
    localStorage.setItem('libris_shelves', JSON.stringify(shelves));
  }, [shelves]);

  useEffect(() => {
    localStorage.setItem('libris_user', JSON.stringify(user));
  }, [user]);

  const selectedBook = books.find((b) => b.id === selectedBookId) || null;

  const openBookDetail = (bookId: string) => {
    setSelectedBookId(bookId);
  };

  const closeBookDetail = () => {
    setSelectedBookId(null);
  };

  const setSelectedBook = (book: Book | null) => {
    setSelectedBookId(book ? book.id : null);
  };

  const getUserShelfItem = (bookId: string) => {
    return shelves.find((s) => s.bookId === bookId);
  };

  const getUserShelfStatus = (bookId: string): ShelfStatus | null => {
    const item = getUserShelfItem(bookId);
    return item ? item.status : null;
  };

  const getUserRating = (bookId: string): number | undefined => {
    const item = getUserShelfItem(bookId);
    return item?.userRating;
  };

  const updateShelfStatus = (bookId: string, status: ShelfStatus) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    setShelves((prev) => {
      const existingIndex = prev.findIndex((s) => s.bookId === bookId);
      const isNew = existingIndex === -1;
      let updated: ShelfItem[];

      if (isNew) {
        updated = [
          ...prev,
          {
            bookId,
            status,
            progressPages: status === 'read' ? targetBook.pages : 0,
            dateStarted: status === 'reading' ? new Date().toISOString().split('T')[0] : undefined,
            dateFinished: status === 'read' ? new Date().toISOString().split('T')[0] : undefined,
          },
        ];
      } else {
        updated = prev.map((s, idx) => {
          if (idx === existingIndex) {
            return {
              ...s,
              status,
              progressPages: status === 'read' ? targetBook.pages : s.progressPages,
              dateFinished: status === 'read' ? new Date().toISOString().split('T')[0] : s.dateFinished,
            };
          }
          return s;
        });
      }

      // Add activity to feed
      const statusLabels: Record<ShelfStatus, string> = {
        reading: 'começou a ler',
        read: 'marcou como lido',
        want_to_read: 'adicionou à lista Quero Ler',
        abandoned: 'abandonou a leitura de',
      };

      const newAct: FeedActivity = {
        id: 'act-' + Date.now(),
        type: 'shelf_add',
        userId: user.id,
        userName: user.name,
        userHandle: '@' + user.username,
        userAvatar: user.avatar,
        timestamp: 'Agora mesmo',
        bookId,
        bookTitle: targetBook.title,
        bookAuthor: targetBook.author,
        bookCover: targetBook.coverUrl,
        shelfStatus: status,
        content: `${user.name} ${statusLabels[status]} "${targetBook.title}".`,
        likes: 0,
        isLiked: false,
        comments: [],
      };

      setFeed((f) => [newAct, ...f]);

      // If marked as read, update user goal count
      if (status === 'read') {
        setUser((u) => ({
          ...u,
          readingGoalYear: {
            ...u.readingGoalYear,
            current: u.readingGoalYear.current + 1,
          },
        }));
      }

      return updated;
    });
  };

  const updateReadingProgress = (bookId: string, page: number, note?: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setShelves((prev) => {
      const idx = prev.findIndex((s) => s.bookId === bookId);
      const isFinished = page >= book.pages;
      const status: ShelfStatus = isFinished ? 'read' : 'reading';

      if (idx === -1) {
        return [
          ...prev,
          {
            bookId,
            status,
            progressPages: page,
            notes: note,
            dateStarted: new Date().toISOString().split('T')[0],
            dateFinished: isFinished ? new Date().toISOString().split('T')[0] : undefined,
          },
        ];
      } else {
        return prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                status,
                progressPages: page,
                notes: note || s.notes,
                dateFinished: isFinished ? new Date().toISOString().split('T')[0] : s.dateFinished,
              }
            : s
        );
      }
    });

    // Feed event
    const pct = Math.min(100, Math.round((page / book.pages) * 100));
    const newAct: FeedActivity = {
      id: 'act-' + Date.now(),
      type: 'status_update',
      userId: user.id,
      userName: user.name,
      userHandle: '@' + user.username,
      userAvatar: user.avatar,
      timestamp: 'Agora mesmo',
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverUrl,
      progress: {
        currentPage: page,
        totalPages: book.pages,
        percentage: pct,
      },
      content: note || (pct === 100 ? `Concluiu a leitura de "${book.title}"!` : `Atingiu a página ${page} (${pct}% concluído).`),
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setFeed((f) => [newAct, ...f]);
  };

  const toggleFavorite = (bookId: string) => {
    setShelves((prev) => {
      return prev.map((item) =>
        item.bookId === bookId ? { ...item, isFavorite: !item.isFavorite } : item
      );
    });

    setUser((u) => {
      const exists = u.favoriteBookIds.includes(bookId);
      return {
        ...u,
        favoriteBookIds: exists
          ? u.favoriteBookIds.filter((id) => id !== bookId)
          : [...u.favoriteBookIds, bookId].slice(0, 4), // max 4 Letterboxd-style
      };
    });
  };

  const rateBook = (
    bookId: string,
    rating: number,
    reviewContent?: string,
    containsSpoilers: boolean = false,
    tags: string[] = []
  ) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    // Update shelf item
    setShelves((prev) => {
      const idx = prev.findIndex((s) => s.bookId === bookId);
      if (idx === -1) {
        return [
          ...prev,
          {
            bookId,
            status: 'read',
            userRating: rating,
            progressPages: book.pages,
            dateFinished: new Date().toISOString().split('T')[0],
          },
        ];
      } else {
        return prev.map((s, i) =>
          i === idx ? { ...s, userRating: rating, status: 'read' } : s
        );
      }
    });

    // Update book average score and count
    setBooks((prev) => {
      return prev.map((b) => {
        if (b.id === bookId) {
          const newCount = b.ratingCount + 1;
          const starIndex = Math.min(5, Math.max(1, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
          const newDist = {
            ...b.ratingsDistribution,
            [starIndex]: (b.ratingsDistribution[starIndex] || 0) + 1,
          };
          const newAvg = Number(((b.rating * b.ratingCount + rating) / newCount).toFixed(2));
          return {
            ...b,
            rating: newAvg,
            ratingCount: newCount,
            ratingsDistribution: newDist,
          };
        }
        return b;
      });
    });

    // Create review if written content exists
    if (reviewContent && reviewContent.trim().length > 0) {
      const newReview: Review = {
        id: 'rev-' + Date.now(),
        bookId,
        bookTitle: book.title,
        bookCover: book.coverUrl,
        bookAuthor: book.author,
        userId: user.id,
        userName: user.name,
        userHandle: '@' + user.username,
        userAvatar: user.avatar,
        rating,
        content: reviewContent.trim(),
        containsSpoilers,
        createdAt: 'Agora mesmo',
        likesCount: 0,
        isLikedByCurrentUser: false,
        commentsCount: 0,
        tags: tags.length ? tags : ['Avaliação'],
      };

      setReviews((r) => [newReview, ...r]);

      // Add to feed
      const newAct: FeedActivity = {
        id: 'act-' + Date.now(),
        type: 'review',
        userId: user.id,
        userName: user.name,
        userHandle: '@' + user.username,
        userAvatar: user.avatar,
        timestamp: 'Agora mesmo',
        bookId,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.coverUrl,
        rating,
        content: reviewContent.trim(),
        likes: 0,
        isLiked: false,
        comments: [],
      };
      setFeed((f) => [newAct, ...f]);
    }
  };

  const likeActivity = (activityId: string) => {
    setFeed((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const nextState = !act.isLiked;
          return {
            ...act,
            isLiked: nextState,
            likes: nextState ? act.likes + 1 : act.likes - 1,
          };
        }
        return act;
      })
    );
  };

  const addActivityComment = (activityId: string, text: string) => {
    if (!text.trim()) return;
    setFeed((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const newComment = {
            id: 'comm-' + Date.now(),
            userName: user.name,
            userHandle: '@' + user.username,
            userAvatar: user.avatar,
            text: text.trim(),
            createdAt: 'Agora mesmo',
          };
          return {
            ...act,
            comments: [...act.comments, newComment],
          };
        }
        return act;
      })
    );
  };

  const createPost = (
    content: string,
    type: 'status_update' | 'quote',
    bookId?: string,
    quote?: string
  ) => {
    const book = bookId ? books.find((b) => b.id === bookId) : undefined;
    const newAct: FeedActivity = {
      id: 'act-' + Date.now(),
      type,
      userId: user.id,
      userName: user.name,
      userHandle: '@' + user.username,
      userAvatar: user.avatar,
      timestamp: 'Agora mesmo',
      bookId: book ? book.id : '',
      bookTitle: book ? book.title : '',
      bookAuthor: book ? book.author : '',
      bookCover: book ? book.coverUrl : '',
      content: content.trim(),
      quote: quote ? quote.trim() : undefined,
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setFeed((prev) => [newAct, ...prev]);
  };

  const likeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const next = !r.isLikedByCurrentUser;
          return {
            ...r,
            isLikedByCurrentUser: next,
            likesCount: next ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const addNewBook = (newBookData: Omit<Book, 'id' | 'rating' | 'ratingCount' | 'ratingsDistribution' | 'rank'>): Book => {
    const newBook: Book = {
      ...newBookData,
      id: 'book-' + Date.now(),
      rating: 5.0,
      ratingCount: 1,
      ratingsDistribution: {
        5: 1,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      rank: books.length + 1,
    };
    setBooks((prev) => [newBook, ...prev]);
    return newBook;
  };

  const openReviewModal = (book: Book) => {
    setReviewTargetBook(book);
    setIsReviewModalOpen(true);
  };

  const openProgressModal = (book: Book) => {
    setProgressTargetBook(book);
    setIsProgressModalOpen(true);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  return (
    <AppContext.Provider
      value={{
        books,
        reviews,
        feed,
        shelves,
        user,
        clubs,
        activeTab,
        setActiveTab,
        selectedBook,
        setSelectedBook,
        selectedBookId,
        openBookDetail,
        closeBookDetail,
        getUserShelfStatus,
        getUserRating,
        getUserShelfItem,
        updateShelfStatus,
        updateReadingProgress,
        rateBook,
        toggleFavorite,
        likeActivity,
        addActivityComment,
        createPost,
        likeReview,
        addNewBook,
        searchQuery,
        setSearchQuery,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewTargetBook,
        openReviewModal,
        isAddBookModalOpen,
        setIsAddBookModalOpen,
        isProgressModalOpen,
        setIsProgressModalOpen,
        progressTargetBook,
        openProgressModal,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
