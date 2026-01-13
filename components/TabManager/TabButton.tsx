/**
 * タブボタンコンポーネント
 */

'use client';

import { MouseEvent, KeyboardEvent } from 'react';

interface TabButtonProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export default function TabButton({
  id,
  name,
  isActive,
  onClick,
  onDelete,
  canDelete,
}: TabButtonProps) {
  const handleClick = () => {
    onClick(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      role="tab"
      tabIndex={0}
      className={`
        px-4 py-2 rounded-t-lg border-t border-l border-r
        flex items-center gap-2 cursor-pointer
        transition-colors duration-200
        ${isActive
          ? 'bg-white border-gray-300 text-gray-900 -mb-px'
          : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
        }
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isActive}
      aria-label={name}
    >
      <span>{name}</span>
      {canDelete && (
        <button
          type="button"
          className="
            ml-1 p-1 rounded text-gray-400
            hover:text-gray-700 hover:bg-gray-200
            transition-colors duration-150
          "
          onClick={handleDelete}
          aria-label={`${name}を削除`}
        >
          ×
        </button>
      )}
    </div>
  );
}
