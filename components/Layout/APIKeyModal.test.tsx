import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import APIKeyModal from './APIKeyModal';

describe('APIKeyModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示制御', () => {
    it('isOpen=trueの場合、モーダルが表示される', () => {
      render(<APIKeyModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('isOpen=falseの場合、モーダルが非表示になる', () => {
      render(<APIKeyModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('入力フィールド', () => {
    it('APIキー入力フィールドが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByLabelText(/APIキー/i)).toBeInTheDocument();
    });

    it('initialValueが入力フィールドに設定される', () => {
      render(<APIKeyModal {...defaultProps} initialValue="test-api-key" />);
      const input = screen.getByLabelText(/APIキー/i);
      expect(input).toHaveValue('test-api-key');
    });

    it('入力値が変更できる', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const input = screen.getByLabelText(/APIキー/i);
      await user.clear(input);
      await user.type(input, 'new-api-key');

      expect(input).toHaveValue('new-api-key');
    });
  });

  describe('保存ボタン', () => {
    it('保存ボタンが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
    });

    it('保存ボタンをクリックするとonSaveが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleSave = jest.fn();
      render(<APIKeyModal {...defaultProps} onSave={handleSave} />);

      const input = screen.getByLabelText(/APIキー/i);
      await user.type(input, 'test-api-key');

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith('test-api-key');
    });

    it('空の入力では保存できない（バリデーション）', async () => {
      const user = userEvent.setup();
      const handleSave = jest.fn();
      render(<APIKeyModal {...defaultProps} onSave={handleSave} />);

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(handleSave).not.toHaveBeenCalled();
    });

    it('空白のみの入力では保存できない', async () => {
      const user = userEvent.setup();
      const handleSave = jest.fn();
      render(<APIKeyModal {...defaultProps} onSave={handleSave} />);

      const input = screen.getByLabelText(/APIキー/i);
      await user.type(input, '   ');

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(handleSave).not.toHaveBeenCalled();
    });

    it('バリデーションエラー時にエラーメッセージが表示される', async () => {
      const user = userEvent.setup();
      render(<APIKeyModal {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /保存/i });
      await user.click(saveButton);

      expect(screen.getByText(/APIキーを入力してください/i)).toBeInTheDocument();
    });
  });

  describe('削除ボタン', () => {
    it('削除ボタンが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });

    it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleDelete = jest.fn();
      render(<APIKeyModal {...defaultProps} onDelete={handleDelete} />);

      const deleteButton = screen.getByRole('button', { name: /削除/i });
      await user.click(deleteButton);

      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('閉じるボタン', () => {
    it('閉じるボタンが表示される', () => {
      render(<APIKeyModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /閉じる/i })).toBeInTheDocument();
    });

    it('閉じるボタンをクリックするとonCloseが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      render(<APIKeyModal {...defaultProps} onClose={handleClose} />);

      const closeButton = screen.getByRole('button', { name: /閉じる/i });
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('キーボード操作', () => {
    it('Escapeキーでモーダルが閉じる', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      render(<APIKeyModal {...defaultProps} onClose={handleClose} />);

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
