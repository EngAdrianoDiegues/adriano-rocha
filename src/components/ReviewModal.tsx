import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from './StarRating';
import { X, AlertCircle } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewTargetBook,
    rateBook,
    getUserRating,
  } = useApp();

  const [rating, setRating] = useState<number>(() => {
    return reviewTargetBook ? (getUserRating(reviewTargetBook.id) || 5) : 5;
  });
  const [content, setContent] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('Obra-Prima');
  const [error, setError] = useState('');

  if (!isReviewModalOpen || !reviewTargetBook) return null;

  const popularTags = [
    'Obra-Prima',
    'Favorito',
    'Escrita Poética',
    'Plot Twist',
    'Emocionante',
    'Reflexivo',
    'Leitura Fluida',
    'Complexo',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Por favor, escreva pelo menos uma breve resenha ou impressão.');
      return;
    }
    rateBook(
      reviewTargetBook.id,
      rating,
      content,
      containsSpoilers,
      selectedTag ? [selectedTag] : ['Avaliação']
    );
    setIsReviewModalOpen(false);
    setContent('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#14171d] border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-100">
              Avaliar & Resenhar
            </h3>
            <p className="text-xs text-stone-400 truncate max-w-xs">
              {reviewTargetBook.title}
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-3 bg-stone-900/60 rounded-lg border border-stone-800/80">
            <span className="text-xs text-stone-400 mb-1">Qual a sua nota?</span>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRate={(newRating) => setRating(newRating)}
            />
            <span className="text-xs font-mono font-semibold text-amber-400 mt-1">
              {rating.toFixed(1)} de 5.0 estrelas
            </span>
          </div>

          {/* Written review textarea */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Sua Resenha
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              placeholder="O que você achou dos personagens, ritmo, temas e final? Compartilhe seus sentimentos com outros leitores..."
              rows={5}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg p-3 text-xs text-stone-200 placeholder-stone-600 outline-none resize-none leading-relaxed"
            />
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Tag em Destaque
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedTag === tag
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Spoilers toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="spoilers"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="spoilers" className="text-xs text-stone-300 cursor-pointer">
              Esta resenha contém <span className="font-semibold text-amber-400">spoilers</span> da história
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold"
            >
              Publicar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
