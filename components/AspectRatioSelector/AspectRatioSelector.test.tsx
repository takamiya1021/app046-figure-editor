/**
 * AspectRatioSelectorコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import AspectRatioSelector from './AspectRatioSelector';
import type { AspectRatio } from '@/lib/types';

describe('AspectRatioSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('タイトルが表示される', () => {
      render(
        <AspectRatioSelector value="auto" onChange={mockOnChange} />
      );

      expect(screen.getByText('アスペクト比')).toBeInTheDocument();
    });

    it('全てのアスペクト比オプションが表示される', () => {
      render(
        <AspectRatioSelector value="auto" onChange={mockOnChange} />
      );

      expect(screen.getByRole('radio', { name: /自動/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /1:1/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /3:4/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /4:3/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /9:16/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /16:9/i })).toBeInTheDocument();
    });

    it('選択中のオプションがチェックされている', () => {
      render(
        <AspectRatioSelector value="1:1" onChange={mockOnChange} />
      );

      const selectedRadio = screen.getByRole('radio', { name: /1:1/i });
      expect(selectedRadio).toBeChecked();
    });
  });

  describe('インタラクション', () => {
    it('オプションをクリックするとonChangeが呼ばれる', () => {
      render(
        <AspectRatioSelector value="auto" onChange={mockOnChange} />
      );

      fireEvent.click(screen.getByRole('radio', { name: /3:4/i }));

      expect(mockOnChange).toHaveBeenCalledWith('3:4');
    });

    it.each<AspectRatio>(['1:1', '3:4', '4:3', '9:16', '16:9'])(
      '%s を選択できる',
      (ratio) => {
        render(
          <AspectRatioSelector value="auto" onChange={mockOnChange} />
        );

        fireEvent.click(screen.getByRole('radio', { name: new RegExp(ratio, 'i') }));

        expect(mockOnChange).toHaveBeenCalledWith(ratio);
      }
    );

    it('autoを選択できる', () => {
      render(
        <AspectRatioSelector value="1:1" onChange={mockOnChange} />
      );

      fireEvent.click(screen.getByRole('radio', { name: /自動/i }));

      expect(mockOnChange).toHaveBeenCalledWith('auto');
    });
  });

  describe('無効化状態', () => {
    it('disabled時は全てのラジオボタンが無効化される', () => {
      render(
        <AspectRatioSelector value="auto" onChange={mockOnChange} disabled />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('disabled時はonChangeが呼ばれない', () => {
      render(
        <AspectRatioSelector value="auto" onChange={mockOnChange} disabled />
      );

      fireEvent.click(screen.getByRole('radio', { name: /3:4/i }));

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
