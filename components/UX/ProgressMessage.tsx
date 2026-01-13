/**
 * 進捗メッセージコンポーネント
 * 労働の錯覚を演出する順次表示メッセージ
 */

'use client';

import { useState, useEffect } from 'react';

interface ProgressMessageProps {
  /** アクティブ状態 */
  isActive: boolean;
  /** メッセージ切り替え間隔（ミリ秒） */
  interval?: number;
}

const PROGRESS_MESSAGES = [
  '画像を分析中...',
  'プロンプトを最適化中...',
  'AIが生成中...',
  '仕上げ処理中...',
];

export default function ProgressMessage({
  isActive,
  interval = 2000,
}: ProgressMessageProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setMessageIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, interval]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg animate-pulse">
      <div
        data-testid="progress-spinner"
        className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
      />
      <span className="text-blue-700 font-medium">
        {PROGRESS_MESSAGES[messageIndex]}
      </span>
    </div>
  );
}
