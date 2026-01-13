/**
 * 画像プレビューコンポーネント
 */

'use client';

import Image from 'next/image';

interface ImagePreviewProps {
  /** 画像ID */
  id: string;
  /** 画像のBase64データ */
  src: string;
  /** ファイル名 */
  name: string;
  /** 削除時のコールバック */
  onRemove: (id: string) => void;
}

export default function ImagePreview({
  id,
  src,
  name,
  onRemove,
}: ImagePreviewProps) {
  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div className="relative group">
      {/* 画像サムネイル */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          unoptimized // Base64データのため最適化をスキップ
        />
      </div>

      {/* 削除ボタン */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="削除"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* ファイル名 */}
      <p className="mt-1 text-xs text-gray-500 truncate max-w-[96px]" title={name}>
        {name}
      </p>
    </div>
  );
}
