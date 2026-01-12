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
