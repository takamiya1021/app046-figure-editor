// APIキー管理用ストレージユーティリティ

const API_KEY_STORAGE_KEY = 'figure_api_key';

/**
 * ストレージ操作が可能かチェック
 * SSR環境やプライベートブラウジングでの制限に対応
 */
const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const storage = {
  /**
   * APIキーを保存
   * ストレージが利用不可の場合やエラー時は静かに失敗
   */
  saveApiKey: (apiKey: string): void => {
    if (!isStorageAvailable()) {
      return;
    }
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } catch (err) {
      // QuotaExceededError等のエラーを静かに処理
      // プロダクション環境ではログ出力しない
      if (process.env.NODE_ENV === 'development') {
        const message =
          err instanceof Error ? err.message : '不明なエラーが発生しました';
        console.warn('ストレージへの保存に失敗しました:', message);
      }
    }
  },

  /**
   * APIキーを取得
   * ストレージが利用不可の場合やエラー時はnullを返す
   */
  getApiKey: (): string | null => {
    if (!isStorageAvailable()) {
      return null;
    }
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (err) {
      // SecurityError等のエラーを静かに処理
      if (process.env.NODE_ENV === 'development') {
        const message =
          err instanceof Error ? err.message : '不明なエラーが発生しました';
        console.warn('ストレージからの取得に失敗しました:', message);
      }
      return null;
    }
  },

  /**
   * APIキーを削除
   * ストレージが利用不可の場合やエラー時は静かに失敗
   */
  removeApiKey: (): void => {
    if (!isStorageAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (err) {
      // SecurityError等のエラーを静かに処理
      if (process.env.NODE_ENV === 'development') {
        const message =
          err instanceof Error ? err.message : '不明なエラーが発生しました';
        console.warn('ストレージからの削除に失敗しました:', message);
      }
    }
  },

  /**
   * APIキーが存在するか確認
   * 空文字列の場合はfalseを返す
   */
  hasApiKey: (): boolean => {
    const key = storage.getApiKey();
    return key !== null && key !== '';
  },
};
