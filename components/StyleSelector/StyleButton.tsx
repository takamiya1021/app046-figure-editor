/**
 * スタイル選択ボタンコンポーネント
 */

'use client';

import { cn } from '@/lib/utils';
import type { GenerationStyle } from '@/lib/types';

interface StyleButtonProps {
  /** スタイル */
  style: GenerationStyle;
  /** ラベル */
  label: string;
  /** 説明 */
  description: string;
  /** 選択状態 */
  isSelected: boolean;
  /** クリック時のコールバック */
  onClick: (style: GenerationStyle) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function StyleButton({
  style,
  label,
  description,
  isSelected,
  onClick,
  disabled = false,
}: StyleButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(style);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left w-full',
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="font-medium text-gray-900">{label}</span>
      <span className="text-sm text-gray-500 mt-1">{description}</span>
    </button>
  );
}
