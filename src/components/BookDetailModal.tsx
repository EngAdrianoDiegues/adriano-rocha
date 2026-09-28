import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from './StarRating';
import {
  X,
  Star,
  BookOpen,
  Check,
  Clock,
  Heart,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Calendar,
  Layers,
  Building,
  Hash,
  Eye,
  EyeOff,
  Edit3,
} from 'lucide-react';
import { ShelfStatus } from '../types';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    closeBookDetail,
    getUserShelfStatus,
    getUserRating,
    getUserShelfItem,
    updateShelfStatus,
    rateBook,
    toggleFavorite,
    openReviewModal,
    openProgressModal,
    reviews,
    likeReview,
    books,
    openBookDetail,
  } = useApp();

  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedBook) return null;

  const currentShelfStatus = getUserShelfStatus(selectedBook.id);
  const userRating = getUserRating(selectedBook.id);
  const shelfItem = getUserShelfItem(selectedBook.id);
  const isFav = shelfItem?.isFavorite;

  // Filter reviews for this book
  const bookReviews = reviews.filter((r) => r.bookId === selectedBook.id);

  // Recommendations
  const relatedBooks = books
    .filter(
      (b) =>
        b.id !== selectedBook.id &&
        b.genres.some((g) => selectedBook.genres.includes(g))
    )
    .slice(0, 3);

  // Calculate rating distribution percentages
  const dist = selectedBook.ratingsDistribution;
  const totalDist = dist[5] + dist[4] + dist[3] + dist[2] + dist[1] || 1;

  const toggleSpoiler = (reviewId: string) => {
    setRevealedSpoilers((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#12151b] border border-stone-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800/80 bg-stone-900/50">
          <div className="flex items-center gap-3">
            {selectedBook.rank && (
              <span className="font-mono text-xs text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                Top #{selectedBook.rank} IMDb dos Livros
              </span>
            )}
            <span className="text-xs text-stone-400">
              {selectedBook.genres.join(' · ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
              title="Copiar link"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && <span className="text-[11px] text-amber-400">Copiado!</span>}
            </button>
            <button
              onClick={closeBookDetail}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-8">
          {/* Main Book Hero Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Cover + Quick Shelves */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shadow-xl">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Personal Action Box */}
              <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-300">Minha Leitura</span>
                  <button
                    onClick={() => toggleFavorite(selectedBook.id)}
                    className={`p-1.5 rounded transition-colors ${
                      isFav ? 'text-rose-400 bg-rose-500/10' : 'text-stone-500 hover:text-stone-300'
                    }`}
                    title={isFav ? 'Favoritado' : 'Favoritar'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Status Segmented Buttons */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-950 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => updateShelfStatus(selectedBook.id, 'want_to_read')}
                    className={`py-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
                      currentShelfStatus === 'want_to_read'
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Quero Ler
                  </button>
                  <button
                    onClick={() => updateShelfStatus(selectedBook.id, 'reading')}
                    className={`py-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
                      currentShelfStatus === 'reading'
                        ? 'bg-sky-500/20 text-sky-300 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    Lendo
                  </button>
                  <button
                    onClick={() => updateShelfStatus(selectedBook.id, 'read')}
                    className={`py-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
                      currentShelfStatus === 'read'
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    Lido
                  </button>
                </div>

                {/* Reading Progress Trigger if reading */}
                {currentShelfStatus === 'reading' && (
                  <button
                    onClick={() => openProgressModal(selectedBook)}
                    className="w-full py-1.5 px-3 text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Atualizar Progresso ({shelfItem?.progressPages || 0}/{selectedBook.pages} págs)
                  </button>
                )}

                {/* Personal Rating Picker */}
                <div className="pt-2 border-t border-stone-800/80">
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                    <span>Sua Avaliação:</span>
                    <span className="font-mono text-amber-400 font-semibold">
                      {userRating ? `${userRating.toFixed(1)} ★` : 'Não avaliado'}
                    </span>
                  </div>
                  <div className="flex justify-center py-1">
                    <StarRating
                      rating={userRating || 0}
                      size="lg"
                      interactive
                      onRate={(r) => rateBook(selectedBook.id, r)}
                    />
                  </div>
                </div>

                {/* Write Review Button */}
                <button
                  onClick={() => openReviewModal(selectedBook)}
                  className="w-full py-2 px-3 text-xs font-medium text-stone-100 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Escrever Resenha
                </button>
              </div>
            </div>

            {/* Right Book Meta & Statistics */}
            <div className="md:col-span-8 flex flex-col space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                  {selectedBook.title}
                </h1>
                {selectedBook.originalTitle && selectedBook.originalTitle !== selectedBook.title && (
                  <p className="text-xs text-stone-400 italic mt-0.5">
                    Título original: {selectedBook.originalTitle}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-sm text-stone-300 mt-2">
                  <span className="font-medium text-amber-300">{selectedBook.author}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span className="font-mono tabular-nums">{selectedBook.publishedYear}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span className="font-mono tabular-nums">{selectedBook.pages} páginas</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span className="text-stone-400">{selectedBook.publisher}</span>
                </div>
              </div>

              {/* IMDb Rating Dashboard Block */}
              <div className="p-4 sm:p-5 bg-stone-900/60 border border-stone-800 rounded-xl flex flex-col sm:flex-row gap-6 items-center">
                {/* Score highlight */}
                <div className="flex flex-col items-center justify-center text-center sm:border-r border-stone-800 sm:pr-6 shrink-0">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                    Avaliação IMDb Libris
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-stone-100 tabular-nums">
                      {selectedBook.rating.toFixed(2)}
                    </span>
                    <span className="text-sm font-mono text-stone-400 self-end mb-1">/ 5.0</span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono tabular-nums mt-1">
                    {selectedBook.ratingCount.toLocaleString('pt-BR')} leitores avaliaram
                  </span>
                </div>

                {/* Rating Distribution Histogram */}
                <div className="flex-1 w-full space-y-1.5 text-xs font-mono">
                  {([5, 4, 3, 2, 1] as const).map((star) => {
                    const count = dist[star];
                    const pct = Math.round((count / totalDist) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2 text-stone-400">
                        <span className="w-3 text-right">{star}★</span>
                        <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400/90 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right tabular-nums text-stone-400">{pct}%</span>
                        <span className="w-14 text-right tabular-nums text-stone-500 text-[11px]">
                          ({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-mono mb-2">
                  Sinopse
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed max-w-prose">
                  {selectedBook.synopsis}
                </p>
              </div>

              {/* Featured Quote */}
              {selectedBook.featuredQuote && (
                <div className="border-l-2 border-amber-400/80 pl-4 py-1 bg-stone-900/30 rounded-r-lg">
                  <p className="text-stone-200 text-sm italic font-serif leading-relaxed">
                    "{selectedBook.featuredQuote.text}"
                  </p>
                  <p className="text-[11px] font-mono text-stone-400 mt-1">
                    — Página {selectedBook.featuredQuote.page}
                  </p>
                </div>
              )}

              {/* Technical Metadata Definition List */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-800/80 text-xs">
                <div>
                  <span className="text-stone-500 block">Editora</span>
                  <span className="font-medium text-stone-300">{selectedBook.publisher}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Ano de Publicação</span>
                  <span className="font-medium text-stone-300 font-mono tabular-nums">{selectedBook.publishedYear}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Número de Páginas</span>
                  <span className="font-medium text-stone-300 font-mono tabular-nums">{selectedBook.pages}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">ISBN</span>
                  <span className="font-mono text-stone-300">{selectedBook.isbn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="pt-6 border-t border-stone-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  Resenhas da Comunidade ({bookReviews.length})
                </h3>
                <p className="text-xs text-stone-400">
                  Opiniões detalhadas de leitores apaixonados
                </p>
              </div>
              <button
                onClick={() => openReviewModal(selectedBook)}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                + Deixar minha resenha
              </button>
            </div>

            {bookReviews.length === 0 ? (
              <div className="p-8 text-center bg-stone-900/40 rounded-xl border border-stone-800/60">
                <MessageSquare className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm text-stone-300 font-medium">Seja o primeiro a resenhar este livro!</p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Compartilhe suas impressões com a comunidade de leitores da Libris.
                </p>
                <button
                  onClick={() => openReviewModal(selectedBook)}
                  className="mt-3 px-4 py-1.5 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Avaliar Agora
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookReviews.map((rev) => {
                  const isSpoilerHidden = rev.containsSpoilers && !revealedSpoilers[rev.id];

                  return (
                    <div
                      key={rev.id}
                      className="p-4 bg-stone-900/40 border border-stone-800 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-stone-200">
                                {rev.userName}
                              </span>
                              <span className="text-[11px] text-stone-500">{rev.userHandle}</span>
                            </div>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {rev.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Rating Display */}
                        <div className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-mono font-bold text-stone-100 tabular-nums">
                            {rev.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Content with Spoiler Blur */}
                      <div className="relative">
                        {isSpoilerHidden ? (
                          <div className="p-4 bg-stone-950/80 rounded border border-stone-800 text-center">
                            <p className="text-xs text-amber-400 font-medium flex items-center justify-center gap-1.5 mb-2">
                              <EyeOff className="w-3.5 h-3.5" />
                              Esta resenha contém spoilers da obra.
                            </p>
                            <button
                              onClick={() => toggleSpoiler(rev.id)}
                              className="text-xs underline text-stone-300 hover:text-white"
                            >
                              Clique para exibir o texto
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                              {rev.content}
                            </p>
                            {rev.containsSpoilers && (
                              <button
                                onClick={() => toggleSpoiler(rev.id)}
                                className="text-[11px] text-stone-500 hover:text-stone-300 mt-1 flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Ocultar spoilers
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Review Tags - Unboxed clean text */}
                      {rev.tags.length > 0 && (
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                          {rev.tags.map((t, idx) => (
                            <React.Fragment key={t}>
                              <span>#{t}</span>
                              {idx < rev.tags.length - 1 && <span>·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Bottom Review Actions */}
                      <div className="flex items-center gap-4 pt-2 border-t border-stone-800/60 text-xs text-stone-400">
                        <button
                          onClick={() => likeReview(rev.id)}
                          className={`flex items-center gap-1.5 hover:text-stone-200 transition-colors ${
                            rev.isLikedByCurrentUser ? 'text-amber-400 font-medium' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${rev.isLikedByCurrentUser ? 'fill-amber-400' : ''}`} />
                          <span className="font-mono tabular-nums">{rev.likesCount}</span>
                        </button>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{rev.commentsCount} respostas</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Similar Books Row */}
          {relatedBooks.length > 0 && (
            <div className="pt-6 border-t border-stone-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400 font-mono mb-3">
                Quem leu também gostou
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedBooks.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => openBookDetail(rel.id)}
                    className="flex items-center gap-3 p-2.5 bg-stone-900/40 hover:bg-stone-800/70 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={rel.coverUrl}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 object-cover rounded bg-stone-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-200 truncate">{rel.title}</p>
                      <p className="text-[11px] text-stone-400 truncate">{rel.author}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="tabular-nums">{rel.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
