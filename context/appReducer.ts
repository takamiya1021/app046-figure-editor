/**
 * アプリケーション状態のReducer
 */

import type { AppState, AppAction } from '@/lib/types';

/**
 * アプリケーション状態を更新するReducer関数
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TAB':
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
      };

    case 'REMOVE_TAB': {
      const newTabs = state.tabs.filter((tab) => tab.id !== action.payload);
      // 削除したタブがアクティブだった場合、最初のタブをアクティブにする
      const newActiveTabId =
        state.activeTabId === action.payload
          ? newTabs[0]?.id || ''
          : state.activeTabId;

      return {
        ...state,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    }

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTabId: action.payload,
      };

    case 'UPDATE_TAB_IMAGES': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload.tabId
          ? { ...tab, uploadedImages: action.payload.images }
          : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    case 'UPDATE_TAB_OPTIONS': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload.tabId
          ? {
              ...tab,
              ...(action.payload.style && { style: action.payload.style }),
              ...(action.payload.aspectRatio && {
                aspectRatio: action.payload.aspectRatio,
              }),
              ...(action.payload.generationCount !== undefined && {
                generationCount: action.payload.generationCount,
              }),
              ...(action.payload.packageOptions && {
                packageOptions: action.payload.packageOptions,
              }),
              ...(action.payload.displayStandOptions && {
                displayStandOptions: action.payload.displayStandOptions,
              }),
              ...(action.payload.backgroundOptions && {
                backgroundOptions: action.payload.backgroundOptions,
              }),
              ...(action.payload.customPrompt !== undefined && {
                customPrompt: action.payload.customPrompt,
              }),
            }
          : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    case 'ADD_GENERATED_IMAGES': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload.tabId
          ? {
              ...tab,
              generatedImages: [
                ...tab.generatedImages,
                ...action.payload.images,
              ],
            }
          : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    case 'START_GENERATION': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload ? { ...tab, isGenerating: true } : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    case 'END_GENERATION': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload ? { ...tab, isGenerating: false } : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    case 'MARK_AS_DOWNLOADED': {
      const newTabs = state.tabs.map((tab) =>
        tab.id === action.payload.tabId
          ? {
              ...tab,
              generatedImages: tab.generatedImages.map((img) =>
                img.id === action.payload.imageId
                  ? { ...img, isDownloaded: true }
                  : img
              ),
            }
          : tab
      );

      return {
        ...state,
        tabs: newTabs,
      };
    }

    default:
      return state;
  }
}
