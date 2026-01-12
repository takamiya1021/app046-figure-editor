/**
 * ストレージユーティリティのテスト
 */

import { storage } from './storage';

describe('ストレージユーティリティテスト', () => {
  // 各テストの前にlocalStorageをクリア
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveApiKey', () => {
    it('APIキーをlocalStorageに保存する', () => {
      const testApiKey = 'test-api-key-12345';
      storage.saveApiKey(testApiKey);
      expect(localStorage.getItem('figure_api_key')).toBe(testApiKey);
    });

    it('既存のAPIキーを上書きする', () => {
      storage.saveApiKey('old-key');
      storage.saveApiKey('new-key');
      expect(localStorage.getItem('figure_api_key')).toBe('new-key');
    });

    it('空文字列も保存できる', () => {
      storage.saveApiKey('');
      expect(localStorage.getItem('figure_api_key')).toBe('');
    });

    it('特殊文字を含むAPIキーを保存できる', () => {
      const specialKey = 'key-with-special-chars!@#$%^&*()';
      storage.saveApiKey(specialKey);
      expect(localStorage.getItem('figure_api_key')).toBe(specialKey);
    });
  });

  describe('getApiKey', () => {
    it('保存されたAPIキーを取得する', () => {
      localStorage.setItem('figure_api_key', 'stored-api-key');
      expect(storage.getApiKey()).toBe('stored-api-key');
    });

    it('APIキーが存在しない場合はnullを返す', () => {
      expect(storage.getApiKey()).toBeNull();
    });

    it('空文字列が保存されている場合は空文字列を返す', () => {
      localStorage.setItem('figure_api_key', '');
      expect(storage.getApiKey()).toBe('');
    });
  });

  describe('removeApiKey', () => {
    it('保存されたAPIキーを削除する', () => {
      localStorage.setItem('figure_api_key', 'key-to-remove');
      storage.removeApiKey();
      expect(localStorage.getItem('figure_api_key')).toBeNull();
    });

    it('APIキーが存在しない場合でもエラーにならない', () => {
      expect(() => storage.removeApiKey()).not.toThrow();
    });

    it('他のlocalStorageアイテムに影響しない', () => {
      localStorage.setItem('figure_api_key', 'key-to-remove');
      localStorage.setItem('other_key', 'other-value');
      storage.removeApiKey();
      expect(localStorage.getItem('other_key')).toBe('other-value');
    });
  });

  describe('hasApiKey', () => {
    it('APIキーが存在する場合はtrueを返す', () => {
      localStorage.setItem('figure_api_key', 'existing-key');
      expect(storage.hasApiKey()).toBe(true);
    });

    it('APIキーが存在しない場合はfalseを返す', () => {
      expect(storage.hasApiKey()).toBe(false);
    });

    it('APIキーが空文字列の場合はfalseを返す', () => {
      localStorage.setItem('figure_api_key', '');
      expect(storage.hasApiKey()).toBe(false);
    });
  });

  describe('統合テスト', () => {
    it('保存→取得→削除のワークフローが正常に動作する', () => {
      // 初期状態: APIキーなし
      expect(storage.hasApiKey()).toBe(false);
      expect(storage.getApiKey()).toBeNull();

      // 保存
      storage.saveApiKey('workflow-test-key');
      expect(storage.hasApiKey()).toBe(true);
      expect(storage.getApiKey()).toBe('workflow-test-key');

      // 削除
      storage.removeApiKey();
      expect(storage.hasApiKey()).toBe(false);
      expect(storage.getApiKey()).toBeNull();
    });

    it('複数回の保存と取得が正常に動作する', () => {
      const keys = ['key1', 'key2', 'key3'];
      for (const key of keys) {
        storage.saveApiKey(key);
        expect(storage.getApiKey()).toBe(key);
      }
    });
  });
});
