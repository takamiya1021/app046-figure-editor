/**
 * Thumbnailコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Thumbnail } from './Thumbnail';
import type { GeneratedImage } from '@/lib/types';

describe('Thumbnail', () => {
  const mockImage: GeneratedImage = {
    id: 'test-id',
    base64: 'data:image/png;base64,mockBase64Data',
    createdAt: '2024-01-01T00:00:00.000Z',
    isDownloaded: false,
    isSelected: false,
  };

  const mockOnSelect = jest.fn();
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('画像が表示される', () => {
      render(
        <Thumbnail
          image={mockImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', mockImage.base64);
    });

    it('選択チェックボックスが表示される', () => {
      render(
        <Thumbnail
          image={mockImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('isSelectedがtrueの場合、チェックボックスがチェックされる', () => {
      const selectedImage = { ...mockImage, isSelected: true };
      render(
        <Thumbnail
          image={selectedImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('isDownloadedがtrueの場合、ダウンロード済みマークが表示される', () => {
      const downloadedImage = { ...mockImage, isDownloaded: true };
      render(
        <Thumbnail
          image={downloadedImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByLabelText('ダウンロード済み')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('画像をクリックするとonClickが呼ばれる', () => {
      render(
        <Thumbnail
          image={mockImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByRole('img'));

      expect(mockOnClick).toHaveBeenCalledWith(mockImage);
    });

    it('チェックボックスをクリックするとonSelectが呼ばれる', () => {
      render(
        <Thumbnail
          image={mockImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(mockOnSelect).toHaveBeenCalledWith(mockImage.id);
    });

    it('チェックボックスクリック時にonClickは呼ばれない', () => {
      render(
        <Thumbnail
          image={mockImage}
          onSelect={mockOnSelect}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
