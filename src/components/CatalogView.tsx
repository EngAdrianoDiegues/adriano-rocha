import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BookCard } from './BookCard';
import {
  Compass,
  TrendingUp,
  Star,
  Award,
  Sparkles,
  SlidersHorizontal,
  Plus,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';

export const CatalogView: React.FC = () => {
  const { books, openBookDetail, setIsAddBookModalOpen, setActiveTab } = useApp();

  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'year' | 'pages'>('rating');

  // Available unique genres
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genres.forEach((g) => set.add(g)));
    return ['Todos', ...Array.from(set)];
  }, [books]);

  // Filter and sort
  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        if (selectedGenre === 'Todos') return true;
        return b.genres.includes(selectedGenre);
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return b.ratingCount - a.ratingCount;
        if (sortBy === 'year') return b.publishedYear - a.publishedYear;
        if (sortBy === 'pages') return b.pages - a.pages;
        return 0;
      });
  }, [books, selectedGenre, sortBy]);

  // Featured book for spotlight
  const spotlightBook = books[0]; // Brás Cubas or first book

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Hero Showcase */}
      <section className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Biblioteca aconchegante"
            className="w-full h-full object-cover opacity-25 filter blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destaque Editorial da Semana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
            {spotlightBook.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 mt-2 font-medium">
            Por {spotlightBook.author} · <span className="font-mono">{spotlightBook.publishedYear}</span>
          </p>

          <p className="text-xs sm:text-sm text-stone-400 mt-4 max-w-2xl leading-relaxed line-clamp-3">
            {spotlightBook.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              onClick={() => openBookDetail(spotlightBook.id)}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Ver Ficha Completa
            </button>
            <button
              onClick={() => setActiveTab('top100')}
              className="px-4 py-2.5 text-xs font-medium text-stone-300 bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 rounded-lg transition-colors flex items-center gap-2"
            >
              Explorar Top 100 IMDb
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 pl-2 text-xs font-mono text-stone-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-100 text-sm">{spotlightBook.rating.toFixed(2)}</span>
              <span>({spotlightBook.ratingCount.toLocaleString('pt-BR')} avaliações)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Functional Segmented Genre Buttons & Sorters */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
        {/* Interactive Genre Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {allGenres.slice(0, 8).map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sort Dropdown & Quick Register Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-amber-400 font-medium focus:outline-none cursor-pointer"
            >
              <option value="rating" className="bg-stone-900 text-stone-200">Melhor Avaliados (IMDb)</option>
              <option value="popular" className="bg-stone-900 text-stone-200">Mais Populares</option>
              <option value="year" className="bg-stone-900 text-stone-200">Mais Recentes</option>
              <option value="pages" className="bg-stone-900 text-stone-200">Páginas (Maior para menor)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800/70 border border-stone-800 rounded-lg transition-colors"
            title="Cadastrar livro novo"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Main Grid & Top 5 Side Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Books Grid */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-serif font-bold text-stone-100">
                Catálogo Geral
              </h2>
              <span className="text-xs text-stone-500 font-mono tabular-nums">
                ({filteredBooks.length} obras)
              </span>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/30 border border-stone-800 rounded-xl">
              <p className="text-stone-400 text-sm">Nenhum livro encontrado para este gênero.</p>
              <button
                onClick={() => setSelectedGenre('Todos')}
                className="mt-3 px-3 py-1.5 text-xs text-amber-400 underline hover:text-amber-300"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: IMDb Top 5 Best Books Ranking */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-5 bg-stone-900/40 border border-stone-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-serif font-bold text-stone-100">
                  Top 5 IMDb Libris
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('top100')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Ver todos
              </button>
            </div>

            <div className="divide-y divide-stone-800/80">
              {books
                .slice()
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((book, idx) => (
                  <div
                    key={book.id}
                    onClick={() => openBookDetail(book.id)}
                    className="py-2.5 flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="font-mono text-base font-bold text-stone-500 group-hover:text-amber-400 tabular-nums w-4">
                      {idx + 1}
                    </span>
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-12 object-cover rounded bg-stone-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{book.author}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="tabular-nums font-bold">{book.rating.toFixed(2)}</span>
                        <span className="text-stone-600">·</span>
                        <span className="text-stone-400">{book.publishedYear}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Reading Prompt Box */}
          <div className="p-5 bg-gradient-to-br from-amber-500/10 via-stone-900/60 to-stone-900/30 border border-amber-500/20 rounded-xl space-y-2.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
              Comunidade Ativa
            </span>
            <h4 className="font-serif font-bold text-sm text-stone-100">
              Não encontrou sua leitura atual?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ajude a expandir a base de dados da Libris cadastrando novos títulos com sinopse e detalhes.
            </p>
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="mt-1 w-full py-1.5 px-3 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold"
            >
              + Adicionar Livro ao Catálogo
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
