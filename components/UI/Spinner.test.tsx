/**
 * Spinnerコンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  describe('基本レンダリング', () => {
    it('スピナーがレンダリングされる', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('スクリーンリーダー用のテキストがある', () => {
      render(<Spinner />);
      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });
  });

  describe('サイズバリアント', () => {
    it('デフォルトサイズ（md）が適用される', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-6', 'h-6');
    });

    it('smサイズが適用される', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-4', 'h-4');
    });

    it('lgサイズが適用される', () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('xlサイズが適用される', () => {
      render(<Spinner size="xl" />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-12', 'h-12');
    });
  });

  describe('カラーバリアント', () => {
    it('デフォルトカラー（primary）が適用される', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('text-blue-600');
    });

    it('secondaryカラーが適用される', () => {
      render(<Spinner color="secondary" />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('text-gray-600');
    });

    it('whiteカラーが適用される', () => {
      render(<Spinner color="white" />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('text-white');
    });
  });

  describe('カスタムクラス', () => {
    it('追加のクラス名が適用される', () => {
      render(<Spinner className="custom-spinner" />);
      expect(screen.getByRole('status')).toHaveClass('custom-spinner');
    });
  });

  describe('アニメーション', () => {
    it('アニメーションクラスが適用される', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('animate-spin');
    });
  });
});
