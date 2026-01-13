/**
 * PackageOptionsコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import PackageOptions from './PackageOptions';
import type { PackageOptions as PackageOptionsType } from '@/lib/types';

describe('PackageOptions', () => {
  const defaultOptions: PackageOptionsType = {
    position: 'none',
    text: '',
    logoText: '',
    logoImage: undefined,
    hasTexture: false,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('タイトルが表示される', () => {
      render(
        <PackageOptions options={defaultOptions} onChange={mockOnChange} />
      );

      expect(screen.getByText('パッケージオプション')).toBeInTheDocument();
    });

    it('配置選択が表示される', () => {
      render(
        <PackageOptions options={defaultOptions} onChange={mockOnChange} />
      );

      expect(screen.getByText('パッケージ配置')).toBeInTheDocument();
    });

    it('position=none時は詳細オプションが非表示', () => {
      render(
        <PackageOptions options={defaultOptions} onChange={mockOnChange} />
      );

      expect(screen.queryByText('パッケージテキスト')).not.toBeInTheDocument();
    });

    it('position!=none時は詳細オプションが表示される', () => {
      render(
        <PackageOptions
          options={{ ...defaultOptions, position: 'beside' }}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('パッケージテキスト')).toBeInTheDocument();
      expect(screen.getByText('ロゴ設定')).toBeInTheDocument();
      expect(screen.getByText('テクスチャを適用')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('配置変更でonChangeが呼ばれる', () => {
      render(
        <PackageOptions options={defaultOptions} onChange={mockOnChange} />
      );

      fireEvent.click(screen.getByRole('radio', { name: /横に配置/i }));

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultOptions,
        position: 'beside',
      });
    });

    it('テキスト変更でonChangeが呼ばれる', () => {
      render(
        <PackageOptions
          options={{ ...defaultOptions, position: 'beside' }}
          onChange={mockOnChange}
        />
      );

      fireEvent.change(screen.getByLabelText(/パッケージテキスト/i), {
        target: { value: 'テスト' },
      });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'テスト' })
      );
    });

    it('テクスチャ変更でonChangeが呼ばれる', () => {
      render(
        <PackageOptions
          options={{ ...defaultOptions, position: 'beside' }}
          onChange={mockOnChange}
        />
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ hasTexture: true })
      );
    });
  });

  describe('無効化状態', () => {
    it('disabled時は全てのコントロールが無効化される', () => {
      render(
        <PackageOptions
          options={{ ...defaultOptions, position: 'beside' }}
          onChange={mockOnChange}
          disabled
        />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });
});
