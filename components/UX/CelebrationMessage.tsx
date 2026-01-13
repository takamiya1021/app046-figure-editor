/**
 * お祝いメッセージコンポーネント
 * ピーク・エンド体験を演出する完了メッセージ
 */

'use client';

import { useEffect } from 'react';

type CelebrationType = 'success' | 'download';

interface CelebrationMessageProps {
  /** 表示状態 */
  isVisible: boolean;
  /** 表示メッセージ */
  message: string;
  /** メッセージタイプ */
  type?: CelebrationType;
  /** 自動非表示までの時間（ミリ秒） */
  duration?: number;
  /** 非表示時のコールバック */
  onDismiss?: () => void;
}

const CELEBRATION_ICONS: Record<CelebrationType, string> = {
  success: '🎉',
  download: '📥',
};

export default function CelebrationMessage({
  isVisible,
  message,
  type = 'success',
  duration = 3000,
  onDismiss,
}: CelebrationMessageProps) {
  useEffect(() => {
    if (!isVisible || !onDismiss) {
      return;
    }

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) {
    return null;
  }

  const icon = CELEBRATION_ICONS[type];

  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 animate-bounce">
      <span className="text-2xl" role="img" aria-label="celebration">
        {icon}
      </span>
      <span className="text-green-700 font-medium">{message}</span>
    </div>
  );
}
