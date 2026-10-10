/**
 * Text analysis utilities specifically optimized for Japanese & Latin text
 */

export interface TextStats {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  wordCount: number;
  lineCount: number;
  estimatedReadingMinutes: number;
}

export function calculateTextStats(text: string): TextStats {
  if (!text) {
    return {
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      wordCount: 0,
      lineCount: 0,
      estimatedReadingMinutes: 0,
    };
  }

  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  
  // Word count (English words + Japanese segmented units approx)
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const lines = text.split('\n');
  const lineCount = lines.length;

  // Japanese average reading speed: ~400-600 characters per minute
  // English average: ~200-250 words per minute
  const readingSpeedCharsPerMin = 450;
  const estimatedReadingMinutes = Math.max(1, Math.ceil(charsWithoutSpaces / readingSpeedCharsPerMin));

  return {
    charsWithSpaces,
    charsWithoutSpaces,
    wordCount,
    lineCount,
    estimatedReadingMinutes,
  };
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 10) return 'たった今';
  if (diffSec < 60) return `${diffSec}秒前`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}時間前`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;

  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  const currentYear = new Date().getFullYear();
  if (year === currentYear) {
    return `${month}/${day} ${hours}:${mins}`;
  }
  return `${year}/${month}/${day}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${mins}`;
}
