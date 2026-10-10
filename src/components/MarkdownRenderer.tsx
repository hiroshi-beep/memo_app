import React, { useMemo } from 'react';
import { marked } from 'marked';
import confetti from 'canvas-confetti';

interface MarkdownRendererProps {
  content: string;
  onToggleTodo?: (todoText: string, newCheckedState: boolean) => void;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onToggleTodo,
  className = '',
}) => {
  // Convert standard markdown with GFM support
  const htmlContent = useMemo(() => {
    try {
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      return marked.parse(content || '') as string;
    } catch (err) {
      console.error('Marked parsing error:', err);
      return `<p>${escapeHtml(content)}</p>`;
    }
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
      const checkbox = target as HTMLInputElement;
      const isChecked = checkbox.checked;
      
      // Look up parent li text
      const li = checkbox.closest('li');
      if (li && onToggleTodo) {
        // Extract plain text of this list item ignoring the checkbox
        const clone = li.cloneNode(true) as HTMLElement;
        const cb = clone.querySelector('input[type="checkbox"]');
        if (cb) cb.remove();
        const text = clone.textContent?.trim() || '';
        
        if (isChecked) {
          // Trigger delightful pastel confetti
          try {
            confetti({
              particleCount: 38,
              spread: 70,
              origin: { y: 0.7 },
              colors: ['#f472b6', '#fb7185', '#f43f5e', '#fbbf24', '#a78bfa', '#38bdf8'],
              disableForReducedMotion: true,
            });
          } catch {
            // ignore if confetti fails
          }
        }
        
        onToggleTodo(text, isChecked);
      }
    }
  };

  return (
    <div
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      onClick={handleClick}
    />
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
