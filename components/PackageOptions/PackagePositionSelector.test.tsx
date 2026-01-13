/**
 * PackagePositionSelectorコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import PackagePositionSelector from './PackagePositionSelector';
import type { PackagePosition } from '@/lib/types';

describe('PackagePositionSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('タイトルが表示される', () => {
      render(
        <PackagePositionSelector value="none" onChange={mockOnChange} />
      );

      expect(screen.getByText('パッケージ配置')).toBeInTheDocument();
    });

    it('全ての配置オプションが表示される', () => {
      render(
        <PackagePositionSelector value="none" onChange={mockOnChange} />
      );

      expect(screen.getByRole('radio', { name: /なし/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /横に配置/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /パッケージ内/i })).toBeInTheDocument();
    });

    it('選択中のオプションがチェックされている', () => {
      render(
        <PackagePositionSelector value="beside" onChange={mockOnChange} />
      );

      expect(screen.getByRole('radio', { name: /横に配置/i })).toBeChecked();
    });
  });

  describe('インタラクション', () => {
    it.each<[PackagePosition, RegExp]>([
      ['none', /なし/i],
      ['beside', /横に配置/i],
      ['inside', /パッケージ内/i],
    ])('%s を選択できる', (position, labelPattern) => {
      render(
        <PackagePositionSelector
          value={position === 'none' ? 'beside' : 'none'}
          onChange={mockOnChange}
        />
      );

      fireEvent.click(screen.getByRole('radio', { name: labelPattern }));

      expect(mockOnChange).toHaveBeenCalledWith(position);
    });
  });

  describe('無効化状態', () => {
    it('disabled時は全てのラジオボタンが無効化される', () => {
      render(
        <PackagePositionSelector value="none" onChange={mockOnChange} disabled />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });
  });
});
