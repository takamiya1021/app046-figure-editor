/**
 * 生成ボタンコンポーネント
 */

'use client';

interface GenerateButtonProps {
  /** クリック時のコールバック */
  onClick: () => void;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** 進捗（0-100） */
  progress?: number;
  /** 無効化状態 */
  disabled?: boolean;
}

/**
 * 画像生成を実行するボタン
 */
export function GenerateButton({
  onClick,
  isLoading = false,
  progress,
  disabled = false,
}: GenerateButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative w-full py-3 px-6 rounded-lg
        font-medium text-white
        transition-all duration-200
        ${isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `}
    >
      {/* プログレスバー背景 */}
      {isLoading && progress !== undefined && (
        <div
          className="absolute inset-0 bg-blue-700 rounded-lg transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* ボタンテキスト */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>生成中...</span>
            {progress !== undefined && (
              <span className="ml-1">{progress}%</span>
            )}
          </>
        ) : (
          '生成する'
        )}
      </span>
    </button>
  );
}
