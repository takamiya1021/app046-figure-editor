/**
 * 金属選択コンポーネント
 */

'use client';

import type { MetalType } from '@/lib/types';

interface MetalOption {
  value: MetalType;
  label: string;
  gradient: string;
}

const METAL_OPTIONS: MetalOption[] = [
  { value: 'gold', label: 'ゴールド', gradient: 'linear-gradient(135deg, #ffd700, #b8860b)' },
  { value: 'silver', label: 'シルバー', gradient: 'linear-gradient(135deg, #c0c0c0, #808080)' },
  { value: 'copper', label: '銅', gradient: 'linear-gradient(135deg, #b87333, #8b4513)' },
  { value: 'chrome', label: 'クローム', gradient: 'linear-gradient(135deg, #e8e8e8, #a0a0a0)' },
  { value: 'hairline', label: 'ヘアライン', gradient: 'linear-gradient(135deg, #d4d4d4, #a8a8a8)' },
  { value: 'rusty-iron', label: '錆び鉄', gradient: 'linear-gradient(135deg, #8b4513, #654321)' },
];

interface MetalSelectorProps {
  /** 選択中の金属 */
  value: MetalType;
  /** 変更時のコールバック */
  onChange: (metal: MetalType) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function MetalSelector({
  value,
  onChange,
  disabled = false,
}: MetalSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">金属の種類</h4>
      <div className="grid grid-cols-3 gap-2">
        {METAL_OPTIONS.map((option) => (
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
              name="metal-type"
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ background: option.gradient }}
            />
            <span className="text-xs text-gray-700 text-center">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
