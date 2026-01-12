/**
 * useTabManagerのテスト
 */

import { renderHook, act } from '@testing-library/react';
import { useTabManager } from './useTabManager';
import { AppProvider } from '@/context/AppContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('useTabManager', () => {
  describe('addTab', () => {
    it('新しいタブを追加する', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      const initialTabCount = result.current.tabs.length;

      act(() => {
        result.current.addTab();
      });

      expect(result.current.tabs).toHaveLength(initialTabCount + 1);
      expect(result.current.tabs[initialTabCount].name).toBe(
        `タブ ${initialTabCount + 1}`
      );
    });

    it('追加したタブがアクティブになる', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      act(() => {
        result.current.addTab();
      });

      const lastTab = result.current.tabs[result.current.tabs.length - 1];
      expect(result.current.activeTabId).toBe(lastTab.id);
    });
  });

  describe('removeTab', () => {
    it('指定されたタブを削除する', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      // タブを追加
      act(() => {
        result.current.addTab();
      });

      const tabCount = result.current.tabs.length;
      const lastTabId = result.current.tabs[tabCount - 1].id;

      // タブを削除
      act(() => {
        result.current.removeTab(lastTabId);
      });

      expect(result.current.tabs).toHaveLength(tabCount - 1);
      expect(result.current.tabs.find((t) => t.id === lastTabId)).toBeUndefined();
    });

    it('タブが1つしかない場合は削除しない', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      const tabId = result.current.tabs[0].id;

      act(() => {
        result.current.removeTab(tabId);
      });

      // タブが削除されない
      expect(result.current.tabs).toHaveLength(1);
    });
  });

  describe('setActiveTab', () => {
    it('アクティブタブを変更する', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      // タブを追加
      act(() => {
        result.current.addTab();
      });

      const firstTabId = result.current.tabs[0].id;

      act(() => {
        result.current.setActiveTab(firstTabId);
      });

      expect(result.current.activeTabId).toBe(firstTabId);
    });
  });

  describe('getActiveTab', () => {
    it('アクティブなタブを取得する', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      const activeTab = result.current.getActiveTab();

      expect(activeTab).toBeDefined();
      expect(activeTab?.id).toBe(result.current.activeTabId);
    });

    it('アクティブタブが存在しない場合はundefinedを返す', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      // 無効なアクティブタブIDを設定（通常は起こらないが、テストのため）
      act(() => {
        result.current.setActiveTab('invalid-id');
      });

      const activeTab = result.current.getActiveTab();

      expect(activeTab).toBeUndefined();
    });
  });

  describe('初期状態', () => {
    it('タブが1つ存在する', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      expect(result.current.tabs).toHaveLength(1);
      expect(result.current.tabs[0].name).toBe('タブ 1');
    });

    it('最初のタブがアクティブ', () => {
      const { result } = renderHook(() => useTabManager(), { wrapper });

      expect(result.current.activeTabId).toBe(result.current.tabs[0].id);
    });
  });
});
