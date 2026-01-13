/**
 * 鉱物選択コンポーネント
 */

'use client';

import type { MineralType } from '@/lib/types';

interface MineralOption {
  value: MineralType;
  label: string;
  gradient: string;
}

const MINERAL_OPTIONS: MineralOption[] = [
  { value: 'marble', label: '大理石', gradient: 'linear-gradient(135deg, #f5f5f5, #d0d0d0, #e8e8e8)' },
  { value: 'granite', label: '花崗岩', gradient: 'linear-gradient(135deg, #8b8b8b, #4a4a4a, #6b6b6b)' },
  { value: 'obsidian', label: '黒曜石', gradient: 'linear-gradient(135deg, #1a1a2e, #0f0f1a, #2a2a3e)' },
  { value: 'crystal', label: '水晶', gradient: 'linear-gradient(135deg, #e8f4fc, #c8e0f0, #f0f8ff)' },
  { value: 'ruby', label: 'ルビー', gradient: 'linear-gradient(135deg, #e0115f, #9b111e, #c41e3a)' },
  { value: 'emerald', label: 'エメラルド', gradient: 'linear-gradient(135deg, #50c878, #046307, #2e8b57)' },
  { value: 'sapphire', label: 'サファイア', gradient: 'linear-gradient(135deg, #0f52ba, #082567, #1560bd)' },
];

interface MineralSelectorProps {
  /** 選択中の鉱物 */
  value: MineralType;
  /** 変更時のコールバック */
  onChange: (mineral: MineralType) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function MineralSelector({
  value,
  onChange,
  disabled = false,
}: MineralSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">鉱物の種類</h4>
      <div className="grid grid-cols-3 gap-2">
        {MINERAL_OPTIONS.map((option) => (
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
              name="mineral-type"
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
