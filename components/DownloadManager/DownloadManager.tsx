/**
 * ダウンロード管理コンポーネント
 */

'use client';

import type { GeneratedImage } from '@/lib/types';

interface DownloadManagerProps {
  /** 生成された画像一覧 */
  images: GeneratedImage[];
  /** ダウンロード実行時のコールバック */
  onDownload: (type: 'selected' | 'all') => void;
  /** 全選択時のコールバック */
  onSelectAll: () => void;
  /** 選択解除時のコールバック */
  onDeselectAll: () => void;
  /** ダウンロード中かどうか */
  isDownloading?: boolean;
}

/**
 * ダウンロードと選択管理を行うコンポーネント
 */
export function DownloadManager({
  images,
  onDownload,
  onSelectAll,
  onDeselectAll,
  isDownloading = false,
}: DownloadManagerProps) {
  if (images.length === 0) {
    return null;
  }

  const selectedCount = images.filter((img) => img.isSelected).length;
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
      {/* 選択状態 */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{selectedCount} / {images.length}</span> 選択中
      </div>

      {/* ボタングループ */}
      <div className="flex flex-wrap gap-2">
        {/* 選択操作 */}
        <button
          type="button"
          onClick={onSelectAll}
          disabled={isDownloading}
          className={`
            px-3 py-1.5 text-sm rounded-lg border
            transition-colors duration-200
            ${isDownloading
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          全て選択
        </button>
        <button
          type="button"
          onClick={onDeselectAll}
          disabled={isDownloading}
          className={`
            px-3 py-1.5 text-sm rounded-lg border
            transition-colors duration-200
            ${isDownloading
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          選択解除
        </button>

        {/* ダウンロード操作 */}
        <button
          type="button"
          onClick={() => onDownload('selected')}
          disabled={isDownloading || !hasSelection}
          className={`
            px-3 py-1.5 text-sm rounded-lg border
            transition-colors duration-200
            ${isDownloading || !hasSelection
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            }
          `}
        >
          選択をダウンロード
        </button>
        <button
          type="button"
          onClick={() => onDownload('all')}
          disabled={isDownloading}
          className={`
            px-3 py-1.5 text-sm rounded-lg border
            transition-colors duration-200
            ${isDownloading
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
            }
          `}
        >
          全てダウンロード
        </button>
      </div>
    </div>
  );
}
