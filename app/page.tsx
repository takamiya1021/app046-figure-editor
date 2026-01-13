/**
 * メインページ
 * 全コンポーネントを統合したアプリケーションのエントリーポイント
 */

'use client';

import { useState, useCallback } from 'react';
import { useAPIKey } from '@/hooks/useAPIKey';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useDownload } from '@/hooks/useDownload';
import APIKeyModal from '@/components/Layout/APIKeyModal';
import { ImageUploader } from '@/components/ImageUploader';
import { StyleSelector } from '@/components/StyleSelector';
import { GenerationControl } from '@/components/GenerationControl';
import { ResultGallery } from '@/components/ResultGallery';
import { DownloadManager } from '@/components/DownloadManager';
import type { GenerationStyle } from '@/lib/types';
import type { UploadedImage } from '@/hooks/useImageUpload';

export default function Home() {
  // APIキー管理
  const { apiKey, saveApiKey, removeApiKey } = useAPIKey();
  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);

  // 画像アップロード状態
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // スタイル選択
  const [selectedStyle, setSelectedStyle] = useState<GenerationStyle>('figure');
  const [customPrompt, setCustomPrompt] = useState('');

  // 画像生成
  const {
    generatedImages,
    isGenerating,
    progress,
    error: generationError,
    generateImages,
    clearGeneratedImages,
    toggleImageSelection,
    markAsDownloaded,
  } = useImageGeneration();

  // ダウンロード
  const { isDownloading, downloadSelected, downloadAll } = useDownload();

  // 生成ハンドラ
  const handleGenerate = useCallback(
    async (count: number) => {
      if (!apiKey) {
        setIsAPIKeyModalOpen(true);
        return;
      }

      await generateImages({
        apiKey,
        images: uploadedImages.map((img) => ({
          base64: img.base64,
          mimeType: img.type,
        })),
        style: selectedStyle,
        count,
        customPrompt: selectedStyle === 'free' ? customPrompt : undefined,
      });
    },
    [apiKey, uploadedImages, selectedStyle, customPrompt, generateImages]
  );

  // ダウンロードハンドラ
  const handleDownload = useCallback(
    async (type: 'selected' | 'all') => {
      let downloadedIds: string[] = [];
      if (type === 'selected') {
        downloadedIds = await downloadSelected(generatedImages);
      } else {
        downloadedIds = await downloadAll(generatedImages);
      }
      if (downloadedIds.length > 0) {
        markAsDownloaded(downloadedIds);
      }
    },
    [generatedImages, downloadSelected, downloadAll, markAsDownloaded]
  );

  // 全選択/解除ハンドラ
  const handleSelectAll = useCallback(() => {
    generatedImages.forEach((img) => {
      if (!img.isSelected) {
        toggleImageSelection(img.id);
      }
    });
  }, [generatedImages, toggleImageSelection]);

  const handleDeselectAll = useCallback(() => {
    generatedImages.forEach((img) => {
      if (img.isSelected) {
        toggleImageSelection(img.id);
      }
    });
  }, [generatedImages, toggleImageSelection]);

  // 生成可能かどうか
  const canGenerate = uploadedImages.length > 0 && !isGenerating;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              フィギュアエディタ
            </h1>
            <button
              type="button"
              onClick={() => setIsAPIKeyModalOpen(true)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${apiKey
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }
              `}
            >
              {apiKey ? 'APIキー設定済み' : 'APIキー設定'}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左カラム：入力 */}
          <div className="space-y-6">
            {/* 画像アップロード */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                入力画像
              </h2>
              <ImageUploader
                onImagesChange={setUploadedImages}
                maxImages={5}
              />
            </section>

            {/* スタイル選択 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                スタイル
              </h2>
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
              />
              {selectedStyle === 'free' && (
                <div className="mt-4">
                  <label
                    htmlFor="custom-prompt"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    カスタムプロンプト
                  </label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="画像の変換方法を自由に記述してください..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              )}
            </section>

            {/* 生成コントロール */}
            <section className="bg-white rounded-lg shadow p-6">
              <GenerationControl
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                progress={progress}
                disabled={!canGenerate}
              />
              {generationError && (
                <p className="mt-2 text-sm text-red-600">{generationError}</p>
              )}
            </section>
          </div>

          {/* 右カラム：出力 */}
          <div className="space-y-6">
            {/* 生成結果 */}
            <section className="bg-white rounded-lg shadow p-6">
              <ResultGallery
                images={generatedImages}
                onSelect={toggleImageSelection}
              />
            </section>

            {/* ダウンロード管理 */}
            {generatedImages.length > 0 && (
              <section className="bg-white rounded-lg shadow p-6">
                <DownloadManager
                  images={generatedImages}
                  onDownload={handleDownload}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  isDownloading={isDownloading}
                />
              </section>
            )}

            {/* クリアボタン */}
            {generatedImages.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearGeneratedImages}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  生成結果をクリア
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* APIキーモーダル */}
      <APIKeyModal
        isOpen={isAPIKeyModalOpen}
        onClose={() => setIsAPIKeyModalOpen(false)}
        currentApiKey={apiKey || ''}
        onSave={saveApiKey}
        onRemove={removeApiKey}
      />
    </main>
  );
}
