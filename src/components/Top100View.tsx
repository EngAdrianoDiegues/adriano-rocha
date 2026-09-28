import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Award, Bookmark, Check, Clock, BookOpen, Edit3 } from 'lucide-react';
import { ShelfStatus } from '../types';

export const Top100View: React.FC = () => {
  const {
    books,
    openBookDetail,
    getUserRating,
    getUserShelfStatus,
    updateShelfStatus,
    openReviewModal,
  } = useApp();

  // Sort books by average IMDb rating descending
  const rankedBooks = [...books].sort((a, b) => b.rating - a.rating);

  const shelfIcons: Record<ShelfStatus, { icon: any; color: string; label: string }> = {
    reading: { icon: BookOpen, color: 'text-sky-400', label: 'Lendo' },
    read: { icon: Check, color: 'text-emerald-400', label: 'Lido' },
    want_to_read: { icon: Clock, color: 'text-amber-400', label: 'Quero Ler' },
    abandoned: { icon: Bookmark, color: 'text-stone-400', label: 'Abandonado' },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
          <Award className="w-4 h-4" />
          <span>Ranking Canônico da Comunidade</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-100 tracking-tight">
          Libris Top 100 — Melhores Livros de Todos os Tempos
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Classificação ponderada pelo algoritmo da Libris combinando a média de notas e o volume de avaliações dos leitores cadastrados, inspirado na metodologia clássica do IMDb.
        </p>
      </div>

      {/* Table / List View */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-stone-950/70 border-b border-stone-800 text-[11px] font-mono uppercase tracking-wider text-stone-400">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6">Título & Autor</div>
          <div className="col-span-2 text-center">Nota IMDb</div>
          <div className="col-span-1 text-center">Sua Nota</div>
          <div className="col-span-2 text-right">Ação / Estante</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-stone-800/60">
          {rankedBooks.map((book, idx) => {
            const rank = idx + 1;
            const userRating = getUserRating(book.id);
            const shelfStatus = getUserShelfStatus(book.id);

            return (
              <div
                key={book.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-4 items-center hover:bg-stone-800/40 transition-colors group"
              >
                {/* Mobile Rank + Poster */}
                <div className="sm:col-span-1 flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-stone-400 group-hover:text-amber-400 tabular-nums w-7">
                    #{rank}
                  </span>
                  <div
                    onClick={() => openBookDetail(book.id)}
                    className="sm:hidden aspect-[3/4] w-12 rounded overflow-hidden bg-stone-950 cursor-pointer shrink-0"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Title & Metadata with Desktop Poster */}
                <div className="sm:col-span-6 flex items-center gap-4 min-w-0">
                  <div
                    onClick={() => openBookDetail(book.id)}
                    className="hidden sm:block aspect-[3/4] w-12 rounded overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer shrink-0 group-hover:scale-105 transition-transform"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      onClick={() => openBookDetail(book.id)}
                      className="text-sm sm:text-base font-semibold text-stone-100 group-hover:text-amber-400 cursor-pointer truncate"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5 truncate">
                      <span>{book.author}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="font-mono tabular-nums">{book.publishedYear}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="font-mono tabular-nums">{book.pages} págs</span>
                    </div>
                  </div>
                </div>

                {/* IMDb Rating */}
                <div className="sm:col-span-2 flex flex-col items-start sm:items-center">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-mono text-base font-bold text-stone-100 tabular-nums">
                      {book.rating.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">/ 5</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono tabular-nums">
                    {book.ratingCount.toLocaleString('pt-BR')} votos
                  </span>
                </div>

                {/* Your Rating */}
                <div className="sm:col-span-1 flex items-center justify-start sm:justify-center">
                  {userRating ? (
                    <button
                      onClick={() => openReviewModal(book)}
                      className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      title="Clique para editar nota"
                    >
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{userRating.toFixed(1)}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openReviewModal(book)}
                      className="text-[11px] text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Avaliar</span>
                    </button>
                  )}
                </div>

                {/* Shelf Action Buttons */}
                <div className="sm:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      updateShelfStatus(
                        book.id,
                        shelfStatus === 'want_to_read' ? 'read' : 'want_to_read'
                      )
                    }
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                      shelfStatus
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300'
                    }`}
                  >
                    {shelfStatus ? (
                      <>
                        {React.createElement(shelfIcons[shelfStatus].icon, {
                          className: `w-3 h-3 ${shelfIcons[shelfStatus].color}`,
                        })}
                        <span>{shelfIcons[shelfStatus].label}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Quero Ler</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openReviewModal(book)}
                    className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
                    title="Escrever resenha"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
