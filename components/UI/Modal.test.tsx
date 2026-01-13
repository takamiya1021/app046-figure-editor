/**
 * Modalコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  describe('基本レンダリング', () => {
    it('isOpen=trueの時にモーダルが表示される', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <p>モーダル内容</p>
        </Modal>
      );
      expect(screen.getByText('モーダル内容')).toBeInTheDocument();
    });

    it('isOpen=falseの時にモーダルが表示されない', () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          <p>モーダル内容</p>
        </Modal>
      );
      expect(screen.queryByText('モーダル内容')).not.toBeInTheDocument();
    });

    it('タイトルが表示される', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="テストタイトル">
          <p>内容</p>
        </Modal>
      );
      expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    });
  });

  describe('閉じる機能', () => {
    it('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>内容</p>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: /閉じる/i });
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('オーバーレイをクリックするとonCloseが呼ばれる', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>内容</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('モーダル内容をクリックしてもonCloseは呼ばれない', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>内容</p>
        </Modal>
      );

      const content = screen.getByText('内容');
      fireEvent.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Escapeキー', () => {
    it('Escapeキーを押すとonCloseが呼ばれる', () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>内容</p>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('role="dialog"が設定される', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <p>内容</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"が設定される', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <p>内容</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });
});
