/**
 * 汎用Modalコンポーネント
 */

'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 閉じる際のコールバック */
  onClose: () => void;
  /** モーダルのタイトル */
  title?: string;
  /** モーダルの内容 */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  // Escapeキーで閉じる
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // スクロール無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* オーバーレイ */}
      <div
        data-testid="modal-overlay"
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-xl',
          'transform transition-all',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="閉じる"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 本文 */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
