import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Terminal,
  Code2,
  Copy,
  Check,
  Share2,
  FileJson,
  Apple,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const DownloadModal: React.FC = () => {
  const { isDownloadModalOpen, setIsDownloadModalOpen, books, reviews, shelves, user } = useApp();
  const [activeTab, setActiveTab] = useState<'install' | 'code' | 'backup' | 'files'>('install');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('types');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isDownloadModalOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar, use a opção "Adicionar à tela inicial" ou "Instalar aplicativo" no menu do seu navegador.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleCopyCode = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      appName: 'Libris — Rede Social Literária',
      user,
      books,
      reviews,
      shelves,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `libris-dados-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const codeSnippets: Record<string, { filename: string; language: string; content: string }> = {
    quickstart: {
      filename: 'Terminal / Linha de Comando',
      language: 'bash',
      content: `# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Gerar a versão de produção otimizada
npm run build`,
    },
    types: {
      filename: 'src/types/index.ts',
      language: 'typescript',
      content: `export type ShelfStatus = 'want_to_read' | 'reading' | 'read' | 'abandoned';

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  coverUrl: string;
  publishedYear: number;
  pages: number;
  genres: string[];
  synopsis: string;
  publisher: string;
  isbn: string;
  rating: number; // 0 to 5.0
  ratingCount: number;
  ratingsDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  featuredQuote?: {
    text: string;
    page?: number;
  };
  edition?: string;
  rank?: number;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  rating: number;
  content: string;
  containsSpoilers: boolean;
  createdAt: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  commentsCount: number;
  tags: string[];
}

export interface ShelfItem {
  bookId: string;
  status: ShelfStatus;
  userRating?: number;
  progressPages: number;
  dateStarted?: string;
  dateFinished?: string;
  notes?: string;
  isFavorite?: boolean;
}`,
    },
    package: {
      filename: 'package.json',
      language: 'json',
      content: `{
  "name": "libris-rede-social-livros",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  }
}`,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#13161c] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-100">
                Baixar App & Obter Código Fonte
              </h3>
              <p className="text-xs text-stone-400">
                Instale no seu celular/PC ou execute o código completo na sua máquina
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-stone-800/80 bg-stone-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Instalar no Celular / PC (PWA)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Como Rodar no seu Computador
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Ver Código Fonte
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            Exportar Dados (JSON)
          </button>
        </div>

        {/* Tab 1: How to Install PWA */}
        {activeTab === 'install' && (
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Quick 1-Click Install Banner if available */}
            {deferredPrompt && (
              <div className="p-4 bg-gradient-to-r from-amber-500/20 via-stone-900 to-stone-900 border border-amber-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-serif font-bold text-amber-200">
                    Instalação Instantânea Disponível
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Seu navegador suporta instalação direta com 1 clique!
                  </p>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Instalar Libris Agora
                </button>
              </div>
            )}

            {isInstalled && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>O Libris já está instalado e funcionando no modo aplicativo autônomo!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Android Card */}
              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>No Android (Chrome)</span>
                </div>
                <ol className="text-xs text-stone-400 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Abra o link do app no <strong>Google Chrome</strong>.</li>
                  <li>Toque no menu de três pontos <strong>(⋮)</strong> no canto superior direito.</li>
                  <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                  <li>O Libris ganhará um ícone próprio e abrirá sem barras do navegador.</li>
                </ol>
              </div>

              {/* iOS / iPhone Card */}
              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
                  <Apple className="w-4 h-4 text-stone-300" />
                  <span>No iPhone / iPad (Safari)</span>
                </div>
                <ol className="text-xs text-stone-400 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Abra o link do app no navegador <strong>Safari</strong>.</li>
                  <li>Toque no botão central de <strong>Compartilhar</strong> (ícone com quadrado e seta).</li>
                  <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
                  <li>Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto!</li>
                </ol>
              </div>

              {/* Desktop Card */}
              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <span>No Computador (PC / Mac)</span>
                </div>
                <ol className="text-xs text-stone-400 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>No <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>.</li>
                  <li>Olhe na barra de endereços (lado direito) e clique no ícone de <strong>Instalar</strong>.</li>
                  <li>Ou abra o menu (⋮) e clique em <strong>"Instalar Libris..."</strong>.</li>
                  <li>Ele vira uma janela independente no seu desktop!</li>
                </ol>
              </div>
            </div>

            <div className="p-4 bg-stone-950/80 border border-stone-800/80 rounded-xl text-xs text-stone-400 space-y-2">
              <span className="font-semibold text-stone-200 block">
                💡 O que é uma PWA (Progressive Web App)?
              </span>
              <p className="leading-relaxed">
                O Libris foi configurado com Manifesto Web App e ícones de alta resolução. Ao instalar, ele funciona exatamente como um aplicativo nativo baixado da App Store ou Play Store: tem ícone na tela inicial, abre em tela cheia sem poluição visual e carrega instantaneamente.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: How to Run Locally */}
        {activeTab === 'code' && (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div>
              <h4 className="text-sm font-serif font-bold text-stone-100">
                Como baixar e rodar o projeto no seu computador
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Você pode clonar ou baixar os arquivos deste app diretamente do <strong>Google AI Studio</strong> e rodar em qualquer máquina com Node.js instalado.
              </p>
            </div>

            {/* Steps list */}
            <div className="space-y-4">
              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-400 font-mono">PASSO 1: Exportar os arquivos</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  No painel superior do Google AI Studio, clique no botão <strong>"Export"</strong> ou <strong>"Git / Download"</strong> para exportar para um repositório GitHub ou baixar como arquivo <code>.zip</code>.
                </p>
              </div>

              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">PASSO 2: Comandos de Execução</span>
                  <button
                    onClick={() => handleCopyCode(codeSnippets.quickstart.content, 'quickstart')}
                    className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedSection === 'quickstart' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar comandos</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-stone-950 p-3 rounded-lg text-xs font-mono text-stone-200 overflow-x-auto border border-stone-800">
                  {codeSnippets.quickstart.content}
                </pre>
              </div>

              <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-400 font-mono">PASSO 3: Abrir no Navegador</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Após executar <code>npm run dev</code>, acesse <code className="text-amber-400">http://localhost:3000</code> ou o endereço indicado no seu terminal. O app estará 100% funcional na sua máquina!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Source Code Viewer */}
        {activeTab === 'files' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFile('types')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedFile === 'types'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  types/index.ts
                </button>
                <button
                  onClick={() => setSelectedFile('package')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedFile === 'package'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  package.json
                </button>
              </div>

              <button
                onClick={() => handleCopyCode(codeSnippets[selectedFile]?.content || '', selectedFile)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium"
              >
                {copiedSection === selectedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Arquivo Inteiro</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="text-[11px] font-mono text-stone-500 bg-stone-950 px-3 py-1.5 border border-b-0 border-stone-800 rounded-t-lg">
                {codeSnippets[selectedFile]?.filename}
              </div>
              <pre className="bg-[#0b0d10] p-4 rounded-b-lg text-xs font-mono text-stone-300 overflow-x-auto border border-stone-800 max-h-96 leading-relaxed">
                {codeSnippets[selectedFile]?.content}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Export Backup */}
        {activeTab === 'backup' && (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div>
              <h4 className="text-sm font-serif font-bold text-stone-100">
                Exportar e Baixar Banco de Dados Completo (JSON)
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Baixe um arquivo contendo todas as informações salvas no seu aplicativo: catálogo de livros, resenhas criadas, status da estante e perfil do leitor.
              </p>
            </div>

            <div className="p-5 bg-stone-900/50 border border-stone-800 rounded-xl space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-950 rounded-lg">
                  <span className="text-stone-500 block">Livros no Catálogo</span>
                  <span className="text-base font-bold text-amber-300 font-mono">{books.length}</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-lg">
                  <span className="text-stone-500 block">Resenhas Críticas</span>
                  <span className="text-base font-bold text-amber-300 font-mono">{reviews.length}</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-lg">
                  <span className="text-stone-500 block">Livros na Estante</span>
                  <span className="text-base font-bold text-amber-300 font-mono">{shelves.length}</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-lg">
                  <span className="text-stone-500 block">Usuário Ativo</span>
                  <span className="text-xs font-bold text-stone-200 truncate block mt-1">{user.name}</span>
                </div>
              </div>

              <button
                onClick={handleExportBackup}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Baixar Arquivo JSON de Backup
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-500">
          <span>Libris — PWA & Open-Source Architecture</span>
          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="px-4 py-1.5 text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
