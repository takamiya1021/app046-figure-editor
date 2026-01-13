/**
 * useAPIKeyフックのテスト
 */

import { renderHook, act } from '@testing-library/react';
import { useAPIKey } from './useAPIKey';
import { storage } from '@/lib/storage';

// storageをモック
jest.mock('@/lib/storage', () => ({
  storage: {
    getApiKey: jest.fn(),
    saveApiKey: jest.fn(),
    removeApiKey: jest.fn(),
    hasApiKey: jest.fn(),
  },
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('useAPIKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期化', () => {
    it('保存されたAPIキーを読み込む', () => {
      mockedStorage.getApiKey.mockReturnValue('saved-api-key');

      const { result } = renderHook(() => useAPIKey());

      expect(result.current.apiKey).toBe('saved-api-key');
      expect(result.current.hasApiKey).toBe(true);
    });

    it('APIキーがない場合は空文字', () => {
      mockedStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      expect(result.current.apiKey).toBe('');
      expect(result.current.hasApiKey).toBe(false);
    });
  });

  describe('saveApiKey', () => {
    it('APIキーを保存する', () => {
      mockedStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.saveApiKey('new-api-key');
      });

      expect(mockedStorage.saveApiKey).toHaveBeenCalledWith('new-api-key');
      expect(result.current.apiKey).toBe('new-api-key');
      expect(result.current.hasApiKey).toBe(true);
    });
  });

  describe('removeApiKey', () => {
    it('APIキーを削除する', () => {
      mockedStorage.getApiKey.mockReturnValue('existing-key');

      const { result } = renderHook(() => useAPIKey());

      act(() => {
        result.current.removeApiKey();
      });

      expect(mockedStorage.removeApiKey).toHaveBeenCalled();
      expect(result.current.apiKey).toBe('');
      expect(result.current.hasApiKey).toBe(false);
    });
  });

  describe('validateApiKey', () => {
    it('有効なAPIキーはtrueを返す', () => {
      mockedStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      expect(result.current.validateApiKey('AIzaSyTest123')).toBe(true);
    });

    it('空文字はfalseを返す', () => {
      mockedStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      expect(result.current.validateApiKey('')).toBe(false);
    });

    it('短すぎるキーはfalseを返す', () => {
      mockedStorage.getApiKey.mockReturnValue(null);

      const { result } = renderHook(() => useAPIKey());

      expect(result.current.validateApiKey('short')).toBe(false);
    });
  });
});
