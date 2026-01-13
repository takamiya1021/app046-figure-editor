/**
 * APIキー管理用カスタムフック
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { storage } from '@/lib/storage';

/**
 * APIキーの最小長
 */
const MIN_API_KEY_LENGTH = 10;

/**
 * APIキー管理機能を提供するカスタムフック
 */
export function useAPIKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期読み込み
  useEffect(() => {
    const savedKey = storage.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
    setIsLoaded(true);
  }, []);

  /**
   * APIキーを保存する
   */
  const saveApiKey = useCallback((key: string) => {
    storage.saveApiKey(key);
    setApiKey(key);
  }, []);

  /**
   * APIキーを削除する
   */
  const removeApiKey = useCallback(() => {
    storage.removeApiKey();
    setApiKey('');
  }, []);

  /**
   * APIキーのバリデーション
   */
  const validateApiKey = useCallback((key: string): boolean => {
    if (!key || key.trim().length === 0) {
      return false;
    }
    if (key.length < MIN_API_KEY_LENGTH) {
      return false;
    }
    return true;
  }, []);

  return {
    /** 現在のAPIキー */
    apiKey,
    /** APIキーが存在するか */
    hasApiKey: apiKey.length > 0,
    /** 初期読み込みが完了したか */
    isLoaded,
    /** APIキーを保存 */
    saveApiKey,
    /** APIキーを削除 */
    removeApiKey,
    /** APIキーのバリデーション */
    validateApiKey,
  };
}
