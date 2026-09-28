import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Calendar, MessageSquare, BookOpen, Check, ArrowRight } from 'lucide-react';

export const ClubsView: React.FC = () => {
  const { clubs, books, openBookDetail } = useApp();
  const [joinedClubs, setJoinedClubs] = useState<Record<string, boolean>>({
    'club-1': true, // joined by default
  });

  const toggleJoin = (clubId: string) => {
    setJoinedClubs((prev) => ({
      ...prev,
      [clubId]: !prev[clubId],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="border-b border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
          <Users className="w-4 h-4" />
          <span>Comunidade & Leitura Compartilhada</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-100 tracking-tight">
          Clubes de Leitura & Discussões
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Participe de grupos temáticos com leituras conjuntas programadas, debates por capítulos e trocas de referências sem spoilers.
        </p>
      </div>

      {/* Clubs List */}
      <div className="space-y-6">
        {clubs.map((club) => {
          const currentBook = books.find((b) => b.id === club.currentBookId);
          const isJoined = Boolean(joinedClubs[club.id]);

          return (
            <div
              key={club.id}
              className="bg-stone-900/40 border border-stone-800 rounded-xl p-6 sm:p-7 space-y-6 hover:border-stone-700 transition-colors shadow-lg"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 mb-1">
                    <span>{club.category}</span>
                    <span className="text-stone-600">·</span>
                    <span>{club.membersCount + (isJoined ? 1 : 0)} membros ativos</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">
                    {club.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl leading-relaxed">
                    {club.tagline}
                  </p>
                </div>

                <button
                  onClick={() => toggleJoin(club.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center justify-center gap-2 ${
                    isJoined
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Membro Inscrito
                    </>
                  ) : (
                    '+ Entrar no Clube'
                  )}
                </button>
              </div>

              {/* Current Read Highlight Box */}
              {currentBook && (
                <div className="p-4 bg-stone-950/70 border border-stone-800/80 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentBook.coverUrl}
                      alt={currentBook.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 object-cover rounded bg-stone-900 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                        Leitura em andamento deste mês
                      </span>
                      <h4
                        onClick={() => openBookDetail(currentBook.id)}
                        className="text-sm font-semibold text-stone-200 hover:text-amber-300 cursor-pointer"
                      >
                        {currentBook.title}
                      </h4>
                      <p className="text-xs text-stone-400">{currentBook.author}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookDetail(currentBook.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 shrink-0"
                  >
                    Ver detalhes do livro
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Meeting & Discussion Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800/60 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-stone-500 block text-[11px]">Próximo Encontro Virtual</span>
                    <span className="font-mono text-stone-200">{club.nextMeeting}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-stone-500 block text-[11px]">Tópico em Discussão</span>
                    <span className="text-stone-200 line-clamp-1">{club.discussionTopic}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
