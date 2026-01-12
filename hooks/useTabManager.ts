/**
 * タブ管理用カスタムフック
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { createDefaultTab } from '@/lib/constants';

/**
 * タブ管理機能を提供するカスタムフック
 */
export function useTabManager() {
  const { state, dispatch } = useAppContext();

  /**
   * 新しいタブを追加する
   */
  const addTab = useCallback(() => {
    const newTabIndex = state.tabs.length + 1;
    const newTab = createDefaultTab(newTabIndex);

    dispatch({ type: 'ADD_TAB', payload: newTab });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: newTab.id });
  }, [state.tabs.length, dispatch]);

  /**
   * タブを削除する
   * @param tabId - 削除するタブのID
   */
  const removeTab = useCallback(
    (tabId: string) => {
      // 最後の1つのタブは削除しない
      if (state.tabs.length <= 1) {
        return;
      }

      dispatch({ type: 'REMOVE_TAB', payload: tabId });
    },
    [state.tabs.length, dispatch]
  );

  /**
   * アクティブタブを変更する
   * @param tabId - アクティブにするタブのID
   */
  const setActiveTab = useCallback(
    (tabId: string) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
    },
    [dispatch]
  );

  /**
   * アクティブなタブを取得する
   */
  const getActiveTab = useCallback(() => {
    return state.tabs.find((tab) => tab.id === state.activeTabId);
  }, [state.tabs, state.activeTabId]);

  return useMemo(
    () => ({
      tabs: state.tabs,
      activeTabId: state.activeTabId,
      addTab,
      removeTab,
      setActiveTab,
      getActiveTab,
    }),
    [state.tabs, state.activeTabId, addTab, removeTab, setActiveTab, getActiveTab]
  );
}
