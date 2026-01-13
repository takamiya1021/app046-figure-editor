/**
 * Inputコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  describe('基本レンダリング', () => {
    it('input要素がレンダリングされる', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('プレースホルダーが表示される', () => {
      render(<Input placeholder="テスト入力" />);
      expect(screen.getByPlaceholderText('テスト入力')).toBeInTheDocument();
    });

    it('初期値が設定される', () => {
      render(<Input defaultValue="初期値" />);
      expect(screen.getByDisplayValue('初期値')).toBeInTheDocument();
    });
  });

  describe('ラベル', () => {
    it('ラベルが表示される', () => {
      render(<Input label="ラベルテスト" />);
      expect(screen.getByText('ラベルテスト')).toBeInTheDocument();
    });

    it('ラベルとinputが関連付けられる', () => {
      render(<Input label="ラベル" id="test-input" />);
      const label = screen.getByText('ラベル');
      expect(label).toHaveAttribute('for', 'test-input');
    });
  });

  describe('エラー状態', () => {
    it('エラーメッセージが表示される', () => {
      render(<Input error="エラーです" />);
      expect(screen.getByText('エラーです')).toBeInTheDocument();
    });

    it('エラー時にスタイルが変わる', () => {
      render(<Input error="エラー" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('disabled状態', () => {
    it('disabled属性が設定される', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('イベントハンドリング', () => {
    it('onChangeが呼ばれる', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '新しい値' },
      });

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('type属性', () => {
    it('type="password"が設定される', () => {
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId('password-input');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('カスタムクラス', () => {
    it('追加のクラス名が適用される', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });
  });
});
