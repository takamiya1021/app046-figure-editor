/**
 * アスペクト比選択コンポーネント
 */

'use client';

import type { AspectRatio } from '@/lib/types';

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  description: string;
}

const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { value: 'auto', label: '自動', description: '元画像に合わせる' },
  { value: '1:1', label: '1:1', description: '正方形' },
  { value: '3:4', label: '3:4', description: '縦長' },
  { value: '4:3', label: '4:3', description: '横長' },
  { value: '9:16', label: '9:16', description: 'スマホ縦' },
  { value: '16:9', label: '16:9', description: 'ワイド' },
];

interface AspectRatioSelectorProps {
  /** 選択中のアスペクト比 */
  value: AspectRatio;
  /** 変更時のコールバック */
  onChange: (ratio: AspectRatio) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function AspectRatioSelector({
  value,
  onChange,
  disabled = false,
}: AspectRatioSelectorProps) {
  const handleChange = (ratio: AspectRatio) => {
    if (!disabled) {
      onChange(ratio);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">アスペクト比</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ASPECT_RATIO_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex flex-col items-center justify-center
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
              name="aspect-ratio"
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <span
              className={`
                text-sm font-medium
                ${value === option.value ? 'text-blue-700' : 'text-gray-900'}
              `}
            >
              {option.label}
            </span>
            <span
              className={`
                text-xs
                ${value === option.value ? 'text-blue-600' : 'text-gray-500'}
              `}
            >
              {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
