/**
 * パッケージオプション統合コンポーネント
 */

'use client';

import type { PackageOptions as PackageOptionsType } from '@/lib/types';
import PackagePositionSelector from './PackagePositionSelector';
import PackageTextInput from './PackageTextInput';
import LogoInput from './LogoInput';
import TextureCheckbox from './TextureCheckbox';

interface PackageOptionsProps {
  /** 現在のオプション */
  options: PackageOptionsType;
  /** 変更時のコールバック */
  onChange: (options: PackageOptionsType) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function PackageOptions({
  options,
  onChange,
  disabled = false,
}: PackageOptionsProps) {
  const showDetails = options.position !== 'none';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">パッケージオプション</h2>

      {/* 配置選択 */}
      <PackagePositionSelector
        value={options.position}
        onChange={(position) => onChange({ ...options, position })}
        disabled={disabled}
      />

      {/* 詳細オプション（配置がnone以外の場合） */}
      {showDetails && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {/* パッケージテキスト */}
          <PackageTextInput
            value={options.text || ''}
            onChange={(text) => onChange({ ...options, text })}
            disabled={disabled}
          />

          {/* ロゴ設定 */}
          <LogoInput
            textValue={options.logoText || ''}
            imageValue={options.logoImage}
            onTextChange={(logoText) => onChange({ ...options, logoText })}
            onImageChange={(logoImage) => onChange({ ...options, logoImage })}
            disabled={disabled}
          />

          {/* テクスチャ */}
          <TextureCheckbox
            checked={options.hasTexture}
            onChange={(hasTexture) => onChange({ ...options, hasTexture })}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
