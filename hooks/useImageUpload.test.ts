/**
 * useImageUploadフックのテスト
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageUpload } from './useImageUpload';

// fileToBase64をモック
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  fileToBase64: jest.fn().mockResolvedValue('data:image/png;base64,mockBase64'),
  isImageFile: jest.fn((file: File) => file.type.startsWith('image/')),
  generateId: jest.fn(() => 'mock-id-' + Math.random()),
}));

describe('useImageUpload', () => {
  const createMockFile = (name: string, type = 'image/png', size = 1024): File => {
    const blob = new Blob([''], { type });
    return new File([blob], name, { type });
  };

  describe('初期状態', () => {
    it('画像が空の配列', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.images).toEqual([]);
    });

    it('エラーがnull', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.error).toBeNull();
    });

    it('isLoadingがfalse', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.isLoading).toBe(false);
    });

    it('canAddMoreがtrue', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.canAddMore).toBe(true);
    });
  });

  describe('addImages', () => {
    it('画像を追加できる', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createMockFile('test.png');

      await act(async () => {
        await result.current.addImages([file]);
      });

      await waitFor(() => {
        expect(result.current.images).toHaveLength(1);
      });
    });

    it('画像以外のファイルはエラーになる', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createMockFile('test.txt', 'text/plain');

      await act(async () => {
        await result.current.addImages([file]);
      });

      expect(result.current.error).toContain('画像ファイル');
      expect(result.current.images).toHaveLength(0);
    });

    it('最大枚数を超えるとエラーになる', async () => {
      const { result } = renderHook(() => useImageUpload({ maxImages: 1 }));

      await act(async () => {
        await result.current.addImages([createMockFile('1.png')]);
      });

      await act(async () => {
        await result.current.addImages([createMockFile('2.png')]);
      });

      expect(result.current.error).toContain('最大');
      expect(result.current.images).toHaveLength(1);
    });
  });

  describe('removeImage', () => {
    it('画像を削除できる', async () => {
      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.addImages([createMockFile('test.png')]);
      });

      await waitFor(() => {
        expect(result.current.images).toHaveLength(1);
      });

      const imageId = result.current.images[0].id;

      act(() => {
        result.current.removeImage(imageId);
      });

      expect(result.current.images).toHaveLength(0);
    });
  });

  describe('clearImages', () => {
    it('すべての画像をクリアできる', async () => {
      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.addImages([createMockFile('test.png')]);
      });

      await waitFor(() => {
        expect(result.current.images).toHaveLength(1);
      });

      act(() => {
        result.current.clearImages();
      });

      expect(result.current.images).toHaveLength(0);
    });
  });

  describe('clearError', () => {
    it('エラーをクリアできる', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createMockFile('test.txt', 'text/plain');

      await act(async () => {
        await result.current.addImages([file]);
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
