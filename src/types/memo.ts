export type MemoCategory = 'daily' | 'tasks' | 'ideas' | 'sweets' | 'study' | 'work' | 'general';

export type MemoColor = 'sakura' | 'honey' | 'mint' | 'sky' | 'lavender' | 'custard' | 'milk';

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: MemoCategory;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isTrash: boolean;
  color: MemoColor;
  createdAt: number;
  updatedAt: number;
}

export type SortOption = 
  | 'updatedAt_desc' 
  | 'updatedAt_asc' 
  | 'createdAt_desc' 
  | 'title_asc' 
  | 'charCount_desc';

export type ViewMode = 'list' | 'grid';

export type FilterType = 
  | 'all' 
  | 'pinned' 
  | 'favorites' 
  | 'category' 
  | 'tag' 
  | 'archived' 
  | 'trash';

export interface CategoryMeta {
  id: MemoCategory;
  label: string;
  icon: string;
  colorClass: string;
  badgeBg: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'daily', label: '日常・つぶやき', icon: '☕', colorClass: 'text-amber-700 dark:text-amber-300', badgeBg: 'bg-amber-100/70 dark:bg-amber-950/40' },
  { id: 'tasks', label: 'やること・ToDo', icon: '🎀', colorClass: 'text-rose-700 dark:text-rose-300', badgeBg: 'bg-rose-100/70 dark:bg-rose-950/40' },
  { id: 'ideas', label: 'ひらめき・アイデア', icon: '💡', colorClass: 'text-yellow-700 dark:text-yellow-300', badgeBg: 'bg-yellow-100/70 dark:bg-yellow-950/40' },
  { id: 'sweets', label: 'カフェ・おやつ', icon: '🍰', colorClass: 'text-pink-700 dark:text-pink-300', badgeBg: 'bg-pink-100/70 dark:bg-pink-950/40' },
  { id: 'study', label: 'まなび・読書ノート', icon: '📖', colorClass: 'text-purple-700 dark:text-purple-300', badgeBg: 'bg-purple-100/70 dark:bg-purple-950/40' },
  { id: 'work', label: 'おしごと・予定', icon: '💼', colorClass: 'text-sky-700 dark:text-sky-300', badgeBg: 'bg-sky-100/70 dark:bg-sky-950/40' },
];

export const COLOR_THEMES: Record<MemoColor, { 
  name: string; 
  bg: string; 
  border: string; 
  darkBg: string; 
  darkBorder: string; 
  dot: string;
  tapeColor: string;
  emoji: string;
}> = {
  sakura: {
    name: 'サクラピンク',
    bg: 'bg-pink-50/70',
    border: 'border-pink-200/90',
    darkBg: 'dark:bg-pink-950/25',
    darkBorder: 'dark:border-pink-900/60',
    dot: 'bg-pink-400',
    tapeColor: 'bg-pink-300/80',
    emoji: '🌸',
  },
  honey: {
    name: 'ハチミツピーチ',
    bg: 'bg-orange-50/70',
    border: 'border-orange-200/90',
    darkBg: 'dark:bg-orange-950/25',
    darkBorder: 'dark:border-orange-900/60',
    dot: 'bg-orange-400',
    tapeColor: 'bg-orange-300/80',
    emoji: '🍯',
  },
  mint: {
    name: 'ミントグリーン',
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200/90',
    darkBg: 'dark:bg-emerald-950/25',
    darkBorder: 'dark:border-emerald-900/60',
    dot: 'bg-emerald-400',
    tapeColor: 'bg-emerald-300/80',
    emoji: '🌿',
  },
  sky: {
    name: 'そら色ブルー',
    bg: 'bg-sky-50/70',
    border: 'border-sky-200/90',
    darkBg: 'dark:bg-sky-950/25',
    darkBorder: 'dark:border-sky-900/60',
    dot: 'bg-sky-400',
    tapeColor: 'bg-sky-300/80',
    emoji: '☁️',
  },
  lavender: {
    name: 'スイートラベンダー',
    bg: 'bg-purple-50/70',
    border: 'border-purple-200/90',
    darkBg: 'dark:bg-purple-950/25',
    darkBorder: 'dark:border-purple-900/60',
    dot: 'bg-purple-400',
    tapeColor: 'bg-purple-300/80',
    emoji: '🍇',
  },
  custard: {
    name: 'カスタードプリン',
    bg: 'bg-amber-50/70',
    border: 'border-amber-200/90',
    darkBg: 'dark:bg-amber-950/25',
    darkBorder: 'dark:border-amber-900/60',
    dot: 'bg-amber-400',
    tapeColor: 'bg-amber-300/80',
    emoji: '🍮',
  },
  milk: {
    name: 'ミルクホワイト',
    bg: 'bg-white',
    border: 'border-rose-100 dark:border-neutral-800',
    darkBg: 'dark:bg-neutral-900',
    darkBorder: 'dark:border-neutral-800',
    dot: 'bg-rose-200',
    tapeColor: 'bg-rose-200/60',
    emoji: '🥛',
  },
};
