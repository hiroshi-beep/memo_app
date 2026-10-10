import React, { useState, useRef, useEffect } from 'react';
import { 
  Pin, 
  Star, 
  Archive, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  CheckSquare, 
  Quote, 
  Code, 
  Minus, 
  Calendar, 
  Eye, 
  Edit3, 
  Columns, 
  Tag as TagIcon, 
  X,
  Plus,
  Sparkles,
  Heart
} from 'lucide-react';
import { Memo, MemoCategory, MemoColor, CATEGORIES, COLOR_THEMES } from '../types/memo';
import { calculateTextStats, formatDateTime } from '../utils/textStats';
import { MarkdownRenderer } from './MarkdownRenderer';
import { exportSingleMemo } from '../utils/storage';

interface MemoEditorProps {
  memo: Memo;
  onUpdateMemo: (updated: Partial<Memo>) => void;
  onDeleteMemo: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export const MemoEditor: React.FC<MemoEditorProps> = ({
  memo,
  onUpdateMemo,
  onDeleteMemo,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
}) => {
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [newTagInput, setNewTagInput] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [copiedRecently, setCopiedRecently] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Compute text stats
  const textStats = calculateTextStats(memo.content || '');

  // Auto-focus tag input when opened
  useEffect(() => {
    if (isTagInputOpen && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [isTagInputOpen]);

  // Insert markdown helpers into textarea
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = memo.content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = 
      memo.content.substring(0, start) + replacement + memo.content.substring(end);

    onUpdateMemo({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Insert current timestamp
  const insertTimestamp = () => {
    const now = new Date();
    const str = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    insertFormatting(`\n**[${str} 🐾]**\n`, '', '');
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertFormatting('  ', '', '');
    }
  };

  // Add new tag
  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !memo.tags.includes(trimmed)) {
      onUpdateMemo({ tags: [...memo.tags, trimmed] });
      setNewTagInput('');
      setIsTagInputOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateMemo({ tags: memo.tags.filter(t => t !== tagToRemove) });
  };

  // Interactive toggle checkbox in markdown
  const handleToggleTodo = (todoText: string, newCheckedState: boolean) => {
    const lines = memo.content.split('\n');
    const cleanTarget = todoText.trim();

    const updatedLines = lines.map(line => {
      const taskRegex = /^(\s*[-*]\s*)\[([ xX])\]\s*(.*)$/;
      const match = line.match(taskRegex);
      if (match) {
        const lineText = match[3].trim();
        if (lineText === cleanTarget || lineText.startsWith(cleanTarget)) {
          const checkChar = newCheckedState ? 'x' : ' ';
          return `${match[1]}[${checkChar}] ${match[3]}`;
        }
      }
      return line;
    });

    onUpdateMemo({ content: updatedLines.join('\n') });
  };

  // Copy plain text
  const handleCopyContent = () => {
    const fullText = `${memo.title}\n\n${memo.content}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 2000);
    });
  };

  const currentColorTheme = COLOR_THEMES[memo.color || 'sakura'];

  return (
    <div className={`flex flex-col h-full transition-colors ${currentColorTheme.bg} ${currentColorTheme.darkBg}`}>
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-rose-100 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xs">
        {/* Left: Category selector & Color Picker */}
        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative flex items-center">
            <select
              value={memo.category}
              onChange={(e) => onUpdateMemo({ category: e.target.value as MemoCategory })}
              className="text-xs bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl px-3 py-1.5 border border-rose-200 dark:border-neutral-700 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-2xs"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker Dropdown with cute emoji preview */}
          <div className="relative">
            <button
              onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-rose-200 dark:border-neutral-700 hover:bg-rose-50/50 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
              title="メモの色を選ぶ"
            >
              <span className="text-sm">{currentColorTheme.emoji}</span>
              <span className="hidden sm:inline text-xs">{currentColorTheme.name}</span>
            </button>

            {isColorMenuOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 p-2 bg-white dark:bg-neutral-800 border border-rose-200 dark:border-neutral-700 rounded-2xl shadow-xl z-30 flex items-center gap-2"
                onMouseLeave={() => setIsColorMenuOpen(false)}
              >
                {(Object.keys(COLOR_THEMES) as MemoColor[]).map(cKey => (
                  <button
                    key={cKey}
                    onClick={() => {
                      onUpdateMemo({ color: cKey });
                      setIsColorMenuOpen(false);
                    }}
                    title={COLOR_THEMES[cKey].name}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs hover:scale-115 transition-transform ${COLOR_THEMES[cKey].dot} ${
                      memo.color === cKey ? 'ring-2 ring-offset-2 ring-rose-400 dark:ring-rose-200' : ''
                    }`}
                  >
                    <span>{COLOR_THEMES[cKey].emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: View Switcher (Edit, Preview, Split) */}
        <div className="flex items-center bg-rose-50/70 dark:bg-neutral-800 p-0.5 rounded-xl border border-rose-100 dark:border-neutral-700">
          <button
            onClick={() => setEditorMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              editorMode === 'edit'
                ? 'bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-300 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>編集</span>
          </button>
          <button
            onClick={() => setEditorMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              editorMode === 'preview'
                ? 'bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-300 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>プレビュー</span>
          </button>
          <button
            onClick={() => setEditorMode('split')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              editorMode === 'split'
                ? 'bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-300 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>2画面分割</span>
          </button>
        </div>

        {/* Right: Actions (Pin, Favorite, Archive, Export, Trash) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTogglePin(memo.id)}
            title={memo.isPinned ? 'ピン留め解除' : 'ピン留め'}
            className={`p-1.5 rounded-xl transition-colors ${
              memo.isPinned 
                ? 'text-rose-500 bg-rose-100/70 dark:bg-rose-950/40' 
                : 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Pin className={`w-4 h-4 ${memo.isPinned ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => onToggleFavorite(memo.id)}
            title={memo.isFavorite ? 'お気に入り解除' : 'お気に入り'}
            className={`p-1.5 rounded-xl transition-colors ${
              memo.isFavorite 
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                : 'text-neutral-400 hover:text-amber-500 hover:bg-rose-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Star className={`w-4 h-4 ${memo.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onToggleArchive(memo.id)}
            title={memo.isArchived ? 'アーカイブ解除' : 'アーカイブ'}
            className={`p-1.5 rounded-xl transition-colors ${
              memo.isArchived 
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' 
                : 'text-neutral-400 hover:text-blue-500 hover:bg-rose-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Archive className="w-4 h-4" />
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              title="エクスポート / 保存"
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-rose-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {isExportMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-white dark:bg-neutral-800 border border-rose-100 dark:border-neutral-700 rounded-2xl shadow-xl z-30 text-xs"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    exportSingleMemo(memo, 'markdown');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-rose-50 dark:hover:bg-neutral-700/60 transition-colors flex items-center justify-between font-medium"
                >
                  <span>Markdown (.md) 保存 📄</span>
                </button>
                <button
                  onClick={() => {
                    exportSingleMemo(memo, 'text');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-rose-50 dark:hover:bg-neutral-700/60 transition-colors flex items-center justify-between font-medium"
                >
                  <span>テキスト (.txt) 保存 📝</span>
                </button>
                <button
                  onClick={() => {
                    handleCopyContent();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-rose-50 dark:hover:bg-neutral-700/60 transition-colors flex items-center justify-between border-t border-rose-100 dark:border-neutral-700 font-medium"
                >
                  <span>全文クリップボードコピー 📋</span>
                  {copiedRecently && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onDeleteMemo(memo.id)}
            title="ゴミ箱へ移動"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting Quick Ribbon */}
      {editorMode !== 'preview' && (
        <div className="flex items-center gap-1 px-4 py-1.5 border-b border-rose-100/70 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/40 overflow-x-auto text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => insertFormatting('**', '**', '太字テキスト')}
            title="太字 (Ctrl+B)"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors font-bold text-xs"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*', '斜体テキスト')}
            title="斜体 (Ctrl+I)"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('~~', '~~', '取消線テキスト')}
            title="取り消し線"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3.5 bg-rose-200 dark:bg-neutral-700 mx-1" />

          <button
            onClick={() => insertFormatting('\n# ', '\n', '大きな見出し')}
            title="大見出し"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n## ', '\n', '中くらいの見出し')}
            title="中見出し"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n### ', '\n', '小さな見出し')}
            title="小見出し"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3.5 bg-rose-200 dark:bg-neutral-700 mx-1" />

          <button
            onClick={() => insertFormatting('\n- ', '', 'リスト項目')}
            title="箇条書き"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n- [ ] ', '', 'ToDo項目')}
            title="チェックリスト (ToDo)"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs text-rose-500 font-bold"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n> ', '', '心に残った言葉')}
            title="引用"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n```\n', '\n```\n', '// コードやメモ')}
            title="コードブロック"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n---\n', '', '')}
            title="区切り線"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={insertTimestamp}
            title="現在の日時を挿入"
            className="p-1.5 hover:bg-rose-100/60 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs text-rose-500"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Title & Tags Header */}
      <div className="px-6 pt-5 pb-3 space-y-3">
        {/* Note Title Input */}
        <input
          type="text"
          value={memo.title}
          onChange={(e) => onUpdateMemo({ title: e.target.value })}
          placeholder="無題のメモ 🐾"
          className="w-full text-2xl font-bold bg-transparent text-neutral-900 dark:text-rose-50 placeholder-neutral-400 focus:outline-none tracking-tight"
        />

        {/* Tags Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="text-xs mr-0.5">🏷️</span>
          
          {memo.tags && memo.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/80 dark:bg-neutral-800 border border-rose-200/90 dark:border-neutral-700 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-medium shadow-2xs"
            >
              <span>#{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-rose-700 transition-colors p-0.5"
                aria-label={`${tag}を削除`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isTagInputOpen ? (
            <div className="inline-flex items-center gap-1">
              <input
                ref={tagInputRef}
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  } else if (e.key === 'Escape') {
                    setIsTagInputOpen(false);
                  }
                }}
                placeholder="タグ名..."
                className="px-2.5 py-0.5 text-xs bg-white dark:bg-neutral-800 border border-rose-400 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none w-28"
              />
              <button
                onClick={handleAddTag}
                className="p-1 text-rose-500 hover:text-rose-600"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsTagInputOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsTagInputOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-rose-500 dark:text-rose-400 hover:bg-white/80 dark:hover:bg-neutral-800 rounded-xl border border-dashed border-rose-300 transition-colors cursor-pointer text-xs font-medium"
            >
              <Plus className="w-3 h-3" />
              <span>タグを追加</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="flex-1 overflow-hidden px-6 pb-2">
        {editorMode === 'edit' && (
          <textarea
            ref={textareaRef}
            value={memo.content}
            onChange={(e) => onUpdateMemo({ content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="ここに思いついたことやToDoを書いてみてね... 🌸 (マークダウンが使えます)"
            className="w-full h-full bg-transparent resize-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none font-normal leading-relaxed text-[15px]"
          />
        )}

        {editorMode === 'preview' && (
          <div className="h-full overflow-y-auto pr-2 pb-6">
            <MarkdownRenderer
              content={memo.content}
              onToggleTodo={handleToggleTodo}
              className="text-neutral-800 dark:text-neutral-200"
            />
          </div>
        )}

        {editorMode === 'split' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="h-full border-r border-rose-100 dark:border-neutral-800 pr-4">
              <textarea
                ref={textareaRef}
                value={memo.content}
                onChange={(e) => onUpdateMemo({ content: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder="マークダウンを入力..."
                className="w-full h-full bg-transparent resize-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none font-normal leading-relaxed text-sm"
              />
            </div>
            <div className="h-full overflow-y-auto pr-2 pb-6">
              <MarkdownRenderer
                content={memo.content}
                onToggleTodo={handleToggleTodo}
                className="text-neutral-800 dark:text-neutral-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-6 py-2 border-t border-rose-100 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xs flex flex-wrap items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 gap-3">
        {/* Left: Saved indicator and Timestamp */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-bold">
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>保存済み ✨</span>
          </div>
          <span aria-hidden="true" className="text-rose-200 dark:text-neutral-700">·</span>
          <span className="font-mono tabular-nums text-neutral-500">
            {formatDateTime(memo.updatedAt)}
          </span>
        </div>

        {/* Right: Real-time Word/Char statistics */}
        <div className="flex items-center gap-3 font-mono tabular-nums font-medium">
          <span>文字数: <strong className="font-bold text-rose-600 dark:text-rose-300">{textStats.charsWithoutSpaces.toLocaleString()}</strong> (空白込: {textStats.charsWithSpaces.toLocaleString()})</span>
          <span aria-hidden="true" className="text-rose-200 dark:text-neutral-700">·</span>
          <span>単語数: {textStats.wordCount.toLocaleString()}</span>
          <span aria-hidden="true" className="text-rose-200 dark:text-neutral-700">·</span>
          <span>読了目安: 約{textStats.estimatedReadingMinutes}分 ☕</span>
        </div>
      </div>
    </div>
  );
};
