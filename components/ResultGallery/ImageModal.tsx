/**
 * 画像拡大表示モーダルコンポーネント
 */

'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GeneratedImage } from '@/lib/types';

interface ImageModalProps {
  /** モーダルを開くかどうか */
  isOpen: boolean;
  /** 画像一覧 */
  images: GeneratedImage[];
  /** 現在表示中の画像インデックス */
  currentIndex: number;
  /** 閉じる時のコールバック */
  onClose: () => void;
  /** 前の画像へ移動 */
  onPrev: () => void;
  /** 次の画像へ移動 */
  onNext: () => void;
}

/**
 * 画像を拡大表示するモーダル
 */
export function ImageModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageModalProps) {
  const currentImage = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // キーボードイベント
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    },
    [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // スクロール防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="画像プレビュー"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* オーバーレイ */}
      <div
        data-testid="modal-overlay"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* コンテンツ */}
      <div className="relative z-10 max-w-[90vw] max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* 画像エリア */}
        <div className="relative flex items-center">
          {/* 前へボタン */}
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="前の画像"
            className={`
              absolute left-0 z-10 -ml-16 p-2
              text-white rounded-full transition-all
              ${hasPrev
                ? 'hover:bg-white/20 cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* 画像 */}
          <div className="relative w-[70vw] h-[70vh]">
            <Image
              src={currentImage.base64}
              alt={`生成された画像 ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="70vw"
              priority
            />
          </div>

          {/* 次へボタン */}
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="次の画像"
            className={`
              absolute right-0 z-10 -mr-16 p-2
              text-white rounded-full transition-all
              ${hasNext
                ? 'hover:bg-white/20 cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
