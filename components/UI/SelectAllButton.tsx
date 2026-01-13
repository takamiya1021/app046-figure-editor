/**
 * 一括選択/解除ボタンコンポーネント
 */

'use client';

interface SelectAllButtonProps {
  /** 総アイテム数 */
  totalCount: number;
  /** 選択中のアイテム数 */
  selectedCount: number;
  /** 全選択時のコールバック */
  onSelectAll: () => void;
  /** 全解除時のコールバック */
  onDeselectAll: () => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function SelectAllButton({
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  disabled = false,
}: SelectAllButtonProps) {
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isDisabled = disabled || totalCount === 0;

  const handleClick = () => {
    if (isDisabled) return;

    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg
          transition-colors duration-200
          ${isDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : isAllSelected
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }
        `}
      >
        {isAllSelected ? '全て解除' : '全て選択'}
      </button>

      <span className="text-sm text-gray-600">
        {selectedCount} / {totalCount} 選択中
      </span>
    </div>
  );
}
