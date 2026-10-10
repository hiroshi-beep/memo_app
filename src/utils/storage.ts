import { Memo } from '../types/memo';

const STORAGE_KEY = 'fuwamemo_notes_v2';
const DARK_MODE_KEY = 'fuwamemo_darkmode_v2';

export const INITIAL_MEMOS: Memo[] = [
  {
    id: 'memo-welcome-guide',
    title: 'ふわメモへようこそ🐾 ふんわり可愛いメモ帳ガイド',
    content: `# ふわメモ (Fuwa Memo) へようこそ 🌸

「ふわメモ」は、毎日のひらめきやタスクをやさしい気持ちで書き留められるノートアプリです🐾

## 🎀 お気に入りポイント
- **可愛いカラーパレット**: サクラ、ハチミツ、ミント、そら色など7色のパステルカラーを選べます
- **かんたんToDoリスト**: プレビュー画面のチェックボックスをポチッと押すと、小さな紙吹雪が舞います✨
- **マスキングテープ風のカード**: まるでノートに付箋を貼ったようなデザインです
- **リアルタイム文字数**: 空白を除いた文字数や読了目安時間をいつでも確認できます

---

## 🐾 かんたんショートカット
- **Ctrl / Cmd + N**: 新しいメモを作成
- **Ctrl / Cmd + F**: メモをすばやく検索
- **Ctrl / Cmd + B**: **太字**にする
- **Ctrl / Cmd + I**: *斜体*にする

> 「毎日をちょっとごきげんに。すてきな言葉やアイデアをここに集めよう🌷」

上の「＋ 新規メモ」ボタンを押して、今日のメモを書いてみてくださいね！`,
    category: 'daily',
    tags: ['ガイド', '使い方', 'ふわメモ'],
    isPinned: true,
    isFavorite: true,
    isArchived: false,
    isTrash: false,
    color: 'sakura',
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'memo-weekly-todo',
    title: '今週のワクワクToDoリスト 🍰',
    content: `# 今週のやることリスト 🎀

完了したらチェックボックスをポチッと押してね！

## 🌷 プライベート・お楽しみ
- [x] お気に入りのカフェで新作ラテをテイクアウト
- [x] お部屋に季節のお花（チューリップ）を飾る
- [ ] 週末においしい焼き菓子を焼く（スコーンかクッキー）
- [ ] 読みたい本を1冊選んでのんびり読書タイム

## 💼 おしごと・作業
- [x] 先週の振り返りメモをまとめる
- [ ] チームへの企画提案スライドの骨子作成
- [ ] 来週のミーティング日程の調整

## 🛍️ ほしいものリスト
- [x] かわいいパステルカラーのマスキングテープ
- [ ] お気に入りのアロマキャンドル`,
    category: 'tasks',
    tags: ['ToDo', '今週', 'お楽しみ'],
    isPinned: true,
    isFavorite: false,
    isArchived: false,
    isTrash: false,
    color: 'honey',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'memo-cafe-list',
    title: '行きたいカフェ＆お気に入りスイーツ巡り ☕🍰',
    content: `# カフェ＆スイーツ巡りメモ 🍮

いつか訪れたい、心ときめくカフェのリスト。

## 📍 行ってみたいお店
1. **喫茶 ぽぽら**
   - 名物：固めプリンと自家製ホイップクリーム
   - 雰囲気：木の温もりがあるレトロ空間
2. **Atelier Fleur (アトリエ・フルール)**
   - 名物：季節のフルーツタルトとハーブティー
   - 席数：テラス席あり（天気のいい日に！）
3. **Cafe Marshmallow**
   - 名物：ふわふわスフレパンケーキ

---

### メモ
- 来月のお給料日あとに友だちを誘ってみる！
- 写真もたくさん撮りたい📷`,
    category: 'sweets',
    tags: ['カフェ', 'プリン', 'スイーツ'],
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    isTrash: false,
    color: 'custard',
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'memo-creative-ideas',
    title: 'アイデアのタネ＆ひらめきノート 💡🌱',
    content: `# ふとしたひらめきノート 🌱

日常生活のなかで見つけた「いいな」と思う瞬間やアイデア。

## 💡 最近の気づき
- 朝起きてすぐコップ1杯の白湯を飲むと、すごく気持ちがスッキリする
- 手帳に小さなシールを貼るだけで、達成感がぐっと増す
- 机の上にお気に入りの小さなマスコットを置くと癒やされる🐾

## 🎨 やってみたいこと
- 週末の水彩イラスト練習（お花とねこちゃん）
- 季節のフルーツで手作りジャムづくり
- 1日1行の感謝日記を続けてみる`,
    category: 'ideas',
    tags: ['ひらめき', '習慣', 'イラスト'],
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    isTrash: false,
    color: 'mint',
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 10,
  },
  {
    id: 'memo-favorite-quotes',
    title: '心あたたまる言葉＆読書ノート 📖✨',
    content: `# 読書ノート＆心に留めたい言葉 🌸

日々の中で出逢った、やさしい言葉たちのコレクション。

> 「焦らなくていい。花が咲くタイミングは、みんなそれぞれ違うのだから。」

> 「今日できた小さなことひとつひとつに、拍手を送ろう。」

### 🔖 次に読みたい本
- 『心をととのえる朝の習慣』
- 『小さなしあわせを見つける絵本』`,
    category: 'study',
    tags: ['言葉', '読書', '癒やし'],
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    isTrash: false,
    color: 'lavender',
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 30,
  }
];

export function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMOS));
      return INITIAL_MEMOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MEMOS;
  } catch (err) {
    console.error('Failed to load memos from localStorage:', err);
    return INITIAL_MEMOS;
  }
}

export function saveMemos(memos: Memo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  } catch (err) {
    console.error('Failed to save memos to localStorage:', err);
  }
}

export function loadDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return false; // Default to gentle light mode for cute pastel aesthetic
  } catch {
    return false;
  }
}

export function saveDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  } catch (err) {
    console.error('Failed to save dark mode setting:', err);
  }
}

export function exportSingleMemo(memo: Memo, format: 'markdown' | 'text' = 'markdown'): void {
  const extension = format === 'markdown' ? 'md' : 'txt';
  const filename = `${memo.title.trim().replace(/[\\/:*?"<>|]/g, '_') || 'memo'}.${extension}`;
  
  let content = memo.content;
  if (format === 'markdown' && !memo.content.startsWith('# ')) {
    content = `# ${memo.title}\n\n${memo.content}`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllMemosAsJSON(memos: Memo[]): void {
  const data = JSON.stringify(memos, null, 2);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `fuwamemo-backup-${dateStr}.json`;
  const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
