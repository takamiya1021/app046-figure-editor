/**
 * DownloadManagerコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadManager } from './DownloadManager';
import type { GeneratedImage } from '@/lib/types';

describe('DownloadManager', () => {
  const mockImages: GeneratedImage[] = [
    {
      id: 'img-1',
      base64: 'data:image/png;base64,mockData1',
      createdAt: '2024-01-01T00:00:00.000Z',
      isDownloaded: false,
      isSelected: false,
    },
    {
      id: 'img-2',
      base64: 'data:image/png;base64,mockData2',
      createdAt: '2024-01-01T00:01:00.000Z',
      isDownloaded: false,
      isSelected: true,
    },
  ];

  const mockOnDownload = jest.fn();
  const mockOnSelectAll = jest.fn();
  const mockOnDeselectAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('画像がない場合は何も表示されない', () => {
      const { container } = render(
        <DownloadManager
          images={[]}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('ダウンロードボタンが表示される', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      expect(screen.getByRole('button', { name: '選択をダウンロード' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '全てダウンロード' })).toBeInTheDocument();
    });

    it('全選択/解除ボタンが表示される', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      expect(screen.getByRole('button', { name: '全て選択' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '選択解除' })).toBeInTheDocument();
    });

    it('選択数が表示される', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      // テキストが複数要素にまたがっているため部分テキストで検索
      expect(screen.getByText(/選択中/)).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('選択をダウンロードボタンをクリックするとonDownloadが呼ばれる', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '選択をダウンロード' }));

      expect(mockOnDownload).toHaveBeenCalledWith('selected');
    });

    it('全てダウンロードボタンをクリックするとonDownloadが呼ばれる', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '全てダウンロード' }));

      expect(mockOnDownload).toHaveBeenCalledWith('all');
    });

    it('全て選択ボタンをクリックするとonSelectAllが呼ばれる', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '全て選択' }));

      expect(mockOnSelectAll).toHaveBeenCalled();
    });

    it('選択解除ボタンをクリックするとonDeselectAllが呼ばれる', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '選択解除' }));

      expect(mockOnDeselectAll).toHaveBeenCalled();
    });
  });

  describe('無効化状態', () => {
    it('選択がない場合は選択をダウンロードボタンが無効', () => {
      const unselectedImages = mockImages.map((img) => ({
        ...img,
        isSelected: false,
      }));

      render(
        <DownloadManager
          images={unselectedImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
        />
      );

      expect(screen.getByRole('button', { name: '選択をダウンロード' })).toBeDisabled();
    });

    it('isDownloading時は全てのボタンが無効', () => {
      render(
        <DownloadManager
          images={mockImages}
          onDownload={mockOnDownload}
          onSelectAll={mockOnSelectAll}
          onDeselectAll={mockOnDeselectAll}
          isDownloading
        />
      );

      expect(screen.getByRole('button', { name: '選択をダウンロード' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '全てダウンロード' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '全て選択' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '選択解除' })).toBeDisabled();
    });
  });
});
