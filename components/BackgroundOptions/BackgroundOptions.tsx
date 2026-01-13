/**
 * 背景オプションコンテナコンポーネント
 */

'use client';

import type { BackgroundOptions as BackgroundOptionsType, BackgroundType } from '@/lib/types';
import BackgroundToggle from './BackgroundToggle';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import CustomBackgroundInput from './CustomBackgroundInput';

interface BackgroundOptionsProps {
  /** 背景オプション */
  value: BackgroundOptionsType;
  /** 変更時のコールバック */
  onChange: (options: BackgroundOptionsType) => void;
}

export default function BackgroundOptions({
  value,
  onChange,
}: BackgroundOptionsProps) {
  const handleEnabledChange = (enabled: boolean) => {
    onChange({ ...value, enabled });
  };

  const handleTypeChange = (type: BackgroundType) => {
    onChange({ ...value, type });
  };

  const handleCustomDescriptionChange = (customDescription: string) => {
    onChange({ ...value, customDescription });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">背景</h3>

      {/* 有効/無効トグル */}
      <BackgroundToggle
        enabled={value.enabled}
        onChange={handleEnabledChange}
      />

      {/* 有効時のオプション */}
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-blue-200">
          {/* タイプ選択 */}
          <BackgroundTypeSelector
            value={value.type}
            onChange={handleTypeChange}
          />

          {/* カスタム入力（customタイプの場合のみ） */}
          {value.type === 'custom' && (
            <CustomBackgroundInput
              value={value.customDescription ?? ''}
              onChange={handleCustomDescriptionChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
