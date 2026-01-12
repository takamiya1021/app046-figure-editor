/**
 * APIキー管理用カスタムフック
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { storage } from '@/lib/storage';

/**
 * useAPIKeyの戻り値の型
 */
interface UseAPIKeyReturn {
  apiKey: string | null;
  isLoaded: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

/**
 * APIキー管理機能を提供するカスタムフック
 * - ローカルストレージとの同期
 * - マウント時の自動ロード
 */
export function useAPIKey(): UseAPIKeyReturn {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * マウント時にストレージからAPIキーを読み込む
   */
  useEffect(() => {
    const storedKey = storage.getApiKey();
    if (storedKey) {
      setApiKeyState(storedKey);
    }
    setIsLoaded(true);
  }, []);

  /**
   * APIキーを設定し、ストレージに保存する
   * @param key - 設定するAPIキー
   */
  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    storage.saveApiKey(key);
  }, []);

  /**
   * APIキーをクリアし、ストレージから削除する
   */
  const clearApiKey = useCallback(() => {
    setApiKeyState(null);
    storage.removeApiKey();
  }, []);

  return useMemo(
    () => ({
      apiKey,
      isLoaded,
      setApiKey,
      clearApiKey,
    }),
    [apiKey, isLoaded, setApiKey, clearApiKey]
  );
}
