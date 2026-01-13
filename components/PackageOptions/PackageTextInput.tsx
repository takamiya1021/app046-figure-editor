/**
 * パッケージテキスト入力コンポーネント
 */

'use client';

interface PackageTextInputProps {
  /** テキスト値 */
  value: string;
  /** 変更時のコールバック */
  onChange: (text: string) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function PackageTextInput({
  value,
  onChange,
  disabled = false,
}: PackageTextInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="package-text"
        className="block text-sm font-medium text-gray-700"
      >
        パッケージテキスト
      </label>
      <input
        type="text"
        id="package-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="パッケージに表示するテキスト..."
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
    </div>
  );
}
