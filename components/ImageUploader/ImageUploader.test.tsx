/**
 * ImageUploaderコンポーネントのテスト
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageUploader from './ImageUploader';

// FileReaderのモック
const mockFileReader = {
  readAsDataURL: jest.fn(),
  result: 'data:image/png;base64,mockBase64Data',
  onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
  onerror: null as ((e: ProgressEvent<FileReader>) => void) | null,
};

global.FileReader = jest.fn(() => mockFileReader) as unknown as typeof FileReader;

describe('ImageUploader', () => {
  const defaultProps = {
    onImagesChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.onload = null;
    mockFileReader.onerror = null;
  });

  describe('基本レンダリング', () => {
    it('DropZoneが表示される', () => {
      render(<ImageUploader {...defaultProps} />);
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    });

    it('初期状態でプレビューが表示されない', () => {
      render(<ImageUploader {...defaultProps} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('画像アップロード', () => {
    it('画像をアップロードするとプレビューが表示される', async () => {
      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      // FileReaderのonloadをトリガー
      await waitFor(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({} as ProgressEvent<FileReader>);
        }
      });

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('画像アップロード後にonImagesChangeが呼ばれる', async () => {
      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({} as ProgressEvent<FileReader>);
        }
      });

      await waitFor(() => {
        expect(defaultProps.onImagesChange).toHaveBeenCalled();
      });
    });
  });

  describe('エラー表示', () => {
    it('画像以外のファイルでエラーが表示される', async () => {
      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([''], 'test.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/画像ファイル/)).toBeInTheDocument();
      });
    });
  });

  describe('クリア機能', () => {
    it('クリアボタンで全画像が削除される', async () => {
      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({} as ProgressEvent<FileReader>);
        }
      });

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: /クリア/i });
      fireEvent.click(clearButton);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});
