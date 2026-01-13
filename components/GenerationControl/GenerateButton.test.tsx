/**
 * GenerateButtonコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { GenerateButton } from './GenerateButton';

describe('GenerateButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('デフォルトのボタンテキストが表示される', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      expect(screen.getByRole('button', { name: '生成する' })).toBeInTheDocument();
    });

    it('ローディング中はローディングテキストが表示される', () => {
      render(<GenerateButton onClick={mockOnClick} isLoading />);

      expect(screen.getByRole('button', { name: '生成中...' })).toBeInTheDocument();
    });

    it('progressが指定されている場合は進捗が表示される', () => {
      render(<GenerateButton onClick={mockOnClick} isLoading progress={50} />);

      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('クリックするとonClickが呼ばれる', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      fireEvent.click(screen.getByRole('button', { name: '生成する' }));

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('ローディング中はクリックできない', () => {
      render(<GenerateButton onClick={mockOnClick} isLoading />);

      const button = screen.getByRole('button', { name: '生成中...' });
      expect(button).toBeDisabled();

      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('無効化状態', () => {
    it('disabled時はボタンが無効になる', () => {
      render(<GenerateButton onClick={mockOnClick} disabled />);

      expect(screen.getByRole('button', { name: '生成する' })).toBeDisabled();
    });

    it('disabled時はクリックしてもonClickが呼ばれない', () => {
      render(<GenerateButton onClick={mockOnClick} disabled />);

      fireEvent.click(screen.getByRole('button', { name: '生成する' }));

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
