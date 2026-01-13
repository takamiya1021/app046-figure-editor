/**
 * useImageGenerationフックのテスト
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageGeneration } from './useImageGeneration';

// fetchをモック
global.fetch = jest.fn();

describe('useImageGeneration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期状態', () => {
    it('isGeneratingがfalse', () => {
      const { result } = renderHook(() => useImageGeneration());
      expect(result.current.isGenerating).toBe(false);
    });

    it('generatedImagesが空の配列', () => {
      const { result } = renderHook(() => useImageGeneration());
      expect(result.current.generatedImages).toEqual([]);
    });

    it('errorがnull', () => {
      const { result } = renderHook(() => useImageGeneration());
      expect(result.current.error).toBeNull();
    });
  });

  describe('generateImages', () => {
    it('APIキーがない場合はエラーになる', async () => {
      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: '',
          images: [{ base64: 'data:image/png;base64,test', mimeType: 'image/png' }],
          style: 'figure',
          count: 1,
        });
      });

      expect(result.current.error).toContain('APIキー');
    });

    it('画像がない場合はエラーになる', async () => {
      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: 'test-api-key',
          images: [],
          style: 'figure',
          count: 1,
        });
      });

      expect(result.current.error).toContain('画像');
    });

    it('成功時に生成された画像が追加される', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          imageBase64: 'generatedImageBase64',
        }),
      });

      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: 'test-api-key',
          images: [{ base64: 'data:image/png;base64,test', mimeType: 'image/png' }],
          style: 'figure',
          count: 1,
        });
      });

      await waitFor(() => {
        expect(result.current.generatedImages).toHaveLength(1);
      });
    });

    it('API失敗時にエラーが設定される', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({
          success: false,
          error: 'APIエラー',
        }),
      });

      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: 'test-api-key',
          images: [{ base64: 'data:image/png;base64,test', mimeType: 'image/png' }],
          style: 'figure',
          count: 1,
        });
      });

      expect(result.current.error).toContain('APIエラー');
    });
  });

  describe('clearGeneratedImages', () => {
    it('生成された画像をクリアできる', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          imageBase64: 'generatedImageBase64',
        }),
      });

      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: 'test-api-key',
          images: [{ base64: 'data:image/png;base64,test', mimeType: 'image/png' }],
          style: 'figure',
          count: 1,
        });
      });

      await waitFor(() => {
        expect(result.current.generatedImages).toHaveLength(1);
      });

      act(() => {
        result.current.clearGeneratedImages();
      });

      expect(result.current.generatedImages).toHaveLength(0);
    });
  });

  describe('clearError', () => {
    it('エラーをクリアできる', async () => {
      const { result } = renderHook(() => useImageGeneration());

      await act(async () => {
        await result.current.generateImages({
          apiKey: '',
          images: [],
          style: 'figure',
          count: 1,
        });
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
