import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  Heart,
  Share2,
  BookOpen,
  Send,
  Star,
  Quote,
  Sparkles,
  TrendingUp,
  Clock,
  Check,
} from 'lucide-react';

export const SocialFeedView: React.FC = () => {
  const {
    feed,
    books,
    user,
    likeActivity,
    addActivityComment,
    createPost,
    openBookDetail,
  } = useApp();

  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'status_update' | 'quote'>('status_update');
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || '');
  const [quoteText, setQuoteText] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentDrawer, setActiveCommentDrawer] = useState<string | null>(null);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !quoteText.trim()) return;

    createPost(
      postContent,
      postType,
      selectedBookId,
      postType === 'quote' ? quoteText : undefined
    );

    setPostContent('');
    setQuoteText('');
  };

  const handleSendComment = (activityId: string) => {
    const text = commentInputs[activityId];
    if (!text || !text.trim()) return;

    addActivityComment(activityId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [activityId]: '' }));
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Post Publisher Box */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-700"
            />
            <div>
              <p className="text-xs font-semibold text-stone-100">{user.name}</p>
              <p className="text-[11px] text-stone-400">Compartilhar com a comunidade</p>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3">
            {/* Post Type Selector */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPostType('status_update')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  postType === 'status_update'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-950'
                }`}
              >
                Reflexão de Leitura
              </button>
              <button
                type="button"
                onClick={() => setPostType('quote')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  postType === 'quote'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-950'
                }`}
              >
                <Quote className="w-3 h-3" />
                Citação de Livro
              </button>
            </div>

            {/* Book picker dropdown */}
            <div className="flex items-center gap-2 text-xs bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5">
              <span className="text-stone-500">Livro relacionado:</span>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="bg-transparent text-amber-300 font-medium focus:outline-none flex-1 truncate cursor-pointer"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id} className="bg-stone-900 text-stone-200">
                    {b.title} — {b.author}
                  </option>
                ))}
              </select>
            </div>

            {postType === 'quote' && (
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Insira a citação exata da obra..."
                rows={2}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg p-3 text-xs italic text-stone-200 placeholder-stone-600 outline-none resize-none font-serif"
              />
            )}

            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="O que chamou sua atenção na história hoje? Como você se sentiu lendo?"
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg p-3 text-xs text-stone-200 placeholder-stone-600 outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">
                Pressione publicar para compartilhar no feed global
              </span>
              <button
                type="submit"
                disabled={!postContent.trim() && !quoteText.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar
              </button>
            </div>
          </form>
        </div>

        {/* Timeline Activities */}
        <div className="space-y-4">
          {feed.map((act) => {
            const isCommentsOpen = activeCommentDrawer === act.id;

            return (
              <div
                key={act.id}
                className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5 space-y-4 hover:border-stone-700/80 transition-colors"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-200">
                          {act.userName}
                        </span>
                        <span className="text-[11px] text-stone-500">{act.userHandle}</span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Activity Badge */}
                  {act.type === 'review' && act.rating && (
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs font-mono text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{act.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {act.type === 'status_update' && act.progress && (
                    <div className="text-[11px] font-mono text-sky-400 font-medium">
                      Progresso: {act.progress.percentage}%
                    </div>
                  )}
                </div>

                {/* Content */}
                {act.quote && (
                  <blockquote className="border-l-2 border-amber-400/80 pl-3 py-1 bg-stone-950/60 rounded-r text-xs italic font-serif text-stone-200 leading-relaxed">
                    "{act.quote}"
                  </blockquote>
                )}

                {act.content && (
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {act.content}
                  </p>
                )}

                {/* Progress bar if status update */}
                {act.progress && (
                  <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${act.progress.percentage}%` }}
                    />
                  </div>
                )}

                {/* Attached Book Card */}
                {act.bookTitle && (
                  <div
                    onClick={() => act.bookId && openBookDetail(act.bookId)}
                    className="flex items-center gap-3 p-2.5 bg-stone-950/70 hover:bg-stone-950 border border-stone-800 rounded-lg cursor-pointer transition-colors group"
                  >
                    {act.bookCover && (
                      <img
                        src={act.bookCover}
                        alt={act.bookTitle}
                        referrerPolicy="no-referrer"
                        className="w-9 h-12 object-cover rounded bg-stone-900 shrink-0 group-hover:scale-103 transition-transform"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        {act.bookTitle}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{act.bookAuthor}</p>
                    </div>
                    <span className="text-[11px] text-amber-400 font-medium shrink-0 group-hover:underline">
                      Ver livro →
                    </span>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs text-stone-400">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => likeActivity(act.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        act.isLiked ? 'text-rose-400 font-semibold' : 'hover:text-stone-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${act.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="font-mono tabular-nums">{act.likes}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentDrawer(isCommentsOpen ? null : act.id)
                      }
                      className="flex items-center gap-1.5 hover:text-stone-200 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-mono tabular-nums">{act.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Thread Drawer */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-stone-800/60 space-y-3">
                    {act.comments.length > 0 && (
                      <div className="space-y-2">
                        {act.comments.map((comm) => (
                          <div
                            key={comm.id}
                            className="flex items-start gap-2.5 p-2 bg-stone-950/60 rounded-lg text-xs"
                          >
                            <img
                              src={comm.userAvatar}
                              alt={comm.userName}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-stone-800"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-stone-200">
                                  {comm.userName}
                                </span>
                                <span className="text-[10px] text-stone-500 font-mono">
                                  {comm.createdAt}
                                </span>
                              </div>
                              <p className="text-stone-300 mt-0.5 leading-snug">{comm.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add reply input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[act.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [act.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(act.id);
                        }}
                        placeholder="Deixe uma resposta..."
                        className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50"
                      />
                      <button
                        onClick={() => handleSendComment(act.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Sidebar */}
      <aside className="lg:col-span-4 space-y-6">
        {/* Readers Weekly Highlight */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mais Discutidos na Rede</span>
          </div>

          <div className="divide-y divide-stone-800/60">
            {books.slice(0, 3).map((b) => (
              <div
                key={b.id}
                onClick={() => openBookDetail(b.id)}
                className="py-3 flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="w-9 h-12 object-cover rounded bg-stone-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                    {b.title}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">{b.author}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{b.rating.toFixed(2)}</span>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-400">
                      {b.ratingCount.toLocaleString('pt-BR')} resenhas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Quote Card */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Quote className="w-3.5 h-3.5" />
            <span>Passagem da Semana</span>
          </div>
          <p className="text-stone-200 text-xs italic font-serif leading-relaxed">
            "Não tive filhos, não transmiti a nenhuma criatura o legado da nossa miséria."
          </p>
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>Machado de Assis</span>
            <span className="font-mono">Brás Cubas · 1881</span>
          </div>
        </div>

        {/* Collective Challenge Widget */}
        <div className="bg-gradient-to-br from-amber-500/10 via-stone-900/60 to-stone-900/30 border border-amber-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meta da Comunidade 2026</span>
          </div>
          <h4 className="font-serif font-bold text-base text-stone-100">
            100.000 Páginas Lidas
          </h4>
          <p className="text-xs text-stone-400">
            Junte-se a centenas de leitores brasileiros compartilhando sua rotina literária.
          </p>
          <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
            <div className="bg-amber-400 h-full rounded-full w-3/4" />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-stone-400">
            <span>75.420 lidas</span>
            <span className="text-amber-400 font-semibold">75% da meta</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
