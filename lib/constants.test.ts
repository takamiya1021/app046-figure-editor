/**
 * 定数定義のテスト
 */

import {
  DEFAULT_TAB,
  INITIAL_APP_STATE,
  MAX_UPLOAD_IMAGES,
  MAX_GENERATION_COUNT,
  MIN_GENERATION_COUNT,
} from './constants';

describe('定数定義テスト', () => {
  describe('DEFAULT_TAB', () => {
    it('正しいデフォルト値を持つ', () => {
      expect(DEFAULT_TAB.name).toBe('タブ 1');
      expect(DEFAULT_TAB.uploadedImages).toEqual([]);
      expect(DEFAULT_TAB.style).toBe('figure');
      expect(DEFAULT_TAB.aspectRatio).toBe('auto');
      expect(DEFAULT_TAB.generationCount).toBe(1);
      expect(DEFAULT_TAB.generatedImages).toEqual([]);
      expect(DEFAULT_TAB.isGenerating).toBe(false);
    });
  });

  describe('INITIAL_APP_STATE', () => {
    it('初期タブを1つ持つ', () => {
      expect(INITIAL_APP_STATE.tabs).toHaveLength(1);
      expect(INITIAL_APP_STATE.tabs[0].name).toBe('タブ 1');
    });

    it('最初のタブがアクティブ', () => {
      expect(INITIAL_APP_STATE.activeTabId).toBe(
        INITIAL_APP_STATE.tabs[0].id
      );
    });
  });

  describe('画像関連定数', () => {
    it('最大アップロード枚数が正しい', () => {
      expect(MAX_UPLOAD_IMAGES).toBe(3);
    });

    it('最大生成枚数が正しい', () => {
      expect(MAX_GENERATION_COUNT).toBe(8);
    });

    it('最小生成枚数が正しい', () => {
      expect(MIN_GENERATION_COUNT).toBe(1);
    });
  });
});
