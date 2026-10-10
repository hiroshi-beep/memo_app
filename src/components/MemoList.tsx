import React from 'react';
import { 
  Search, 
  X, 
  Pin, 
  Star, 
  Trash2, 
  RotateCcw, 
  LayoutList, 
  LayoutGrid, 
  ArrowUpDown, 
  Tag
} from 'lucide-react';
import { Memo, SortOption, ViewMode, FilterType, MemoCategory, CATEGORIES, COLOR_THEMES } from '../types/memo';
import { formatRelativeTime } from '../utils/textStats';

interface MemoListProps {
  memos: Memo[];
  activeMemoId: string | null;
  onSelectMemo: (memoId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilter: FilterType;
  selectedCategory: MemoCategory | null;
  selectedTag: string | null;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onMoveToTrash: (id: string, e: React.MouseEvent) => void;
  onRestoreFromTrash: (id: string, e: React.MouseEvent) => void;
  onPermanentDelete: (id: string, e: React.MouseEvent) => void;
  onEmptyTrash: () => void;
  onCreateNewMemo: () => void;
}

export const MemoList: React.FC<MemoListProps> = ({
  memos,
  activeMemoId,
  onSelectMemo,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilter,
  selectedCategory,
  selectedTag,
  onTogglePin,
  onToggleFavorite,
  onMoveToTrash,
  onRestoreFromTrash,
  onPermanentDelete,
  onEmptyTrash,
  onCreateNewMemo,
}) => {
  // Title for current filter context
  const getFilterHeading = () => {
    if (searchQuery.trim()) {
      return `「${searchQuery}」の検索結果`;
    }
    if (activeFilter === 'all') return '📝 すべてのメモ';
    if (activeFilter === 'pinned') return '📌 ピン留めメモ';
    if (activeFilter === 'favorites') return '⭐ お気に入り';
    if (activeFilter === 'archived') return '📦 アーカイブ';
    if (activeFilter === 'trash') return '🗑️ ゴミ箱';
    if (activeFilter === 'category' && selectedCategory) {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      return cat ? `${cat.icon} ${cat.label}` : 'カテゴリー';
    }
    if (activeFilter === 'tag' && selectedTag) {
      return `🏷️ #${selectedTag}`;
    }
    return 'メモ一覧';
  };

  const isTrashView = activeFilter === 'trash';

  return (
    <div className="flex flex-col h-full bg-white/70 dark:bg-neutral-950/70 border-r border-rose-100/90 dark:border-neutral-800">
      {/* Search and Filter Bar Header */}
      <div className="p-3.5 border-b border-rose-100/80 dark:border-neutral-800 space-y-2.5 bg-white/50 dark:bg-neutral-900/40">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300 dark:text-neutral-400" />
          <input
            id="memo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="メモを検索する... 🐾 (Ctrl+F)"
            className="w-full pl-9 pr-8 py-2 text-sm bg-rose-50/50 dark:bg-neutral-900 border border-rose-100 dark:border-neutral-800 focus:border-rose-300 dark:focus:border-rose-400 rounded-2xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200/50 dark:focus:ring-rose-950/40 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-rose-500 rounded-full p-1"
              aria-label="検索をクリア"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sub-header controls: Filter title, Count, Sort, View mode */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate">
              {getFilterHeading()}
            </span>
            <span className="font-mono tabular-nums text-rose-400 dark:text-rose-300 shrink-0 font-semibold">
              ({memos.length})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Trash Empty action */}
            {isTrashView && memos.length > 0 && (
              <button
                onClick={onEmptyTrash}
                className="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors font-bold cursor-pointer"
              >
                ゴミ箱を空にする
              </button>
            )}

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs bg-rose-50/60 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-rose-100 dark:border-neutral-800 rounded-xl px-2.5 py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-300 font-medium"
                aria-label="並び替え順"
              >
                <option value="updatedAt_desc">更新順 (新)</option>
                <option value="updatedAt_asc">更新順 (古)</option>
                <option value="createdAt_desc">作成順 (新)</option>
                <option value="title_asc">タイトル順</option>
                <option value="charCount_desc">文字数順</option>
              </select>
              <ArrowUpDown className="w-3 h-3 absolute right-2 pointer-events-none text-rose-300 dark:text-neutral-400" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-rose-50/70 dark:bg-neutral-900 p-0.5 rounded-xl border border-rose-100 dark:border-neutral-800">
              <button
                onClick={() => onViewModeChange('list')}
                title="リスト表示"
                className={`p-1 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-neutral-800 text-rose-500 dark:text-rose-300 shadow-2xs font-bold' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                title="カード表示"
                className={`p-1 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 text-rose-500 dark:text-rose-300 shadow-2xs font-bold' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Memos List / Grid Container */}
      <div className="flex-1 overflow-y-auto p-3">
        {memos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400 dark:text-neutral-500">
            {isTrashView ? (
              <>
                <Trash2 className="w-10 h-10 mb-2 stroke-1 text-rose-200 dark:text-neutral-700" />
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">ゴミ箱は空っぽです ✨</p>
                <p className="text-xs mt-1 text-neutral-400">削除したメモはここに届きます</p>
              </>
            ) : searchQuery ? (
              <>
                <Search className="w-10 h-10 mb-2 stroke-1 text-rose-200 dark:text-neutral-700" />
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">見つかりませんでした 🐾</p>
                <p className="text-xs mt-1 text-neutral-400">別のキーワードで探してみてね</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border-2 border-rose-200 shadow-xs">
                  <img
                    src="/src/assets/images/cute_cat_mascot_1791617920584.jpg"
                    alt="Fuwa Memo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">メモがまだありません 🌸</p>
                <p className="text-xs mt-1 mb-4 text-neutral-400">今日のやることやアイデアを書いてみよう</p>
                <button
                  onClick={onCreateNewMemo}
                  className="px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  新しいメモを書く 🐾
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2.5'}>
            {memos.map((memo) => {
              const isSelected = memo.id === activeMemoId;
              const theme = COLOR_THEMES[memo.color || 'sakura'];
              const plainSnippet = memo.content
                ? memo.content.replace(/[#*`~_\[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim()
                : '（メモの本文がまだありません）';
              const catMeta = CATEGORIES.find(c => c.id === memo.category);

              return (
                <div
                  key={memo.id}
                  onClick={() => onSelectMemo(memo.id)}
                  className={`group relative pt-4 pb-3 px-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left shadow-2xs ${
                    theme.bg
                  } ${theme.darkBg} ${
                    isSelected
                      ? 'border-rose-400 dark:border-rose-400 ring-2 ring-rose-300/40 shadow-sm scale-[1.01]'
                      : `${theme.border} ${theme.darkBorder} hover:border-rose-300 dark:hover:border-neutral-700 hover:shadow-xs hover:-translate-y-0.5`
                  }`}
                >
                  {/* Cute Washi Tape Decoration on top */}
                  <div 
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-xs ${theme.tapeColor} opacity-75 shadow-2xs transform rotate-[-1deg]`} 
                  />

                  {/* Card Header: Pin / Title / Favorite */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {memo.isPinned && !isTrashView && (
                        <span className="text-xs shrink-0" title="ピン留め中">📌</span>
                      )}
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">
                        {memo.title.trim() || '無題のメモ 📝'}
                      </h4>
                    </div>

                    {/* Quick actions (Favorite, Trash/Restore) */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      {!isTrashView ? (
                        <>
                          <button
                            onClick={(e) => onToggleFavorite(memo.id, e)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
                            title={memo.isFavorite ? 'お気に入りを解除' : 'お気に入りに追加'}
                          >
                            <Star className={`w-3.5 h-3.5 ${memo.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => onTogglePin(memo.id, e)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
                            title={memo.isPinned ? 'ピン留めを解除' : '上部にピン留め'}
                          >
                            <Pin className={`w-3.5 h-3.5 ${memo.isPinned ? 'text-rose-500 fill-rose-500' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => onMoveToTrash(memo.id, e)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
                            title="ゴミ箱へ移動"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => onRestoreFromTrash(memo.id, e)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-emerald-500 hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
                            title="メモを復元"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => onPermanentDelete(memo.id, e)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
                            title="完全に削除"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Snippet */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed mb-2.5">
                    {plainSnippet}
                  </p>

                  {/* Meta Footer */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1.5 border-t border-rose-100/60 dark:border-neutral-800/60">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-mono tabular-nums text-rose-400 dark:text-rose-300 font-medium">
                        {formatRelativeTime(memo.updatedAt)}
                      </span>
                      {catMeta && (
                        <>
                          <span aria-hidden="true" className="text-rose-200 dark:text-neutral-700">·</span>
                          <span className="truncate flex items-center gap-0.5 font-medium">
                            <span>{catMeta.icon}</span>
                            <span>{catMeta.label}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Tags preview */}
                    {memo.tags && memo.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-rose-500 dark:text-rose-300 truncate max-w-[45%] font-medium">
                        <Tag className="w-3 h-3 text-rose-300 shrink-0" />
                        <span className="truncate">#{memo.tags[0]}</span>
                        {memo.tags.length > 1 && (
                          <span className="font-mono text-neutral-400">+{memo.tags.length - 1}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
