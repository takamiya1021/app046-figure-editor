/**
 * ImageModalコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from './ImageModal';
import type { GeneratedImage } from '@/lib/types';

describe('ImageModal', () => {
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
      isSelected: false,
    },
    {
      id: 'img-3',
      base64: 'data:image/png;base64,mockData3',
      createdAt: '2024-01-01T00:02:00.000Z',
      isDownloaded: false,
      isSelected: false,
    },
  ];

  const mockOnClose = jest.fn();
  const mockOnPrev = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('isOpenがfalseの場合は何も表示されない', () => {
      render(
        <ImageModal
          isOpen={false}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('isOpenがtrueの場合はモーダルが表示される', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('現在の画像が表示される', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', mockImages[1].base64);
    });

    it('ページネーション情報が表示される', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  describe('ナビゲーション', () => {
    it('前へボタンをクリックするとonPrevが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.click(screen.getByLabelText('前の画像'));

      expect(mockOnPrev).toHaveBeenCalledTimes(1);
    });

    it('次へボタンをクリックするとonNextが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.click(screen.getByLabelText('次の画像'));

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('最初の画像の時は前へボタンが無効', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByLabelText('前の画像')).toBeDisabled();
    });

    it('最後の画像の時は次へボタンが無効', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={2}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByLabelText('次の画像')).toBeDisabled();
    });
  });

  describe('キーボード操作', () => {
    it('EscapeキーでonCloseが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('ArrowLeftキーでonPrevが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      expect(mockOnPrev).toHaveBeenCalledTimes(1);
    });

    it('ArrowRightキーでonNextが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={1}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('閉じる', () => {
    it('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.click(screen.getByLabelText('閉じる'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('オーバーレイをクリックするとonCloseが呼ばれる', () => {
      render(
        <ImageModal
          isOpen={true}
          images={mockImages}
          currentIndex={0}
          onClose={mockOnClose}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      fireEvent.click(screen.getByTestId('modal-overlay'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
