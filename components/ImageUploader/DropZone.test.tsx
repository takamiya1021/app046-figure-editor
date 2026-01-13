/**
 * DropZoneコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import DropZone from './DropZone';

describe('DropZone', () => {
  const defaultProps = {
    onDrop: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('ドロップゾーンがレンダリングされる', () => {
      render(<DropZone {...defaultProps} />);
      expect(screen.getByText(/ドラッグ&ドロップ/)).toBeInTheDocument();
    });

    it('ファイル選択ボタンが表示される', () => {
      render(<DropZone {...defaultProps} />);
      expect(screen.getByRole('button', { name: /ファイルを選択/i })).toBeInTheDocument();
    });
  });

  describe('ファイル選択', () => {
    it('ファイル選択でonDropが呼ばれる', () => {
      render(<DropZone {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      expect(defaultProps.onDrop).toHaveBeenCalledWith([file]);
    });
  });

  describe('ドラッグ&ドロップ', () => {
    it('ドラッグオーバー時にスタイルが変わる', () => {
      render(<DropZone {...defaultProps} />);
      const zone = screen.getByTestId('drop-zone');

      fireEvent.dragOver(zone, {
        dataTransfer: { types: ['Files'] },
      });

      expect(zone).toHaveClass('border-blue-500');
    });

    it('ドラッグリーブでスタイルが戻る', () => {
      render(<DropZone {...defaultProps} />);
      const zone = screen.getByTestId('drop-zone');

      fireEvent.dragOver(zone, {
        dataTransfer: { types: ['Files'] },
      });

      fireEvent.dragLeave(zone);

      expect(zone).not.toHaveClass('border-blue-500');
    });

    it('ドロップでonDropが呼ばれる', () => {
      render(<DropZone {...defaultProps} />);
      const zone = screen.getByTestId('drop-zone');

      const file = new File([''], 'test.png', { type: 'image/png' });

      fireEvent.drop(zone, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(defaultProps.onDrop).toHaveBeenCalledWith([file]);
    });
  });

  describe('disabled状態', () => {
    it('disabled時はドロップできない', () => {
      render(<DropZone {...defaultProps} disabled />);
      const zone = screen.getByTestId('drop-zone');

      const file = new File([''], 'test.png', { type: 'image/png' });

      fireEvent.drop(zone, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(defaultProps.onDrop).not.toHaveBeenCalled();
    });

    it('disabled時はスタイルが変わる', () => {
      render(<DropZone {...defaultProps} disabled />);
      const zone = screen.getByTestId('drop-zone');
      expect(zone).toHaveClass('opacity-50');
    });
  });
});
