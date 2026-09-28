import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen, Check } from 'lucide-react';

export const ReadingProgressModal: React.FC = () => {
  const {
    isProgressModalOpen,
    setIsProgressModalOpen,
    progressTargetBook,
    updateReadingProgress,
    getUserShelfItem,
  } = useApp();

  if (!isProgressModalOpen || !progressTargetBook) return null;

  const currentShelf = getUserShelfItem(progressTargetBook.id);
  const [currentPage, setCurrentPage] = useState<number>(
    currentShelf?.progressPages || 0
  );
  const [note, setNote] = useState('');

  const totalPages = progressTargetBook.pages;
  const pct = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReadingProgress(progressTargetBook.id, currentPage, note);
    setIsProgressModalOpen(false);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#14171d] border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-stone-100">
              Progresso de Leitura
            </h3>
          </div>
          <button
            onClick={() => setIsProgressModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <h4 className="font-serif font-bold text-base text-stone-100 line-clamp-1">
              {progressTargetBook.title}
            </h4>
            <p className="text-xs text-stone-400">{progressTargetBook.author}</p>
          </div>

          {/* Progress Slider and Number */}
          <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Página atual:</span>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  min="0"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) =>
                    setCurrentPage(
                      Math.max(0, Math.min(totalPages, Number(e.target.value) || 0))
                    )
                  }
                  className="w-16 bg-stone-950 border border-stone-700 rounded px-2 py-0.5 text-center text-sm font-bold text-sky-400 focus:outline-none"
                />
                <span className="text-stone-500">/ {totalPages}</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />

            {/* Percentage Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>{pct}% concluído</span>
              {currentPage >= totalPages && (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Livro finalizado!
                </span>
              )}
            </div>
          </div>

          {/* Optional update note */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">
              Compartilhar um pensamento sobre este trecho (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Que reviravolta no capítulo 8! A escrita continua maravilhosa..."
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 focus:border-sky-500/60 rounded-lg p-2.5 text-xs text-stone-200 placeholder-stone-600 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsProgressModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-stone-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors font-semibold"
            >
              Atualizar Progresso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
