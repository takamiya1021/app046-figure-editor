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
import {
  ThreeViewOptions,
  AcrylicStandOptions,
  LineArtOptions,
  FreeStyleOptions,
} from '@/components/StyleOptions';
import { ProgressMessage, CelebrationMessage } from '@/components/UX';
import type {
  GenerationStyle,
  ThreeViewOptions as ThreeViewOptionsType,
  AcrylicStandOptions as AcrylicStandOptionsType,
  LineArtOptions as LineArtOptionsType,
  LineThickness,
} from '@/lib/types';
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
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // スタイルオプション
  const [threeViewOptions, setThreeViewOptions] = useState<ThreeViewOptionsType>({
    figurize: false,
  });
  const [acrylicStandOptions, setAcrylicStandOptions] = useState<AcrylicStandOptionsType>({
    hasOutline: true,
  });
  const [lineArtOptions, setLineArtOptions] = useState<LineArtOptionsType>({
    thickness: 'medium',
  });

  // UX状態
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

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

  // 翻訳ハンドラ
  const handleTranslate = useCallback(async () => {
    if (!apiKey || !customPrompt.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: customPrompt, apiKey }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedPrompt(data.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [apiKey, customPrompt]);

  // 生成ハンドラ
  const handleGenerate = useCallback(
    async (count: number) => {
      if (!apiKey) {
        setIsAPIKeyModalOpen(true);
        return;
      }

      // スタイルに応じたオプションを含める
      const styleOptions = {
        threeViewOptions: selectedStyle === 'three-view' ? threeViewOptions : undefined,
        acrylicStandOptions: selectedStyle === 'acrylic-stand' ? acrylicStandOptions : undefined,
        lineArtOptions: selectedStyle === 'line-art' ? lineArtOptions : undefined,
      };

      await generateImages({
        apiKey,
        images: uploadedImages.map((img) => ({
          base64: img.base64,
          mimeType: img.type,
        })),
        style: selectedStyle,
        count,
        customPrompt: selectedStyle === 'free' ? (translatedPrompt || customPrompt) : undefined,
        ...styleOptions,
      });

      // 生成完了時の祝福メッセージ
      setCelebrationMessage('生成完了！');
      setShowCelebration(true);
    },
    [apiKey, uploadedImages, selectedStyle, customPrompt, translatedPrompt, generateImages, threeViewOptions, acrylicStandOptions, lineArtOptions]
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
        // ダウンロード完了の祝福メッセージ
        setCelebrationMessage(`${downloadedIds.length}枚ダウンロード完了！`);
        setShowCelebration(true);
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

              {/* スタイルオプション */}
              <div className="mt-4">
                {selectedStyle === 'three-view' && (
                  <ThreeViewOptions
                    figurize={threeViewOptions.figurize}
                    onFigurizeChange={(figurize) =>
                      setThreeViewOptions({ ...threeViewOptions, figurize })
                    }
                    disabled={isGenerating}
                  />
                )}

                {selectedStyle === 'acrylic-stand' && (
                  <AcrylicStandOptions
                    hasOutline={acrylicStandOptions.hasOutline}
                    onOutlineChange={(hasOutline) =>
                      setAcrylicStandOptions({ ...acrylicStandOptions, hasOutline })
                    }
                    disabled={isGenerating}
                  />
                )}

                {selectedStyle === 'line-art' && (
                  <LineArtOptions
                    thickness={lineArtOptions.thickness}
                    onThicknessChange={(thickness: LineThickness) =>
                      setLineArtOptions({ ...lineArtOptions, thickness })
                    }
                    disabled={isGenerating}
                  />
                )}

                {selectedStyle === 'free' && (
                  <FreeStyleOptions
                    prompt={customPrompt}
                    onPromptChange={setCustomPrompt}
                    translatedPrompt={translatedPrompt}
                    onTranslatedPromptChange={setTranslatedPrompt}
                    onTranslate={handleTranslate}
                    isTranslating={isTranslating}
                    disabled={isGenerating}
                  />
                )}
              </div>
            </section>

            {/* 生成コントロール */}
            <section className="bg-white rounded-lg shadow p-6">
              <GenerationControl
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                progress={progress}
                disabled={!canGenerate}
              />

              {/* 労働の錯覚：進捗メッセージ */}
              <div className="mt-4">
                <ProgressMessage isActive={isGenerating} />
              </div>

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

      {/* ピーク・エンド体験：祝福メッセージ */}
      <div className="fixed bottom-4 right-4 z-50">
        <CelebrationMessage
          isVisible={showCelebration}
          message={celebrationMessage}
          type={celebrationMessage.includes('ダウンロード') ? 'download' : 'success'}
          onDismiss={() => setShowCelebration(false)}
        />
      </div>
    </main>
  );
}
