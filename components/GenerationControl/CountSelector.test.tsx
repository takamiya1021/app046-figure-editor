/**
 * CountSelectorコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CountSelector } from './CountSelector';

describe('CountSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('1-8の選択肢が表示される', () => {
      render(<CountSelector value={1} onChange={mockOnChange} />);

      for (let i = 1; i <= 8; i++) {
        expect(screen.getByRole('radio', { name: `${i}枚` })).toBeInTheDocument();
      }
    });

    it('ラベルが表示される', () => {
      render(<CountSelector value={1} onChange={mockOnChange} />);

      expect(screen.getByText('生成枚数')).toBeInTheDocument();
    });

    it('選択中の値がチェックされている', () => {
      render(<CountSelector value={3} onChange={mockOnChange} />);

      const selectedRadio = screen.getByRole('radio', { name: '3枚' });
      expect(selectedRadio).toBeChecked();
    });
  });

  describe('インタラクション', () => {
    it('選択肢をクリックするとonChangeが呼ばれる', () => {
      render(<CountSelector value={1} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('radio', { name: '5枚' }));

      expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    it('既に選択されている値をクリックするとonChangeは呼ばれない', () => {
      render(<CountSelector value={3} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('radio', { name: '3枚' }));

      // ラジオボタンは同じ値のクリックでは発火しない
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('無効化状態', () => {
    it('disabled時は全ての選択肢が無効になる', () => {
      render(<CountSelector value={1} onChange={mockOnChange} disabled />);

      for (let i = 1; i <= 8; i++) {
        expect(screen.getByRole('radio', { name: `${i}枚` })).toBeDisabled();
      }
    });

    it('disabled時はクリックしてもonChangeが呼ばれない', () => {
      render(<CountSelector value={1} onChange={mockOnChange} disabled />);

      fireEvent.click(screen.getByRole('radio', { name: '5枚' }));

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
