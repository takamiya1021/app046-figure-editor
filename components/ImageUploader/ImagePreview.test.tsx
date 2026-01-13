/**
 * ImagePreviewコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ImagePreview from './ImagePreview';

describe('ImagePreview', () => {
  const defaultProps = {
    id: 'img-1',
    src: 'data:image/png;base64,mockBase64',
    name: 'test.png',
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('画像がレンダリングされる', () => {
      render(<ImagePreview {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', defaultProps.src);
      expect(img).toHaveAttribute('alt', defaultProps.name);
    });

    it('ファイル名が表示される', () => {
      render(<ImagePreview {...defaultProps} />);
      expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    it('削除ボタンが表示される', () => {
      render(<ImagePreview {...defaultProps} />);
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });
  });

  describe('削除機能', () => {
    it('削除ボタンをクリックするとonRemoveが呼ばれる', () => {
      render(<ImagePreview {...defaultProps} />);
      const deleteButton = screen.getByRole('button', { name: /削除/i });
      fireEvent.click(deleteButton);
      expect(defaultProps.onRemove).toHaveBeenCalledWith('img-1');
    });
  });

  describe('長いファイル名', () => {
    it('長いファイル名は省略される', () => {
      render(
        <ImagePreview
          {...defaultProps}
          name="very-long-filename-that-should-be-truncated.png"
        />
      );
      const nameElement = screen.getByText(/very-long/);
      expect(nameElement).toHaveClass('truncate');
    });
  });
});
