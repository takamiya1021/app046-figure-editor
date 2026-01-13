/**
 * カラーピッカーコンポーネント
 */

'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';

interface ColorPickerProps {
  /** 選択中の色（hex形式） */
  value: string;
  /** 変更時のコールバック */
  onChange: (color: string) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function ColorPicker({
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h4 className="text-sm font-medium text-gray-700">カラー</h4>
      <div className="space-y-3">
        <HexColorPicker
          color={value}
          onChange={onChange}
          style={{ width: '100%', maxWidth: '200px' }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">#</span>
          <HexColorInput
            color={value}
            onChange={onChange}
            className="
              w-24 px-2 py-1 border border-gray-300 rounded
              text-sm font-mono uppercase
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            "
            aria-label="カラーコード"
          />
          <div
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: value }}
            aria-label={`選択色: ${value}`}
          />
        </div>
      </div>
    </div>
  );
}
