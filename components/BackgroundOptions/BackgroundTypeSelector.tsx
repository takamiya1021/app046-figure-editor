/**
 * 背景タイプ選択コンポーネント
 */

'use client';

import type { BackgroundType } from '@/lib/types';

interface BackgroundTypeOption {
  value: BackgroundType;
  label: string;
  icon: string;
  description: string;
}

const BACKGROUND_TYPE_OPTIONS: BackgroundTypeOption[] = [
  { value: 'studio', label: 'スタジオ', icon: '📷', description: '撮影スタジオ背景' },
  { value: 'shop', label: 'ショップ', icon: '🏪', description: '店舗ディスプレイ' },
  { value: 'desktop', label: 'デスクトップ', icon: '🖥️', description: 'デスク上の配置' },
  { value: 'diorama', label: 'ジオラマ', icon: '🎪', description: 'ミニチュア世界' },
  { value: 'custom', label: 'カスタム', icon: '✏️', description: '自由に指定' },
];

interface BackgroundTypeSelectorProps {
  /** 選択中のタイプ */
  value: BackgroundType;
  /** 変更時のコールバック */
  onChange: (type: BackgroundType) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function BackgroundTypeSelector({
  value,
  onChange,
  disabled = false,
}: BackgroundTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">背景タイプ</h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BACKGROUND_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex flex-col items-center gap-1
              p-3 rounded-lg border-2 cursor-pointer
              transition-all duration-200
              ${value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="background-type"
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <span className="text-2xl">{option.icon}</span>
            <span className="text-sm font-medium text-gray-700">{option.label}</span>
            <span className="text-xs text-gray-500 text-center">{option.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
