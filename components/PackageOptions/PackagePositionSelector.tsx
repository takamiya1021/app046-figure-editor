/**
 * パッケージ配置選択コンポーネント
 */

'use client';

import type { PackagePosition } from '@/lib/types';

interface PositionOption {
  value: PackagePosition;
  label: string;
  description: string;
}

const POSITION_OPTIONS: PositionOption[] = [
  { value: 'none', label: 'なし', description: 'パッケージなし' },
  { value: 'beside', label: '横に配置', description: 'フィギュアの横に表示' },
  { value: 'inside', label: 'パッケージ内', description: 'パッケージの中に収納' },
];

interface PackagePositionSelectorProps {
  /** 選択中の配置 */
  value: PackagePosition;
  /** 変更時のコールバック */
  onChange: (position: PackagePosition) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function PackagePositionSelector({
  value,
  onChange,
  disabled = false,
}: PackagePositionSelectorProps) {
  const handleChange = (position: PackagePosition) => {
    if (!disabled) {
      onChange(position);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">パッケージ配置</h3>
      <div className="flex flex-wrap gap-2">
        {POSITION_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center gap-2
              px-4 py-2 rounded-lg border-2 cursor-pointer
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
              name="package-position"
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
          </label>
        ))}
      </div>
    </div>
  );
}
