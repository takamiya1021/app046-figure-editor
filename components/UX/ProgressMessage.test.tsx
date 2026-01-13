/**
 * ProgressMessageコンポーネントのテスト
 * 労働の錯覚を演出する進捗メッセージ
 */

import { render, screen, act } from '@testing-library/react';
import ProgressMessage from './ProgressMessage';

describe('ProgressMessage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render initial message', () => {
    render(<ProgressMessage isActive={true} />);
    expect(screen.getByText('画像を分析中...')).toBeInTheDocument();
  });

  it('should cycle through messages', () => {
    render(<ProgressMessage isActive={true} />);

    expect(screen.getByText('画像を分析中...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('プロンプトを最適化中...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('AIが生成中...')).toBeInTheDocument();
  });

  it('should not render when inactive', () => {
    render(<ProgressMessage isActive={false} />);
    expect(screen.queryByText('画像を分析中...')).not.toBeInTheDocument();
  });

  it('should reset to first message when reactivated', () => {
    const { rerender } = render(<ProgressMessage isActive={true} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('プロンプトを最適化中...')).toBeInTheDocument();

    rerender(<ProgressMessage isActive={false} />);
    rerender(<ProgressMessage isActive={true} />);

    expect(screen.getByText('画像を分析中...')).toBeInTheDocument();
  });

  it('should show spinner animation', () => {
    render(<ProgressMessage isActive={true} />);
    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument();
  });
});
