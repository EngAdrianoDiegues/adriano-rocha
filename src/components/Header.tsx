import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, BookOpen, Star, X, Download } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsAddBookModalOpen,
    setIsDownloadModalOpen,
    books,
    openBookDetail,
    user,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredBooks = query.trim()
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()) ||
          b.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0f12]/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-2xl font-serif font-bold tracking-tight text-stone-100 hover:text-amber-400 transition-colors shrink-0"
        >
          Libris
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle active states */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-400">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors hover:text-stone-100 cursor-pointer ${
              activeTab === 'catalog' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Explorar
          </button>
          <button
            onClick={() => setActiveTab('top100')}
            className={`transition-colors hover:text-stone-100 cursor-pointer ${
              activeTab === 'top100' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Top 100
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`transition-colors hover:text-stone-100 cursor-pointer ${
              activeTab === 'feed' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Feed Social
          </button>
          <button
            onClick={() => setActiveTab('shelves')}
            className={`transition-colors hover:text-stone-100 cursor-pointer ${
              activeTab === 'shelves' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Minha Estante
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`transition-colors hover:text-stone-100 cursor-pointer ${
              activeTab === 'clubs' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Clubes
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Dropdown */}
          <div className="relative" ref={searchRef}>
            {searchOpen ? (
              <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 w-60 sm:w-72">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar livro, autor, gênero..."
                  autoFocus
                  className="bg-transparent border-none outline-none text-xs text-stone-200 placeholder-stone-500 w-full"
                />
                <button
                  onClick={() => {
                    setQuery('');
                    setSearchOpen(false);
                  }}
                  className="text-stone-400 hover:text-stone-200 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 rounded-lg transition-colors"
                title="Buscar no catálogo"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Live Search Autocomplete Results */}
            {searchOpen && query.trim().length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                  Resultados ({filteredBooks.length})
                </div>
                {filteredBooks.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-stone-500 text-center">
                    Nenhum livro encontrado para "{query}".
                  </div>
                ) : (
                  <div className="divide-y divide-stone-800/60">
                    {filteredBooks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          openBookDetail(b.id);
                          setSearchOpen(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-stone-800/70 cursor-pointer transition-colors"
                      >
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="w-8 h-11 object-cover rounded bg-stone-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-stone-200 truncate">{b.title}</p>
                          <p className="text-[11px] text-stone-400 truncate">{b.author}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="font-mono tabular-nums">{b.rating.toFixed(2)}</span>
                            <span className="text-stone-500">·</span>
                            <span className="text-stone-400">{b.publishedYear}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action 1: Add new book */}
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-700 border border-stone-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Livro
          </button>

          {/* Action 2: Download / Install App & Code */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            title="Baixar App ou ver código"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Baixar App</span>
          </button>

          {/* Action 3: User Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg border transition-colors ${
              activeTab === 'profile'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-stone-800 hover:border-stone-700 bg-stone-900/60 text-stone-300'
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-700"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-medium max-w-[85px] truncate hidden lg:inline">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-800/60 bg-stone-950/80 text-xs text-stone-400">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-1 px-2 ${activeTab === 'catalog' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Explorar
        </button>
        <button
          onClick={() => setActiveTab('top100')}
          className={`py-1 px-2 ${activeTab === 'top100' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Top 100
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-1 px-2 ${activeTab === 'feed' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('shelves')}
          className={`py-1 px-2 ${activeTab === 'shelves' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Estante
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`py-1 px-2 ${activeTab === 'clubs' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Clubes
        </button>
      </div>
    </header>
  );
};
