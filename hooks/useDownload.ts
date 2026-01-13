/**
 * ダウンロード機能用カスタムフック
 */

'use client';

import { useState, useCallback } from 'react';
import type { GeneratedImage } from '@/lib/types';

/**
 * 画像ダウンロード機能を提供するカスタムフック
 */
export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Base64データから画像をダウンロード
   */
  const downloadImage = useCallback(
    async (image: GeneratedImage, filename: string): Promise<void> => {
      const link = document.createElement('a');
      link.href = image.base64;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

  /**
   * 単一画像をダウンロード
   */
  const downloadIndividual = useCallback(
    async (image: GeneratedImage): Promise<string[]> => {
      setIsDownloading(true);
      try {
        const timestamp = new Date(image.createdAt).getTime();
        const filename = `figure_${timestamp}.png`;
        await downloadImage(image, filename);
        return [image.id];
      } finally {
        setIsDownloading(false);
      }
    },
    [downloadImage]
  );

  /**
   * 選択された画像をダウンロード
   */
  const downloadSelected = useCallback(
    async (images: GeneratedImage[]): Promise<string[]> => {
      const selectedImages = images.filter((img) => img.isSelected);
      if (selectedImages.length === 0) {
        return [];
      }

      setIsDownloading(true);
      const downloadedIds: string[] = [];

      try {
        for (const image of selectedImages) {
          const timestamp = new Date(image.createdAt).getTime();
          const filename = `figure_${timestamp}.png`;
          await downloadImage(image, filename);
          downloadedIds.push(image.id);
        }
        return downloadedIds;
      } finally {
        setIsDownloading(false);
      }
    },
    [downloadImage]
  );

  /**
   * 全画像をダウンロード
   */
  const downloadAll = useCallback(
    async (images: GeneratedImage[]): Promise<string[]> => {
      if (images.length === 0) {
        return [];
      }

      setIsDownloading(true);
      const downloadedIds: string[] = [];

      try {
        for (const image of images) {
          const timestamp = new Date(image.createdAt).getTime();
          const filename = `figure_${timestamp}.png`;
          await downloadImage(image, filename);
          downloadedIds.push(image.id);
        }
        return downloadedIds;
      } finally {
        setIsDownloading(false);
      }
    },
    [downloadImage]
  );

  return {
    /** ダウンロード中かどうか */
    isDownloading,
    /** 単一画像をダウンロード */
    downloadIndividual,
    /** 選択された画像をダウンロード */
    downloadSelected,
    /** 全画像をダウンロード */
    downloadAll,
  };
}
