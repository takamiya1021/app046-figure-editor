/**
 * 材質選択コンポーネント
 */

'use client';

import type { DisplayStandMaterial } from '@/lib/types';

interface MaterialOption {
  value: DisplayStandMaterial;
  label: string;
  icon: string;
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  { value: 'gaming', label: 'ゲーミング', icon: '🎮' },
  { value: 'wood', label: '木材', icon: '🪵' },
  { value: 'metal', label: '金属', icon: '⚙️' },
  { value: 'mineral', label: '鉱物', icon: '💎' },
  { value: 'custom', label: 'カスタム', icon: '✏️' },
];

interface MaterialSelectorProps {
  /** 選択中の材質 */
  value: DisplayStandMaterial;
  /** 変更時のコールバック */
  onChange: (material: DisplayStandMaterial) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function MaterialSelector({
  value,
  onChange,
  disabled = false,
}: MaterialSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">材質</h4>
      <div className="flex flex-wrap gap-2">
        {MATERIAL_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-lg border-2 cursor-pointer
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
              name="stand-material"
              value={option.value}
              checked={value === option.value}
              onChange={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={option.label}
            />
            <span className="text-lg">{option.icon}</span>
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
