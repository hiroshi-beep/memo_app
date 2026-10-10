import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { Memo } from '../types/memo';
import { exportAllMemosAsJSON, INITIAL_MEMOS } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  memos: Memo[];
  onImportMemos: (imported: Memo[]) => void;
  onResetMemos: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  memos,
  onImportMemos,
  onResetMemos,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    exportAllMemosAsJSON(memos);
    setStatusMessage({ text: 'バックアップファイルをダウンロードしました 🌸', type: 'success' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].title !== undefined) {
          onImportMemos(parsed);
          setStatusMessage({ text: `${parsed.length} 件のメモをインポートしました ✨`, type: 'success' });
          setTimeout(() => {
            setStatusMessage(null);
            onClose();
          }, 1500);
        } else {
          setStatusMessage({ text: '有効なFuwa MemoのJSONファイルではありません。', type: 'error' });
        }
      } catch (err) {
        setStatusMessage({ text: 'ファイルの解析に失敗しました。', type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetConfirm = () => {
    if (window.confirm('初期サンプルデータにリセットしますか？現在のデータは上書きされます。')) {
      onResetMemos();
      setStatusMessage({ text: 'サンプルデータに初期化しました 🐾', type: 'success' });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-rose-100 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 text-neutral-800 dark:text-neutral-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <h3 className="font-bold text-sm text-neutral-800 dark:text-rose-100">データ管理・バックアップ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-xl transition-colors"
            aria-label="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div className={`mt-3 p-3 rounded-2xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Export JSON */}
          <div className="p-3.5 bg-rose-50/50 dark:bg-neutral-800/60 rounded-2xl border border-rose-100 dark:border-neutral-700">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 mb-1">
              <Download className="w-3.5 h-3.5 text-pink-500" />
              <span>JSONバックアップの保存</span>
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2.5">
              作成したすべてのメモ（{memos.length}件）をお使いの端末に保存します。
            </p>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-200 border border-rose-200 dark:border-neutral-600 rounded-xl hover:bg-rose-50 dark:hover:bg-neutral-600 transition-colors cursor-pointer shadow-2xs"
            >
              JSONファイルをダウンロード 🌸
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-3.5 bg-rose-50/50 dark:bg-neutral-800/60 rounded-2xl border border-rose-100 dark:border-neutral-700">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 mb-1">
              <Upload className="w-3.5 h-3.5 text-sky-500" />
              <span>バックアップの復元（読み込み）</span>
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2.5">
              以前保存したJSONファイルを選択してメモを復元します。
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-neutral-700 text-sky-600 dark:text-sky-200 border border-sky-200 dark:border-neutral-600 rounded-xl hover:bg-sky-50 dark:hover:bg-neutral-600 transition-colors cursor-pointer shadow-2xs"
            >
              JSONファイルを選ぶ 📂
            </button>
          </div>

          {/* Reset to Samples */}
          <div className="p-3.5 bg-rose-50/50 dark:bg-neutral-800/60 rounded-2xl border border-rose-100 dark:border-neutral-700">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 mb-1">
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>初期サンプルデータに戻す</span>
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2.5">
              最初の可愛いガイドとサンプルメモを再読み込みします。
            </p>
            <button
              onClick={handleResetConfirm}
              className="px-3.5 py-1.5 text-xs font-bold text-rose-500 dark:text-rose-400 bg-white dark:bg-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer shadow-2xs"
            >
              初期データにリセット 🐾
            </button>
          </div>
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
