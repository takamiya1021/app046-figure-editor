/**
 * TextureCheckboxコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TextureCheckbox from './TextureCheckbox';

describe('TextureCheckbox', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('ラベルが表示される', () => {
      render(
        <TextureCheckbox checked={false} onChange={mockOnChange} />
      );

      expect(screen.getByText('テクスチャを適用')).toBeInTheDocument();
    });

    it('チェックボックスが表示される', () => {
      render(
        <TextureCheckbox checked={false} onChange={mockOnChange} />
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('チェック状態が正しく表示される', () => {
      render(
        <TextureCheckbox checked={true} onChange={mockOnChange} />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('インタラクション', () => {
    it('クリックでonChangeが呼ばれる', () => {
      render(
        <TextureCheckbox checked={false} onChange={mockOnChange} />
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('チェック済みの場合はfalseで呼ばれる', () => {
      render(
        <TextureCheckbox checked={true} onChange={mockOnChange} />
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(mockOnChange).toHaveBeenCalledWith(false);
    });
  });

  describe('無効化状態', () => {
    it('disabled時はチェックボックスが無効化される', () => {
      render(
        <TextureCheckbox checked={false} onChange={mockOnChange} disabled />
      );

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });
});
