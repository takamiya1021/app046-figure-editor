/**
 * StyleSelectorコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import StyleSelector from './StyleSelector';
import type { GenerationStyle } from '@/lib/types';

describe('StyleSelector', () => {
  const defaultProps = {
    selectedStyle: 'figure' as GenerationStyle,
    onStyleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('全てのスタイルが表示される', () => {
      render(<StyleSelector {...defaultProps} />);
      expect(screen.getByText('フィギュア')).toBeInTheDocument();
      expect(screen.getByText('三面図')).toBeInTheDocument();
      expect(screen.getByText('アクリルスタンド')).toBeInTheDocument();
      expect(screen.getByText('線画')).toBeInTheDocument();
      expect(screen.getByText('自由生成')).toBeInTheDocument();
    });

    it('選択されたスタイルがハイライトされる', () => {
      render(<StyleSelector {...defaultProps} selectedStyle="figure" />);
      const figureButton = screen.getByText('フィギュア').closest('button');
      expect(figureButton).toHaveClass('border-blue-500');
    });
  });

  describe('スタイル変更', () => {
    it('スタイルをクリックするとonStyleChangeが呼ばれる', () => {
      render(<StyleSelector {...defaultProps} />);
      const threeViewButton = screen.getByText('三面図').closest('button');
      fireEvent.click(threeViewButton!);
      expect(defaultProps.onStyleChange).toHaveBeenCalledWith('three-view');
    });
  });

  describe('無効化スタイル', () => {
    it('disabledStylesで指定されたスタイルが無効化される', () => {
      render(
        <StyleSelector
          {...defaultProps}
          disabledStyles={['three-view', 'free']}
        />
      );

      const threeViewButton = screen.getByText('三面図').closest('button');
      const freeButton = screen.getByText('自由生成').closest('button');

      expect(threeViewButton).toBeDisabled();
      expect(freeButton).toBeDisabled();
    });
  });
});
