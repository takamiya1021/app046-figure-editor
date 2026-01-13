/**
 * 線画スタイルオプションコンポーネント
 */

'use client';

export type LineThickness = 'thin' | 'medium' | 'thick';

interface LineArtOptionsProps {
  /** 線の太さ */
  thickness: LineThickness;
  /** 線の太さ変更時のコールバック */
  onThicknessChange: (thickness: LineThickness) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

const THICKNESS_OPTIONS: { value: LineThickness; label: string }[] = [
  { value: 'thin', label: '細め' },
  { value: 'medium', label: '普通' },
  { value: 'thick', label: '太め' },
];

export default function LineArtOptions({
  thickness,
  onThicknessChange,
  disabled = false,
}: LineArtOptionsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">線画オプション</h4>

      <div className="space-y-2">
        <label className="text-xs text-gray-600">線の太さ</label>
        <div className="flex gap-2">
          {THICKNESS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !disabled && onThicknessChange(option.value)}
              disabled={disabled}
              className={`
                flex-1 px-3 py-2 text-sm rounded-lg border transition-colors duration-200
                ${thickness === option.value
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-pressed={thickness === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
