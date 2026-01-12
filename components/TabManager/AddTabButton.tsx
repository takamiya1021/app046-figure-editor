import { ButtonHTMLAttributes } from 'react';

interface AddTabButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick: () => void;
}

export default function AddTabButton({
  onClick,
  className = '',
  ...props
}: AddTabButtonProps) {
  const baseStyles = 'w-8 h-8 flex items-center justify-center rounded text-gray-600 font-medium';
  const hoverStyles = 'hover:bg-gray-200 hover:text-gray-800 hover:scale-110';
  const activeStyles = 'active:scale-95';
  const transitionStyles = 'transition-all duration-150';

  return (
    <button
      className={`${baseStyles} ${hoverStyles} ${activeStyles} ${transitionStyles} ${className}`}
      onClick={onClick}
      aria-label="タブを追加"
      {...props}
    >
      +
    </button>
  );
}
