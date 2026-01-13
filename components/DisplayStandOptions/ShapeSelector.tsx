/**
 * 展示台形状選択コンポーネント
 */

'use client';

import type { DisplayStandShape } from '@/lib/types';

interface ShapeOption {
  value: DisplayStandShape;
  label: string;
  icon: string;
}

const SHAPE_OPTIONS: ShapeOption[] = [
  { value: 'circle', label: '円形', icon: '○' },
  { value: 'square', label: '四角形', icon: '□' },
  { value: 'hexagon', label: '六角形', icon: '⬡' },
];

interface ShapeSelectorProps {
  /** 選択中の形状 */
  value: DisplayStandShape;
  /** 変更時のコールバック */
  onChange: (shape: DisplayStandShape) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function ShapeSelector({
  value,
  onChange,
  disabled = false,
}: ShapeSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">形状</h4>
      <div className="flex gap-2">
        {SHAPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex flex-col items-center justify-center
              w-16 h-16 rounded-lg border-2 cursor-pointer
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
              name="stand-shape"
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <span className="text-2xl">{option.icon}</span>
            <span className="text-xs text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
