/**
 * useAPIKeyのテスト
 * APIキー管理フックのテスト
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAPIKey } from './useAPIKey';
import { storage } from '@/lib/storage';

// storageモジュールをモック
jest.mock('@/lib/storage', () => ({
  storage: {
    saveApiKey: jest.fn(),
    getApiKey: jest.fn(),
    removeApiKey: jest.fn(),
    hasApiKey: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('useAPIKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getApiKey.mockReturnValue(null);
  });

  describe('初期状態', () => {
    it('apiKeyがnullで初期化される', () => {
      const { result } = renderHook(() => useAPIKey());

      expect(result.current.apiKey).toBeNull();
    });

    it('isLoadedが最終的にtrueになる', async () => {
      const { result } = renderHook(() => useAPIKey());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });
    });
  });

  describe('setApiKey', () => {
    it('APIキーを設定できる', () => {
      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.setApiKey('test-api-key');
      });

      expect(result.current.apiKey).toBe('test-api-key');
    });

    it('ストレージにAPIキーを保存する', () => {
      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.setApiKey('test-api-key');
      });

      expect(mockStorage.saveApiKey).toHaveBeenCalledWith('test-api-key');
    });
  });

  describe('clearApiKey', () => {
    it('APIキーをクリアできる', () => {
      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.setApiKey('test-api-key');
      });

      act(() => {
        result.current.clearApiKey();
      });

      expect(result.current.apiKey).toBeNull();
    });

    it('ストレージからAPIキーを削除する', () => {
      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.clearApiKey();
      });

      expect(mockStorage.removeApiKey).toHaveBeenCalled();
    });
  });

  describe('自動ロード', () => {
    it('マウント時にストレージからAPIキーを読み込む', async () => {
      mockStorage.getApiKey.mockReturnValue('stored-api-key');

      const { result } = renderHook(() => useAPIKey());

      await waitFor(() => {
        expect(result.current.apiKey).toBe('stored-api-key');
      });
    });

    it('ストレージにキーがない場合はnullのまま', async () => {
      mockStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      expect(result.current.apiKey).toBeNull();
    });
  });
});
