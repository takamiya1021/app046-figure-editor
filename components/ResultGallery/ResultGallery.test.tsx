/**
 * ResultGalleryコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ResultGallery } from './ResultGallery';
import type { GeneratedImage } from '@/lib/types';

describe('ResultGallery', () => {
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
      isDownloaded: true,
      isSelected: true,
    },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('画像がない場合はプレースホルダーが表示される', () => {
      render(<ResultGallery images={[]} onSelect={mockOnSelect} />);

      expect(screen.getByText('生成された画像がありません')).toBeInTheDocument();
    });

    it('画像一覧が表示される', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
    });

    it('見出しが表示される', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      expect(screen.getByText('生成結果')).toBeInTheDocument();
    });

    it('画像数が表示される', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      expect(screen.getByText('（2枚）')).toBeInTheDocument();
    });
  });

  describe('選択操作', () => {
    it('チェックボックスをクリックするとonSelectが呼ばれる', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      expect(mockOnSelect).toHaveBeenCalledWith('img-1');
    });
  });

  describe('モーダル表示', () => {
    it('画像をクリックするとモーダルが開く', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      // 画像ボタンをクリック（チェックボックス以外の部分）
      const imageButtons = screen.getAllByRole('img');
      fireEvent.click(imageButtons[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('モーダルで画像を切り替えられる', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      // モーダルを開く
      const imageButtons = screen.getAllByRole('img');
      fireEvent.click(imageButtons[0]);

      // 次へボタンをクリック
      fireEvent.click(screen.getByLabelText('次の画像'));

      // 2枚目の画像が表示されていることを確認
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });

    it('Escapeキーでモーダルが閉じる', () => {
      render(<ResultGallery images={mockImages} onSelect={mockOnSelect} />);

      // モーダルを開く
      const imageButtons = screen.getAllByRole('img');
      fireEvent.click(imageButtons[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Escapeキーで閉じる
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
