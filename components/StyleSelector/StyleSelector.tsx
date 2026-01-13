/**
 * スタイル選択コンポーネント
 */

'use client';

import StyleButton from './StyleButton';
import type { GenerationStyle } from '@/lib/types';

interface StyleInfo {
  style: GenerationStyle;
  label: string;
  description: string;
}

const STYLES: StyleInfo[] = [
  {
    style: 'figure',
    label: 'フィギュア',
    description: '3Dフィギュア風に変換',
  },
  {
    style: 'three-view',
    label: '三面図',
    description: '正面・横・後ろの3面を生成',
  },
  {
    style: 'acrylic-stand',
    label: 'アクリルスタンド',
    description: 'アクスタ風に変換',
  },
  {
    style: 'line-art',
    label: '線画',
    description: '線画を抽出',
  },
  {
    style: 'free',
    label: '自由生成',
    description: 'プロンプトで自由に生成',
  },
];

interface StyleSelectorProps {
  /** 選択中のスタイル */
  selectedStyle: GenerationStyle;
  /** スタイル変更時のコールバック */
  onStyleChange: (style: GenerationStyle) => void;
  /** 無効化するスタイル */
  disabledStyles?: GenerationStyle[];
}

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
  disabledStyles = [],
}: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">生成スタイル</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STYLES.map((styleInfo) => (
          <StyleButton
            key={styleInfo.style}
            style={styleInfo.style}
            label={styleInfo.label}
            description={styleInfo.description}
            isSelected={selectedStyle === styleInfo.style}
            onClick={onStyleChange}
            disabled={disabledStyles.includes(styleInfo.style)}
          />
        ))}
      </div>
    </div>
  );
}
