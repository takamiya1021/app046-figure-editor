/**
 * useDownloadフックのテスト
 */

import { renderHook, act } from '@testing-library/react';
import { useDownload } from './useDownload';
import type { GeneratedImage } from '@/lib/types';

describe('useDownload', () => {
  const mockImages: GeneratedImage[] = [
    {
      id: 'img-1',
      base64: 'data:image/png;base64,mockData1',
      createdAt: '2024-01-01T00:00:00.000Z',
      isDownloaded: false,
      isSelected: false,
    },
    {
      id: 'img-2',
      base64: 'data:image/png;base64,mockData2',
      createdAt: '2024-01-01T00:01:00.000Z',
      isDownloaded: false,
      isSelected: true,
    },
  ];

  // HTMLAnchorElementのモック
  let mockClick: jest.Mock;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    mockClick = jest.fn();
    originalCreateElement = document.createElement.bind(document);

    // createElementをモック（'a'タグのみ）
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        const mockAnchor = originalCreateElement('a');
        mockAnchor.click = mockClick;
        return mockAnchor;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  describe('初期状態', () => {
    it('isDownloadingがfalse', () => {
      const { result } = renderHook(() => useDownload());
      expect(result.current.isDownloading).toBe(false);
    });
  });

  describe('downloadIndividual', () => {
    it('単一画像をダウンロードできる', async () => {
      const { result } = renderHook(() => useDownload());

      await act(async () => {
        await result.current.downloadIndividual(mockImages[0]);
      });

      expect(mockClick).toHaveBeenCalled();
    });

    it('ダウンロードしたIDの配列を返す', async () => {
      const { result } = renderHook(() => useDownload());

      let downloadedIds: string[] = [];
      await act(async () => {
        downloadedIds = await result.current.downloadIndividual(mockImages[0]);
      });

      expect(downloadedIds).toEqual(['img-1']);
    });
  });

  describe('downloadSelected', () => {
    it('選択された画像をダウンロードできる', async () => {
      const { result } = renderHook(() => useDownload());

      await act(async () => {
        await result.current.downloadSelected(mockImages);
      });

      // 選択された画像（img-2）のみダウンロード
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('選択された画像がない場合は何もしない', async () => {
      const unselectedImages = mockImages.map((img) => ({
        ...img,
        isSelected: false,
      }));
      const { result } = renderHook(() => useDownload());

      await act(async () => {
        await result.current.downloadSelected(unselectedImages);
      });

      expect(mockClick).not.toHaveBeenCalled();
    });

    it('ダウンロードしたIDの配列を返す', async () => {
      const { result } = renderHook(() => useDownload());

      let downloadedIds: string[] = [];
      await act(async () => {
        downloadedIds = await result.current.downloadSelected(mockImages);
      });

      expect(downloadedIds).toEqual(['img-2']);
    });
  });

  describe('downloadAll', () => {
    it('全画像をダウンロードできる', async () => {
      const { result } = renderHook(() => useDownload());

      await act(async () => {
        await result.current.downloadAll(mockImages);
      });

      expect(mockClick).toHaveBeenCalledTimes(2);
    });

    it('ダウンロードしたIDの配列を返す', async () => {
      const { result } = renderHook(() => useDownload());

      let downloadedIds: string[] = [];
      await act(async () => {
        downloadedIds = await result.current.downloadAll(mockImages);
      });

      expect(downloadedIds).toEqual(['img-1', 'img-2']);
    });
  });
});
