/**
 * GenerationControlコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationControl } from './GenerationControl';

describe('GenerationControl', () => {
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('CountSelectorとGenerateButtonが表示される', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} />);

      expect(screen.getByText('生成枚数')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '生成する' })).toBeInTheDocument();
    });

    it('デフォルトで1枚が選択されている', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} />);

      expect(screen.getByRole('radio', { name: '1枚' })).toBeChecked();
    });
  });

  describe('インタラクション', () => {
    it('枚数を変更できる', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} />);

      fireEvent.click(screen.getByRole('radio', { name: '5枚' }));

      expect(screen.getByRole('radio', { name: '5枚' })).toBeChecked();
    });

    it('生成ボタンを押すと選択した枚数でonGenerateが呼ばれる', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} />);

      fireEvent.click(screen.getByRole('radio', { name: '3枚' }));
      fireEvent.click(screen.getByRole('button', { name: '生成する' }));

      expect(mockOnGenerate).toHaveBeenCalledWith(3);
    });
  });

  describe('ローディング状態', () => {
    it('isLoading時はCountSelectorが無効になる', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} isLoading />);

      for (let i = 1; i <= 8; i++) {
        expect(screen.getByRole('radio', { name: `${i}枚` })).toBeDisabled();
      }
    });

    it('isLoading時はGenerateButtonがローディング表示になる', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} isLoading />);

      expect(screen.getByRole('button', { name: '生成中...' })).toBeInTheDocument();
    });

    it('progressが表示される', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} isLoading progress={75} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('無効化状態', () => {
    it('disabled時は全体が無効になる', () => {
      render(<GenerationControl onGenerate={mockOnGenerate} disabled />);

      expect(screen.getByRole('button', { name: '生成する' })).toBeDisabled();
      for (let i = 1; i <= 8; i++) {
        expect(screen.getByRole('radio', { name: `${i}枚` })).toBeDisabled();
      }
    });
  });
});
