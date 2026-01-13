/**
 * CelebrationMessageコンポーネントのテスト
 * ピーク・エンド体験を演出する完了メッセージ
 */

import { render, screen, act } from '@testing-library/react';
import CelebrationMessage from './CelebrationMessage';

describe('CelebrationMessage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render success message', () => {
    render(<CelebrationMessage isVisible={true} message="生成完了！" />);
    expect(screen.getByText('生成完了！')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(<CelebrationMessage isVisible={false} message="生成完了！" />);
    expect(screen.queryByText('生成完了！')).not.toBeInTheDocument();
  });

  it('should call onDismiss after duration', () => {
    const handleDismiss = jest.fn();
    render(
      <CelebrationMessage
        isVisible={true}
        message="生成完了！"
        duration={3000}
        onDismiss={handleDismiss}
      />
    );

    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(handleDismiss).toHaveBeenCalled();
  });

  it('should show celebration icon', () => {
    render(<CelebrationMessage isVisible={true} message="生成完了！" />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('should support custom type', () => {
    render(
      <CelebrationMessage
        isVisible={true}
        message="ダウンロード完了！"
        type="download"
      />
    );
    expect(screen.getByText('📥')).toBeInTheDocument();
  });
});
