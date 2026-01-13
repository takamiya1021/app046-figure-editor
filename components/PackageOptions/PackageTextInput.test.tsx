/**
 * PackageTextInputコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import PackageTextInput from './PackageTextInput';

describe('PackageTextInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('ラベルが表示される', () => {
      render(
        <PackageTextInput value="" onChange={mockOnChange} />
      );

      expect(screen.getByText('パッケージテキスト')).toBeInTheDocument();
    });

    it('入力フィールドが表示される', () => {
      render(
        <PackageTextInput value="" onChange={mockOnChange} />
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('値が正しく表示される', () => {
      render(
        <PackageTextInput value="テスト文字列" onChange={mockOnChange} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('テスト文字列');
    });
  });

  describe('インタラクション', () => {
    it('テキスト入力でonChangeが呼ばれる', () => {
      render(
        <PackageTextInput value="" onChange={mockOnChange} />
      );

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '新しいテキスト' },
      });

      expect(mockOnChange).toHaveBeenCalledWith('新しいテキスト');
    });
  });

  describe('無効化状態', () => {
    it('disabled時は入力フィールドが無効化される', () => {
      render(
        <PackageTextInput value="" onChange={mockOnChange} disabled />
      );

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });
});
