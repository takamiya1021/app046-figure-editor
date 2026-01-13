/**
 * スピナー（ローディング）コンポーネント
 */

import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** サイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** カラー */
  color?: 'primary' | 'secondary' | 'white';
  /** 追加のクラス名 */
  className?: string;
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  className,
}: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div role="status" className={cn('inline-flex items-center', className)}>
      <svg
        className={cn('animate-spin', sizeStyles[size], colorStyles[color])}
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
      <span className="sr-only">読み込み中...</span>
    </div>
  );
}
