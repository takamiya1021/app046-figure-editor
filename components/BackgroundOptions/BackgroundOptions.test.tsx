/**
 * BackgroundOptionsコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import BackgroundToggle from './BackgroundToggle';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import CustomBackgroundInput from './CustomBackgroundInput';
import BackgroundOptions from './BackgroundOptions';

// ============================================
// BackgroundToggle Tests
// ============================================
describe('BackgroundToggle', () => {
  it('should render toggle with label', () => {
    render(<BackgroundToggle enabled={false} onChange={jest.fn()} />);
    expect(screen.getByText('背景を追加')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should show OFF state when disabled', () => {
    render(<BackgroundToggle enabled={false} onChange={jest.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('should show ON state when enabled', () => {
    render(<BackgroundToggle enabled={true} onChange={jest.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<BackgroundToggle enabled={false} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<BackgroundToggle enabled={false} onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ============================================
// BackgroundTypeSelector Tests
// ============================================
describe('BackgroundTypeSelector', () => {
  it('should render all background type options', () => {
    render(<BackgroundTypeSelector value="studio" onChange={jest.fn()} />);
    expect(screen.getByText('スタジオ')).toBeInTheDocument();
    expect(screen.getByText('ショップ')).toBeInTheDocument();
    expect(screen.getByText('デスクトップ')).toBeInTheDocument();
    expect(screen.getByText('ジオラマ')).toBeInTheDocument();
    expect(screen.getByText('カスタム')).toBeInTheDocument();
  });

  it('should show descriptions for each option', () => {
    render(<BackgroundTypeSelector value="studio" onChange={jest.fn()} />);
    expect(screen.getByText('撮影スタジオ背景')).toBeInTheDocument();
    expect(screen.getByText('店舗ディスプレイ')).toBeInTheDocument();
    expect(screen.getByText('デスク上の配置')).toBeInTheDocument();
    expect(screen.getByText('ミニチュア世界')).toBeInTheDocument();
    expect(screen.getByText('自由に指定')).toBeInTheDocument();
  });

  it('should show selected type as checked', () => {
    render(<BackgroundTypeSelector value="shop" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'ショップ' })).toBeChecked();
  });

  it('should call onChange when type is selected', () => {
    const handleChange = jest.fn();
    render(<BackgroundTypeSelector value="studio" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'ジオラマ' }));
    expect(handleChange).toHaveBeenCalledWith('diorama');
  });

  it('should not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<BackgroundTypeSelector value="studio" onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('radio', { name: 'ショップ' }));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ============================================
// CustomBackgroundInput Tests
// ============================================
describe('CustomBackgroundInput', () => {
  it('should render textarea with label', () => {
    render(<CustomBackgroundInput value="" onChange={jest.fn()} />);
    expect(screen.getByText('カスタム背景')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show current value', () => {
    render(<CustomBackgroundInput value="test background" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('test background');
  });

  it('should show character count', () => {
    render(<CustomBackgroundInput value="hello" onChange={jest.fn()} />);
    expect(screen.getByText('5 / 200')).toBeInTheDocument();
  });

  it('should call onChange when text is entered', () => {
    const handleChange = jest.fn();
    render(<CustomBackgroundInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new background' } });
    expect(handleChange).toHaveBeenCalledWith('new background');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CustomBackgroundInput value="" onChange={jest.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should use custom placeholder', () => {
    render(<CustomBackgroundInput value="" onChange={jest.fn()} placeholder="Enter custom text" />);
    expect(screen.getByPlaceholderText('Enter custom text')).toBeInTheDocument();
  });
});

// ============================================
// BackgroundOptions Container Tests
// ============================================
describe('BackgroundOptions', () => {
  const defaultValue = {
    enabled: false,
    type: 'studio' as const,
  };

  it('should render toggle', () => {
    render(<BackgroundOptions value={defaultValue} onChange={jest.fn()} />);
    expect(screen.getByText('背景')).toBeInTheDocument();
    expect(screen.getByText('背景を追加')).toBeInTheDocument();
  });

  it('should not show options when disabled', () => {
    render(<BackgroundOptions value={defaultValue} onChange={jest.fn()} />);
    expect(screen.queryByText('背景タイプ')).not.toBeInTheDocument();
  });

  it('should show options when enabled', () => {
    const enabledValue = { ...defaultValue, enabled: true };
    render(<BackgroundOptions value={enabledValue} onChange={jest.fn()} />);
    expect(screen.getByText('背景タイプ')).toBeInTheDocument();
  });

  it('should not show custom input when type is not custom', () => {
    const studioValue = { ...defaultValue, enabled: true, type: 'studio' as const };
    render(<BackgroundOptions value={studioValue} onChange={jest.fn()} />);
    expect(screen.queryByText('カスタム背景')).not.toBeInTheDocument();
  });

  it('should show custom input when type is custom', () => {
    const customValue = { ...defaultValue, enabled: true, type: 'custom' as const, customDescription: '' };
    render(<BackgroundOptions value={customValue} onChange={jest.fn()} />);
    expect(screen.getByText('カスタム背景')).toBeInTheDocument();
  });

  it('should call onChange when toggle is clicked', () => {
    const handleChange = jest.fn();
    render(<BackgroundOptions value={defaultValue} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith({ ...defaultValue, enabled: true });
  });

  it('should call onChange when type is changed', () => {
    const handleChange = jest.fn();
    const enabledValue = { ...defaultValue, enabled: true };
    render(<BackgroundOptions value={enabledValue} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'ショップ' }));
    expect(handleChange).toHaveBeenCalledWith({ ...enabledValue, type: 'shop' });
  });

  it('should call onChange when custom description is changed', () => {
    const handleChange = jest.fn();
    const customValue = { ...defaultValue, enabled: true, type: 'custom' as const, customDescription: '' };
    render(<BackgroundOptions value={customValue} onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new description' } });
    expect(handleChange).toHaveBeenCalledWith({ ...customValue, customDescription: 'new description' });
  });
});
