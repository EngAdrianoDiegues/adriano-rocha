import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, BookPlus, AlertCircle } from 'lucide-react';

export const AddBookModal: React.FC = () => {
  const { isAddBookModalOpen, setIsAddBookModalOpen, addNewBook, openBookDetail } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState<number>(2024);
  const [pages, setPages] = useState<number>(300);
  const [genres, setGenres] = useState('Ficção, Drama');
  const [publisher, setPublisher] = useState('Editora Independente');
  const [isbn, setIsbn] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [error, setError] = useState('');

  if (!isAddBookModalOpen) return null;

  const defaultCovers = [
    '/src/assets/images/cover_scifi_horizonte_1790537035475.jpg',
    '/src/assets/images/cover_classico_memorias_1790537045854.jpg',
    '/src/assets/images/cover_fantasia_relogios_1790537055400.jpg',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=700',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) {
      setError('Por favor preencha o título, autor e a sinopse da obra.');
      return;
    }

    const genreList = genres
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    const chosenCover = coverUrl.trim() || defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const created = addNewBook({
      title: title.trim(),
      author: author.trim(),
      publishedYear: publishedYear || new Date().getFullYear(),
      pages: pages || 250,
      genres: genreList.length ? genreList : ['Literatura'],
      publisher: publisher.trim() || 'Edição do Autor',
      isbn: isbn.trim() || '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
      synopsis: synopsis.trim(),
      coverUrl: chosenCover,
      edition: '1ª Edição',
    });

    setIsAddBookModalOpen(false);
    openBookDetail(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#14171d] border border-stone-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <BookPlus className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-serif font-bold text-stone-100">
              Cadastrar Novo Livro no Catálogo
            </h3>
          </div>
          <button
            onClick={() => setIsAddBookModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Título do Livro *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A Menina que Roubava Livros"
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Autor(a) *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Markus Zusak"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Ano de Publicação</label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Total de Páginas</label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Editora</label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Ex: Intrínseca"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Gêneros (separados por vírgula)</label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Ex: Ficção Histórica, Segunda Guerra, Drama"
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Sinopse da Obra *</label>
            <textarea
              required
              rows={4}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Descreva a premissa principal do livro para outros leitores..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg p-3 text-xs text-stone-100 outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">URL da Imagem da Capa (opcional)</label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Deixe em branco para capa gerada automática"
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-100 outline-none font-mono"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setIsAddBookModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold"
            >
              Salvar e Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
