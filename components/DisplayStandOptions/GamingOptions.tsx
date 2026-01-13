/**
 * ゲーミングオプションコンポーネント
 */

'use client';

import ColorPicker from './ColorPicker';

interface GamingOptionsProps {
  /** レインボー設定 */
  isRainbow: boolean;
  /** 単色カラー */
  color: string;
  /** レインボー変更時のコールバック */
  onRainbowChange: (isRainbow: boolean) => void;
  /** カラー変更時のコールバック */
  onColorChange: (color: string) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function GamingOptions({
  isRainbow,
  color,
  onRainbowChange,
  onColorChange,
  disabled = false,
}: GamingOptionsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">ゲーミングLED</h4>

      {/* レインボー選択 */}
      <label
        className={`
          inline-flex items-center gap-2 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="checkbox"
          checked={isRainbow}
          onChange={(e) => onRainbowChange(e.target.checked)}
          disabled={disabled}
          className="
            w-4 h-4 rounded border-gray-300
            text-blue-600 focus:ring-blue-500
          "
        />
        <span className="text-sm text-gray-700">🌈 レインボー</span>
      </label>

      {/* 単色選択（レインボーでない場合） */}
      {!isRainbow && (
        <ColorPicker
          value={color}
          onChange={onColorChange}
          disabled={disabled}
        />
      )}
    </div>
  );
}
