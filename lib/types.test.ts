/**
 * 型定義のテスト
 * TypeScriptの型が正しく定義されているかを確認
 */

import type {
  GenerationStyle,
  AspectRatio,
  Tab,
  GeneratedImage,
  PackagePosition,
  DisplayStandShape,
  DisplayStandMaterial,
  BackgroundType,
  AppState,
} from './types';

describe('型定義テスト', () => {
  describe('GenerationStyle', () => {
    it('有効な値を受け入れる', () => {
      const validStyles: GenerationStyle[] = [
        'figure',
        'three-view',
        'acrylic-stand',
        'line-art',
        'free',
      ];
      expect(validStyles).toHaveLength(5);
    });
  });

  describe('AspectRatio', () => {
    it('有効な値を受け入れる', () => {
      const validRatios: AspectRatio[] = [
        'auto',
        '1:1',
        '3:4',
        '4:3',
        '9:16',
        '16:9',
      ];
      expect(validRatios).toHaveLength(6);
    });
  });

  describe('Tab', () => {
    it('正しい構造を持つ', () => {
      const tab: Tab = {
        id: 'test-1',
        name: 'テストタブ',
        uploadedImages: [],
        style: 'figure',
        aspectRatio: 'auto',
        generationCount: 1,
        generatedImages: [],
        isGenerating: false,
      };
      expect(tab.id).toBe('test-1');
      expect(tab.uploadedImages).toEqual([]);
      expect(tab.generatedImages).toEqual([]);
    });
  });

  describe('GeneratedImage', () => {
    it('正しい構造を持つ', () => {
      const image: GeneratedImage = {
        id: 'img-1',
        url: 'data:image/png;base64,test',
        timestamp: Date.now(),
        isDownloaded: false,
      };
      expect(image.id).toBe('img-1');
      expect(image.isDownloaded).toBe(false);
    });
  });

  describe('AppState', () => {
    it('正しい構造を持つ', () => {
      const state: AppState = {
        tabs: [],
        activeTabId: '',
      };
      expect(state.tabs).toEqual([]);
      expect(state.activeTabId).toBe('');
    });
  });
});
