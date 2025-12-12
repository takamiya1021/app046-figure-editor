/**
 * アプリケーション全体で使用する型定義
 */

// 生成スタイル
export type GenerationStyle =
  | 'figure' // フィギュア
  | 'three-view' // 三面図
  | 'acrylic-stand' // アクリルスタンド
  | 'line-art' // 線画
  | 'free'; // 自由生成

// アスペクト比
export type AspectRatio = 'auto' | '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

// パッケージ配置
export type PackagePosition = 'none' | 'beside' | 'inside';

// 展示台の形状
export type DisplayStandShape = 'circle' | 'square' | 'hexagon';

// 展示台の材質
export type DisplayStandMaterial =
  | 'gaming' // ゲーミング
  | 'wood' // 木材
  | 'metal' // 金属
  | 'mineral' // 鉱物
  | 'custom'; // カスタム

// 木材の種類
export type WoodType =
  | 'oak'
  | 'dark-oak'
  | 'walnut'
  | 'maple'
  | 'cherry'
  | 'mahogany';

// 金属の種類
export type MetalType =
  | 'gold'
  | 'silver'
  | 'copper'
  | 'chrome'
  | 'hairline'
  | 'rusty-iron';

// 鉱物の種類
export type MineralType =
  | 'marble'
  | 'granite'
  | 'obsidian'
  | 'crystal'
  | 'ruby'
  | 'emerald'
  | 'sapphire';

// 背景タイプ
export type BackgroundType =
  | 'none'
  | 'studio' // スタジオ
  | 'shop' // ショップ
  | 'desktop' // デスクトップ
  | 'diorama' // ジオラマ
  | 'custom'; // カスタム

// パッケージオプション
export interface PackageOptions {
  position: PackagePosition;
  text?: string;
  logoText?: string;
  logoImage?: string;
  hasTexture: boolean;
}

// 展示台オプション
export interface DisplayStandOptions {
  enabled: boolean;
  shape: DisplayStandShape;
  material: DisplayStandMaterial;
  // Gaming
  isRainbow?: boolean;
  color?: string;
  // Wood
  woodType?: WoodType;
  // Metal
  metalType?: MetalType;
  // Mineral
  mineralType?: MineralType;
  // Custom
  customDescription?: string;
}

// 背景オプション
export interface BackgroundOptions {
  enabled: boolean;
  type: BackgroundType;
  customDescription?: string;
}

// アップロードされた画像
export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

// 生成された画像
export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  timestamp: number;
  isDownloaded: boolean;
}

// タブ
export interface Tab {
  id: string;
  name: string;
  uploadedImages: UploadedImage[];
  style: GenerationStyle;
  aspectRatio: AspectRatio;
  generationCount: number;
  packageOptions?: PackageOptions;
  displayStandOptions?: DisplayStandOptions;
  backgroundOptions?: BackgroundOptions;
  customPrompt?: string; // 自由生成用
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
}

// アプリケーション全体の状態
export interface AppState {
  tabs: Tab[];
  activeTabId: string;
}

// アクションタイプ
export type AppAction =
  | { type: 'ADD_TAB'; payload: Tab }
  | { type: 'REMOVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'UPDATE_TAB_IMAGES'; payload: { tabId: string; images: UploadedImage[] } }
  | {
      type: 'UPDATE_TAB_OPTIONS';
      payload: {
        tabId: string;
        style?: GenerationStyle;
        aspectRatio?: AspectRatio;
        generationCount?: number;
        packageOptions?: PackageOptions;
        displayStandOptions?: DisplayStandOptions;
        backgroundOptions?: BackgroundOptions;
        customPrompt?: string;
      };
    }
  | {
      type: 'ADD_GENERATED_IMAGES';
      payload: { tabId: string; images: GeneratedImage[] };
    }
  | { type: 'START_GENERATION'; payload: string }
  | { type: 'END_GENERATION'; payload: string }
  | {
      type: 'MARK_AS_DOWNLOADED';
      payload: { tabId: string; imageId: string };
    };
