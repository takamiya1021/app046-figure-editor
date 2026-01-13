/**
 * APIKeyModalコンポーネントのテスト
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import APIKeyModal from './APIKeyModal';

describe('APIKeyModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    onRemove: jest.fn(),
    currentApiKey: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('モーダルが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByText('APIキー設定')).toBeInTheDocument();
    });

    it('入力フィールドが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByPlaceholderText(/AIza/)).toBeInTheDocument();
    });

    it('保存ボタンが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
    });
  });

  describe('既存APIキー', () => {
    it('既存のAPIキーがマスク表示される', () => {
      render(<APIKeyModal {...defaultProps} currentApiKey="AIzaSyTest123456" />);
      expect(screen.getByText(/AIza\*+/)).toBeInTheDocument();
    });

    it('削除ボタンが表示される', () => {
      render(<APIKeyModal {...defaultProps} currentApiKey="AIzaSyTest123456" />);
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });
  });

  describe('保存機能', () => {
    it('有効なAPIキーで保存ボタンをクリックするとonSaveが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const input = screen.getByPlaceholderText(/AIza/);
      await user.type(input, 'AIzaSyTestKey12345');

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(defaultProps.onSave).toHaveBeenCalledWith('AIzaSyTestKey12345');
    });

    it('空のAPIキーでは保存できない', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });
  });

  describe('削除機能', () => {
    it('削除ボタンをクリックするとonRemoveが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} currentApiKey="AIzaSyTest123456" />);

      const deleteButton = screen.getByRole('button', { name: /削除/i });
      await user.click(deleteButton);

      expect(defaultProps.onRemove).toHaveBeenCalled();
    });
  });

  describe('閉じる機能', () => {
    it('閉じるボタンをクリックするとonCloseが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /閉じる/i });
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('バリデーション', () => {
    it('短すぎるAPIキーでエラーメッセージが表示される', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const input = screen.getByPlaceholderText(/AIza/);
      await user.type(input, 'short');

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/10文字以上/)).toBeInTheDocument();
      });
    });
  });
});
