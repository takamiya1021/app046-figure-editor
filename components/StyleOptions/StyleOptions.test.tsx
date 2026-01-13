/**
 * StyleOptionsコンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ThreeViewOptions from './ThreeViewOptions';
import FreeStyleOptions from './FreeStyleOptions';
import AcrylicStandOptions from './AcrylicStandOptions';
import LineArtOptions from './LineArtOptions';

// ============================================
// ThreeViewOptions Tests
// ============================================
describe('ThreeViewOptions', () => {
  it('should render with label and checkbox', () => {
    render(<ThreeViewOptions figurize={false} onFigurizeChange={jest.fn()} />);
    expect(screen.getByText('三面図オプション')).toBeInTheDocument();
    expect(screen.getByText('フィギュア化して生成')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should show unchecked state when figurize is false', () => {
    render(<ThreeViewOptions figurize={false} onFigurizeChange={jest.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should show checked state when figurize is true', () => {
    render(<ThreeViewOptions figurize={true} onFigurizeChange={jest.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call onFigurizeChange when checkbox is clicked', () => {
    const handleChange = jest.fn();
    render(<ThreeViewOptions figurize={false} onFigurizeChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onFigurizeChange when disabled', () => {
    const handleChange = jest.fn();
    render(<ThreeViewOptions figurize={false} onFigurizeChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should show description text', () => {
    render(<ThreeViewOptions figurize={false} onFigurizeChange={jest.fn()} />);
    expect(screen.getByText('三面図をフィギュア風の質感で生成します')).toBeInTheDocument();
  });
});

// ============================================
// FreeStyleOptions Tests
// ============================================
describe('FreeStyleOptions', () => {
  it('should render with label and textarea', () => {
    render(<FreeStyleOptions prompt="" onPromptChange={jest.fn()} />);
    expect(screen.getByText('自由生成プロンプト')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '日本語プロンプト' })).toBeInTheDocument();
  });

  it('should show current prompt value', () => {
    render(<FreeStyleOptions prompt="テストプロンプト" onPromptChange={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: '日本語プロンプト' })).toHaveValue('テストプロンプト');
  });

  it('should show character count', () => {
    render(<FreeStyleOptions prompt="hello" onPromptChange={jest.fn()} />);
    expect(screen.getByText('5 文字')).toBeInTheDocument();
  });

  it('should call onPromptChange when text is entered', () => {
    const handleChange = jest.fn();
    render(<FreeStyleOptions prompt="" onPromptChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: '日本語プロンプト' }), {
      target: { value: 'new prompt' },
    });
    expect(handleChange).toHaveBeenCalledWith('new prompt');
  });

  it('should show translate button when onTranslate is provided', () => {
    render(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        onTranslate={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '英訳する' })).toBeInTheDocument();
  });

  it('should not show translate button when onTranslate is not provided', () => {
    render(<FreeStyleOptions prompt="test" onPromptChange={jest.fn()} />);
    expect(screen.queryByRole('button', { name: '英訳する' })).not.toBeInTheDocument();
  });

  it('should call onTranslate when translate button is clicked', () => {
    const handleTranslate = jest.fn();
    render(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        onTranslate={handleTranslate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '英訳する' }));
    expect(handleTranslate).toHaveBeenCalled();
  });

  it('should disable translate button when prompt is empty', () => {
    render(
      <FreeStyleOptions
        prompt=""
        onPromptChange={jest.fn()}
        onTranslate={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '英訳する' })).toBeDisabled();
  });

  it('should show translating state', () => {
    render(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        onTranslate={jest.fn()}
        isTranslating={true}
      />
    );
    expect(screen.getByRole('button', { name: '翻訳中...' })).toBeDisabled();
  });

  it('should show translated prompt after translation', () => {
    const { rerender } = render(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        onTranslate={jest.fn()}
        translatedPrompt=""
      />
    );

    // Click translate button to show translated area
    fireEvent.click(screen.getByRole('button', { name: '英訳する' }));

    // Rerender with translated prompt
    rerender(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        onTranslate={jest.fn()}
        translatedPrompt="translated test"
      />
    );

    expect(screen.getByRole('textbox', { name: '英語プロンプト' })).toHaveValue('translated test');
  });

  it('should show generation mode message for Japanese', () => {
    render(<FreeStyleOptions prompt="test" onPromptChange={jest.fn()} />);
    expect(screen.getByText(/日本語プロンプトでそのまま生成されます/)).toBeInTheDocument();
  });

  it('should show generation mode message for English when translated', () => {
    render(
      <FreeStyleOptions
        prompt="test"
        onPromptChange={jest.fn()}
        translatedPrompt="translated"
      />
    );
    expect(screen.getByText(/英語プロンプトで生成されます/)).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FreeStyleOptions prompt="" onPromptChange={jest.fn()} disabled />);
    expect(screen.getByRole('textbox', { name: '日本語プロンプト' })).toBeDisabled();
  });
});

// ============================================
// AcrylicStandOptions Tests
// ============================================
describe('AcrylicStandOptions', () => {
  it('should render with label and checkbox', () => {
    render(<AcrylicStandOptions hasOutline={false} onOutlineChange={jest.fn()} />);
    expect(screen.getByText('アクスタオプション')).toBeInTheDocument();
    expect(screen.getByText('白い縁取りを追加')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should show unchecked state when hasOutline is false', () => {
    render(<AcrylicStandOptions hasOutline={false} onOutlineChange={jest.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should show checked state when hasOutline is true', () => {
    render(<AcrylicStandOptions hasOutline={true} onOutlineChange={jest.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call onOutlineChange when checkbox is clicked', () => {
    const handleChange = jest.fn();
    render(<AcrylicStandOptions hasOutline={false} onOutlineChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onOutlineChange when disabled', () => {
    const handleChange = jest.fn();
    render(<AcrylicStandOptions hasOutline={false} onOutlineChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ============================================
// LineArtOptions Tests
// ============================================
describe('LineArtOptions', () => {
  it('should render with label and thickness options', () => {
    render(<LineArtOptions thickness="medium" onThicknessChange={jest.fn()} />);
    expect(screen.getByText('線画オプション')).toBeInTheDocument();
    expect(screen.getByText('線の太さ')).toBeInTheDocument();
    expect(screen.getByText('細め')).toBeInTheDocument();
    expect(screen.getByText('普通')).toBeInTheDocument();
    expect(screen.getByText('太め')).toBeInTheDocument();
  });

  it('should show selected state for current thickness', () => {
    render(<LineArtOptions thickness="thin" onThicknessChange={jest.fn()} />);
    expect(screen.getByText('細め')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('普通')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onThicknessChange when option is clicked', () => {
    const handleChange = jest.fn();
    render(<LineArtOptions thickness="medium" onThicknessChange={handleChange} />);
    fireEvent.click(screen.getByText('太め'));
    expect(handleChange).toHaveBeenCalledWith('thick');
  });

  it('should not call onThicknessChange when disabled', () => {
    const handleChange = jest.fn();
    render(<LineArtOptions thickness="medium" onThicknessChange={handleChange} disabled />);
    fireEvent.click(screen.getByText('太め'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
