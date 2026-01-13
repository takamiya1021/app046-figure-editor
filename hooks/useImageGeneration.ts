/**
 * 画像生成用カスタムフック
 */

'use client';

import { useState, useCallback } from 'react';
import { generateId } from '@/lib/utils';
import type { GenerationStyle, AspectRatio, GeneratedImage } from '@/lib/types';

interface GenerateImagesOptions {
  /** APIキー */
  apiKey: string;
  /** 入力画像 */
  images: Array<{ base64: string; mimeType: string }>;
  /** 生成スタイル */
  style: GenerationStyle;
  /** 生成枚数 */
  count: number;
  /** カスタムプロンプト */
  customPrompt?: string;
  /** アスペクト比 */
  aspectRatio?: AspectRatio;
}

/**
 * 画像生成機能を提供するカスタムフック
 */
export function useImageGeneration() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  /**
   * 画像を生成する
   */
  const generateImages = useCallback(
    async (options: GenerateImagesOptions) => {
      const { apiKey, images, style, count, customPrompt, aspectRatio } = options;

      // バリデーション
      if (!apiKey) {
        setError('APIキーが設定されていません');
        return;
      }

      if (images.length === 0) {
        setError('画像を選択してください');
        return;
      }

      setIsGenerating(true);
      setError(null);
      setProgress(0);

      const newImages: GeneratedImage[] = [];

      try {
        // 指定された枚数だけ生成
        for (let i = 0; i < count; i++) {
          // 入力画像からランダムに選択（複数ある場合）
          const inputImage = images[Math.floor(Math.random() * images.length)];

          // Base64からData URL形式を除去
          const base64Data = inputImage.base64.includes(',')
            ? inputImage.base64.split(',')[1]
            : inputImage.base64;

          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey,
              imageBase64: base64Data,
              mimeType: inputImage.mimeType,
              style,
              customPrompt,
              aspectRatio,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || '画像の生成に失敗しました');
          }

          const generatedImage: GeneratedImage = {
            id: generateId('gen'),
            base64: `data:image/png;base64,${data.imageBase64}`,
            createdAt: new Date().toISOString(),
            isDownloaded: false,
            isSelected: false,
          };

          newImages.push(generatedImage);

          // 進捗更新
          setProgress(Math.round(((i + 1) / count) * 100));

          // 生成された画像を即座に追加
          setGeneratedImages((prev) => [...prev, generatedImage]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '不明なエラーが発生しました';
        setError(message);
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    []
  );

  /**
   * 生成された画像をクリアする
   */
  const clearGeneratedImages = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  /**
   * エラーをクリアする
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 画像の選択状態を切り替える
   */
  const toggleImageSelection = useCallback((id: string) => {
    setGeneratedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, isSelected: !img.isSelected } : img
      )
    );
  }, []);

  /**
   * 画像をダウンロード済みとしてマークする
   */
  const markAsDownloaded = useCallback((ids: string[]) => {
    setGeneratedImages((prev) =>
      prev.map((img) =>
        ids.includes(img.id) ? { ...img, isDownloaded: true } : img
      )
    );
  }, []);

  return {
    /** 生成された画像 */
    generatedImages,
    /** 生成中かどうか */
    isGenerating,
    /** 進捗（0-100） */
    progress,
    /** エラーメッセージ */
    error,
    /** 画像を生成 */
    generateImages,
    /** 生成された画像をクリア */
    clearGeneratedImages,
    /** エラーをクリア */
    clearError,
    /** 画像の選択状態を切り替え */
    toggleImageSelection,
    /** ダウンロード済みとしてマーク */
    markAsDownloaded,
  };
}
