# フィギュアエディタ 技術設計書 v1.0

## 1. 技術スタック選択

### 1.1 フロントエンド基盤

#### Next.js 14 (App Router)
- **選定理由**:
  - 100Appsプロジェクト標準技術スタック
  - App Routerによるモダンな開発体験
  - Server ComponentsとClient Componentsの適切な使い分け
  - API Routesによるバックエンド統合
  - PWA対応が容易
  - ビルド最適化・画像最適化が標準搭載
- **バージョン**: 14.x

#### React
- **選定理由**:
  - Next.js 14の基盤技術
  - 豊富なエコシステム
  - Hooks APIによる状態管理
- **バージョン**: 18.x

#### TypeScript
- **選定理由**:
  - 型安全性による開発効率向上
  - IDEサポートの充実
  - バグの早期発見
  - APIレスポンスの型定義による安全性向上
- **バージョン**: 5.x

#### Tailwind CSS
- **選定理由**:
  - 100Appsプロジェクト標準スタイリングツール
  - ユーティリティファーストによる高速開発
  - レスポンシブデザインの容易な実装
  - カスタマイズ性の高さ
- **バージョン**: v3

### 1.2 AI API連携

#### @google/generative-ai
- **選定理由**:
  - Gemini API公式SDK
  - CLAUDE.mdで推奨されている実装方法
  - 簡潔で保守性が高い
  - TypeScript型定義が充実
- **使用モデル**:
  - テキスト生成: `gemini-2.5-flash`
  - 画像生成: `gemini-2.5-flash-image` (Nano Banana)
  - 将来対応: `gemini-3-pro-image-preview` (Nano Banana Pro)

### 1.3 PWA対応

#### vite-plugin-pwa
- **選定理由**:
  - Next.jsとの統合が容易
  - Service Worker自動生成
  - Workboxベースの信頼性
  - CLAUDE.md記載のService Worker設定に対応
- **設定項目**:
  - `skipWaiting: true`
  - `clientsClaim: true`
  - `cleanupOutdatedCaches: true`
  - `runtimeCaching`設定

### 1.4 ユーティリティライブラリ

#### JSZip
- **選定理由**:
  - 複数画像のZIP化に必須
  - ブラウザ上で完結
  - Base64データの直接処理が可能
- **用途**: 生成画像の一括ダウンロード

#### react-colorful
- **選定理由**:
  - 軽量（2.5KB gzipped）
  - TypeScript完全対応
  - カスタマイズ性が高い
  - アクセシビリティ対応
- **用途**: 展示台カラーピッカー

#### clsx / tailwind-merge
- **選定理由**:
  - 条件付きクラス名の管理
  - Tailwind CSSクラスの競合解決
- **用途**: 動的スタイリング

---

## 2. アーキテクチャ設計

### 2.1 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 14 App Router              │
├─────────────────────────────────────────────────────┤
│  [Browser]                                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Page Component (app/page.tsx)               │  │
│  │  - Server Component (初期レンダリング)       │  │
│  └───────────────┬─────────────────────────────┘  │
│                  │                                 │
│  ┌───────────────▼─────────────────────────────┐  │
│  │ Client Components                           │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ TabManager                             │ │  │
│  │  │  - タブ状態管理                         │ │  │
│  │  │  - タブ追加・切り替え                    │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ ImageUploader                          │ │  │
│  │  │  - ドラッグ&ドロップ                    │ │  │
│  │  │  - 画像プレビュー                        │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ StyleSelector                          │ │  │
│  │  │  - 生成スタイル選択                      │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ OptionsPanel                           │ │  │
│  │  │  - AspectRatioSelector                 │ │  │
│  │  │  - PackageOptions                      │ │  │
│  │  │  - DisplayStandOptions                 │ │  │
│  │  │  - BackgroundOptions                   │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ GenerationControl                      │ │  │
│  │  │  - 生成枚数指定                          │ │  │
│  │  │  - 生成実行                              │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ ResultGallery                          │ │  │
│  │  │  - サムネイル表示                        │ │  │
│  │  │  - 拡大モーダル                          │ │  │
│  │  │  - 選択管理                              │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ DownloadManager                        │ │  │
│  │  │  - 個別ダウンロード                      │ │  │
│  │  │  - ZIP一括ダウンロード                   │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Context / State Management                  │  │
│  │  - AppContext (React Context API)           │  │
│  │  - タブごとの状態管理                         │  │
│  │  - グローバル状態（APIキー、設定）             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Hooks                                       │  │
│  │  - useTabManager                            │  │
│  │  - useImageGeneration                       │  │
│  │  - useDownload                              │  │
│  │  - useAPIKey                                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Storage                                     │  │
│  │  - LocalStorage (APIキー)                   │  │
│  │  - IndexedDB (ダウンロード済み管理)           │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          │ API Request
                          ▼
┌─────────────────────────────────────────────────────┐
│              API Routes (app/api)                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  /api/generate-image                                │
│   - Nano Banana画像生成                             │
│   - responseModalities: ['IMAGE']設定               │
│                                                     │
│  /api/generate-prompt                               │
│   - Gemini APIでプロンプト生成                       │
│   - 展示台・背景プロンプト                            │
│                                                     │
│  /api/translate                                     │
│   - Gemini APIで英訳                                │
│   - 自由生成モード用                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
                          │
                          │ Gemini API Request
                          ▼
┌─────────────────────────────────────────────────────┐
│              Gemini API                             │
├─────────────────────────────────────────────────────┤
│  - gemini-2.5-flash (テキスト生成)                  │
│  - gemini-2.5-flash-image (Nano Banana 画像生成)    │
└─────────────────────────────────────────────────────┘
```

### 2.2 データフロー

#### 画像生成フロー
```
1. ユーザー操作
   ↓
2. ImageUploader: 画像アップロード
   ↓
3. StyleSelector: スタイル選択
   ↓
4. OptionsPanel: オプション設定
   ↓
5. GenerationControl: 生成実行
   ↓
6. API Route (/api/generate-image)
   ↓
7. Gemini API (Nano Banana)
   ↓
8. Base64画像データ取得
   ↓
9. ResultGallery: 結果表示
   ↓
10. DownloadManager: ダウンロード
```

#### プロンプト生成フロー
```
1. ユーザー: 展示台/背景オプション選択
   ↓
2. 「プロンプトを生成」ボタンクリック
   ↓
3. API Route (/api/generate-prompt)
   ↓
4. Gemini API (gemini-2.5-flash)
   ↓
5. プロンプトテキスト取得
   ↓
6. PromptEditor: 編集可能な状態で表示
```

---

## 3. コンポーネント設計

### 3.1 コンポーネント構成図

```
app/
├── layout.tsx (Root Layout)
│   └── APIKeyModal
│
└── page.tsx (Main Page)
    ├── TabManager
    │   ├── TabButton[]
    │   └── AddTabButton
    │
    ├── TabContent (各タブごと)
    │   ├── ImageUploader
    │   │   ├── DropZone
    │   │   └── ImagePreview[]
    │   │
    │   ├── StyleSelector
    │   │   └── StyleButton[]
    │   │
    │   ├── OptionsPanel
    │   │   ├── AspectRatioSelector
    │   │   ├── PackageOptions (フィギュアのみ)
    │   │   │   ├── PackagePositionSelector
    │   │   │   ├── PackageTextInput
    │   │   │   ├── LogoInput
    │   │   │   └── TextureCheckbox
    │   │   │
    │   │   ├── DisplayStandOptions (フィギュアのみ)
    │   │   │   ├── DisplayStandToggle
    │   │   │   ├── ShapeSelector
    │   │   │   ├── MaterialSelector
    │   │   │   │   ├── ColorPicker (プラスチック/クリア)
    │   │   │   │   ├── GamingOptions
    │   │   │   │   ├── WoodSelector
    │   │   │   │   ├── MetalSelector
    │   │   │   │   ├── MineralSelector
    │   │   │   │   └── CustomInput
    │   │   │   └── PromptEditor
    │   │   │
    │   │   └── BackgroundOptions (フィギュア/アクスタ)
    │   │       ├── BackgroundToggle
    │   │       ├── BackgroundTypeSelector
    │   │       └── PromptEditor
    │   │
    │   ├── GenerationControl
    │   │   ├── CountSelector
    │   │   └── GenerateButton
    │   │
    │   ├── ResultGallery
    │   │   ├── Thumbnail[]
    │   │   │   ├── Image
    │   │   │   ├── Checkbox
    │   │   │   └── DownloadedLabel
    │   │   │
    │   │   └── ImageModal
    │   │       ├── FullSizeImage
    │   │       ├── NavigationButtons
    │   │       └── CheckButton
    │   │
    │   └── DownloadManager
    │       ├── SelectAllButton
    │       ├── IndividualDownloadButton
    │       └── ZipDownloadButton
    │
    └── LoadingSpinner
```

### 3.2 主要コンポーネント詳細

#### TabManager
- **責務**: タブの追加・切り替え・削除管理
- **状態**:
  - `tabs: Tab[]` - タブ一覧
  - `activeTabId: string` - アクティブタブID
- **機能**:
  - タブ追加
  - タブ切り替え
  - タブ削除（1つ以上必須）
- **Props**: なし（Context経由で状態管理）

#### ImageUploader
- **責務**: 画像アップロード・プレビュー
- **状態**:
  - `uploadedImages: File[]` - アップロード画像リスト
- **機能**:
  - ドラッグ&ドロップ
  - ファイル選択
  - プレビュー表示
  - 画像削除
  - 枚数制限チェック（4枚 or 3枚）
- **Props**:
  - `maxImages: number` - 最大枚数
  - `onImagesChange: (images: File[]) => void`

#### StyleSelector
- **責務**: 生成スタイル選択
- **状態**:
  - `selectedStyle: GenerationStyle`
- **機能**:
  - スタイル選択
  - スタイルごとのオプション表示/非表示制御
- **Props**:
  - `selectedStyle: GenerationStyle`
  - `onStyleChange: (style: GenerationStyle) => void`

#### OptionsPanel
- **責務**: 各種オプションの選択UI統合
- **サブコンポーネント**:
  - AspectRatioSelector
  - PackageOptions
  - DisplayStandOptions
  - BackgroundOptions
- **Props**:
  - `style: GenerationStyle` - 選択中のスタイル
  - `options: GenerationOptions`
  - `onOptionsChange: (options: Partial<GenerationOptions>) => void`

#### GenerationControl
- **責務**: 生成枚数指定・生成実行
- **状態**:
  - `count: number` - 生成枚数（1-8）
  - `isGenerating: boolean` - 生成中フラグ
- **機能**:
  - 生成枚数選択
  - 生成ボタンクリック
  - ローディング表示
- **Props**:
  - `onGenerate: (count: number) => Promise<void>`
  - `disabled: boolean` - 生成不可状態（三面図生成中など）

#### ResultGallery
- **責務**: 生成画像の表示・選択管理
- **状態**:
  - `generatedImages: GeneratedImage[]`
  - `selectedImageIds: Set<string>`
  - `modalImageIndex: number | null` - 拡大表示中の画像インデックス
- **機能**:
  - サムネイル一覧表示
  - 画像選択/解除
  - 拡大モーダル表示
  - 画像送り（前/次）
  - ダウンロード済みラベル表示
- **Props**:
  - `images: GeneratedImage[]`
  - `selectedIds: Set<string>`
  - `onSelectionChange: (ids: Set<string>) => void`

#### DownloadManager
- **責務**: 画像ダウンロード機能
- **機能**:
  - 全選択/全解除
  - 個別ダウンロード
  - ZIP一括ダウンロード
  - ダウンロード済み状態の更新（IndexedDB）
- **Props**:
  - `selectedImages: GeneratedImage[]`
  - `onDownloadComplete: (imageIds: string[]) => void`

---

## 4. データモデル設計

### 4.1 型定義

```typescript
// lib/types.ts

/**
 * 生成スタイル
 */
export type GenerationStyle =
  | 'figure'        // フィギュア
  | 'three-view'    // 三面図
  | 'acrylic-stand' // アクリルスタンド
  | 'line-art'      // 線画
  | 'free';         // 自由生成

/**
 * アスペクト比
 */
export type AspectRatio =
  | 'auto'   // 参照画像に合わせる
  | '1:1'    // 正方形
  | '3:4'    // 縦長
  | '4:3'    // 横長
  | '9:16'   // スマホ画面 縦
  | '16:9';  // ワイド画面 横

/**
 * パッケージ配置
 */
export type PackagePosition =
  | 'none'   // パッケージ無し
  | 'beside' // パッケージを置く
  | 'inside'; // パッケージに入れる

/**
 * 展示台形状
 */
export type DisplayStandShape =
  | 'circle'   // 円形
  | 'square'   // 四角形
  | 'hexagon'; // 六角形

/**
 * 展示台材質
 */
export type DisplayStandMaterial =
  | 'plastic' // プラスチック
  | 'clear'   // クリア
  | 'gaming'  // ゲーミング
  | 'wood'    // 木材
  | 'metal'   // 金属
  | 'mineral' // 鉱物
  | 'custom'; // その他

/**
 * 木材種類
 */
export type WoodType =
  | 'oak' | 'dark-oak' | 'walnut'
  | 'maple' | 'cherry' | 'mahogany';

/**
 * 金属種類
 */
export type MetalType =
  | 'gold' | 'silver' | 'copper'
  | 'chrome' | 'hairline' | 'rusty-iron';

/**
 * 鉱物種類
 */
export type MineralType =
  | 'marble' | 'granite' | 'obsidian'
  | 'crystal' | 'ruby' | 'emerald' | 'sapphire';

/**
 * 背景タイプ
 */
export type BackgroundType =
  | 'studio'   // スタジオ
  | 'shop'     // ショップ
  | 'desktop'  // 机の上
  | 'diorama'  // ジオラマ
  | 'custom';  // その他

/**
 * 展示台オプション
 */
export interface DisplayStandOptions {
  enabled: boolean;
  shape: DisplayStandShape;
  material: DisplayStandMaterial;

  // 材質別の詳細設定
  plasticColor?: string;      // プラスチック色
  clearColor?: string;        // クリア色
  gamingRainbow?: boolean;    // ゲーミングレインボー
  gamingColor?: string;       // ゲーミング単色
  woodType?: WoodType;        // 木材種類
  metalType?: MetalType;      // 金属種類
  mineralType?: MineralType;  // 鉱物種類
  customText?: string;        // その他（自由記述）

  generatedPrompt?: string;   // 生成されたプロンプト
}

/**
 * パッケージオプション
 */
export interface PackageOptions {
  position: PackagePosition;
  text?: string;              // パッケージに描画する文字
  logoText?: string;          // ロゴ用文字（Geminiがプロンプト生成）
  logoImage?: File;           // ロゴ画像
  useTexture: boolean;        // テクスチャ使用
}

/**
 * 背景オプション
 */
export interface BackgroundOptions {
  enabled: boolean;
  type: BackgroundType;
  customText?: string;        // その他（自由記述）
  generatedPrompt?: string;   // 生成されたプロンプト
}

/**
 * 生成オプション統合
 */
export interface GenerationOptions {
  style: GenerationStyle;
  aspectRatio: AspectRatio;

  // スタイル別オプション
  packageOptions?: PackageOptions;        // フィギュアのみ
  displayStandOptions?: DisplayStandOptions; // フィギュアのみ
  backgroundOptions?: BackgroundOptions;  // フィギュア・アクスタ

  // 三面図サブオプション
  threeViewAsFigure?: boolean;  // フィギュア化して生成

  // 自由生成オプション
  customPrompt?: string;        // 日本語プロンプト
  translatedPrompt?: string;    // 英訳プロンプト
  useEnglish?: boolean;         // 英語で生成
}

/**
 * タブ状態
 */
export interface Tab {
  id: string;
  name: string;
  uploadedImages: File[];
  options: GenerationOptions;
  generatedImages: GeneratedImage[];
}

/**
 * 生成画像
 */
export interface GeneratedImage {
  id: string;
  tabId: string;
  dataUrl: string;          // Base64データURL
  timestamp: number;        // 生成日時
  selected: boolean;        // 選択状態
  downloaded: boolean;      // ダウンロード済み
  prompt: string;           // 生成時のプロンプト（参考）
}

/**
 * APIキー設定
 */
export interface APIKeyConfig {
  geminiApiKey: string;
}

/**
 * アプリケーション状態
 */
export interface AppState {
  tabs: Tab[];
  activeTabId: string;
  apiKeyConfig: APIKeyConfig | null;
  isGenerating: boolean;
  generatingTabId: string | null; // 三面図生成中のタブID
}
```

### 4.2 初期状態

```typescript
// lib/constants.ts

export const DEFAULT_TAB: Omit<Tab, 'id'> = {
  name: 'Tab 1',
  uploadedImages: [],
  options: {
    style: 'figure',
    aspectRatio: 'auto',
    packageOptions: {
      position: 'none',
      useTexture: false,
    },
    displayStandOptions: {
      enabled: false,
      shape: 'circle',
      material: 'plastic',
      plasticColor: '#ffffff',
    },
    backgroundOptions: {
      enabled: false,
      type: 'studio',
    },
  },
  generatedImages: [],
};

export const INITIAL_APP_STATE: AppState = {
  tabs: [{ ...DEFAULT_TAB, id: crypto.randomUUID(), name: 'Tab 1' }],
  activeTabId: '',
  apiKeyConfig: null,
  isGenerating: false,
  generatingTabId: null,
};
```

---

## 5. ファイル構成設計

```
app046-figure-editor/
├── app/
│   ├── layout.tsx                    # Root Layout（PWA設定、APIKeyModal）
│   ├── page.tsx                      # Main Page（TabManager + TabContent）
│   ├── globals.css                   # グローバルスタイル
│   │
│   └── api/
│       ├── generate-image/
│       │   └── route.ts              # Nano Banana画像生成API
│       ├── generate-prompt/
│       │   └── route.ts              # Geminiプロンプト生成API
│       └── translate/
│           └── route.ts              # Gemini英訳API
│
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── APIKeyModal.tsx
│   │
│   ├── TabManager/
│   │   ├── TabManager.tsx
│   │   ├── TabButton.tsx
│   │   └── AddTabButton.tsx
│   │
│   ├── ImageUploader/
│   │   ├── ImageUploader.tsx
│   │   ├── DropZone.tsx
│   │   └── ImagePreview.tsx
│   │
│   ├── StyleSelector/
│   │   ├── StyleSelector.tsx
│   │   └── StyleButton.tsx
│   │
│   ├── OptionsPanel/
│   │   ├── OptionsPanel.tsx
│   │   ├── AspectRatioSelector.tsx
│   │   ├── PackageOptions/
│   │   │   ├── PackageOptions.tsx
│   │   │   ├── PackagePositionSelector.tsx
│   │   │   ├── PackageTextInput.tsx
│   │   │   ├── LogoInput.tsx
│   │   │   └── TextureCheckbox.tsx
│   │   │
│   │   ├── DisplayStandOptions/
│   │   │   ├── DisplayStandOptions.tsx
│   │   │   ├── DisplayStandToggle.tsx
│   │   │   ├── ShapeSelector.tsx
│   │   │   ├── MaterialSelector.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── GamingOptions.tsx
│   │   │   ├── WoodSelector.tsx
│   │   │   ├── MetalSelector.tsx
│   │   │   ├── MineralSelector.tsx
│   │   │   └── CustomInput.tsx
│   │   │
│   │   └── BackgroundOptions/
│   │       ├── BackgroundOptions.tsx
│   │       ├── BackgroundToggle.tsx
│   │       └── BackgroundTypeSelector.tsx
│   │
│   ├── PromptEditor/
│   │   └── PromptEditor.tsx          # プロンプト表示・編集
│   │
│   ├── GenerationControl/
│   │   ├── GenerationControl.tsx
│   │   ├── CountSelector.tsx
│   │   └── GenerateButton.tsx
│   │
│   ├── ResultGallery/
│   │   ├── ResultGallery.tsx
│   │   ├── Thumbnail.tsx
│   │   ├── ImageModal.tsx
│   │   └── NavigationButtons.tsx
│   │
│   ├── DownloadManager/
│   │   ├── DownloadManager.tsx
│   │   ├── SelectAllButton.tsx
│   │   ├── IndividualDownloadButton.tsx
│   │   └── ZipDownloadButton.tsx
│   │
│   └── UI/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       ├── Modal.tsx
│       ├── Spinner.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── gemini.ts                     # Gemini API連携
│   ├── storage.ts                    # LocalStorage/IndexedDB管理
│   ├── utils.ts                      # ユーティリティ関数
│   ├── types.ts                      # 型定義
│   ├── constants.ts                  # 定数
│   └── prompt-builder.ts             # プロンプト構築ロジック
│
├── hooks/
│   ├── useTabManager.ts              # タブ管理
│   ├── useImageGeneration.ts         # 画像生成
│   ├── useDownload.ts                # ダウンロード
│   ├── useAPIKey.ts                  # APIキー管理
│   └── useImageUpload.ts             # 画像アップロード
│
├── context/
│   └── AppContext.tsx                # グローバル状態管理
│
├── public/
│   ├── manifest.json                 # PWA Manifest
│   ├── sw.js                         # Service Worker (自動生成)
│   └── icons/
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       └── apple-touch-icon.png
│
├── doc/
│   ├── requirements_v1.0.md          # 要件定義書
│   └── technical_design_v1.0.md      # 技術設計書
│
├── .env.local                        # 環境変数（開発用）
├── .env.example                      # 環境変数サンプル
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
└── README.md
```

---

## 6. API設計

### 6.1 API Route: /api/generate-image

#### リクエスト
```typescript
POST /api/generate-image

{
  "images": string[],          // Base64エンコードされた画像データ配列
  "prompt": string,            // 生成プロンプト
  "count": number,             // 生成枚数（1-8）
  "aspectRatio"?: string,      // アスペクト比（オプション）
  "apiKey": string             // Gemini APIキー
}
```

#### レスポンス
```typescript
{
  "success": true,
  "images": [
    {
      "data": string,          // Base64エンコードされた画像データ
      "mimeType": string       // "image/png"
    }
  ]
}

// エラー時
{
  "success": false,
  "error": string,
  "code"?: string              // "RATE_LIMIT" | "INVALID_API_KEY" | "GENERATION_FAILED"
}
```

#### 実装要点
- Nano Banana使用（`gemini-2.5-flash-image`）
- `responseModalities: ['IMAGE']` のみ指定（重要）
- URLパラメータ認証（`?key=...`）
- レート制限（429）への対応（リトライロジック）

### 6.2 API Route: /api/generate-prompt

#### リクエスト
```typescript
POST /api/generate-prompt

{
  "type": "display-stand" | "background" | "logo",
  "options": object,           // 選択されたオプション
  "apiKey": string
}

// 展示台プロンプト生成例
{
  "type": "display-stand",
  "options": {
    "shape": "circle",
    "material": "wood",
    "woodType": "oak"
  },
  "apiKey": "..."
}

// 背景プロンプト生成例
{
  "type": "background",
  "options": {
    "backgroundType": "diorama",
    "characterInfo": "ファンタジー世界の魔法使い"
  },
  "apiKey": "..."
}
```

#### レスポンス
```typescript
{
  "success": true,
  "prompt": string
}

// エラー時
{
  "success": false,
  "error": string
}
```

#### 実装要点
- Gemini使用（`gemini-2.5-flash`）
- タイプごとに異なるシステムプロンプト
- 毎回異なるバリエーションを生成

### 6.3 API Route: /api/translate

#### リクエスト
```typescript
POST /api/translate

{
  "text": string,              // 日本語プロンプト
  "apiKey": string
}
```

#### レスポンス
```typescript
{
  "success": true,
  "translatedText": string     // 英訳プロンプト
}

// エラー時
{
  "success": false,
  "error": string
}
```

#### 実装要点
- Gemini使用（`gemini-2.5-flash`）
- プロンプト翻訳専用のシステムプロンプト

---

## 7. 状態管理設計

### 7.1 React Context API + useReducer

#### 設計方針
- グローバル状態はReact Context API + useReducer
- タブごとの状態はContext内で配列管理
- 重い処理はuseMemoでメモ化
- 副作用はuseEffectで管理

#### AppContext構造

```typescript
// context/AppContext.tsx

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Tab, GenerationOptions, GeneratedImage } from '@/lib/types';

type AppAction =
  | { type: 'ADD_TAB' }
  | { type: 'REMOVE_TAB'; tabId: string }
  | { type: 'SET_ACTIVE_TAB'; tabId: string }
  | { type: 'UPDATE_TAB_IMAGES'; tabId: string; images: File[] }
  | { type: 'UPDATE_TAB_OPTIONS'; tabId: string; options: Partial<GenerationOptions> }
  | { type: 'ADD_GENERATED_IMAGES'; tabId: string; images: GeneratedImage[] }
  | { type: 'UPDATE_IMAGE_SELECTION'; tabId: string; imageIds: Set<string> }
  | { type: 'MARK_IMAGES_DOWNLOADED'; imageIds: string[] }
  | { type: 'SET_API_KEY'; apiKey: string }
  | { type: 'START_GENERATION'; tabId: string }
  | { type: 'END_GENERATION' };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

### 7.2 カスタムフック

#### useTabManager
```typescript
// hooks/useTabManager.ts

export const useTabManager = () => {
  const { state, dispatch } = useAppContext();

  const addTab = useCallback(() => {
    dispatch({ type: 'ADD_TAB' });
  }, [dispatch]);

  const removeTab = useCallback((tabId: string) => {
    dispatch({ type: 'REMOVE_TAB', tabId });
  }, [dispatch]);

  const setActiveTab = useCallback((tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', tabId });
  }, [dispatch]);

  const activeTab = useMemo(
    () => state.tabs.find(tab => tab.id === state.activeTabId),
    [state.tabs, state.activeTabId]
  );

  return { tabs: state.tabs, activeTab, addTab, removeTab, setActiveTab };
};
```

#### useImageGeneration
```typescript
// hooks/useImageGeneration.ts

export const useImageGeneration = () => {
  const { state, dispatch } = useAppContext();
  const { apiKeyConfig } = state;

  const generateImages = useCallback(async (
    tabId: string,
    images: File[],
    options: GenerationOptions,
    count: number
  ) => {
    if (!apiKeyConfig?.geminiApiKey) {
      throw new Error('APIキーが設定されていません');
    }

    dispatch({ type: 'START_GENERATION', tabId });

    try {
      // プロンプト構築
      const prompt = buildPrompt(options);

      // 画像をBase64に変換
      const base64Images = await Promise.all(
        images.map(img => convertToBase64(img))
      );

      // API呼び出し
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: base64Images,
          prompt,
          count,
          aspectRatio: options.aspectRatio !== 'auto' ? options.aspectRatio : undefined,
          apiKey: apiKeyConfig.geminiApiKey,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // 生成画像を状態に追加
      const generatedImages: GeneratedImage[] = data.images.map((img: any) => ({
        id: crypto.randomUUID(),
        tabId,
        dataUrl: `data:${img.mimeType};base64,${img.data}`,
        timestamp: Date.now(),
        selected: false,
        downloaded: false,
        prompt,
      }));

      dispatch({ type: 'ADD_GENERATED_IMAGES', tabId, images: generatedImages });

      return generatedImages;
    } finally {
      dispatch({ type: 'END_GENERATION' });
    }
  }, [apiKeyConfig, dispatch]);

  return { generateImages, isGenerating: state.isGenerating };
};
```

#### useDownload
```typescript
// hooks/useDownload.ts

export const useDownload = () => {
  const { dispatch } = useAppContext();

  const downloadIndividual = useCallback(async (images: GeneratedImage[]) => {
    for (const image of images) {
      const link = document.createElement('a');
      link.href = image.dataUrl;
      link.download = `figure_${image.id}.png`;
      link.click();
    }

    // ダウンロード済みマーク
    const imageIds = images.map(img => img.id);
    dispatch({ type: 'MARK_IMAGES_DOWNLOADED', imageIds });

    // IndexedDBに記録
    await markAsDownloaded(imageIds);
  }, [dispatch]);

  const downloadAsZip = useCallback(async (
    images: GeneratedImage[],
    folderName: string = 'generated_images'
  ) => {
    const zip = new JSZip();

    for (const image of images) {
      const base64Data = image.dataUrl.split(',')[1];
      zip.file(`${image.id}.png`, base64Data, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${folderName}.zip`;
    link.click();

    // ダウンロード済みマーク
    const imageIds = images.map(img => img.id);
    dispatch({ type: 'MARK_IMAGES_DOWNLOADED', imageIds });

    // IndexedDBに記録
    await markAsDownloaded(imageIds);
  }, [dispatch]);

  return { downloadIndividual, downloadAsZip };
};
```

---

## 8. プロンプト構築ロジック

### 8.1 プロンプトビルダー

```typescript
// lib/prompt-builder.ts

/**
 * 生成オプションから最終プロンプトを構築
 */
export function buildPrompt(options: GenerationOptions): string {
  const parts: string[] = [];

  // 1. ベースプロンプト（スタイルごと）
  parts.push(getBasePrompt(options.style, options));

  // 2. パッケージプロンプト（フィギュアのみ）
  if (options.style === 'figure' && options.packageOptions) {
    const packagePrompt = buildPackagePrompt(options.packageOptions);
    if (packagePrompt) parts.push(packagePrompt);
  }

  // 3. 展示台プロンプト（フィギュアのみ、パッケージ内でない場合）
  if (
    options.style === 'figure' &&
    options.displayStandOptions?.enabled &&
    options.packageOptions?.position !== 'inside'
  ) {
    const standPrompt = options.displayStandOptions.generatedPrompt ||
                        buildDisplayStandPrompt(options.displayStandOptions);
    parts.push(standPrompt);
  }

  // 4. 背景プロンプト（フィギュア・アクスタ）
  if (
    (options.style === 'figure' || options.style === 'acrylic-stand') &&
    options.backgroundOptions?.enabled
  ) {
    const bgPrompt = options.backgroundOptions.generatedPrompt ||
                     buildBackgroundPrompt(options.backgroundOptions);
    parts.push(bgPrompt);
  }

  // 5. 自由生成プロンプト
  if (options.style === 'free') {
    const freePrompt = options.useEnglish
      ? options.translatedPrompt
      : options.customPrompt;
    if (freePrompt) parts.push(freePrompt);
  }

  return parts.join('\n\n');
}

/**
 * ベースプロンプト取得
 */
function getBasePrompt(style: GenerationStyle, options: GenerationOptions): string {
  switch (style) {
    case 'figure':
      return 'Create a highly detailed collectible figure based on the reference image. ' +
             'The figure should have realistic proportions, clean paint application, ' +
             'and professional sculpting quality. Include proper lighting and shadows.';

    case 'three-view':
      if (options.threeViewAsFigure) {
        return 'Create three views (front, side, back) of a collectible figure based on the reference image. ' +
               'Show the figure as a physical 3D object with realistic proportions.';
      } else {
        return 'Create three views (front, side, back) of the character from the reference image. ' +
               'Maintain the original art style and details.';
      }

    case 'acrylic-stand':
      return 'Create an acrylic stand design based on the reference image. ' +
             'The character should maintain the original illustration style, ' +
             'placed on a transparent acrylic base with a clean, professional look.';

    case 'line-art':
      return 'Extract clean line art from the reference image. ' +
             'Remove all colors and shading, keeping only the black outlines. ' +
             'The lines should be clean, consistent, and suitable for coloring.';

    case 'free':
      return ''; // 自由生成はカスタムプロンプトを使用

    default:
      return '';
  }
}

/**
 * パッケージプロンプト構築
 */
function buildPackagePrompt(packageOpts: PackageOptions): string {
  const parts: string[] = [];

  switch (packageOpts.position) {
    case 'beside':
      parts.push('Place a product package box beside the figure.');
      break;
    case 'inside':
      parts.push('Place the figure inside a product package box with a clear front window.');
      break;
    case 'none':
      return '';
  }

  if (packageOpts.text) {
    parts.push(`The package should display the text: "${packageOpts.text}"`);
  }

  if (packageOpts.logoText) {
    parts.push(`Include a logo with the theme: "${packageOpts.logoText}"`);
  }

  if (packageOpts.logoImage) {
    parts.push('Include the provided logo image on the package.');
  }

  if (packageOpts.useTexture) {
    parts.push('Use the reference image as package design texture.');
  }

  return parts.join(' ');
}

/**
 * 展示台プロンプト構築
 */
function buildDisplayStandPrompt(standOpts: DisplayStandOptions): string {
  const parts: string[] = [];

  // 形状
  const shapeMap: Record<DisplayStandShape, string> = {
    circle: 'circular',
    square: 'square',
    hexagon: 'hexagonal',
  };
  parts.push(`Place the figure on a ${shapeMap[standOpts.shape]} display stand.`);

  // 材質
  switch (standOpts.material) {
    case 'plastic':
      parts.push(`The stand should be made of plastic in ${standOpts.plasticColor} color.`);
      break;
    case 'clear':
      parts.push(`The stand should be made of transparent clear material tinted ${standOpts.clearColor}.`);
      break;
    case 'gaming':
      if (standOpts.gamingRainbow) {
        parts.push('The stand should have rainbow RGB LED lighting effect.');
      } else if (standOpts.gamingColor) {
        parts.push(`The stand should have ${standOpts.gamingColor} LED lighting effect.`);
      }
      parts.push('The stand base is white.');
      break;
    case 'wood':
      parts.push(`The stand should be made of ${standOpts.woodType} wood.`);
      break;
    case 'metal':
      const metalFinish = ['hairline', 'rusty-iron'].includes(standOpts.metalType!)
        ? ''
        : 'with mirror finish';
      parts.push(`The stand should be made of ${standOpts.metalType} metal ${metalFinish}.`);
      break;
    case 'mineral':
      parts.push(`The stand should be made of ${standOpts.mineralType} mineral.`);
      break;
    case 'custom':
      if (standOpts.customText) {
        parts.push(`The stand material: ${standOpts.customText}`);
      }
      break;
  }

  return parts.join(' ');
}

/**
 * 背景プロンプト構築
 */
function buildBackgroundPrompt(bgOpts: BackgroundOptions): string {
  const bgMap: Record<BackgroundType, string> = {
    studio: 'Set the scene in a professional photo studio with clean lighting and neutral background.',
    shop: 'Set the scene in a figure shop display with shelves and retail atmosphere.',
    desktop: 'Set the scene on a home desk with casual photography setup.',
    diorama: 'Create a diorama scene based on the character and reference image background.',
    custom: bgOpts.customText || '',
  };

  return bgMap[bgOpts.type];
}
```

---

## 9. Storage設計

### 9.1 LocalStorage

#### APIキー保存
```typescript
// lib/storage.ts

const API_KEY_STORAGE_KEY = 'figure-editor-api-key';

export function saveAPIKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function loadAPIKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function removeAPIKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
```

### 9.2 IndexedDB

#### ダウンロード済み画像管理
```typescript
// lib/storage.ts

const DB_NAME = 'figure-editor-db';
const STORE_NAME = 'downloaded-images';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

/**
 * IndexedDB初期化
 */
export async function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * ダウンロード済みマーク
 */
export async function markAsDownloaded(imageIds: string[]): Promise<void> {
  if (!db) await initDB();

  const transaction = db!.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  for (const id of imageIds) {
    store.put({ id, downloadedAt: Date.now() });
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * ダウンロード済みチェック
 */
export async function isDownloaded(imageId: string): Promise<boolean> {
  if (!db) await initDB();

  const transaction = db!.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(imageId);

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });
}
```

---

## 10. PWA設定

### 10.1 next.config.js

```javascript
// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'gemini-api',
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // その他の設定
};

module.exports = withPWA(nextConfig);
```

### 10.2 public/manifest.json

```json
{
  "name": "フィギュアエディタ",
  "short_name": "Figure Editor",
  "description": "イラストから簡単にフィギュア風画像を生成",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 11. エラーハンドリング設計

### 11.1 API呼び出しエラー

```typescript
// lib/api-error.ts

export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message, 'UNKNOWN_ERROR');
  }

  return new APIError('Unknown error occurred', 'UNKNOWN_ERROR');
}

/**
 * Gemini APIエラーハンドリング
 */
export async function handleGeminiResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const status = response.status;

    if (status === 429) {
      throw new APIError(
        'レート制限に達しました。しばらく待ってから再試行してください。',
        'RATE_LIMIT',
        429
      );
    }

    if (status === 401 || status === 403) {
      throw new APIError(
        'APIキーが無効です。設定を確認してください。',
        'INVALID_API_KEY',
        status
      );
    }

    throw new APIError(
      `API呼び出しに失敗しました (${status})`,
      'API_ERROR',
      status
    );
  }

  return response.json();
}
```

### 11.2 リトライロジック

```typescript
// lib/utils.ts

/**
 * 指数バックオフでリトライ
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof APIError && error.code === 'RATE_LIMIT') {
        if (i === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

## 12. パフォーマンス最適化

### 12.1 画像最適化

- Next.js Image Componentの活用（サムネイル表示）
- 遅延ロード（Lazy Loading）
- Base64データのメモ化

### 12.2 コンポーネント最適化

- React.memoでの再レンダリング防止
- useCallbackでの関数メモ化
- useMemoでの計算結果キャッシュ

### 12.3 バンドル最適化

- Dynamic Importでのコード分割
- Tree Shakingの活用
- 不要な依存関係の削除

---

## 13. セキュリティ考慮事項

### 13.1 APIキー管理

- LocalStorageに平文保存（ブラウザのセキュリティに依存）
- APIキー削除機能の提供
- 環境変数でのデフォルトキー設定禁止

### 13.2 XSS対策

- ユーザー入力のサニタイズ
- DOMPurifyの使用（必要に応じて）
- Reactのデフォルトエスケープを活用

### 13.3 CORS対策

- Next.js API Routesを経由したAPI呼び出し
- クライアントから直接Gemini APIを呼ばない設計

---

## 14. テスト戦略

### 14.1 単体テスト

- Jest + React Testing Library
- ユーティリティ関数のテスト
- プロンプトビルダーのテスト
- Storage関数のテスト

### 14.2 コンポーネントテスト

- 主要コンポーネントのテスト
- ユーザーインタラクションのテスト
- スナップショットテスト

### 14.3 E2Eテスト

- Playwright使用
- 画像アップロード→生成→ダウンロードフロー
- タブ管理機能
- APIキー設定機能

---

## 15. デプロイ戦略

### 15.1 Vercel（推奨）

- Next.js最適化済み
- 自動PWA設定
- 環境変数管理

### 15.2 環境変数

```bash
# .env.local (開発環境)
# APIキーは使用しない（ユーザーが設定）

# .env.example
# NEXT_PUBLIC_APP_NAME=フィギュアエディタ
# NEXT_PUBLIC_VERSION=1.0.0
```

---

## 16. 今後の拡張性

### 16.1 Nano Banana Pro対応

- モデル選択UI追加
- `gemini-3-pro-image-preview`への切り替え
- Allowlist制限の確認

### 16.2 バッチ処理

- 複数画像の一括処理
- プリセット保存機能

### 16.3 履歴管理

- 生成履歴の保存
- お気に入り機能
- 再生成機能

---

**文書履歴**
- v1.0 (2025-12-12): 初版作成
