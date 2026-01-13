/**
 * テクスチャチェックボックスコンポーネント
 */

'use client';

interface TextureCheckboxProps {
  /** チェック状態 */
  checked: boolean;
  /** 変更時のコールバック */
  onChange: (checked: boolean) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function TextureCheckbox({
  checked,
  onChange,
  disabled = false,
}: TextureCheckboxProps) {
  return (
    <label
      className={`
        inline-flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`
          w-4 h-4 rounded border-gray-300
          text-blue-600 focus:ring-blue-500
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      />
      <span className="text-sm text-gray-700">テクスチャを適用</span>
    </label>
  );
}
