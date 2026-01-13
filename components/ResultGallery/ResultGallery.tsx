/**
 * 生成結果ギャラリーコンポーネント
 */

'use client';

import { useState, useCallback } from 'react';
import { Thumbnail } from './Thumbnail';
import { ImageModal } from './ImageModal';
import type { GeneratedImage } from '@/lib/types';

interface ResultGalleryProps {
  /** 生成された画像一覧 */
  images: GeneratedImage[];
  /** 選択状態変更時のコールバック */
  onSelect: (id: string) => void;
}

/**
 * 生成された画像をギャラリー表示するコンポーネント
 */
export function ResultGallery({ images, onSelect }: ResultGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = useCallback(
    (image: GeneratedImage) => {
      const index = images.findIndex((img) => img.id === image.id);
      if (index !== -1) {
        setCurrentIndex(index);
        setIsModalOpen(true);
      }
    },
    [images]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>生成された画像がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">生成結果</h2>
        <span className="text-sm text-gray-500">（{images.length}枚）</span>
      </div>

      {/* サムネイル一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Thumbnail
            key={image.id}
            image={image}
            onSelect={onSelect}
            onClick={handleImageClick}
          />
        ))}
      </div>

      {/* 画像モーダル */}
      <ImageModal
        isOpen={isModalOpen}
        images={images}
        currentIndex={currentIndex}
        onClose={handleCloseModal}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
