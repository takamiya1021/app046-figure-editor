/**
 * 背景トグルコンポーネント
 */

'use client';

interface BackgroundToggleProps {
  /** 有効状態 */
  enabled: boolean;
  /** 変更時のコールバック */
  onChange: (enabled: boolean) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function BackgroundToggle({
  enabled,
  onChange,
  disabled = false,
}: BackgroundToggleProps) {
  return (
    <label
      className={`
        inline-flex items-center gap-3 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span className="text-sm font-medium text-gray-700">背景を追加</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </label>
  );
}
