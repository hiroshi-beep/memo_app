import React from 'react';
import { 
  FileText, 
  Pin, 
  Star, 
  Archive, 
  Trash2, 
  Plus, 
  Hash, 
  Sun, 
  Moon, 
  Download, 
  Keyboard, 
  X,
  Sparkles,
  Heart
} from 'lucide-react';
import { Memo, FilterType, MemoCategory, CATEGORIES } from '../types/memo';

interface SidebarProps {
  memos: Memo[];
  activeFilter: FilterType;
  selectedCategory: MemoCategory | null;
  selectedTag: string | null;
  onSelectFilter: (filter: FilterType) => void;
  onSelectCategory: (category: MemoCategory) => void;
  onSelectTag: (tag: string) => void;
  onCreateNewMemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenShortcuts: () => void;
  onOpenBackupModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  memos,
  activeFilter,
  selectedCategory,
  selectedTag,
  onSelectFilter,
  onSelectCategory,
  onSelectTag,
  onCreateNewMemo,
  isDarkMode,
  onToggleDarkMode,
  onOpenShortcuts,
  onOpenBackupModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Counts calculation
  const nonTrashMemos = memos.filter(m => !m.isTrash);
  const allCount = nonTrashMemos.filter(m => !m.isArchived).length;
  const pinnedCount = nonTrashMemos.filter(m => m.isPinned && !m.isArchived).length;
  const favoriteCount = nonTrashMemos.filter(m => m.isFavorite && !m.isArchived).length;
  const archivedCount = nonTrashMemos.filter(m => m.isArchived).length;
  const trashCount = memos.filter(m => m.isTrash).length;

  // Category counts
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = nonTrashMemos.filter(m => m.category === cat.id && !m.isArchived).length;
    return acc;
  }, {} as Record<MemoCategory, number>);

  // Tag extraction and counts
  const tagCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    nonTrashMemos.forEach(m => {
      if (!m.isArchived && m.tags) {
        m.tags.forEach(t => {
          const clean = t.trim();
          if (clean) {
            map[clean] = (map[clean] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [nonTrashMemos]);

  const navItems = [
    { id: 'all' as FilterType, label: 'すべてのメモ', emoji: '📝', count: allCount },
    { id: 'pinned' as FilterType, label: 'ピン留め', emoji: '📌', count: pinnedCount },
    { id: 'favorites' as FilterType, label: 'お気に入り', emoji: '⭐', count: favoriteCount },
    { id: 'archived' as FilterType, label: 'アーカイブ', emoji: '📦', count: archivedCount },
    { id: 'trash' as FilterType, label: 'ゴミ箱', emoji: '🗑️', count: trashCount },
  ];

  const handleNavClick = (filter: FilterType) => {
    onSelectFilter(filter);
    if (isOpenMobile) onCloseMobile();
  };

  const handleCategoryClick = (catId: MemoCategory) => {
    onSelectCategory(catId);
    if (isOpenMobile) onCloseMobile();
  };

  const handleTagClick = (tag: string) => {
    onSelectTag(tag);
    if (isOpenMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-rose-50/70 dark:bg-neutral-900 border-r border-rose-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200">
      {/* Brand Header with cute Mascot Kitten */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-rose-100/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-200 dark:border-rose-900 shadow-xs shrink-0 group">
            <img
              src="/src/assets/images/cute_cat_mascot_1791617920584.jpg"
              alt="Fuwa Memo Mascot"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold tracking-tight text-neutral-800 dark:text-rose-100 text-base">
                Fuwa Memo
              </span>
              <span className="text-xs">🐾</span>
            </div>
            <span className="text-[11px] text-rose-400 dark:text-rose-300 font-medium">
              ふわメモ・心地いいノート
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-100/60 dark:hover:bg-neutral-800 transition-colors"
          aria-label="サイドバーを閉じる"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Action Button (Cute bouncy button) */}
      <div className="p-3.5">
        <button
          onClick={() => {
            onCreateNewMemo();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl shadow-sm shadow-rose-200 dark:shadow-none transition-all cursor-pointer group active:scale-[0.98] hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>新しいメモを書く 🌸</span>
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* Main Views */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-rose-400 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>ビュー</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-300 font-bold shadow-xs border border-rose-100 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-rose-100/50 dark:hover:bg-neutral-800/60 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base shrink-0">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-neutral-800 text-rose-500 dark:text-neutral-400 font-mono tabular-nums ml-2">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-rose-400 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>カテゴリー</span>
          </div>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = activeFilter === 'category' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-300 font-bold shadow-xs border border-rose-100 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-rose-100/50 dark:hover:bg-neutral-800/60 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-neutral-800 text-rose-500 dark:text-neutral-400 font-mono tabular-nums ml-2">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tags */}
        {tagCounts.length > 0 && (
          <div>
            <div className="px-3 pb-1.5 text-[11px] font-bold text-rose-400 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3 h-3" />
              <span>タグ</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-1 py-1">
              {tagCounts.map(([tag, count]) => {
                const isActive = activeFilter === 'tag' && selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-white/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-rose-100 dark:border-neutral-700 hover:bg-rose-100/60 hover:text-rose-600'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-[10px] opacity-75 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-rose-100 dark:border-neutral-800 space-y-1 bg-white/40 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between gap-1.5">
          <button
            onClick={onOpenBackupModal}
            title="バックアップ・復元"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs text-neutral-600 dark:text-neutral-300 hover:text-rose-600 hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-rose-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>データ管理</span>
          </button>
          
          <button
            onClick={onOpenShortcuts}
            title="ショートカットキー"
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-rose-600 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-amber-500 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
