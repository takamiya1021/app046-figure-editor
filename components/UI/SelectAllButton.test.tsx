/**
 * SelectAllButtonコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SelectAllButton from './SelectAllButton';

describe('SelectAllButton', () => {
  it('should render select all button', () => {
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={0}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '全て選択' })).toBeInTheDocument();
  });

  it('should show deselect button when all items are selected', () => {
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={10}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '全て解除' })).toBeInTheDocument();
  });

  it('should show selection count', () => {
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={5}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
      />
    );
    expect(screen.getByText('5 / 10 選択中')).toBeInTheDocument();
  });

  it('should call onSelectAll when select all button is clicked', () => {
    const handleSelectAll = jest.fn();
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={0}
        onSelectAll={handleSelectAll}
        onDeselectAll={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '全て選択' }));
    expect(handleSelectAll).toHaveBeenCalled();
  });

  it('should call onDeselectAll when deselect all button is clicked', () => {
    const handleDeselectAll = jest.fn();
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={10}
        onSelectAll={jest.fn()}
        onDeselectAll={handleDeselectAll}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '全て解除' }));
    expect(handleDeselectAll).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={0}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
        disabled
      />
    );
    expect(screen.getByRole('button', { name: '全て選択' })).toBeDisabled();
  });

  it('should be disabled when totalCount is 0', () => {
    render(
      <SelectAllButton
        totalCount={0}
        selectedCount={0}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '全て選択' })).toBeDisabled();
  });

  it('should show partial selection state', () => {
    render(
      <SelectAllButton
        totalCount={10}
        selectedCount={5}
        onSelectAll={jest.fn()}
        onDeselectAll={jest.fn()}
      />
    );
    // 部分選択時は「全て選択」ボタンを表示
    expect(screen.getByRole('button', { name: '全て選択' })).toBeInTheDocument();
  });
});
