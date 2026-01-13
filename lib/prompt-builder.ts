/**
 * プロンプトビルダー
 */

import type {
  GenerationStyle,
  AspectRatio,
  PackageOptions,
  DisplayStandOptions,
  BackgroundOptions,
  ThreeViewOptions,
  AcrylicStandOptions,
  LineArtOptions,
  LineThickness,
  WoodType,
  MetalType,
  MineralType,
  BackgroundType,
} from './types';

/**
 * スタイルごとのベースプロンプト
 */
const BASE_PROMPTS: Record<GenerationStyle, string> = {
  figure: `この画像をリアルなフィギュア・スタチュー風に変換してください。
以下の特徴を持つように生成してください：
- 実際のフィギュア製品のような質感
- PVCやレジン素材のような光沢感
- 立体的な造形を感じさせる陰影
- フィギュアの台座（ベース）を追加
- スタジオ撮影のような背景
- 高品質なフィギュア製品写真のような仕上がり`,

  'three-view': `この画像のキャラクターの三面図を生成してください。
以下の特徴を持つように生成してください：
- 正面、横（左または右）、後ろの3つの視点
- 同じキャラクターの統一されたデザイン
- 白または薄いグレーの背景
- キャラクターシートのような配置`,

  'acrylic-stand': `この画像をアクリルスタンド風に変換してください。
以下の特徴を持つように生成してください：
- アクリル素材の透明感
- スタンドの台座部分
- イラストのスタイルを維持
- クリアな輪郭線`,

  'line-art': `この画像から線画を抽出してください。
以下の特徴を持つように生成してください：
- 色を除去し、線のみを残す
- クリーンでシャープな輪郭線
- 白い背景
- ベクター風の仕上がり`,

  free: '',
};

/**
 * 木材タイプの日本語名
 */
const WOOD_TYPE_LABELS: Record<WoodType, string> = {
  oak: 'オーク',
  'dark-oak': 'ダークオーク',
  walnut: 'ウォールナット',
  maple: 'メープル',
  cherry: 'チェリー',
  mahogany: 'マホガニー',
};

/**
 * 金属タイプの日本語名
 */
const METAL_TYPE_LABELS: Record<MetalType, string> = {
  gold: 'ゴールド',
  silver: 'シルバー',
  copper: '銅',
  chrome: 'クローム',
  hairline: 'ヘアライン',
  'rusty-iron': '錆び鉄',
};

/**
 * 鉱物タイプの日本語名
 */
const MINERAL_TYPE_LABELS: Record<MineralType, string> = {
  marble: '大理石',
  granite: '花崗岩',
  obsidian: '黒曜石',
  crystal: '水晶',
  ruby: 'ルビー',
  emerald: 'エメラルド',
  sapphire: 'サファイア',
};

/**
 * 背景タイプの日本語名
 */
const BACKGROUND_TYPE_LABELS: Record<BackgroundType, string> = {
  none: 'なし',
  studio: 'スタジオ撮影風の背景',
  shop: 'ショップディスプレイ風の背景',
  desktop: 'デスクトップに置かれた雰囲気',
  diorama: 'ジオラマ風の小さな世界',
  custom: 'カスタム',
};

/**
 * 展示台形状の日本語名
 */
const SHAPE_LABELS: Record<string, string> = {
  circle: '円形',
  square: '四角形',
  hexagon: '六角形',
};

/**
 * スタイルに基づいたベースプロンプトを取得
 */
export function getBasePrompt(style: GenerationStyle): string {
  return BASE_PROMPTS[style];
}

interface BuildPromptOptions {
  /** 生成スタイル */
  style: GenerationStyle;
  /** カスタムプロンプト（freeスタイル用） */
  customPrompt?: string;
  /** アスペクト比 */
  aspectRatio?: AspectRatio;
  /** パッケージオプション */
  packageOptions?: PackageOptions;
  /** 展示台オプション */
  displayStandOptions?: DisplayStandOptions;
  /** 背景オプション */
  backgroundOptions?: BackgroundOptions;
  /** 三面図オプション */
  threeViewOptions?: ThreeViewOptions;
  /** アクリルスタンドオプション */
  acrylicStandOptions?: AcrylicStandOptions;
  /** 線画オプション */
  lineArtOptions?: LineArtOptions;
}

/**
 * パッケージオプションのプロンプトを構築
 */
function buildPackagePrompt(options: PackageOptions): string {
  if (options.position === 'none') {
    return '';
  }

  const parts: string[] = [];

  // 配置
  if (options.position === 'beside') {
    parts.push('パッケージを横に並べて表示');
  } else if (options.position === 'inside') {
    parts.push('パッケージの中に収められた状態で表示');
  }

  // テキスト
  if (options.text) {
    parts.push(`パッケージに「${options.text}」というテキスト`);
  }

  // ロゴ
  if (options.logoText) {
    parts.push(`「${options.logoText}」のロゴ`);
  }

  // テクスチャ
  if (options.hasTexture) {
    parts.push('パッケージにリアルなテクスチャ（印刷の質感、箱の折り目など）');
  }

  return parts.length > 0 ? `\n\nパッケージ:\n- ${parts.join('\n- ')}` : '';
}

/**
 * 展示台オプションのプロンプトを構築
 */
function buildDisplayStandPrompt(options: DisplayStandOptions): string {
  if (!options.enabled) {
    return '';
  }

  const parts: string[] = [];

  // 形状
  const shapeLabel = SHAPE_LABELS[options.shape] || options.shape;
  parts.push(`${shapeLabel}の展示台`);

  // 材質別の詳細
  switch (options.material) {
    case 'gaming':
      if (options.isRainbow) {
        parts.push('レインボーに光るLED（ゲーミング風）');
      } else if (options.color) {
        parts.push(`${options.color}色に光るLED`);
      }
      break;
    case 'wood':
      if (options.woodType) {
        const woodLabel = WOOD_TYPE_LABELS[options.woodType];
        parts.push(`木材（${woodLabel}）製`);
      }
      break;
    case 'metal':
      if (options.metalType) {
        const metalLabel = METAL_TYPE_LABELS[options.metalType];
        parts.push(`金属（${metalLabel}）製`);
      }
      break;
    case 'mineral':
      if (options.mineralType) {
        const mineralLabel = MINERAL_TYPE_LABELS[options.mineralType];
        parts.push(`鉱物（${mineralLabel}）製`);
      }
      break;
    case 'custom':
      if (options.customDescription) {
        parts.push(options.customDescription);
      }
      break;
  }

  return parts.length > 0 ? `\n\n展示台:\n- ${parts.join('\n- ')}` : '';
}

/**
 * 三面図オプションのプロンプトを構築
 */
function buildThreeViewPrompt(options: ThreeViewOptions): string {
  if (!options.figurize) {
    return '';
  }

  return `\n\nフィギュア化指示:
- 三面図をフィギュア風の質感で生成
- PVCやレジン素材のような光沢感を持たせる
- 立体的な造形を感じさせる陰影を追加
- 高品質なフィギュア製品のような仕上がり`;
}

/**
 * アクリルスタンドオプションのプロンプトを構築
 */
function buildAcrylicStandPrompt(options: AcrylicStandOptions): string {
  if (!options.hasOutline) {
    return '';
  }

  return `\n\n縁取りオプション:
- キャラクターの周囲に白い縁取りを追加
- アクリルスタンドらしいクリーンな仕上がり`;
}

/**
 * 線の太さラベル
 */
const LINE_THICKNESS_LABELS: Record<LineThickness, string> = {
  thin: '細め',
  medium: '普通',
  thick: '太め',
};

/**
 * 線画オプションのプロンプトを構築
 */
function buildLineArtPrompt(options: LineArtOptions): string {
  const thicknessLabel = LINE_THICKNESS_LABELS[options.thickness];

  return `\n\n線の太さ: ${thicknessLabel}の線で描画`;
}

/**
 * 背景オプションのプロンプトを構築
 */
function buildBackgroundPrompt(options: BackgroundOptions): string {
  if (!options.enabled) {
    return '';
  }

  const parts: string[] = [];

  if (options.type === 'custom') {
    if (options.customDescription) {
      parts.push(options.customDescription);
    }
  } else if (options.type !== 'none') {
    const bgLabel = BACKGROUND_TYPE_LABELS[options.type];
    parts.push(bgLabel);
  }

  return parts.length > 0 ? `\n\n背景:\n- ${parts.join('\n- ')}` : '';
}

/**
 * プロンプトを構築する
 */
export function buildPrompt(options: BuildPromptOptions): string {
  const {
    style,
    customPrompt,
    aspectRatio,
    packageOptions,
    displayStandOptions,
    backgroundOptions,
    threeViewOptions,
    acrylicStandOptions,
    lineArtOptions,
  } = options;

  let prompt = getBasePrompt(style);

  // freeスタイルの場合はカスタムプロンプトを使用
  if (style === 'free' && customPrompt) {
    prompt = customPrompt;
  }

  // 三面図スタイルの場合、オプションを適用
  if (style === 'three-view' && threeViewOptions) {
    prompt += buildThreeViewPrompt(threeViewOptions);
  }

  // アクリルスタンドスタイルの場合、オプションを適用
  if (style === 'acrylic-stand' && acrylicStandOptions) {
    prompt += buildAcrylicStandPrompt(acrylicStandOptions);
  }

  // 線画スタイルの場合、オプションを適用
  if (style === 'line-art' && lineArtOptions) {
    prompt += buildLineArtPrompt(lineArtOptions);
  }

  // アスペクト比の指定
  if (aspectRatio && aspectRatio !== 'auto') {
    prompt += `\n\nアスペクト比: ${aspectRatio}`;
  }

  // パッケージオプション
  if (packageOptions) {
    prompt += buildPackagePrompt(packageOptions);
  }

  // 展示台オプション
  if (displayStandOptions) {
    prompt += buildDisplayStandPrompt(displayStandOptions);
  }

  // 背景オプション
  if (backgroundOptions) {
    prompt += buildBackgroundPrompt(backgroundOptions);
  }

  return prompt;
}
