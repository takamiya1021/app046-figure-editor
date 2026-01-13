/**
 * 画像アップロード用カスタムフック
 */

'use client';

import { useState, useCallback } from 'react';
import { generateId, isImageFile, fileToBase64 } from '@/lib/utils';

export interface UploadedImage {
  id: string;
  name: string;
  base64: string;
  type: string;
  size: number;
}

interface UseImageUploadOptions {
  /** 最大画像枚数 */
  maxImages?: number;
}

/**
 * 画像アップロード機能を提供するカスタムフック
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { maxImages = 4 } = options;

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 画像を追加する
   */
  const addImages = useCallback(
    async (files: File[]) => {
      setError(null);

      // 画像ファイルのみフィルタリング
      const imageFiles = files.filter((file) => isImageFile(file));

      if (imageFiles.length !== files.length) {
        setError('画像ファイルのみアップロードできます');
      }

      if (imageFiles.length === 0) {
        return;
      }

      // 最大枚数チェック
      const remainingSlots = maxImages - images.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);

      if (imageFiles.length > remainingSlots) {
        setError(`最大${maxImages}枚までアップロードできます`);
      }

      if (filesToAdd.length === 0) {
        return;
      }

      setIsLoading(true);

      try {
        const newImages: UploadedImage[] = [];

        for (const file of filesToAdd) {
          const base64 = await fileToBase64(file);
          newImages.push({
            id: generateId('img'),
            name: file.name,
            base64,
            type: file.type,
            size: file.size,
          });
        }

        setImages((prev) => [...prev, ...newImages]);
      } catch (err) {
        setError('画像の読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [images.length, maxImages]
  );

  /**
   * 画像を削除する
   */
  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  /**
   * すべての画像をクリアする
   */
  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  /**
   * エラーをクリアする
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    /** アップロードされた画像 */
    images,
    /** エラーメッセージ */
    error,
    /** 読み込み中かどうか */
    isLoading,
    /** 画像を追加 */
    addImages,
    /** 画像を削除 */
    removeImage,
    /** すべての画像をクリア */
    clearImages,
    /** エラーをクリア */
    clearError,
    /** 画像を追加可能かどうか */
    canAddMore: images.length < maxImages,
  };
}
