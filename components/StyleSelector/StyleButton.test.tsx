/**
 * StyleButtonコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import StyleButton from './StyleButton';
import type { GenerationStyle } from '@/lib/types';

describe('StyleButton', () => {
  const defaultProps = {
    style: 'figure' as GenerationStyle,
    label: 'フィギュア',
    description: '3Dフィギュア風に変換',
    isSelected: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('ラベルが表示される', () => {
      render(<StyleButton {...defaultProps} />);
      expect(screen.getByText('フィギュア')).toBeInTheDocument();
    });

    it('説明が表示される', () => {
      render(<StyleButton {...defaultProps} />);
      expect(screen.getByText('3Dフィギュア風に変換')).toBeInTheDocument();
    });
  });

  describe('選択状態', () => {
    it('選択時にスタイルが変わる', () => {
      render(<StyleButton {...defaultProps} isSelected={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-blue-500');
    });

    it('非選択時のスタイル', () => {
      render(<StyleButton {...defaultProps} isSelected={false} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-gray-200');
    });
  });

  describe('クリックイベント', () => {
    it('クリック時にonClickが呼ばれる', () => {
      render(<StyleButton {...defaultProps} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(defaultProps.onClick).toHaveBeenCalledWith('figure');
    });
  });

  describe('disabled状態', () => {
    it('disabled時はクリックできない', () => {
      render(<StyleButton {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
  });
});
