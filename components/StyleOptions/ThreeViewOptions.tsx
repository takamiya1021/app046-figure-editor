/**
 * 三面図スタイルオプションコンポーネント
 */

'use client';

interface ThreeViewOptionsProps {
  /** フィギュア化オプション */
  figurize: boolean;
  /** フィギュア化変更時のコールバック */
  onFigurizeChange: (figurize: boolean) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function ThreeViewOptions({
  figurize,
  onFigurizeChange,
  disabled = false,
}: ThreeViewOptionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">三面図オプション</h4>
      <label
        className={`
          inline-flex items-center gap-2 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="checkbox"
          checked={figurize}
          onChange={(e) => !disabled && onFigurizeChange(e.target.checked)}
          disabled={disabled}
          className="
            w-4 h-4 rounded border-gray-300
            text-blue-600 focus:ring-blue-500
          "
        />
        <span className="text-sm text-gray-700">
          フィギュア化して生成
        </span>
      </label>
      <p className="text-xs text-gray-500">
        三面図をフィギュア風の質感で生成します
      </p>
    </div>
  );
}
