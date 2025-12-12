/**
 * アプリケーション全体の状態管理Context
 */

'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { AppState, AppAction } from '@/lib/types';
import { INITIAL_APP_STATE } from '@/lib/constants';
import { appReducer } from './appReducer';

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * アプリケーション全体の状態を提供するProvider
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * AppContextを使用するカスタムフック
 * @throws Provider外で使用した場合にエラー
 */
export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
