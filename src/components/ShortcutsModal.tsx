import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl / Cmd + N', desc: '新しいメモを作成 🌸' },
    { key: 'Ctrl / Cmd + S', desc: '手動保存（自動保存も常時作動）' },
    { key: 'Ctrl / Cmd + F', desc: 'メモの検索ボックスへフォーカス 🐾' },
    { key: 'Ctrl / Cmd + B', desc: '太字にする (**bold**)' },
    { key: 'Ctrl / Cmd + I', desc: '斜体にする (*italic*)' },
    { key: 'Tab', desc: 'エディタ内で2スペースインデント' },
    { key: 'Esc', desc: '検索解除 / 画面を閉じる' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-rose-100 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 text-neutral-800 dark:text-neutral-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-base">⌨️</span>
            <h3 className="font-bold text-sm text-neutral-800 dark:text-rose-100">キーボードショートカット</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-xl transition-colors"
            aria-label="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-rose-50 dark:bg-neutral-800 border border-rose-200 dark:border-neutral-700 rounded-xl font-mono text-[11px] text-neutral-800 dark:text-neutral-300 font-bold shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3.5 border-t border-rose-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            閉じる 🐾
          </button>
        </div>
      </div>
    </div>
  );
};
