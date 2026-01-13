/**
 * アクリルスタンドスタイルオプションコンポーネント
 */

'use client';

interface AcrylicStandOptionsProps {
  /** 縁取りを追加するか */
  hasOutline: boolean;
  /** 縁取り変更時のコールバック */
  onOutlineChange: (hasOutline: boolean) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function AcrylicStandOptions({
  hasOutline,
  onOutlineChange,
  disabled = false,
}: AcrylicStandOptionsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onOutlineChange(e.target.checked);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">アクスタオプション</h4>

      <label className={`
        flex items-center gap-3 p-3 rounded-lg border border-gray-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
      `}>
        <input
          type="checkbox"
          checked={hasOutline}
          onChange={handleChange}
          disabled={disabled}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <div>
          <span className="text-sm text-gray-700">白い縁取りを追加</span>
          <p className="text-xs text-gray-500">アクリルスタンドに白い縁取りを追加します</p>
        </div>
      </label>
    </div>
  );
}
