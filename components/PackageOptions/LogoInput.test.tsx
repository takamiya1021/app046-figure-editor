/**
 * LogoInputコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import LogoInput from './LogoInput';

describe('LogoInput', () => {
  const mockOnTextChange = jest.fn();
  const mockOnImageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('タイトルが表示される', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      expect(screen.getByText('ロゴ設定')).toBeInTheDocument();
    });

    it('テキスト入力フィールドが表示される', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      expect(screen.getByLabelText('ロゴテキスト')).toBeInTheDocument();
    });

    it('画像アップロードボタンが表示される', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      expect(screen.getByText('ロゴ画像をアップロード')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('テキスト入力でonTextChangeが呼ばれる', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      fireEvent.change(screen.getByLabelText('ロゴテキスト'), {
        target: { value: 'ブランド名' },
      });

      expect(mockOnTextChange).toHaveBeenCalledWith('ブランド名');
    });
  });

  describe('プレビュー', () => {
    it('画像がある場合はプレビューが表示される', () => {
      render(
        <LogoInput
          textValue=""
          imageValue="data:image/png;base64,test"
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      expect(screen.getByAltText('ロゴプレビュー')).toBeInTheDocument();
    });

    it('画像がない場合はプレビューが表示されない', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
        />
      );

      expect(screen.queryByAltText('ロゴプレビュー')).not.toBeInTheDocument();
    });
  });

  describe('無効化状態', () => {
    it('disabled時は入力フィールドが無効化される', () => {
      render(
        <LogoInput
          textValue=""
          onTextChange={mockOnTextChange}
          onImageChange={mockOnImageChange}
          disabled
        />
      );

      expect(screen.getByLabelText('ロゴテキスト')).toBeDisabled();
    });
  });
});
