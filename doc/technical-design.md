# 技術設計書：3Dリアルフィギュア化アプリ

## 1. 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|----------|
| フレームワーク | React | 18.x |
| 言語 | TypeScript | 5.x |
| ビルドツール | Vite | 5.x |
| スタイリング | Tailwind CSS | 3.x |
| PWA | vite-plugin-pwa | 0.x |
| AI API | Gemini API | gemini-2.5-flash-image |
| リンター | ESLint | 8.x |

## 2. アーキテクチャ

### 2.1 ディレクトリ構造

```
app046-figure-editor/
├── doc/
│   ├── requirements.md
│   ├── technical-design.md
│   └── implementation-plan.md
├── src/
│   ├── components/
│   │   ├── ImageUploader.tsx      # 画像アップロードコンポーネント
│   │   ├── FigureResult.tsx       # 変換結果表示コンポーネント
│   │   ├── ApiKeyModal.tsx        # APIキー設定モーダル
│   │   └── Header.tsx             # ヘッダーコンポーネント
│   ├── hooks/
│   │   └── useGeminiApi.ts        # Gemini API呼び出しフック
│   ├── utils/
│   │   ├── imageUtils.ts          # 画像処理ユーティリティ
│   │   └── storage.ts             # ローカルストレージ操作
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── icons/                     # PWAアイコン
│   └── manifest.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2.2 コンポーネント構成

```
App
├── Header
│   └── Settings Button → ApiKeyModal
├── ImageUploader
│   ├── DropZone
│   └── Preview
└── FigureResult
    ├── ResultImage
    └── DownloadButton
```

## 3. データフロー

### 3.1 画像変換フロー

```
1. ユーザーが画像をアップロード
   ↓
2. ImageUploaderが画像をBase64に変換
   ↓
3. useGeminiApiフックでAPI呼び出し
   ↓
4. Gemini APIがフィギュア風画像を生成
   ↓
5. FigureResultに結果を表示
   ↓
6. ユーザーがダウンロード
```

### 3.2 状態管理

```typescript
interface AppState {
  uploadedImage: string | null;      // アップロード画像（Base64）
  generatedImage: string | null;     // 生成画像（Base64）
  isLoading: boolean;                // 変換中フラグ
  error: string | null;              // エラーメッセージ
  apiKey: string | null;             // Gemini APIキー
}
```

## 4. API設計

### 4.1 Gemini API呼び出し

**エンドポイント**:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={API_KEY}
```

**リクエスト形式**:
```typescript
{
  contents: [{
    parts: [
      {
        text: "この画像をリアルなフィギュア風に変換してください。..."
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: "{base64_image}"
        }
      }
    ]
  }]
}
```

**プロンプト設計**:
```
この画像をリアルなフィギュア・スタチュー風に変換してください。
以下の特徴を持つように生成してください：
- 実際のフィギュア製品のような質感
- PVCやレジン素材のような光沢感
- 立体的な造形を感じさせる陰影
- フィギュアの台座（ベース）を追加
- スタジオ撮影のような背景
```

### 4.2 レスポンス処理

```typescript
interface GeminiResponse {
  candidates: [{
    content: {
      parts: [{
        inlineData: {
          mimeType: string;
          data: string;  // Base64
        }
      }]
    }
  }]
}
```

## 5. ストレージ設計

### 5.1 ローカルストレージ

| キー | 用途 | 型 |
|-----|------|-----|
| `figure_api_key` | Gemini APIキー | string |

## 6. PWA設定

### 6.1 vite.config.ts

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/generativelanguage\.googleapis\.com/,
        handler: 'NetworkOnly'
      }
    ]
  },
  manifest: {
    name: '3Dリアルフィギュア化',
    short_name: 'フィギュア化',
    theme_color: '#6366f1',
    background_color: '#0f172a',
    display: 'standalone',
    icons: [...]
  }
})
```

## 7. エラーハンドリング

| エラー | 対応 |
|--------|------|
| APIキー未設定 | 設定モーダルを表示 |
| 429 Too Many Requests | リトライ案内を表示 |
| 画像サイズ超過 | 自動リサイズまたはエラー表示 |
| ネットワークエラー | 再試行ボタンを表示 |

## 8. セキュリティ考慮

- APIキーはローカルストレージに保存（クライアントサイドのみ）
- APIキー入力はパスワードフィールドで隠蔽
- HTTPS通信必須（PWA要件）
