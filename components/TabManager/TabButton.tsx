import { MouseEvent, KeyboardEvent } from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  onClose: (id: string) => void;
}

export default function TabButton({
  id,
  label,
  isActive,
  onClick,
  onClose,
}: TabButtonProps) {
  const baseStyles = 'px-4 py-2 border border-gray-300 rounded-t flex items-center gap-2 transition-colors cursor-pointer';

  const activeStyles = 'bg-white border-b-white';
  const inactiveStyles = 'bg-gray-100 hover:bg-gray-200';

  const handleClick = () => {
    onClick(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose(id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
    >
      <span>{label}</span>
      <button
        className="ml-1 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-300"
        onClick={handleClose}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}
