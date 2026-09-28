import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Calendar,
  Heart,
  Star,
  BookOpen,
  Edit2,
  Check,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    shelves,
    books,
    reviews,
    updateUserProfile,
    openBookDetail,
    setActiveTab,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);

  const readBooksCount = shelves.filter((s) => s.status === 'read').length;
  const userReviews = reviews.filter((r) => r.userId === user.id);

  // Favorite 4 books (Letterboxd style)
  const favoriteBooks = user.favoriteBookIds
    .map((id) => books.find((b) => b.id === id))
    .filter(Boolean) as typeof books;

  const handleSave = () => {
    updateUserProfile({ name, bio, location });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Profile Header */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-amber-400/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-bold text-stone-100">
                  {user.name}
                </h1>
                <span className="text-xs text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  Crítico Literário
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5">@{user.username}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Membro desde {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {/* Bio Edit or Display */}
        {isEditing ? (
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3 text-xs">
            <div>
              <label className="text-stone-400 block mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 outline-none"
              />
            </div>
            <div>
              <label className="text-stone-400 block mb-1">Localização</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 outline-none"
              />
            </div>
            <div>
              <label className="text-stone-400 block mb-1">Biografia Literária</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 outline-none resize-none leading-relaxed"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-amber-400 text-stone-950 font-semibold rounded hover:bg-amber-300"
            >
              Salvar Alterações
            </button>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            {user.bio}
          </p>
        )}

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800 text-xs">
          <div>
            <span className="text-stone-500 block">Livros Lidos</span>
            <span className="text-xl font-serif font-bold text-stone-100 font-mono tabular-nums">
              {readBooksCount}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">Resenhas Escritas</span>
            <span className="text-xl font-serif font-bold text-stone-100 font-mono tabular-nums">
              {userReviews.length}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">Seguidores</span>
            <span className="text-xl font-serif font-bold text-stone-100 font-mono tabular-nums">
              {user.followersCount}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">Seguindo</span>
            <span className="text-xl font-serif font-bold text-stone-100 font-mono tabular-nums">
              {user.followingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Favorite Books (Letterboxd Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-serif font-bold text-stone-100">
              Quatro Livros Favoritos da Vida
            </h2>
          </div>
          <span className="text-xs text-stone-500">Inspirado na curadoria do Letterboxd</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {favoriteBooks.map((fav) => (
            <div
              key={fav.id}
              onClick={() => openBookDetail(fav.id)}
              className="group aspect-[3/4] relative rounded-lg overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-400/50 cursor-pointer shadow-md transition-all duration-300"
            >
              <img
                src={fav.coverUrl}
                alt={fav.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-xs font-semibold text-stone-100 line-clamp-1">{fav.title}</p>
                <p className="text-[11px] text-stone-400">{fav.author}</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{fav.rating.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges and Honors */}
      <div className="bg-stone-900/30 border border-stone-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Conquistas do Leitor
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            🏅 Leitor Voraz 2026
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            🖋️ Crítico Perspicaz
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            🪐 Explorador do Cosmos (Ficção Científica)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            🏛️ Guardião dos Clássicos
          </span>
        </div>
      </div>

      {/* User's Written Reviews */}
      <div className="space-y-4">
        <h3 className="text-base font-serif font-bold text-stone-100">
          Suas Resenhas Publicadas ({userReviews.length})
        </h3>

        {userReviews.length === 0 ? (
          <div className="p-8 text-center bg-stone-900/20 border border-stone-800 rounded-xl text-xs text-stone-400">
            Você ainda não publicou resenhas. Avalie um livro para compartilhar sua opinião.
          </div>
        ) : (
          <div className="space-y-3">
            {userReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-stone-900/40 border border-stone-800 rounded-xl flex items-start gap-4"
              >
                <img
                  src={rev.bookCover}
                  alt={rev.bookTitle}
                  referrerPolicy="no-referrer"
                  className="w-10 h-14 object-cover rounded bg-stone-900 shrink-0 cursor-pointer"
                  onClick={() => openBookDetail(rev.bookId)}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4
                      onClick={() => openBookDetail(rev.bookId)}
                      className="text-xs font-semibold text-stone-200 hover:text-amber-300 cursor-pointer truncate"
                    >
                      {rev.bookTitle}
                    </h4>
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{rev.content}</p>
                  <span className="text-[10px] text-stone-500 font-mono block pt-1">
                    Publicada em {rev.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
