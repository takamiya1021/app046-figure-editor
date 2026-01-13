/**
 * 木材選択コンポーネント
 */

'use client';

import type { WoodType } from '@/lib/types';

interface WoodOption {
  value: WoodType;
  label: string;
  color: string;
}

const WOOD_OPTIONS: WoodOption[] = [
  { value: 'oak', label: 'オーク', color: '#c4a35a' },
  { value: 'dark-oak', label: 'ダークオーク', color: '#4a3728' },
  { value: 'walnut', label: 'ウォールナット', color: '#5c4033' },
  { value: 'maple', label: 'メープル', color: '#e8d5b7' },
  { value: 'cherry', label: 'チェリー', color: '#9b4f4f' },
  { value: 'mahogany', label: 'マホガニー', color: '#6b3d2e' },
];

interface WoodSelectorProps {
  /** 選択中の木材 */
  value: WoodType;
  /** 変更時のコールバック */
  onChange: (wood: WoodType) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function WoodSelector({
  value,
  onChange,
  disabled = false,
}: WoodSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">木材の種類</h4>
      <div className="grid grid-cols-3 gap-2">
        {WOOD_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex flex-col items-center gap-1
              p-2 rounded-lg border-2 cursor-pointer
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
              name="wood-type"
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ backgroundColor: option.color }}
            />
            <span className="text-xs text-gray-700 text-center">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
