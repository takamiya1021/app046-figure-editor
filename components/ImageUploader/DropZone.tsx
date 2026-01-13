/**
 * ドラッグ&ドロップゾーンコンポーネント
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  /** ファイルがドロップされた時のコールバック */
  onDrop: (files: File[]) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function DropZone({ onDrop, disabled = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onDrop(files);
      }
    },
    [disabled, onDrop]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onDrop(Array.from(files));
      }
      // 同じファイルを再選択可能にする
      e.target.value = '';
    },
    [onDrop]
  );

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      data-testid="drop-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors',
        isDragOver && !disabled
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* アイコン */}
      <svg
        className="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>

      {/* テキスト */}
      <p className="text-gray-600 text-center mb-2">
        ドラッグ&ドロップで画像をアップロード
      </p>
      <p className="text-gray-400 text-sm mb-4">または</p>

      {/* ファイル選択ボタン */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={cn(
          'px-4 py-2 bg-blue-600 text-white rounded-md transition-colors',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700'
        )}
      >
        ファイルを選択
      </button>

      {/* 非表示のファイル入力 */}
      <input
        ref={inputRef}
        data-testid="file-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}
