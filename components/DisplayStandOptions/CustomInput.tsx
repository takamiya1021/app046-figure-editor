/**
 * カスタム説明入力コンポーネント
 */

'use client';

interface CustomInputProps {
  /** 入力値 */
  value: string;
  /** 変更時のコールバック */
  onChange: (value: string) => void;
  /** 無効化状態 */
  disabled?: boolean;
  /** プレースホルダー */
  placeholder?: string;
  /** 最大文字数 */
  maxLength?: number;
}

export default function CustomInput({
  value,
  onChange,
  disabled = false,
  placeholder = '展示台の詳細な説明を入力...',
  maxLength = 200,
}: CustomInputProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">カスタム説明</h4>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          text-sm text-gray-700 placeholder-gray-400
          resize-none
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
        `}
        aria-label="カスタム説明"
      />
      <div className="text-xs text-gray-500 text-right">
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
