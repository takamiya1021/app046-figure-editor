// APIキー管理用ストレージユーティリティ

const API_KEY_STORAGE_KEY = 'figure_api_key';

export const storage = {
  // APIキーを保存
  saveApiKey: (apiKey: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    }
  },

  // APIキーを取得
  getApiKey: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    }
    return null;
  },

  // APIキーを削除
  removeApiKey: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  },

  // APIキーが存在するか確認
  hasApiKey: (): boolean => {
    return !!storage.getApiKey();
  },
};

// ダウンロード済み画像管理用IndexedDB

const DB_NAME = 'FigureEditorDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloadedImages';

interface DownloadedImage {
  id: string;
  downloadedAt: string;
}

// データベース接続を取得
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const downloadedImagesDB = {
  // 画像をダウンロード済みとしてマーク
  markAsDownloaded: async (imageId: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const record: DownloadedImage = {
        id: imageId,
        downloadedAt: new Date().toISOString(),
      };
      const request = store.put(record);
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  },

  // 画像がダウンロード済みか確認
  isDownloaded: async (imageId: string): Promise<boolean> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(imageId);
      request.onsuccess = () => {
        db.close();
        resolve(!!request.result);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  },

  // ダウンロード済み画像のIDリストを取得
  getDownloadedImageIds: async (): Promise<string[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        db.close();
        const records = request.result as DownloadedImage[];
        resolve(records.map((r) => r.id));
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  },

  // ダウンロード履歴をクリア
  clearDownloadHistory: async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  },
};
