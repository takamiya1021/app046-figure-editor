# フィギュアエディタ 実装計画書 v1.0（TDD準拠版）

## 📋 実装方針

### TDD（Test-Driven Development）原則
- **Red**: 失敗するテストを先に書く
- **Green**: テストを通す最小限の実装
- **Refactor**: テストが通った状態でリファクタリング

### 完了条件
- ✅ 全テストがパス
- ✅ コードカバレッジ80%以上
- ✅ ESLint警告ゼロ
- ✅ TypeScript型エラーゼロ

### 工数見積もり
- 各タスクにはTDD対応分を含む
- 1ポイント = 約1時間
- バッファ20%を考慮

---

## Phase 0: テスト環境構築

**目的**: TDD開発の基盤整備
**予定工数**: 3時間
**完了条件**: サンプルテストが動作すること

### タスクリスト

#### 0.1 Next.js プロジェクトセットアップ（1h）
- [x] Next.js 14プロジェクト作成
  ```bash
  npx create-next-app@latest app046-figure-editor --typescript --tailwind --app
  ```
- [x] 不要ファイル削除
- [x] ディレクトリ構造作成（components/, lib/, hooks/, context/）
- [x] Git初期化・初回コミット

#### 0.2 Jest + React Testing Library セットアップ（1.5h）
- [x] 依存関係インストール
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
  ```
- [x] Jest設定ファイル作成（`jest.config.js`）
- [x] テストセットアップファイル作成（`jest.setup.js`）
- [x] package.jsonにテストスクリプト追加
  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
  ```

#### 0.3 サンプルテスト作成（0.5h）
- [x] サンプルコンポーネント作成（`components/UI/Button.tsx`）
- [x] サンプルテスト作成（`components/UI/Button.test.tsx`）
- [x] テスト実行確認（`npm test`）
- [x] カバレッジレポート確認（`npm run test:coverage`）

---

## Phase 1: 基本機能実装（必須）

**目的**: 画像アップロード→生成→ダウンロードの基本フローを実現
**予定工数**: 40時間
**完了条件**: フィギュア生成の基本機能が動作すること

### 1.1 プロジェクト基盤（4h）

#### 1.1.1 型定義作成（Red → Green → Refactor）（1h）
- [x] **Red**: 型定義のテスト作成（`lib/types.test.ts`）
- [x] **Green**: 基本型定義実装（`lib/types.ts`）
  - GenerationStyle, AspectRatio, Tab, GeneratedImage等
- [x] **Refactor**: 型の整理・ドキュメント追加

#### 1.1.2 定数定義（Red → Green → Refactor）（0.5h）
- [x] **Red**: 定数テスト作成（`lib/constants.test.ts`）
- [x] **Green**: 定数実装（`lib/constants.ts`）
  - DEFAULT_TAB, INITIAL_APP_STATE等
- [x] **Refactor**: 定数のグルーピング

#### 1.1.3 ユーティリティ関数（Red → Green → Refactor）（1h）
- [x] **Red**: ユーティリティテスト作成（`lib/utils.test.ts`）
- [x] **Green**: 基本ユーティリティ実装（`lib/utils.ts`）
  - clsx/tailwind-merge統合
  - Base64変換関数
- [x] **Refactor**: 関数の最適化

#### 1.1.4 グローバルスタイル設定（0.5h）
- [x] Tailwind設定（`tailwind.config.ts`）
  - カラーパレット定義
  - カスタムスペーシング
- [x] グローバルCSS（`app/globals.css`）
  - リセットCSS
  - カスタムスタイル

#### 1.1.5 Layout設定（Red → Green → Refactor）（1h）
- [ ] **Red**: Layoutテスト作成（`app/layout.test.tsx`）
- [ ] **Green**: Root Layout実装（`app/layout.tsx`）
  - メタデータ設定
  - フォント読み込み
- [ ] **Refactor**: SEO最適化

---

### 1.2 状態管理基盤（5h）

#### 1.2.1 AppContext作成（Red → Green → Refactor）（2h）
- [ ] **Red**: AppContextテスト作成（`context/AppContext.test.tsx`）
- [ ] **Green**: Context実装（`context/AppContext.tsx`）
  - createContext, Provider
  - useReducer統合
  - AppAction型定義
- [ ] **Refactor**: Context分割（必要に応じて）

#### 1.2.2 Reducer実装（Red → Green → Refactor）（2h）
- [ ] **Red**: Reducerテスト作成（各アクションごと）
- [ ] **Green**: Reducer実装
  - ADD_TAB, REMOVE_TAB
  - SET_ACTIVE_TAB
  - UPDATE_TAB_IMAGES
  - UPDATE_TAB_OPTIONS
  - ADD_GENERATED_IMAGES
  - START_GENERATION, END_GENERATION
- [ ] **Refactor**: Reducer関数の分割

#### 1.2.3 カスタムフック - useTabManager（Red → Green → Refactor）（1h）
- [ ] **Red**: useTabManagerテスト作成（`hooks/useTabManager.test.ts`）
- [ ] **Green**: useTabManager実装（`hooks/useTabManager.ts`）
  - addTab, removeTab, setActiveTab
- [ ] **Refactor**: メモ化最適化

---

### 1.3 UIコンポーネント基盤（3h）

#### 1.3.1 基本UIコンポーネント（Red → Green → Refactor）（3h）
- [ ] **Red**: Buttonテスト作成（`components/UI/Button.test.tsx`）
- [ ] **Green**: Button実装（`components/UI/Button.tsx`）
- [ ] **Refactor**: バリアント追加（primary, secondary, danger）

- [ ] **Red**: Inputテスト作成（`components/UI/Input.test.tsx`）
- [ ] **Green**: Input実装（`components/UI/Input.tsx`）
- [ ] **Refactor**: エラー状態対応

- [ ] **Red**: Modalテスト作成（`components/UI/Modal.test.tsx`）
- [ ] **Green**: Modal実装（`components/UI/Modal.tsx`）
- [ ] **Refactor**: アニメーション追加

- [ ] **Red**: Spinnerテスト作成（`components/UI/Spinner.test.tsx`）
- [ ] **Green**: Spinner実装（`components/UI/Spinner.tsx`）
- [ ] **Refactor**: サイズバリアント追加

---

### 1.4 APIキー管理（3h）

#### 1.4.1 Storage実装（Red → Green → Refactor）（1.5h）
- [ ] **Red**: Storageテスト作成（`lib/storage.test.ts`）
- [ ] **Green**: LocalStorage実装（`lib/storage.ts`）
  - saveAPIKey, loadAPIKey, removeAPIKey
- [ ] **Refactor**: エラーハンドリング追加

#### 1.4.2 useAPIKeyフック（Red → Green → Refactor）（0.5h）
- [ ] **Red**: useAPIKeyテスト作成（`hooks/useAPIKey.test.ts`）
- [ ] **Green**: useAPIKey実装（`hooks/useAPIKey.ts`）
- [ ] **Refactor**: 自動読み込み対応

#### 1.4.3 APIKeyModalコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: APIKeyModalテスト作成（`components/Layout/APIKeyModal.test.tsx`）
- [ ] **Green**: APIKeyModal実装（`components/Layout/APIKeyModal.tsx`）
  - 入力フォーム
  - 保存・削除機能
- [ ] **Refactor**: バリデーション追加

---

### 1.5 タブ管理機能（4h）

#### 1.5.1 TabManagerコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: TabManagerテスト作成（`components/TabManager/TabManager.test.tsx`）
- [ ] **Green**: TabManager実装（`components/TabManager/TabManager.tsx`）
  - タブ一覧表示
  - アクティブタブ表示
- [ ] **Refactor**: スタイル最適化

#### 1.5.2 TabButtonコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: TabButtonテスト作成（`components/TabManager/TabButton.test.tsx`）
- [ ] **Green**: TabButton実装（`components/TabManager/TabButton.tsx`）
  - タブ切り替え
  - タブ削除
- [ ] **Refactor**: アクティブ状態のスタイル

#### 1.5.3 AddTabButtonコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: AddTabButtonテスト作成（`components/TabManager/AddTabButton.test.tsx`）
- [ ] **Green**: AddTabButton実装（`components/TabManager/AddTabButton.tsx`）
- [ ] **Refactor**: アニメーション追加

---

### 1.6 画像アップロード機能（5h）

#### 1.6.1 useImageUploadフック（Red → Green → Refactor）（1h）
- [ ] **Red**: useImageUploadテスト作成（`hooks/useImageUpload.test.ts`）
- [ ] **Green**: useImageUpload実装（`hooks/useImageUpload.ts`）
  - 画像選択処理
  - 枚数制限チェック
- [ ] **Refactor**: エラーハンドリング

#### 1.6.2 DropZoneコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: DropZoneテスト作成（`components/ImageUploader/DropZone.test.tsx`）
- [ ] **Green**: DropZone実装（`components/ImageUploader/DropZone.tsx`）
  - ドラッグ&ドロップ
  - ファイル選択
  - ビジュアルフィードバック
- [ ] **Refactor**: アクセシビリティ対応

#### 1.6.3 ImagePreviewコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: ImagePreviewテスト作成（`components/ImageUploader/ImagePreview.test.tsx`）
- [ ] **Green**: ImagePreview実装（`components/ImageUploader/ImagePreview.tsx`）
  - サムネイル表示
  - 削除ボタン
- [ ] **Refactor**: レイアウト最適化

#### 1.6.4 ImageUploaderコンポーネント統合（Red → Green → Refactor）（1h）
- [ ] **Red**: ImageUploaderテスト作成（`components/ImageUploader/ImageUploader.test.tsx`）
- [ ] **Green**: ImageUploader実装（`components/ImageUploader/ImageUploader.tsx`）
  - DropZone + ImagePreview統合
- [ ] **Refactor**: 状態管理最適化

---

### 1.7 生成スタイル選択（2h）

#### 1.7.1 StyleButtonコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: StyleButtonテスト作成（`components/StyleSelector/StyleButton.test.tsx`）
- [ ] **Green**: StyleButton実装（`components/StyleSelector/StyleButton.tsx`）
- [ ] **Refactor**: 選択状態のスタイル

#### 1.7.2 StyleSelectorコンポーネント（Red → Green → Refactor）（1.5h）
- [ ] **Red**: StyleSelectorテスト作成（`components/StyleSelector/StyleSelector.test.tsx`）
- [ ] **Green**: StyleSelector実装（`components/StyleSelector/StyleSelector.tsx`）
  - フィギュアスタイル選択（Phase 1は基本のみ）
- [ ] **Refactor**: アイコン・説明追加

---

### 1.8 Gemini API連携基盤（6h）

#### 1.8.1 Gemini クライアント実装（Red → Green → Refactor）（2h）
- [ ] **Red**: Gemini APIテスト作成（`lib/gemini.test.ts`）
- [ ] **Green**: Gemini API実装（`lib/gemini.ts`）
  - GoogleGenerativeAI初期化
  - モデル取得関数
- [ ] **Refactor**: エラーハンドリング強化

#### 1.8.2 API Route - 画像生成（Red → Green → Refactor）（2h）
- [ ] **Red**: API Routeテスト作成（`app/api/generate-image/route.test.ts`）
- [ ] **Green**: API Route実装（`app/api/generate-image/route.ts`）
  - Nano Banana呼び出し
  - responseModalities: ['IMAGE']設定
  - Base64データ取得
- [ ] **Refactor**: レート制限対応（リトライロジック）

#### 1.8.3 プロンプトビルダー（Red → Green → Refactor）（1h）
- [ ] **Red**: プロンプトビルダーテスト作成（`lib/prompt-builder.test.ts`）
- [ ] **Green**: プロンプトビルダー実装（`lib/prompt-builder.ts`）
  - buildPrompt関数
  - getBasePrompt関数（フィギュア基本プロンプト）
- [ ] **Refactor**: プロンプト最適化

#### 1.8.4 useImageGenerationフック（Red → Green → Refactor）（1h）
- [ ] **Red**: useImageGenerationテスト作成（`hooks/useImageGeneration.test.ts`）
- [ ] **Green**: useImageGeneration実装（`hooks/useImageGeneration.ts`）
  - generateImages関数
  - API呼び出し
  - 状態更新
- [ ] **Refactor**: エラーハンドリング

---

### 1.9 生成コントロール（3h）

#### 1.9.1 CountSelectorコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: CountSelectorテスト作成（`components/GenerationControl/CountSelector.test.tsx`）
- [ ] **Green**: CountSelector実装（`components/GenerationControl/CountSelector.tsx`）
  - 1-8枚選択
- [ ] **Refactor**: UI改善

#### 1.9.2 GenerateButtonコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: GenerateButtonテスト作成（`components/GenerationControl/GenerateButton.test.tsx`）
- [ ] **Green**: GenerateButton実装（`components/GenerationControl/GenerateButton.tsx`）
  - 生成実行
  - ローディング状態
- [ ] **Refactor**: アニメーション追加

#### 1.9.3 GenerationControlコンポーネント統合（Red → Green → Refactor）（1.5h）
- [ ] **Red**: GenerationControlテスト作成（`components/GenerationControl/GenerationControl.test.tsx`）
- [ ] **Green**: GenerationControl実装（`components/GenerationControl/GenerationControl.tsx`）
  - CountSelector + GenerateButton統合
  - useImageGeneration連携
- [ ] **Refactor**: UX最適化

---

### 1.10 生成結果表示（4h）

#### 1.10.1 Thumbnailコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: Thumbnailテスト作成（`components/ResultGallery/Thumbnail.test.tsx`）
- [ ] **Green**: Thumbnail実装（`components/ResultGallery/Thumbnail.tsx`）
  - サムネイル表示
  - 選択チェックボックス
- [ ] **Refactor**: レイアウト最適化

#### 1.10.2 ImageModalコンポーネント（Red → Green → Refactor）（1.5h）
- [ ] **Red**: ImageModalテスト作成（`components/ResultGallery/ImageModal.test.tsx`）
- [ ] **Green**: ImageModal実装（`components/ResultGallery/ImageModal.tsx`）
  - 拡大表示
  - 画像送り（前/次）
- [ ] **Refactor**: キーボード操作対応

#### 1.10.3 ResultGalleryコンポーネント統合（Red → Green → Refactor）（1.5h）
- [ ] **Red**: ResultGalleryテスト作成（`components/ResultGallery/ResultGallery.test.tsx`）
- [ ] **Green**: ResultGallery実装（`components/ResultGallery/ResultGallery.tsx`）
  - Thumbnail一覧
  - ImageModal統合
  - 選択状態管理
- [ ] **Refactor**: パフォーマンス最適化

---

### 1.11 ダウンロード機能（3h）

#### 1.11.1 useDownloadフック（Red → Green → Refactor）（1h）
- [ ] **Red**: useDownloadテスト作成（`hooks/useDownload.test.ts`）
- [ ] **Green**: useDownload実装（`hooks/useDownload.ts`）
  - downloadIndividual関数
  - downloadAsZip関数（JSZip使用）
- [ ] **Refactor**: エラーハンドリング

#### 1.11.2 DownloadManagerコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: DownloadManagerテスト作成（`components/DownloadManager/DownloadManager.test.tsx`）
- [ ] **Green**: DownloadManager実装（`components/DownloadManager/DownloadManager.tsx`）
  - 個別ダウンロードボタン
  - ZIPダウンロードボタン
  - 全選択/解除ボタン
- [ ] **Refactor**: UI最適化

---

### 1.12 PWA設定（2h）

#### 1.12.1 PWA設定ファイル（1h）
- [ ] next-pwaインストール
  ```bash
  npm install next-pwa
  ```
- [ ] next.config.js設定
  - Service Worker設定
  - skipWaiting: true
  - clientsClaim: true
- [ ] manifest.json作成（`public/manifest.json`）
  - アプリ名・説明
  - アイコン設定

#### 1.12.2 アイコン作成（1h）
- [ ] アイコン画像作成（192x192, 512x512）
- [ ] apple-touch-icon作成
- [ ] favicon設定

---

### 1.13 メインページ統合（2h）

#### 1.13.1 メインページ実装（Red → Green → Refactor）（2h）
- [ ] **Red**: メインページテスト作成（`app/page.test.tsx`）
- [ ] **Green**: メインページ実装（`app/page.tsx`）
  - AppProvider統合
  - TabManager配置
  - ImageUploader配置
  - StyleSelector配置
  - GenerationControl配置
  - ResultGallery配置
  - DownloadManager配置
- [ ] **Refactor**: レイアウト最適化

---

### Phase 1 完了チェック
- [ ] 全テストがパス（`npm test`）
- [ ] コードカバレッジ80%以上（`npm run test:coverage`）
- [ ] ESLint警告ゼロ（`npm run lint`）
- [ ] TypeScript型エラーゼロ（`npm run build`）
- [ ] 基本フロー動作確認（画像アップロード→生成→ダウンロード）

---

## Phase 2: オプション機能実装（重要）

**目的**: アスペクト比・パッケージ・展示台・背景オプションの実装
**予定工数**: 25時間
**完了条件**: 全オプションが動作すること

### 2.1 アスペクト比指定（2h）

#### 2.1.1 AspectRatioSelectorコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: AspectRatioSelectorテスト作成
- [ ] **Green**: AspectRatioSelector実装
  - ラジオボタン選択（auto, 1:1, 3:4, 4:3, 9:16, 16:9）
  - API連携（アスペクト比パラメータ送信）
- [ ] **Refactor**: UI最適化

---

### 2.2 パッケージオプション（5h）

#### 2.2.1 PackagePositionSelectorコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: PackagePositionSelectorテスト作成
- [ ] **Green**: PackagePositionSelector実装
  - none, beside, inside選択
- [ ] **Refactor**: アイコン追加

#### 2.2.2 PackageTextInputコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: PackageTextInputテスト作成
- [ ] **Green**: PackageTextInput実装
  - テキスト入力
- [ ] **Refactor**: バリデーション

#### 2.2.3 LogoInputコンポーネント（Red → Green → Refactor）（1.5h）
- [ ] **Red**: LogoInputテスト作成
- [ ] **Green**: LogoInput実装
  - ロゴテキスト入力
  - ロゴ画像アップロード
- [ ] **Refactor**: プレビュー機能

#### 2.2.4 TextureCheckboxコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: TextureCheckboxテスト作成
- [ ] **Green**: TextureCheckbox実装
- [ ] **Refactor**: ラベル改善

#### 2.2.5 PackageOptionsコンポーネント統合（Red → Green → Refactor）（1h）
- [ ] **Red**: PackageOptionsテスト作成
- [ ] **Green**: PackageOptions実装
  - サブコンポーネント統合
- [ ] **Refactor**: レイアウト最適化

---

### 2.3 展示台オプション（10h）

#### 2.3.1 DisplayStandToggleコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: DisplayStandToggleテスト作成
- [ ] **Green**: DisplayStandToggle実装
- [ ] **Refactor**: トグルアニメーション

#### 2.3.2 ShapeSelectorコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: ShapeSelectorテスト作成
- [ ] **Green**: ShapeSelector実装
  - circle, square, hexagon選択
- [ ] **Refactor**: アイコン追加

#### 2.3.3 ColorPickerコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: ColorPickerテスト作成
- [ ] **Green**: ColorPicker実装（react-colorful使用）
  - カラーピッカー
  - RGB値入力
  - スポイト機能
- [ ] **Refactor**: UX最適化

#### 2.3.4 GamingOptionsコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: GamingOptionsテスト作成
- [ ] **Green**: GamingOptions実装
  - レインボーチェックボックス
  - 単色選択
- [ ] **Refactor**: プレビュー表示

#### 2.3.5 WoodSelectorコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: WoodSelectorテスト作成
- [ ] **Green**: WoodSelector実装
  - 木材種類選択（oak, dark-oak, walnut, maple, cherry, mahogany）
- [ ] **Refactor**: サムネイル追加

#### 2.3.6 MetalSelectorコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: MetalSelectorテスト作成
- [ ] **Green**: MetalSelector実装
  - 金属種類選択（gold, silver, copper, chrome, hairline, rusty-iron）
- [ ] **Refactor**: サムネイル追加

#### 2.3.7 MineralSelectorコンポーネント（Red → Green → Refactor）（1h）
- [ ] **Red**: MineralSelectorテスト作成
- [ ] **Green**: MineralSelector実装
  - 鉱物種類選択（marble, granite, obsidian, crystal, ruby, emerald, sapphire）
- [ ] **Refactor**: サムネイル追加

#### 2.3.8 CustomInputコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: CustomInputテスト作成
- [ ] **Green**: CustomInput実装
  - 自由記述入力
- [ ] **Refactor**: プレースホルダー改善

#### 2.3.9 DisplayStandOptionsコンポーネント統合（Red → Green → Refactor）（2h）
- [ ] **Red**: DisplayStandOptionsテスト作成
- [ ] **Green**: DisplayStandOptions実装
  - MaterialSelector統合
  - 材質別UI切り替え
- [ ] **Refactor**: レイアウト最適化

---

### 2.4 背景オプション（3h）

#### 2.4.1 BackgroundToggleコンポーネント（Red → Green → Refactor）（0.5h）
- [ ] **Red**: BackgroundToggleテスト作成
- [ ] **Green**: BackgroundToggle実装
- [ ] **Refactor**: トグルアニメーション

#### 2.4.2 BackgroundTypeSelectorコンポーネント（Red → Green → Refactor）（1.5h）
- [ ] **Red**: BackgroundTypeSelectorテスト作成
- [ ] **Green**: BackgroundTypeSelector実装
  - studio, shop, desktop, diorama, custom選択
- [ ] **Refactor**: アイコン・説明追加

#### 2.4.3 BackgroundOptionsコンポーネント統合（Red → Green → Refactor）（1h）
- [ ] **Red**: BackgroundOptionsテスト作成
- [ ] **Green**: BackgroundOptions実装
  - サブコンポーネント統合
- [ ] **Refactor**: レイアウト最適化

---

### 2.5 プロンプト自動生成（5h）

#### 2.5.1 API Route - プロンプト生成（Red → Green → Refactor）（2h）
- [ ] **Red**: API Routeテスト作成（`app/api/generate-prompt/route.test.ts`）
- [ ] **Green**: API Route実装（`app/api/generate-prompt/route.ts`）
  - Gemini呼び出し（gemini-2.5-flash）
  - タイプ別プロンプト生成（display-stand, background, logo）
- [ ] **Refactor**: エラーハンドリング

#### 2.5.2 プロンプトビルダー拡張（Red → Green → Refactor）（1.5h）
- [ ] **Red**: プロンプトビルダーテスト拡張
- [ ] **Green**: プロンプトビルダー実装拡張
  - buildPackagePrompt関数
  - buildDisplayStandPrompt関数
  - buildBackgroundPrompt関数
- [ ] **Refactor**: プロンプト最適化

#### 2.5.3 PromptEditorコンポーネント（Red → Green → Refactor）（1.5h）
- [ ] **Red**: PromptEditorテスト作成
- [ ] **Green**: PromptEditor実装
  - プロンプト表示
  - 編集機能
  - 「プロンプトを生成」ボタン
- [ ] **Refactor**: UI最適化

---

### Phase 2 完了チェック
- [ ] 全テストがパス
- [ ] コードカバレッジ80%以上
- [ ] ESLint警告ゼロ
- [ ] 全オプション動作確認

---

## Phase 3: 追加生成スタイル実装（重要）

**目的**: 三面図・アクスタ・線画・自由生成の実装
**予定工数**: 15時間
**完了条件**: 全スタイルが動作すること

### 3.1 三面図スタイル（4h）

#### 3.1.1 三面図プロンプト実装（Red → Green → Refactor）（1.5h）
- [ ] **Red**: 三面図プロンプトテスト作成
- [ ] **Green**: 三面図プロンプト実装
  - getBasePrompt拡張（three-view対応）
  - フィギュア化サブオプション対応
- [ ] **Refactor**: プロンプト最適化

#### 3.1.2 三面図UI実装（Red → Green → Refactor）（1.5h）
- [ ] **Red**: 三面図UIテスト作成
- [ ] **Green**: StyleSelector拡張
  - 三面図選択肢追加
  - サブオプション（フィギュア化）チェックボックス
- [ ] **Refactor**: UI最適化

#### 3.1.3 三面図生成制御（Red → Green → Refactor）（1h）
- [ ] **Red**: 三面図生成制御テスト作成
- [ ] **Green**: 三面図生成制御実装
  - 他タブ無効化ロジック
  - 生成中メッセージ
- [ ] **Refactor**: UX改善

---

### 3.2 アクリルスタンドスタイル（2h）

#### 3.2.1 アクスタプロンプト実装（Red → Green → Refactor）（1h）
- [ ] **Red**: アクスタプロンプトテスト作成
- [ ] **Green**: アクスタプロンプト実装
  - getBasePrompt拡張（acrylic-stand対応）
- [ ] **Refactor**: プロンプト最適化

#### 3.2.2 アクスタUI実装（Red → Green → Refactor）（1h）
- [ ] **Red**: アクスタUIテスト作成
- [ ] **Green**: StyleSelector拡張
  - アクスタ選択肢追加
  - 背景オプション対応
- [ ] **Refactor**: UI最適化

---

### 3.3 線画スタイル（2h）

#### 3.3.1 線画プロンプト実装（Red → Green → Refactor）（1h）
- [ ] **Red**: 線画プロンプトテスト作成
- [ ] **Green**: 線画プロンプト実装
  - getBasePrompt拡張（line-art対応）
- [ ] **Refactor**: プロンプト最適化

#### 3.3.2 線画UI実装（Red → Green → Refactor）（1h）
- [ ] **Red**: 線画UIテスト作成
- [ ] **Green**: StyleSelector拡張
  - 線画選択肢追加
- [ ] **Refactor**: UI最適化

---

### 3.4 自由生成スタイル（7h）

#### 3.4.1 API Route - 翻訳（Red → Green → Refactor）（2h）
- [ ] **Red**: API Routeテスト作成（`app/api/translate/route.test.ts`）
- [ ] **Green**: API Route実装（`app/api/translate/route.ts`）
  - Gemini呼び出し（gemini-2.5-flash）
  - 日本語→英語翻訳
- [ ] **Refactor**: エラーハンドリング

#### 3.4.2 自由生成プロンプト実装（Red → Green → Refactor）（1h）
- [ ] **Red**: 自由生成プロンプトテスト作成
- [ ] **Green**: 自由生成プロンプト実装
  - buildPrompt拡張（free対応）
- [ ] **Refactor**: プロンプト最適化

#### 3.4.3 自由生成UI実装（Red → Green → Refactor）（4h）
- [ ] **Red**: 自由生成UIテスト作成
- [ ] **Green**: StyleSelector拡張
  - 自由生成選択肢追加
  - プロンプト入力エリア
  - 「日本語のまま生成」ボタン
  - 「英訳」ボタン
  - 「英語で生成」ボタン
  - 英訳プロンプト表示エリア
- [ ] **Refactor**: UX最適化

---

### Phase 3 完了チェック
- [ ] 全テストがパス
- [ ] コードカバレッジ80%以上
- [ ] ESLint警告ゼロ
- [ ] 全スタイル動作確認

---

## Phase 4: UX改善（推奨）

**目的**: ダウンロード済み管理・一括選択等のUX向上
**予定工数**: 10時間
**完了条件**: UX改善機能が動作すること

### 4.1 IndexedDB実装（3h）

#### 4.1.1 IndexedDB基盤（Red → Green → Refactor）（2h）
- [ ] **Red**: IndexedDBテスト作成（`lib/storage.test.ts`拡張）
- [ ] **Green**: IndexedDB実装（`lib/storage.ts`拡張）
  - initDB関数
  - markAsDownloaded関数
  - isDownloaded関数
- [ ] **Refactor**: エラーハンドリング

#### 4.1.2 ダウンロード済み表示（Red → Green → Refactor）（1h）
- [ ] **Red**: ダウンロード済み表示テスト作成
- [ ] **Green**: Thumbnail拡張
  - 「ダウンロード済み」ラベル
  - トーンダウン表示
  - チェックボックス自動OFF
- [ ] **Refactor**: スタイル最適化

---

### 4.2 一括選択/解除（2h）

#### 4.2.1 SelectAllButtonコンポーネント（Red → Green → Refactor）（2h）
- [ ] **Red**: SelectAllButtonテスト作成
- [ ] **Green**: SelectAllButton実装
  - 全選択
  - 全解除
  - トグル動作
- [ ] **Refactor**: UI最適化

---

### 4.3 UX心理学適用（5h）

#### 4.3.1 マイクロインタラクション（Red → Green → Refactor）（2h）
- [ ] **Red**: マイクロインタラクションテスト作成
- [ ] **Green**: マイクロインタラクション実装
  - ボタンホバーアニメーション
  - クリックフィードバック
  - トランジション効果
- [ ] **Refactor**: パフォーマンス最適化

#### 4.3.2 ピーク・エンド体験（Red → Green → Refactor）（1.5h）
- [ ] **Red**: 完了体験テスト作成
- [ ] **Green**: 完了体験実装
  - 生成完了時のセレブレーション🎉
  - ダウンロード完了メッセージ
- [ ] **Refactor**: アニメーション最適化

#### 4.3.3 労働の錯覚（Red → Green → Refactor）（1.5h）
- [ ] **Red**: 生成プロセステスト作成
- [ ] **Green**: 生成プロセス実装
  - 「画像を分析中...」メッセージ
  - 「プロンプトを最適化中...」メッセージ
  - 「AIが生成中...」メッセージ
  - 進捗メッセージの順次表示
- [ ] **Refactor**: タイミング調整

---

### Phase 4 完了チェック
- [ ] 全テストがパス
- [ ] コードカバレッジ80%以上
- [ ] ESLint警告ゼロ
- [ ] UX改善機能動作確認

---

## 📊 工数サマリー

| Phase | 内容 | 工数（時間） | 備考 |
|-------|------|------------|------|
| Phase 0 | テスト環境構築 | 3 | TDD基盤 |
| Phase 1 | 基本機能 | 40 | 必須 |
| Phase 2 | オプション機能 | 25 | 重要 |
| Phase 3 | 追加スタイル | 15 | 重要 |
| Phase 4 | UX改善 | 10 | 推奨 |
| **合計** | - | **93** | バッファ含まず |
| **バッファ20%** | - | **18.6** | - |
| **総工数** | - | **111.6** | 約14営業日 |

---

## 🎯 マイルストーン

### M1: テスト環境構築完了（0.5日）
- Phase 0完了
- Jest + React Testing Library動作確認

### M2: 基本フロー完成（5日）
- Phase 1完了
- 画像アップロード→生成→ダウンロードが動作

### M3: オプション機能完成（8日）
- Phase 2完了
- 全オプションが動作

### M4: 全スタイル対応完成（10日）
- Phase 3完了
- 5種類全てのスタイルが動作

### M5: リリース準備完了（12日）
- Phase 4完了
- UX改善・最終調整完了

### M6: 本番リリース（14日）
- デプロイ
- ドキュメント整備

---

## 📝 開発ルール

### コミット規約
- `feat:` 新機能追加
- `fix:` バグ修正
- `test:` テスト追加・修正
- `refactor:` リファクタリング
- `docs:` ドキュメント更新
- `style:` コードスタイル修正

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/xxx`: 機能開発
- `test/xxx`: テスト追加

### レビュー基準
- [ ] 全テストがパス
- [ ] コードカバレッジ80%以上
- [ ] ESLint警告ゼロ
- [ ] TypeScript型エラーゼロ
- [ ] レビュー承認

---

## 🔗 参考ドキュメント
- 要件定義書: `requirements_v1.0.md`
- 技術設計書: `technical_design_v1.0.md`
- UX心理学コンセプト: `ux_concepts.md`

---

**文書履歴**
- v1.0 (2025-12-12): 初版作成
