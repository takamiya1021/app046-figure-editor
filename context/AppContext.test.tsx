/**
 * AppContextのテスト
 */

import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';
import type { ReactNode } from 'react';

// テスト用のWrapper
const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  describe('初期状態', () => {
    it('初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.state.tabs).toHaveLength(1);
      expect(result.current.state.tabs[0].name).toBe('タブ 1');
      expect(result.current.state.activeTabId).toBe(
        result.current.state.tabs[0].id
      );
    });
  });

  describe('dispatch関数', () => {
    it('dispatchが提供される', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.dispatch).toBeDefined();
      expect(typeof result.current.dispatch).toBe('function');
    });

    it('ADD_TABアクションが動作する', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      const newTab = {
        id: 'test-tab-2',
        name: 'テストタブ 2',
        uploadedImages: [],
        style: 'figure' as const,
        aspectRatio: 'auto' as const,
        generationCount: 1,
        generatedImages: [],
        isGenerating: false,
      };

      act(() => {
        result.current.dispatch({ type: 'ADD_TAB', payload: newTab });
      });

      expect(result.current.state.tabs).toHaveLength(2);
      expect(result.current.state.tabs[1]).toEqual(newTab);
    });

    it('SET_ACTIVE_TABアクションが動作する', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      const firstTabId = result.current.state.tabs[0].id;

      // 新しいタブを追加
      const newTab = {
        id: 'test-tab-2',
        name: 'テストタブ 2',
        uploadedImages: [],
        style: 'figure' as const,
        aspectRatio: 'auto' as const,
        generationCount: 1,
        generatedImages: [],
        isGenerating: false,
      };

      act(() => {
        result.current.dispatch({ type: 'ADD_TAB', payload: newTab });
      });

      // アクティブタブを変更
      act(() => {
        result.current.dispatch({
          type: 'SET_ACTIVE_TAB',
          payload: newTab.id,
        });
      });

      expect(result.current.state.activeTabId).toBe(newTab.id);

      // 元のタブに戻す
      act(() => {
        result.current.dispatch({
          type: 'SET_ACTIVE_TAB',
          payload: firstTabId,
        });
      });

      expect(result.current.state.activeTabId).toBe(firstTabId);
    });
  });

  describe('エラーハンドリング', () => {
    it('Provider外でuseAppContextを使用するとエラーになる', () => {
      // コンソールエラーを抑制
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAppContext());
      }).toThrow('useAppContext must be used within AppProvider');

      consoleSpy.mockRestore();
    });
  });
});
