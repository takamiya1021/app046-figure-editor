/**
 * 画像アップローダーコンポーネント（統合）
 */

'use client';

import { useEffect } from 'react';
import { useImageUpload, type UploadedImage } from '@/hooks/useImageUpload';
import DropZone from './DropZone';
import ImagePreview from './ImagePreview';
import Button from '@/components/UI/Button';
import Spinner from '@/components/UI/Spinner';

interface ImageUploaderProps {
  /** 画像が変更された時のコールバック */
  onImagesChange: (images: UploadedImage[]) => void;
  /** 最大画像枚数 */
  maxImages?: number;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function ImageUploader({
  onImagesChange,
  maxImages = 4,
  disabled = false,
}: ImageUploaderProps) {
  const {
    images,
    error,
    isLoading,
    addImages,
    removeImage,
    clearImages,
    clearError,
    canAddMore,
  } = useImageUpload({ maxImages });

  // 画像が変更されたら親コンポーネントに通知
  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  const handleDrop = (files: File[]) => {
    addImages(files);
  };

  const handleRemove = (id: string) => {
    removeImage(id);
  };

  const handleClear = () => {
    clearImages();
  };

  return (
    <div className="space-y-4">
      {/* ドロップゾーン */}
      <DropZone
        onDrop={handleDrop}
        disabled={disabled || !canAddMore || isLoading}
      />

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="md" />
          <span className="ml-2 text-gray-600">画像を読み込み中...</span>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            type="button"
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
            aria-label="エラーを閉じる"
          >
            <svg
              className="w-4 h-4"
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
      )}

      {/* 画像プレビュー一覧 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {images.length} / {maxImages} 枚
            </p>
            <Button variant="secondary" onClick={handleClear}>
              クリア
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                id={image.id}
                src={image.base64}
                name={image.name}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
