/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { Top100View } from './components/Top100View';
import { SocialFeedView } from './components/SocialFeedView';
import { ShelvesView } from './components/ShelvesView';
import { ClubsView } from './components/ClubsView';
import { ProfileView } from './components/ProfileView';
import { BookDetailModal } from './components/BookDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { ReadingProgressModal } from './components/ReadingProgressModal';
import { AddBookModal } from './components/AddBookModal';
import { DownloadModal } from './components/DownloadModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsDownloadModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#e5e5e7] flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* 3-Zone Top Bar Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'top100' && <Top100View />}
        {activeTab === 'feed' && <SocialFeedView />}
        {activeTab === 'shelves' && <ShelvesView />}
        {activeTab === 'clubs' && <ClubsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950/80 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-300 text-sm">Libris</span>
            <span aria-hidden="true">·</span>
            <span>A Rede Social Literária e IMDb dos Livros</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('catalog')}
              className="hover:text-stone-300 transition-colors"
            >
              Catálogo
            </button>
            <button
              onClick={() => setActiveTab('top100')}
              className="hover:text-stone-300 transition-colors"
            >
              Top 100 IMDb
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className="hover:text-stone-300 transition-colors"
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('shelves')}
              className="hover:text-stone-300 transition-colors"
            >
              Minhas Leituras
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className="hover:text-stone-300 transition-colors"
            >
              Clubes do Livro
            </button>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
            >
              Baixar App & Código
            </button>
          </div>

          <p className="font-mono text-[11px] text-stone-600">
            © 2026 Libris. Feito para amantes da leitura.
          </p>
        </div>
      </footer>

      {/* Global Modals */}
      <BookDetailModal />
      <ReviewModal />
      <ReadingProgressModal />
      <AddBookModal />
      <DownloadModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
