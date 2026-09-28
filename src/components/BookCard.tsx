import React, { useState } from 'react';
import { Book, ShelfStatus } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Bookmark, Check, BookOpen, Clock, Heart } from 'lucide-react';

interface BookCardProps {
  book: Book;
  rank?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, rank }) => {
  const {
    openBookDetail,
    getUserShelfStatus,
    getUserRating,
    updateShelfStatus,
    toggleFavorite,
    getUserShelfItem,
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const [shelfMenuOpen, setShelfMenuOpen] = useState(false);

  const currentShelfStatus = getUserShelfStatus(book.id);
  const userRating = getUserRating(book.id);
  const shelfItem = getUserShelfItem(book.id);
  const isFav = shelfItem?.isFavorite;

  const shelfLabels: Record<ShelfStatus, { text: string; icon: any; color: string }> = {
    reading: { text: 'Lendo', icon: BookOpen, color: 'text-sky-400' },
    read: { text: 'Lido', icon: Check, color: 'text-emerald-400' },
    want_to_read: { text: 'Quero Ler', icon: Clock, color: 'text-amber-400' },
    abandoned: { text: 'Abandonado', icon: Bookmark, color: 'text-stone-400' },
  };

  return (
    <div className="group relative flex flex-col transition-all duration-200">
      {/* Cover Container */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-stone-900 border border-stone-800 shadow-md group-hover:border-stone-600 transition-all duration-300">
        {/* Rank Watermark / Badge if present */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[11px] font-mono tabular-nums font-bold text-amber-300 border border-amber-500/30">
            #{rank}
          </div>
        )}

        {/* Favorite Heart Quick Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(book.id);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-md transition-all duration-150 ${
            isFav
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-black/50 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-rose-400'
          }`}
          title={isFav ? 'Remover dos favoritos' : 'Favoritar livro'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Image with fallback */}
        {!imageError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103 cursor-pointer"
            onClick={() => openBookDetail(book.id)}
          />
        ) : (
          <div
            onClick={() => openBookDetail(book.id)}
            className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 cursor-pointer text-stone-300"
          >
            <span className="text-[11px] uppercase tracking-wider text-amber-500/80 font-mono">
              {book.genres[0] || 'Literatura'}
            </span>
            <div className="my-auto">
              <h4 className="font-serif font-bold text-sm text-stone-100 line-clamp-3 leading-snug">
                {book.title}
              </h4>
              <p className="text-xs text-stone-400 mt-1 line-clamp-1">{book.author}</p>
            </div>
            <span className="text-[10px] text-stone-500 font-mono tabular-nums">{book.publishedYear}</span>
          </div>
        )}

        {/* Overlay Scrim on hover */}
        <div
          onClick={() => openBookDetail(book.id)}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex flex-col justify-end p-3"
        >
          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {book.synopsis}
          </p>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 font-mono">
            <span className="tabular-nums">{book.pages} páginas</span>
            <span className="text-amber-400 font-semibold underline underline-offset-2">Ver detalhes</span>
          </div>
        </div>

        {/* Quick Shelf Status Badge if on Shelf */}
        {currentShelfStatus && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md ${shelfLabels[currentShelfStatus].color} border border-white/10`}>
              {currentShelfStatus === 'reading' && <BookOpen className="w-2.5 h-2.5" />}
              {currentShelfStatus === 'read' && <Check className="w-2.5 h-2.5" />}
              {currentShelfStatus === 'want_to_read' && <Clock className="w-2.5 h-2.5" />}
              {shelfLabels[currentShelfStatus].text}
            </span>
          </div>
        )}
      </div>

      {/* Book Metadata - Zero-Pill Discipline */}
      <div className="mt-2.5 flex flex-col">
        <div className="flex items-center justify-between gap-1">
          {/* Average IMDb-style Score */}
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono tabular-nums font-semibold text-stone-100">
              {book.rating.toFixed(2)}
            </span>
            <span className="text-[11px] text-stone-500 font-mono tabular-nums">
              ({book.ratingCount >= 1000 ? `${(book.ratingCount / 1000).toFixed(1)}k` : book.ratingCount})
            </span>
          </div>

          {/* User's own rating if exists */}
          {userRating && (
            <span className="text-[11px] font-mono tabular-nums text-amber-400/90 font-medium">
              Sua nota: ★ {userRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => openBookDetail(book.id)}
          className="text-sm font-semibold text-stone-100 hover:text-amber-400 transition-colors mt-1 line-clamp-1 cursor-pointer"
          title={book.title}
        >
          {book.title}
        </h3>

        {/* Author & Year - Clean unboxed text with typographic dot */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5 truncate">
          <span className="truncate">{book.author}</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span className="font-mono tabular-nums shrink-0">{book.publishedYear}</span>
        </div>

        {/* Quick Shelf Management dropdown */}
        <div className="mt-2 relative">
          <button
            onClick={() => setShelfMenuOpen(!shelfMenuOpen)}
            className="w-full py-1 px-2 text-[11px] font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <Bookmark className="w-3 h-3 text-stone-400" />
            <span>
              {currentShelfStatus
                ? shelfLabels[currentShelfStatus].text
                : '+ Adicionar à Estante'}
            </span>
          </button>

          {shelfMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShelfMenuOpen(false)}
              />
              <div className="absolute left-0 bottom-full mb-1 w-full bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1 z-40 text-xs">
                <button
                  onClick={() => {
                    updateShelfStatus(book.id, 'want_to_read');
                    setShelfMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-stone-800 flex items-center gap-2 ${
                    currentShelfStatus === 'want_to_read' ? 'text-amber-400 font-medium' : 'text-stone-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  Quero Ler
                </button>
                <button
                  onClick={() => {
                    updateShelfStatus(book.id, 'reading');
                    setShelfMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-stone-800 flex items-center gap-2 ${
                    currentShelfStatus === 'reading' ? 'text-sky-400 font-medium' : 'text-stone-300'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  Lendo Agora
                </button>
                <button
                  onClick={() => {
                    updateShelfStatus(book.id, 'read');
                    setShelfMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-stone-800 flex items-center gap-2 ${
                    currentShelfStatus === 'read' ? 'text-emerald-400 font-medium' : 'text-stone-300'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  Lido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
