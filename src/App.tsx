/**
 * MemoPad - Modern Note & Memo Taking Application
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Menu, Plus, ArrowLeft, PenSquare, FileText } from 'lucide-react';
import { Memo, FilterType, MemoCategory, SortOption, ViewMode } from './types/memo';
import { loadMemos, saveMemos, loadDarkMode, saveDarkMode, INITIAL_MEMOS } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { MemoList } from './components/MemoList';
import { MemoEditor } from './components/MemoEditor';
import { ShortcutsModal } from './components/ShortcutsModal';
import { BackupModal } from './components/BackupModal';

export default function App() {
  const [memos, setMemos] = useState<Memo[]>(() => loadMemos());
  const [activeMemoId, setActiveMemoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<MemoCategory | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadDarkMode());
  
  // UI Modal & Mobile states
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileEditorActive, setIsMobileEditorActive] = useState(false);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Persist memos whenever they change
  useEffect(() => {
    saveMemos(memos);
  }, [memos]);

  // Filtered and Sorted Memos
  const filteredMemos = useMemo(() => {
    return memos
      .filter((memo) => {
        // Trash view separation
        if (activeFilter === 'trash') {
          return memo.isTrash;
        }
        if (memo.isTrash) return false;

        // Archive separation
        if (activeFilter === 'archived') {
          return memo.isArchived;
        }
        if (memo.isArchived) return false;

        // Specific filters
        if (activeFilter === 'pinned' && !memo.isPinned) return false;
        if (activeFilter === 'favorites' && !memo.isFavorite) return false;
        if (activeFilter === 'category' && selectedCategory && memo.category !== selectedCategory) return false;
        if (activeFilter === 'tag' && selectedTag && (!memo.tags || !memo.tags.includes(selectedTag))) return false;

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = memo.title.toLowerCase().includes(q);
          const contentMatch = memo.content.toLowerCase().includes(q);
          const tagMatch = memo.tags && memo.tags.some(t => t.toLowerCase().includes(q));
          if (!titleMatch && !contentMatch && !tagMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned memos stay at top unless sorting strictly in trash or archives
        if (activeFilter !== 'trash' && activeFilter !== 'archived') {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
        }

        switch (sortOption) {
          case 'updatedAt_desc':
            return b.updatedAt - a.updatedAt;
          case 'updatedAt_asc':
            return a.updatedAt - b.updatedAt;
          case 'createdAt_desc':
            return b.createdAt - a.createdAt;
          case 'title_asc':
            return a.title.localeCompare(b.title, 'ja');
          case 'charCount_desc':
            return (b.content?.length || 0) - (a.content?.length || 0);
          default:
            return b.updatedAt - a.updatedAt;
        }
      });
  }, [memos, activeFilter, selectedCategory, selectedTag, searchQuery, sortOption]);

  // Ensure an active memo is selected when available
  useEffect(() => {
    if (!activeMemoId && filteredMemos.length > 0) {
      setActiveMemoId(filteredMemos[0].id);
    } else if (activeMemoId && !memos.some(m => m.id === activeMemoId)) {
      setActiveMemoId(filteredMemos[0]?.id || null);
    }
  }, [filteredMemos, activeMemoId, memos]);

  // Active Memo object
  const activeMemo = useMemo(() => {
    return memos.find(m => m.id === activeMemoId) || null;
  }, [memos, activeMemoId]);

  // Create new memo
  const handleCreateNewMemo = useCallback(() => {
    const newMemo: Memo = {
      id: `memo-${Date.now()}`,
      title: '',
      content: '',
      category: selectedCategory || 'daily',
      tags: selectedTag ? [selectedTag] : [],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      isTrash: false,
      color: 'sakura',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setMemos(prev => [newMemo, ...prev]);
    setActiveMemoId(newMemo.id);
    setIsMobileEditorActive(true);
  }, [selectedCategory, selectedTag]);

  // Update memo partial properties
  const handleUpdateMemo = useCallback((updates: Partial<Memo>) => {
    if (!activeMemoId) return;

    setMemos(prev =>
      prev.map(m => {
        if (m.id === activeMemoId) {
          return {
            ...m,
            ...updates,
            updatedAt: Date.now(),
          };
        }
        return m;
      })
    );
  }, [activeMemoId]);

  // Pin toggle
  const handleTogglePin = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, isPinned: !m.isPinned, updatedAt: Date.now() } : m))
    );
  }, []);

  // Favorite toggle
  const handleToggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, isFavorite: !m.isFavorite, updatedAt: Date.now() } : m))
    );
  }, []);

  // Archive toggle
  const handleToggleArchive = useCallback((id: string) => {
    setMemos(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextArchived = !m.isArchived;
          return { ...m, isArchived: nextArchived, updatedAt: Date.now() };
        }
        return m;
      })
    );
  }, []);

  // Move to trash
  const handleMoveToTrash = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, isTrash: true, updatedAt: Date.now() } : m))
    );
    if (activeMemoId === id) {
      const remaining = filteredMemos.filter(m => m.id !== id);
      setActiveMemoId(remaining[0]?.id || null);
    }
  }, [activeMemoId, filteredMemos]);

  // Restore from trash
  const handleRestoreFromTrash = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, isTrash: false, updatedAt: Date.now() } : m))
    );
  }, []);

  // Permanent delete
  const handlePermanentDelete = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('このメモを完全に削除しますか？この操作は元に戻せません。')) {
      setMemos(prev => prev.filter(m => m.id !== id));
      if (activeMemoId === id) {
        const remaining = filteredMemos.filter(m => m.id !== id);
        setActiveMemoId(remaining[0]?.id || null);
      }
    }
  }, [activeMemoId, filteredMemos]);

  // Empty trash
  const handleEmptyTrash = useCallback(() => {
    if (window.confirm('ゴミ箱内のすべてのメモを完全に削除しますか？')) {
      setMemos(prev => prev.filter(m => !m.isTrash));
      setActiveMemoId(null);
    }
  }, []);

  // Filter Selection handlers
  const handleSelectFilter = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');
  }, []);

  const handleSelectCategory = useCallback((category: MemoCategory) => {
    setActiveFilter('category');
    setSelectedCategory(category);
    setSelectedTag(null);
    setSearchQuery('');
  }, []);

  const handleSelectTag = useCallback((tag: string) => {
    setActiveFilter('tag');
    setSelectedTag(tag);
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  // Select a memo from list
  const handleSelectMemo = useCallback((id: string) => {
    setActiveMemoId(id);
    setIsMobileEditorActive(true);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd modifier
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNewMemo();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        // Feedback is naturally shown by the Saved status
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('memo-search-input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isBackupOpen) setIsBackupOpen(false);
        if (searchQuery) setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNewMemo, isShortcutsOpen, isBackupOpen, searchQuery]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
      {/* 1. Sidebar Component */}
      <Sidebar
        memos={memos}
        activeFilter={activeFilter}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onSelectFilter={handleSelectFilter}
        onSelectCategory={handleSelectCategory}
        onSelectTag={handleSelectTag}
        onCreateNewMemo={handleCreateNewMemo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Top Header (hidden on large screens) */}
        <div className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-rose-50 dark:bg-neutral-900 border-b border-rose-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl hover:bg-rose-100/60 dark:hover:bg-neutral-800 text-rose-500 dark:text-rose-300"
              aria-label="メニューを開く"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-neutral-800 dark:text-rose-100">Fuwa Memo</span>
              <span className="text-xs">🐾</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isMobileEditorActive && (
              <button
                onClick={() => setIsMobileEditorActive(false)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-rose-200 dark:border-neutral-700 rounded-xl font-bold shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>一覧へ</span>
              </button>
            )}
            <button
              onClick={handleCreateNewMemo}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新規 🌸</span>
            </button>
          </div>
        </div>

        {/* Desktop Split Panes / Mobile conditional view */}
        <div className="flex-1 flex min-w-0 h-full overflow-hidden">
          {/* 2. Memo List Column */}
          <div 
            className={`w-full lg:w-80 xl:w-96 shrink-0 h-full flex flex-col ${
              isMobileEditorActive ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <MemoList
              memos={filteredMemos}
              activeMemoId={activeMemoId}
              onSelectMemo={handleSelectMemo}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activeFilter={activeFilter}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onMoveToTrash={handleMoveToTrash}
              onRestoreFromTrash={handleRestoreFromTrash}
              onPermanentDelete={handlePermanentDelete}
              onEmptyTrash={handleEmptyTrash}
              onCreateNewMemo={handleCreateNewMemo}
            />
          </div>

          {/* 3. Memo Editor Column */}
          <div 
            className={`flex-1 h-full min-w-0 flex flex-col ${
              !isMobileEditorActive ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeMemo ? (
              <MemoEditor
                key={activeMemo.id}
                memo={activeMemo}
                onUpdateMemo={handleUpdateMemo}
                onDeleteMemo={handleMoveToTrash}
                onTogglePin={handleTogglePin}
                onToggleFavorite={handleToggleFavorite}
                onToggleArchive={handleToggleArchive}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-500 dark:text-neutral-400 bg-rose-50/20 dark:bg-neutral-900">
                <div className="w-full max-w-md rounded-3xl overflow-hidden border-2 border-rose-200/80 dark:border-neutral-800 shadow-md mb-6 relative group">
                  <img
                    src="/src/assets/images/cozy_desk_banner_1791617936990.jpg"
                    alt="Cozy Study Desk"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold drop-shadow-sm flex items-center gap-1">
                      <span>今日もお疲れさまでした ☕</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-800 dark:text-rose-100 mb-1.5 flex items-center gap-1.5">
                  <span>メモが選択されていません</span>
                  <span>🐾</span>
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
                  左側の一覧からメモを選ぶか、新しくメモを書いてワクワクする予定やアイデアをまとめましょう。
                </p>
                <button
                  onClick={handleCreateNewMemo}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-2xl shadow-sm shadow-rose-200 dark:shadow-none transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>新しいメモを書く 🌸</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        memos={memos}
        onImportMemos={(imported) => {
          setMemos(imported);
          if (imported.length > 0) setActiveMemoId(imported[0].id);
        }}
        onResetMemos={() => {
          setMemos(INITIAL_MEMOS);
          setActiveMemoId(INITIAL_MEMOS[0].id);
        }}
      />
    </div>
  );
}
