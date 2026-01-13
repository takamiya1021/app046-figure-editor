/**
 * 展示台オプションコンテナコンポーネント
 */

'use client';

import type {
  DisplayStandOptions as DisplayStandOptionsType,
  DisplayStandShape,
  DisplayStandMaterial,
  WoodType,
  MetalType,
  MineralType,
} from '@/lib/types';
import DisplayStandToggle from './DisplayStandToggle';
import ShapeSelector from './ShapeSelector';
import MaterialSelector from './MaterialSelector';
import GamingOptions from './GamingOptions';
import WoodSelector from './WoodSelector';
import MetalSelector from './MetalSelector';
import MineralSelector from './MineralSelector';
import CustomInput from './CustomInput';

interface DisplayStandOptionsProps {
  /** 展示台オプション */
  value: DisplayStandOptionsType;
  /** 変更時のコールバック */
  onChange: (options: DisplayStandOptionsType) => void;
}

export default function DisplayStandOptions({
  value,
  onChange,
}: DisplayStandOptionsProps) {
  const handleEnabledChange = (enabled: boolean) => {
    onChange({ ...value, enabled });
  };

  const handleShapeChange = (shape: DisplayStandShape) => {
    onChange({ ...value, shape });
  };

  const handleMaterialChange = (material: DisplayStandMaterial) => {
    onChange({ ...value, material });
  };

  const handleRainbowChange = (isRainbow: boolean) => {
    onChange({ ...value, isRainbow });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...value, color });
  };

  const handleWoodTypeChange = (woodType: WoodType) => {
    onChange({ ...value, woodType });
  };

  const handleMetalTypeChange = (metalType: MetalType) => {
    onChange({ ...value, metalType });
  };

  const handleMineralTypeChange = (mineralType: MineralType) => {
    onChange({ ...value, mineralType });
  };

  const handleCustomDescriptionChange = (customDescription: string) => {
    onChange({ ...value, customDescription });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">展示台</h3>

      {/* 有効/無効トグル */}
      <DisplayStandToggle
        enabled={value.enabled}
        onChange={handleEnabledChange}
      />

      {/* 有効時のオプション */}
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-blue-200">
          {/* 形状選択 */}
          <ShapeSelector
            value={value.shape}
            onChange={handleShapeChange}
          />

          {/* 材質選択 */}
          <MaterialSelector
            value={value.material}
            onChange={handleMaterialChange}
          />

          {/* 材質別オプション */}
          {value.material === 'gaming' && (
            <GamingOptions
              isRainbow={value.isRainbow ?? false}
              color={value.color ?? '#ff0000'}
              onRainbowChange={handleRainbowChange}
              onColorChange={handleColorChange}
            />
          )}

          {value.material === 'wood' && (
            <WoodSelector
              value={value.woodType ?? 'oak'}
              onChange={handleWoodTypeChange}
            />
          )}

          {value.material === 'metal' && (
            <MetalSelector
              value={value.metalType ?? 'gold'}
              onChange={handleMetalTypeChange}
            />
          )}

          {value.material === 'mineral' && (
            <MineralSelector
              value={value.mineralType ?? 'marble'}
              onChange={handleMineralTypeChange}
            />
          )}

          {value.material === 'custom' && (
            <CustomInput
              value={value.customDescription ?? ''}
              onChange={handleCustomDescriptionChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
