import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabButton from './TabButton';

describe('TabButton', () => {
  const defaultProps = {
    id: 'tab-1',
    label: 'タブ1',
    isActive: false,
    onClick: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ラベルが正しくレンダリングされる', () => {
    render(<TabButton {...defaultProps} />);
    expect(screen.getByText('タブ1')).toBeInTheDocument();
  });

  it('クリックでonClickがidと共に発火する', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<TabButton {...defaultProps} onClick={handleClick} />);

    const tabButton = screen.getByRole('button', { name: /タブ1/i });
    await user.click(tabButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('tab-1');
  });

  it('閉じるボタンでonCloseがidと共に発火する', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(<TabButton {...defaultProps} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledWith('tab-1');
  });

  it('閉じるボタンクリック時にonClickが発火しない', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const handleClose = jest.fn();
    render(<TabButton {...defaultProps} onClick={handleClick} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('アクティブ状態のスタイリングが適用される', () => {
    render(<TabButton {...defaultProps} isActive={true} />);
    const tabButton = screen.getByRole('button', { name: /タブ1/i });
    expect(tabButton).toHaveClass('bg-white');
    expect(tabButton).toHaveClass('border-b-white');
  });

  it('非アクティブ状態のスタイリングが適用される', () => {
    render(<TabButton {...defaultProps} isActive={false} />);
    const tabButton = screen.getByRole('button', { name: /タブ1/i });
    expect(tabButton).toHaveClass('bg-gray-100');
  });
});
