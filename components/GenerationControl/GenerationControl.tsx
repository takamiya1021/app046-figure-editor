/**
 * 生成コントロールコンポーネント
 */

'use client';

import { useState } from 'react';
import { CountSelector } from './CountSelector';
import { GenerateButton } from './GenerateButton';

interface GenerationControlProps {
  /** 生成実行時のコールバック */
  onGenerate: (count: number) => void;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** 進捗（0-100） */
  progress?: number;
  /** 無効化状態 */
  disabled?: boolean;
}

/**
 * 生成枚数選択と生成ボタンを統合したコンポーネント
 */
export function GenerationControl({
  onGenerate,
  isLoading = false,
  progress,
  disabled = false,
}: GenerationControlProps) {
  const [count, setCount] = useState(1);

  const handleGenerate = () => {
    onGenerate(count);
  };

  const isDisabled = disabled || isLoading;

  return (
    <div className="space-y-4">
      <CountSelector
        value={count}
        onChange={setCount}
        disabled={isDisabled}
      />
      <GenerateButton
        onClick={handleGenerate}
        isLoading={isLoading}
        progress={progress}
        disabled={disabled}
      />
    </div>
  );
}
