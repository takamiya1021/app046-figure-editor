/**
 * アプリケーション全体で使用する定数
 */

import type { Tab, AppState } from './types';

/**
 * 画像関連の定数
 */
export const MAX_UPLOAD_IMAGES = 3; // 最大アップロード枚数
export const MAX_GENERATION_COUNT = 8; // 最大生成枚数
export const MIN_GENERATION_COUNT = 1; // 最小生成枚数

/**
 * デフォルトタブ（関数として定義して、毎回新しいオブジェクトを生成）
 */
export const createDefaultTab = (index: number): Tab => ({
  id: `tab-${Date.now()}-${index}`,
  name: `タブ ${index}`,
  uploadedImages: [],
  style: 'figure',
  aspectRatio: 'auto',
  generationCount: 1,
  generatedImages: [],
  isGenerating: false,
});

/**
 * テスト用のデフォルトタブ（固定ID）
 */
export const DEFAULT_TAB: Tab = {
  id: 'default-tab',
  name: 'タブ 1',
  uploadedImages: [],
  style: 'figure',
  aspectRatio: 'auto',
  generationCount: 1,
  generatedImages: [],
  isGenerating: false,
};

/**
 * 初期アプリケーション状態
 */
export const INITIAL_APP_STATE: AppState = {
  tabs: [DEFAULT_TAB],
  activeTabId: DEFAULT_TAB.id,
};

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  TABS: 'figure_editor_tabs',
  ACTIVE_TAB_ID: 'figure_editor_active_tab_id',
} as const;

/**
 * Gemini APIモデル名
 */
export const GEMINI_MODELS = {
  TEXT: 'gemini-2.5-flash',
  IMAGE: 'gemini-2.5-flash-image',
  IMAGE_PRO: 'gemini-3-pro-image-preview',
} as const;
