/**
 * Storageユーティリティのテスト
 */

import { storage, downloadedImagesDB } from './storage';

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('saveApiKey', () => {
    it('APIキーを保存する', () => {
      storage.saveApiKey('test-api-key');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'figure_api_key',
        'test-api-key'
      );
    });
  });

  describe('getApiKey', () => {
    it('保存されたAPIキーを取得する', () => {
      storage.saveApiKey('my-api-key');
      const result = storage.getApiKey();
      expect(result).toBe('my-api-key');
    });

    it('APIキーが存在しない場合はnullを返す', () => {
      const result = storage.getApiKey();
      expect(result).toBeNull();
    });
  });

  describe('removeApiKey', () => {
    it('APIキーを削除する', () => {
      storage.saveApiKey('to-be-deleted');
      storage.removeApiKey();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('figure_api_key');
    });
  });

  describe('hasApiKey', () => {
    it('APIキーが存在する場合はtrueを返す', () => {
      storage.saveApiKey('existing-key');
      expect(storage.hasApiKey()).toBe(true);
    });

    it('APIキーが存在しない場合はfalseを返す', () => {
      expect(storage.hasApiKey()).toBe(false);
    });
  });
});

// IndexedDBのモック
const mockIndexedDB = (() => {
  let store: Record<string, unknown> = {};

  const createRequest = <T>(result: T, operation?: () => void) => {
    const request = {
      result,
      onsuccess: null as ((event: Event) => void) | null,
      onerror: null as ((event: Event) => void) | null,
    };
    // 次のマイクロタスクでコールバックを呼ぶ
    Promise.resolve().then(() => {
      operation?.();
      request.onsuccess?.({ target: request } as unknown as Event);
    });
    return request;
  };

  const mockObjectStore = {
    put: jest.fn((value: { id: string; downloadedAt: string }) => {
      return createRequest(undefined, () => {
        store[value.id] = value;
      });
    }),
    get: jest.fn((key: string) => {
      return createRequest(store[key] || undefined);
    }),
    getAll: jest.fn(() => {
      return createRequest(Object.values(store));
    }),
    delete: jest.fn((key: string) => {
      return createRequest(undefined, () => {
        delete store[key];
      });
    }),
    clear: jest.fn(() => {
      return createRequest(undefined, () => {
        store = {};
      });
    }),
  };

  const mockTransaction = {
    objectStore: jest.fn(() => mockObjectStore),
  };

  const mockDB = {
    transaction: jest.fn(() => mockTransaction),
    close: jest.fn(),
    objectStoreNames: {
      contains: jest.fn(() => true),
    },
  };

  return {
    open: jest.fn(() => {
      const request = {
        result: mockDB,
        onsuccess: null as ((event: Event) => void) | null,
        onerror: null as ((event: Event) => void) | null,
        onupgradeneeded: null as ((event: Event) => void) | null,
      };
      Promise.resolve().then(() => {
        request.onsuccess?.({ target: request } as unknown as Event);
      });
      return request;
    }),
    clearStore: () => { store = {}; },
    getStore: () => store,
  };
})();

// IndexedDBをグローバルにモック
Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
});

describe('downloadedImagesDB', () => {
  beforeEach(() => {
    mockIndexedDB.clearStore();
    jest.clearAllMocks();
  });

  describe('markAsDownloaded', () => {
    it('画像をダウンロード済みとしてマークする', async () => {
      await downloadedImagesDB.markAsDownloaded('image-123');
      const store = mockIndexedDB.getStore();
      expect(store['image-123']).toBeDefined();
    });
  });

  describe('isDownloaded', () => {
    it('ダウンロード済みの画像はtrueを返す', async () => {
      await downloadedImagesDB.markAsDownloaded('image-456');
      const result = await downloadedImagesDB.isDownloaded('image-456');
      expect(result).toBe(true);
    });

    it('ダウンロードしていない画像はfalseを返す', async () => {
      const result = await downloadedImagesDB.isDownloaded('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getDownloadedImageIds', () => {
    it('ダウンロード済み画像のIDリストを取得する', async () => {
      await downloadedImagesDB.markAsDownloaded('img-1');
      await downloadedImagesDB.markAsDownloaded('img-2');
      const ids = await downloadedImagesDB.getDownloadedImageIds();
      expect(ids).toContain('img-1');
      expect(ids).toContain('img-2');
    });

    it('ダウンロード済み画像がない場合は空配列を返す', async () => {
      const ids = await downloadedImagesDB.getDownloadedImageIds();
      expect(ids).toEqual([]);
    });
  });

  describe('clearDownloadHistory', () => {
    it('ダウンロード履歴をクリアする', async () => {
      await downloadedImagesDB.markAsDownloaded('img-to-clear');
      await downloadedImagesDB.clearDownloadHistory();
      const store = mockIndexedDB.getStore();
      expect(Object.keys(store).length).toBe(0);
    });
  });
});
