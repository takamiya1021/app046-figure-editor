/**
 * 生成枚数選択コンポーネント
 */

'use client';

interface CountSelectorProps {
  /** 現在の選択値 */
  value: number;
  /** 値変更時のコールバック */
  onChange: (count: number) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

/** 選択可能な枚数 */
const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * 生成枚数を選択するラジオボタングループ
 */
export function CountSelector({ value, onChange, disabled = false }: CountSelectorProps) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">生成枚数</span>
      <div
        role="radiogroup"
        aria-label="生成枚数"
        className="flex flex-wrap gap-2"
      >
        {COUNT_OPTIONS.map((count) => (
          <label
            key={count}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();
              }
            }}
            className={`
              inline-flex items-center justify-center
              w-12 h-10 rounded-lg border-2 cursor-pointer
              transition-colors duration-200
              ${value === count
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="count-selector"
              value={count}
              checked={value === count}
              onChange={() => {
                if (!disabled) {
                  onChange(count);
                }
              }}
              disabled={disabled}
              aria-label={`${count}枚`}
              className="sr-only"
            />
            <span className="text-sm font-medium">{count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
