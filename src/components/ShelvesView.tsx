import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookCard } from './BookCard';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Heart,
  Target,
  BarChart3,
  Calendar,
  Layers,
  Star,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';
import { ShelfStatus } from '../types';

export const ShelvesView: React.FC = () => {
  const {
    shelves,
    books,
    user,
    updateUserProfile,
    openProgressModal,
    openReviewModal,
    openBookDetail,
    setActiveTab,
  } = useApp();

  const [activeShelfTab, setActiveShelfTab] = useState<'reading' | 'want_to_read' | 'read' | 'favorites'>('reading');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(user.readingGoalYear.target);

  // Group books by shelf status
  const readingBooks = shelves
    .filter((s) => s.status === 'reading')
    .map((s) => ({
      item: s,
      book: books.find((b) => b.id === s.bookId)!,
    }))
    .filter((x) => Boolean(x.book));

  const wantToReadBooks = shelves
    .filter((s) => s.status === 'want_to_read')
    .map((s) => ({
      item: s,
      book: books.find((b) => b.id === s.bookId)!,
    }))
    .filter((x) => Boolean(x.book));

  const readBooks = shelves
    .filter((s) => s.status === 'read')
    .map((s) => ({
      item: s,
      book: books.find((b) => b.id === s.bookId)!,
    }))
    .filter((x) => Boolean(x.book));

  const favoriteBooks = shelves
    .filter((s) => s.isFavorite)
    .map((s) => ({
      item: s,
      book: books.find((b) => b.id === s.bookId)!,
    }))
    .filter((x) => Boolean(x.book));

  // Calculate statistics
  const totalPagesRead = readBooks.reduce((acc, curr) => acc + (curr.book.pages || 0), 0) +
    readingBooks.reduce((acc, curr) => acc + (curr.item.progressPages || 0), 0);

  const ratedItems = readBooks.filter((r) => r.item.userRating !== undefined);
  const avgRatingGiven = ratedItems.length
    ? (ratedItems.reduce((acc, curr) => acc + (curr.item.userRating || 0), 0) / ratedItems.length).toFixed(1)
    : '—';

  const goalCurrent = readBooks.length;
  const goalTarget = user.readingGoalYear.target;
  const goalPct = Math.min(100, Math.round((goalCurrent / goalTarget) * 100));

  const handleSaveGoal = () => {
    updateUserProfile({
      readingGoalYear: {
        target: goalInput,
        current: goalCurrent,
      },
    });
    setIsEditingGoal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header & 2026 Reading Challenge Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Challenge Widget */}
        <div className="md:col-span-8 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
                <Target className="w-4 h-4" />
                <span>Desafio Literário 2026</span>
              </div>

              {!isEditingGoal ? (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Alterar meta
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={goalInput}
                    onChange={(e) => setGoalInput(Number(e.target.value))}
                    className="w-16 bg-stone-950 border border-stone-700 rounded px-2 py-0.5 text-xs text-amber-300 font-mono"
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="p-1 text-emerald-400 hover:text-emerald-300"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-100 tabular-nums">
                {goalCurrent}
              </span>
              <span className="text-stone-400 text-sm font-mono">
                de {goalTarget} livros lidos em 2026
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-stone-950 rounded-full h-3 overflow-hidden border border-stone-800">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-800/80">
            <span>
              {goalCurrent >= goalTarget
                ? '🎉 Parabéns! Você concluiu sua meta do ano!'
                : `Faltam ${goalTarget - goalCurrent} livros para completar seu objetivo.`}
            </span>
            <span className="font-mono text-amber-400 font-bold">{goalPct}%</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-4 grid grid-cols-2 gap-3.5">
          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[11px] uppercase font-mono text-stone-400">Total de Páginas</span>
            <span className="text-2xl font-mono font-bold text-stone-100 mt-1 tabular-nums">
              {totalPagesRead.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">páginas devoradas</span>
          </div>

          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[11px] uppercase font-mono text-stone-400">Média Pessoal</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
                {avgRatingGiven}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5">em {ratedItems.length} avaliações</span>
          </div>

          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[11px] uppercase font-mono text-stone-400">Lendo Agora</span>
            <span className="text-2xl font-mono font-bold text-sky-400 mt-1 tabular-nums">
              {readingBooks.length}
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">obras ativas</span>
          </div>

          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[11px] uppercase font-mono text-stone-400">Favoritos</span>
            <span className="text-2xl font-mono font-bold text-rose-400 mt-1 tabular-nums">
              {favoriteBooks.length}
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">livros marcados</span>
          </div>
        </div>
      </div>

      {/* Shelf Tabs - Functional Filter Buttons */}
      <div className="border-b border-stone-800 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveShelfTab('reading')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeShelfTab === 'reading'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Lendo Agora ({readingBooks.length})
          </button>

          <button
            onClick={() => setActiveShelfTab('want_to_read')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeShelfTab === 'want_to_read'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Quero Ler ({wantToReadBooks.length})
          </button>

          <button
            onClick={() => setActiveShelfTab('read')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeShelfTab === 'read'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lidos ({readBooks.length})
          </button>

          <button
            onClick={() => setActiveShelfTab('favorites')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeShelfTab === 'favorites'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Favoritos ({favoriteBooks.length})
          </button>
        </div>

        <button
          onClick={() => setActiveTab('catalog')}
          className="text-xs text-amber-400 hover:underline shrink-0 hidden sm:inline-block"
        >
          + Buscar novos livros
        </button>
      </div>

      {/* Active Tab Content */}
      {activeShelfTab === 'reading' && (
        <div>
          {readingBooks.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/20 border border-stone-800 rounded-xl">
              <BookOpen className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-300 font-medium">Você não está lendo nenhum livro no momento.</p>
              <p className="text-xs text-stone-500 mt-1">Navegue pelo catálogo e selecione sua próxima jornada.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {readingBooks.map(({ item, book }) => {
                const pct = Math.min(100, Math.round(((item.progressPages || 0) / book.pages) * 100));

                return (
                  <div
                    key={book.id}
                    className="p-5 bg-stone-900/50 border border-stone-800 rounded-xl flex gap-5 items-start hover:border-stone-700 transition-colors"
                  >
                    <div
                      onClick={() => openBookDetail(book.id)}
                      className="aspect-[3/4] w-24 rounded-lg overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer shrink-0 shadow-md"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h4
                          onClick={() => openBookDetail(book.id)}
                          className="font-serif font-bold text-base text-stone-100 hover:text-amber-400 cursor-pointer truncate"
                        >
                          {book.title}
                        </h4>
                        <p className="text-xs text-stone-400">{book.author}</p>
                      </div>

                      {/* Progress widget */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-stone-400">
                            Pág. {item.progressPages || 0} de {book.pages}
                          </span>
                          <span className="text-sky-400 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
                          <div
                            className="bg-sky-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openProgressModal(book)}
                          className="flex-1 py-1.5 px-3 text-xs font-medium text-stone-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors font-semibold"
                        >
                          Atualizar Páginas
                        </button>
                        <button
                          onClick={() => openReviewModal(book)}
                          className="py-1.5 px-3 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
                        >
                          Concluir Leitura
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeShelfTab === 'want_to_read' && (
        <div>
          {wantToReadBooks.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/20 border border-stone-800 rounded-xl">
              <Clock className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-300">Sua lista de desejos está vazia.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-3 text-xs text-amber-400 hover:underline"
              >
                Descobrir livros para ler
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {wantToReadBooks.map(({ book }) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeShelfTab === 'read' && (
        <div>
          {readBooks.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/20 border border-stone-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-300">Nenhum livro marcado como lido ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {readBooks.map(({ book }) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeShelfTab === 'favorites' && (
        <div>
          {favoriteBooks.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/20 border border-stone-800 rounded-xl">
              <Heart className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-300">Você ainda não marcou livros favoritos.</p>
              <p className="text-xs text-stone-500 mt-1">
                Clique no ícone de coração nos cartões para favoritar suas obras mais queridas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {favoriteBooks.map(({ book }) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
