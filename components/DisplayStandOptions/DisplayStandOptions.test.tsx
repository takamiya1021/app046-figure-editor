/**
 * DisplayStandOptionsコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import DisplayStandToggle from './DisplayStandToggle';
import ShapeSelector from './ShapeSelector';
import MaterialSelector from './MaterialSelector';
import GamingOptions from './GamingOptions';
import WoodSelector from './WoodSelector';
import MetalSelector from './MetalSelector';
import MineralSelector from './MineralSelector';
import CustomInput from './CustomInput';
import DisplayStandOptions from './DisplayStandOptions';

// ============================================
// DisplayStandToggle Tests
// ============================================
describe('DisplayStandToggle', () => {
  it('should render toggle with label', () => {
    render(<DisplayStandToggle enabled={false} onChange={jest.fn()} />);
    expect(screen.getByText('展示台を追加')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should show OFF state when disabled', () => {
    render(<DisplayStandToggle enabled={false} onChange={jest.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('should show ON state when enabled', () => {
    render(<DisplayStandToggle enabled={true} onChange={jest.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<DisplayStandToggle enabled={false} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<DisplayStandToggle enabled={false} onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ============================================
// ShapeSelector Tests
// ============================================
describe('ShapeSelector', () => {
  it('should render all shape options', () => {
    render(<ShapeSelector value="circle" onChange={jest.fn()} />);
    expect(screen.getByText('円形')).toBeInTheDocument();
    expect(screen.getByText('四角形')).toBeInTheDocument();
    expect(screen.getByText('六角形')).toBeInTheDocument();
  });

  it('should show selected shape as checked', () => {
    render(<ShapeSelector value="square" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: '四角形' })).toBeChecked();
  });

  it('should call onChange when shape is selected', () => {
    const handleChange = jest.fn();
    render(<ShapeSelector value="circle" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '六角形' }));
    expect(handleChange).toHaveBeenCalledWith('hexagon');
  });

  it('should not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<ShapeSelector value="circle" onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('radio', { name: '四角形' }));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ============================================
// MaterialSelector Tests
// ============================================
describe('MaterialSelector', () => {
  it('should render all material options', () => {
    render(<MaterialSelector value="gaming" onChange={jest.fn()} />);
    expect(screen.getByText('ゲーミング')).toBeInTheDocument();
    expect(screen.getByText('木材')).toBeInTheDocument();
    expect(screen.getByText('金属')).toBeInTheDocument();
    expect(screen.getByText('鉱物')).toBeInTheDocument();
    expect(screen.getByText('カスタム')).toBeInTheDocument();
  });

  it('should show selected material as checked', () => {
    render(<MaterialSelector value="wood" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: '木材' })).toBeChecked();
  });

  it('should call onChange when material is selected', () => {
    const handleChange = jest.fn();
    render(<MaterialSelector value="gaming" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '金属' }));
    expect(handleChange).toHaveBeenCalledWith('metal');
  });
});

// ============================================
// GamingOptions Tests
// ============================================
describe('GamingOptions', () => {
  it('should render rainbow checkbox', () => {
    render(
      <GamingOptions
        isRainbow={false}
        color="#ff0000"
        onRainbowChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    expect(screen.getByText('🌈 レインボー')).toBeInTheDocument();
  });

  it('should show color picker when not rainbow', () => {
    render(
      <GamingOptions
        isRainbow={false}
        color="#ff0000"
        onRainbowChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    expect(screen.getByText('カラー')).toBeInTheDocument();
  });

  it('should hide color picker when rainbow is selected', () => {
    render(
      <GamingOptions
        isRainbow={true}
        color="#ff0000"
        onRainbowChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    );
    expect(screen.queryByText('カラー')).not.toBeInTheDocument();
  });

  it('should call onRainbowChange when checkbox is clicked', () => {
    const handleRainbowChange = jest.fn();
    render(
      <GamingOptions
        isRainbow={false}
        color="#ff0000"
        onRainbowChange={handleRainbowChange}
        onColorChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleRainbowChange).toHaveBeenCalledWith(true);
  });
});

// ============================================
// WoodSelector Tests
// ============================================
describe('WoodSelector', () => {
  it('should render all wood types', () => {
    render(<WoodSelector value="oak" onChange={jest.fn()} />);
    expect(screen.getByText('オーク')).toBeInTheDocument();
    expect(screen.getByText('ダークオーク')).toBeInTheDocument();
    expect(screen.getByText('ウォールナット')).toBeInTheDocument();
    expect(screen.getByText('メープル')).toBeInTheDocument();
    expect(screen.getByText('チェリー')).toBeInTheDocument();
    expect(screen.getByText('マホガニー')).toBeInTheDocument();
  });

  it('should show selected wood as checked', () => {
    render(<WoodSelector value="walnut" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'ウォールナット' })).toBeChecked();
  });

  it('should call onChange when wood is selected', () => {
    const handleChange = jest.fn();
    render(<WoodSelector value="oak" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'チェリー' }));
    expect(handleChange).toHaveBeenCalledWith('cherry');
  });
});

// ============================================
// MetalSelector Tests
// ============================================
describe('MetalSelector', () => {
  it('should render all metal types', () => {
    render(<MetalSelector value="gold" onChange={jest.fn()} />);
    expect(screen.getByText('ゴールド')).toBeInTheDocument();
    expect(screen.getByText('シルバー')).toBeInTheDocument();
    expect(screen.getByText('銅')).toBeInTheDocument();
    expect(screen.getByText('クローム')).toBeInTheDocument();
    expect(screen.getByText('ヘアライン')).toBeInTheDocument();
    expect(screen.getByText('錆び鉄')).toBeInTheDocument();
  });

  it('should show selected metal as checked', () => {
    render(<MetalSelector value="chrome" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'クローム' })).toBeChecked();
  });

  it('should call onChange when metal is selected', () => {
    const handleChange = jest.fn();
    render(<MetalSelector value="gold" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'シルバー' }));
    expect(handleChange).toHaveBeenCalledWith('silver');
  });
});

// ============================================
// MineralSelector Tests
// ============================================
describe('MineralSelector', () => {
  it('should render all mineral types', () => {
    render(<MineralSelector value="marble" onChange={jest.fn()} />);
    expect(screen.getByText('大理石')).toBeInTheDocument();
    expect(screen.getByText('花崗岩')).toBeInTheDocument();
    expect(screen.getByText('黒曜石')).toBeInTheDocument();
    expect(screen.getByText('水晶')).toBeInTheDocument();
    expect(screen.getByText('ルビー')).toBeInTheDocument();
    expect(screen.getByText('エメラルド')).toBeInTheDocument();
    expect(screen.getByText('サファイア')).toBeInTheDocument();
  });

  it('should show selected mineral as checked', () => {
    render(<MineralSelector value="emerald" onChange={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'エメラルド' })).toBeChecked();
  });

  it('should call onChange when mineral is selected', () => {
    const handleChange = jest.fn();
    render(<MineralSelector value="marble" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'サファイア' }));
    expect(handleChange).toHaveBeenCalledWith('sapphire');
  });
});

// ============================================
// CustomInput Tests
// ============================================
describe('CustomInput', () => {
  it('should render textarea with label', () => {
    render(<CustomInput value="" onChange={jest.fn()} />);
    expect(screen.getByText('カスタム説明')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show current value', () => {
    render(<CustomInput value="test description" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('test description');
  });

  it('should show character count', () => {
    render(<CustomInput value="hello" onChange={jest.fn()} />);
    expect(screen.getByText('5 / 200')).toBeInTheDocument();
  });

  it('should call onChange when text is entered', () => {
    const handleChange = jest.fn();
    render(<CustomInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new text' } });
    expect(handleChange).toHaveBeenCalledWith('new text');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CustomInput value="" onChange={jest.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

// ============================================
// DisplayStandOptions Container Tests
// ============================================
describe('DisplayStandOptions', () => {
  const defaultValue = {
    enabled: false,
    shape: 'circle' as const,
    material: 'gaming' as const,
    isRainbow: false,
    color: '#ff0000',
  };

  it('should render toggle', () => {
    render(<DisplayStandOptions value={defaultValue} onChange={jest.fn()} />);
    expect(screen.getByText('展示台')).toBeInTheDocument();
    expect(screen.getByText('展示台を追加')).toBeInTheDocument();
  });

  it('should not show options when disabled', () => {
    render(<DisplayStandOptions value={defaultValue} onChange={jest.fn()} />);
    expect(screen.queryByText('形状')).not.toBeInTheDocument();
    expect(screen.queryByText('材質')).not.toBeInTheDocument();
  });

  it('should show options when enabled', () => {
    const enabledValue = { ...defaultValue, enabled: true };
    render(<DisplayStandOptions value={enabledValue} onChange={jest.fn()} />);
    expect(screen.getByText('形状')).toBeInTheDocument();
    expect(screen.getByText('材質')).toBeInTheDocument();
  });

  it('should show gaming options when material is gaming', () => {
    const gamingValue = { ...defaultValue, enabled: true, material: 'gaming' as const };
    render(<DisplayStandOptions value={gamingValue} onChange={jest.fn()} />);
    expect(screen.getByText('ゲーミングLED')).toBeInTheDocument();
  });

  it('should show wood selector when material is wood', () => {
    const woodValue = { ...defaultValue, enabled: true, material: 'wood' as const, woodType: 'oak' as const };
    render(<DisplayStandOptions value={woodValue} onChange={jest.fn()} />);
    expect(screen.getByText('木材の種類')).toBeInTheDocument();
  });

  it('should show metal selector when material is metal', () => {
    const metalValue = { ...defaultValue, enabled: true, material: 'metal' as const, metalType: 'gold' as const };
    render(<DisplayStandOptions value={metalValue} onChange={jest.fn()} />);
    expect(screen.getByText('金属の種類')).toBeInTheDocument();
  });

  it('should show mineral selector when material is mineral', () => {
    const mineralValue = { ...defaultValue, enabled: true, material: 'mineral' as const, mineralType: 'marble' as const };
    render(<DisplayStandOptions value={mineralValue} onChange={jest.fn()} />);
    expect(screen.getByText('鉱物の種類')).toBeInTheDocument();
  });

  it('should show custom input when material is custom', () => {
    const customValue = { ...defaultValue, enabled: true, material: 'custom' as const, customDescription: '' };
    render(<DisplayStandOptions value={customValue} onChange={jest.fn()} />);
    expect(screen.getByText('カスタム説明')).toBeInTheDocument();
  });

  it('should call onChange when toggle is clicked', () => {
    const handleChange = jest.fn();
    render(<DisplayStandOptions value={defaultValue} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith({ ...defaultValue, enabled: true });
  });

  it('should call onChange when shape is changed', () => {
    const handleChange = jest.fn();
    const enabledValue = { ...defaultValue, enabled: true };
    render(<DisplayStandOptions value={enabledValue} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '六角形' }));
    expect(handleChange).toHaveBeenCalledWith({ ...enabledValue, shape: 'hexagon' });
  });

  it('should call onChange when material is changed', () => {
    const handleChange = jest.fn();
    const enabledValue = { ...defaultValue, enabled: true };
    render(<DisplayStandOptions value={enabledValue} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '木材' }));
    expect(handleChange).toHaveBeenCalledWith({ ...enabledValue, material: 'wood' });
  });
});
