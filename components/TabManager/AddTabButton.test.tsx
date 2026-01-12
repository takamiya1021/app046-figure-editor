import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTabButton from './AddTabButton';

describe('AddTabButton', () => {
  it('"+"アイコンを持つボタンがレンダリングされる', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('+');
  });

  it('クリック時にonClickコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<AddTabButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'タブを追加' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('アクセシビリティ用のaria-labelが設定される', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toHaveAttribute('aria-label', 'タブを追加');
  });

  it('ホバースタイルクラスが適用される', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toHaveClass('hover:bg-gray-200');
  });

  it('トランジションクラスが適用される', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toHaveClass('transition-all');
  });

  it('ホバー時のスケールアニメーションクラスが適用される', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toHaveClass('hover:scale-110');
  });

  it('アクティブ状態のフィードバッククラスが適用される', () => {
    render(<AddTabButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'タブを追加' });
    expect(button).toHaveClass('active:scale-95');
  });
});
