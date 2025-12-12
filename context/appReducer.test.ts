/**
 * appReducerのテスト
 */

import { appReducer } from './appReducer';
import type { AppState, Tab } from '@/lib/types';
import { INITIAL_APP_STATE } from '@/lib/constants';

describe('appReducer', () => {
  let initialState: AppState;
  let testTab: Tab;

  beforeEach(() => {
    initialState = INITIAL_APP_STATE;
    testTab = {
      id: 'test-tab-2',
      name: 'テストタブ 2',
      uploadedImages: [],
      style: 'figure',
      aspectRatio: 'auto',
      generationCount: 1,
      generatedImages: [],
      isGenerating: false,
    };
  });

  describe('ADD_TAB', () => {
    it('新しいタブを追加する', () => {
      const newState = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      expect(newState.tabs).toHaveLength(2);
      expect(newState.tabs[1]).toEqual(testTab);
    });

    it('既存のタブは変更されない', () => {
      const newState = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      expect(newState.tabs[0]).toEqual(initialState.tabs[0]);
    });
  });

  describe('REMOVE_TAB', () => {
    it('指定されたタブを削除する', () => {
      // まずタブを追加
      const stateWithTwoTabs = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      // タブを削除
      const newState = appReducer(stateWithTwoTabs, {
        type: 'REMOVE_TAB',
        payload: testTab.id,
      });

      expect(newState.tabs).toHaveLength(1);
      expect(newState.tabs.find((t) => t.id === testTab.id)).toBeUndefined();
    });

    it('アクティブタブを削除した場合、最初のタブがアクティブになる', () => {
      // タブを追加してアクティブに
      const stateWithTwoTabs = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });
      const stateWithActiveTab = appReducer(stateWithTwoTabs, {
        type: 'SET_ACTIVE_TAB',
        payload: testTab.id,
      });

      // アクティブタブを削除
      const newState = appReducer(stateWithActiveTab, {
        type: 'REMOVE_TAB',
        payload: testTab.id,
      });

      expect(newState.activeTabId).toBe(initialState.tabs[0].id);
    });

    it('非アクティブタブを削除してもアクティブタブは変わらない', () => {
      const stateWithTwoTabs = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      const newState = appReducer(stateWithTwoTabs, {
        type: 'REMOVE_TAB',
        payload: testTab.id,
      });

      expect(newState.activeTabId).toBe(initialState.activeTabId);
    });
  });

  describe('SET_ACTIVE_TAB', () => {
    it('アクティブタブを変更する', () => {
      const stateWithTwoTabs = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      const newState = appReducer(stateWithTwoTabs, {
        type: 'SET_ACTIVE_TAB',
        payload: testTab.id,
      });

      expect(newState.activeTabId).toBe(testTab.id);
    });
  });

  describe('UPDATE_TAB_IMAGES', () => {
    it('指定されたタブの画像を更新する', () => {
      const images = [
        {
          id: 'img-1',
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          preview: 'data:image/png;base64,test',
        },
      ];

      const newState = appReducer(initialState, {
        type: 'UPDATE_TAB_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images,
        },
      });

      expect(newState.tabs[0].uploadedImages).toEqual(images);
    });

    it('他のタブの画像は変更されない', () => {
      const stateWithTwoTabs = appReducer(initialState, {
        type: 'ADD_TAB',
        payload: testTab,
      });

      const images = [
        {
          id: 'img-1',
          file: new File(['test'], 'test.png', { type: 'image/png' }),
          preview: 'data:image/png;base64,test',
        },
      ];

      const newState = appReducer(stateWithTwoTabs, {
        type: 'UPDATE_TAB_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images,
        },
      });

      expect(newState.tabs[1].uploadedImages).toEqual([]);
    });
  });

  describe('UPDATE_TAB_OPTIONS', () => {
    it('スタイルを更新する', () => {
      const newState = appReducer(initialState, {
        type: 'UPDATE_TAB_OPTIONS',
        payload: {
          tabId: initialState.tabs[0].id,
          style: 'three-view',
        },
      });

      expect(newState.tabs[0].style).toBe('three-view');
    });

    it('アスペクト比を更新する', () => {
      const newState = appReducer(initialState, {
        type: 'UPDATE_TAB_OPTIONS',
        payload: {
          tabId: initialState.tabs[0].id,
          aspectRatio: '16:9',
        },
      });

      expect(newState.tabs[0].aspectRatio).toBe('16:9');
    });

    it('生成枚数を更新する', () => {
      const newState = appReducer(initialState, {
        type: 'UPDATE_TAB_OPTIONS',
        payload: {
          tabId: initialState.tabs[0].id,
          generationCount: 4,
        },
      });

      expect(newState.tabs[0].generationCount).toBe(4);
    });

    it('複数のオプションを同時に更新する', () => {
      const newState = appReducer(initialState, {
        type: 'UPDATE_TAB_OPTIONS',
        payload: {
          tabId: initialState.tabs[0].id,
          style: 'acrylic-stand',
          aspectRatio: '1:1',
          generationCount: 8,
        },
      });

      expect(newState.tabs[0].style).toBe('acrylic-stand');
      expect(newState.tabs[0].aspectRatio).toBe('1:1');
      expect(newState.tabs[0].generationCount).toBe(8);
    });
  });

  describe('ADD_GENERATED_IMAGES', () => {
    it('生成された画像を追加する', () => {
      const generatedImages = [
        {
          id: 'gen-1',
          url: 'data:image/png;base64,generated',
          timestamp: Date.now(),
          isDownloaded: false,
        },
      ];

      const newState = appReducer(initialState, {
        type: 'ADD_GENERATED_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images: generatedImages,
        },
      });

      expect(newState.tabs[0].generatedImages).toEqual(generatedImages);
    });

    it('既存の画像に追加される', () => {
      const firstImages = [
        {
          id: 'gen-1',
          url: 'data:image/png;base64,first',
          timestamp: Date.now(),
          isDownloaded: false,
        },
      ];

      const stateWithFirstImages = appReducer(initialState, {
        type: 'ADD_GENERATED_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images: firstImages,
        },
      });

      const secondImages = [
        {
          id: 'gen-2',
          url: 'data:image/png;base64,second',
          timestamp: Date.now(),
          isDownloaded: false,
        },
      ];

      const newState = appReducer(stateWithFirstImages, {
        type: 'ADD_GENERATED_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images: secondImages,
        },
      });

      expect(newState.tabs[0].generatedImages).toHaveLength(2);
      expect(newState.tabs[0].generatedImages).toEqual([
        ...firstImages,
        ...secondImages,
      ]);
    });
  });

  describe('START_GENERATION', () => {
    it('生成中フラグを立てる', () => {
      const newState = appReducer(initialState, {
        type: 'START_GENERATION',
        payload: initialState.tabs[0].id,
      });

      expect(newState.tabs[0].isGenerating).toBe(true);
    });
  });

  describe('END_GENERATION', () => {
    it('生成中フラグを下ろす', () => {
      const stateGenerating = appReducer(initialState, {
        type: 'START_GENERATION',
        payload: initialState.tabs[0].id,
      });

      const newState = appReducer(stateGenerating, {
        type: 'END_GENERATION',
        payload: initialState.tabs[0].id,
      });

      expect(newState.tabs[0].isGenerating).toBe(false);
    });
  });

  describe('MARK_AS_DOWNLOADED', () => {
    it('画像をダウンロード済みにマークする', () => {
      const generatedImages = [
        {
          id: 'gen-1',
          url: 'data:image/png;base64,generated',
          timestamp: Date.now(),
          isDownloaded: false,
        },
      ];

      const stateWithImages = appReducer(initialState, {
        type: 'ADD_GENERATED_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images: generatedImages,
        },
      });

      const newState = appReducer(stateWithImages, {
        type: 'MARK_AS_DOWNLOADED',
        payload: {
          tabId: initialState.tabs[0].id,
          imageId: 'gen-1',
        },
      });

      expect(newState.tabs[0].generatedImages[0].isDownloaded).toBe(true);
    });

    it('他の画像は影響を受けない', () => {
      const generatedImages = [
        {
          id: 'gen-1',
          url: 'data:image/png;base64,first',
          timestamp: Date.now(),
          isDownloaded: false,
        },
        {
          id: 'gen-2',
          url: 'data:image/png;base64,second',
          timestamp: Date.now(),
          isDownloaded: false,
        },
      ];

      const stateWithImages = appReducer(initialState, {
        type: 'ADD_GENERATED_IMAGES',
        payload: {
          tabId: initialState.tabs[0].id,
          images: generatedImages,
        },
      });

      const newState = appReducer(stateWithImages, {
        type: 'MARK_AS_DOWNLOADED',
        payload: {
          tabId: initialState.tabs[0].id,
          imageId: 'gen-1',
        },
      });

      expect(newState.tabs[0].generatedImages[0].isDownloaded).toBe(true);
      expect(newState.tabs[0].generatedImages[1].isDownloaded).toBe(false);
    });
  });

  describe('不明なアクション', () => {
    it('状態を変更しない', () => {
      const newState = appReducer(initialState, {
        type: 'UNKNOWN_ACTION' as any,
      });

      expect(newState).toEqual(initialState);
    });
  });
});
