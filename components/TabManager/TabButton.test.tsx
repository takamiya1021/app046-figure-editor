/**
 * TabButtonコンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabButton from './TabButton';

describe('TabButton', () => {
  const defaultProps = {
    id: 'tab-1',
    name: 'タブ1',
    isActive: false,
    onClick: jest.fn(),
    onDelete: jest.fn(),
    canDelete: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('タブ名が正しくレンダリングされる', () => {
    render(<TabButton {...defaultProps} />);
    expect(screen.getByText('タブ1')).toBeInTheDocument();
  });

  it('クリックでonClickがidと共に発火する', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<TabButton {...defaultProps} onClick={handleClick} />);

    const tabButton = screen.getByRole('tab', { name: /タブ1/i });
    await user.click(tabButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('tab-1');
  });

  it('削除ボタンでonDeleteがidと共に発火する', async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();
    render(<TabButton {...defaultProps} onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('tab-1');
  });

  it('削除ボタンクリック時にonClickが発火しない', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const handleDelete = jest.fn();
    render(<TabButton {...defaultProps} onClick={handleClick} onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('canDelete=falseの場合、削除ボタンが表示されない', () => {
    render(<TabButton {...defaultProps} canDelete={false} />);
    expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
  });

  it('アクティブ状態でaria-selected=trueになる', () => {
    render(<TabButton {...defaultProps} isActive={true} />);
    const tabButton = screen.getByRole('tab', { name: /タブ1/i });
    expect(tabButton).toHaveAttribute('aria-selected', 'true');
  });

  it('非アクティブ状態でaria-selected=falseになる', () => {
    render(<TabButton {...defaultProps} isActive={false} />);
    const tabButton = screen.getByRole('tab', { name: /タブ1/i });
    expect(tabButton).toHaveAttribute('aria-selected', 'false');
  });

  it('アクティブ状態のスタイリングが適用される', () => {
    render(<TabButton {...defaultProps} isActive={true} />);
    const tabButton = screen.getByRole('tab', { name: /タブ1/i });
    expect(tabButton).toHaveClass('bg-white');
  });

  it('非アクティブ状態のスタイリングが適用される', () => {
    render(<TabButton {...defaultProps} isActive={false} />);
    const tabButton = screen.getByRole('tab', { name: /タブ1/i });
    expect(tabButton).toHaveClass('bg-gray-100');
  });
});
