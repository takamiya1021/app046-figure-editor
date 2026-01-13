/**
 * TabManagerコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TabManager from './TabManager';
import { AppProvider } from '@/context/AppContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('TabManager', () => {
  describe('基本レンダリング', () => {
    it('タブマネージャーがレンダリングされる', () => {
      render(<TabManager />, { wrapper });
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('初期状態で1つのタブが表示される', () => {
      render(<TabManager />, { wrapper });
      expect(screen.getByText('タブ 1')).toBeInTheDocument();
    });

    it('タブ追加ボタンが表示される', () => {
      render(<TabManager />, { wrapper });
      expect(screen.getByRole('button', { name: /タブを追加/i })).toBeInTheDocument();
    });
  });

  describe('タブ追加', () => {
    it('追加ボタンをクリックすると新しいタブが追加される', () => {
      render(<TabManager />, { wrapper });

      const addButton = screen.getByRole('button', { name: /タブを追加/i });
      fireEvent.click(addButton);

      expect(screen.getByText('タブ 2')).toBeInTheDocument();
    });

    it('追加したタブがアクティブになる', () => {
      render(<TabManager />, { wrapper });

      const addButton = screen.getByRole('button', { name: /タブを追加/i });
      fireEvent.click(addButton);

      const tab2 = screen.getByText('タブ 2').closest('[role="tab"]');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('タブ切り替え', () => {
    it('タブをクリックするとアクティブタブが切り替わる', () => {
      render(<TabManager />, { wrapper });

      // タブを追加
      const addButton = screen.getByRole('button', { name: /タブを追加/i });
      fireEvent.click(addButton);

      // 最初のタブをクリック
      const tab1 = screen.getByText('タブ 1');
      fireEvent.click(tab1);

      expect(tab1.closest('[role="tab"]')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('タブ削除', () => {
    it('削除ボタンをクリックするとタブが削除される', () => {
      render(<TabManager />, { wrapper });

      // タブを追加
      const addButton = screen.getByRole('button', { name: /タブを追加/i });
      fireEvent.click(addButton);

      // タブ2の削除ボタンをクリック
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i });
      fireEvent.click(deleteButtons[1]); // 2番目の削除ボタン

      expect(screen.queryByText('タブ 2')).not.toBeInTheDocument();
    });

    it('タブが1つの場合は削除ボタンが表示されない', () => {
      render(<TabManager />, { wrapper });
      expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
    });
  });
});
