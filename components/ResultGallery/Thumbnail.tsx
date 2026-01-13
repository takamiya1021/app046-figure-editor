/**
 * サムネイルコンポーネント
 */

'use client';

import Image from 'next/image';
import type { GeneratedImage } from '@/lib/types';

interface ThumbnailProps {
  /** 生成された画像 */
  image: GeneratedImage;
  /** 選択状態変更時のコールバック */
  onSelect: (id: string) => void;
  /** 画像クリック時のコールバック */
  onClick: (image: GeneratedImage) => void;
}

/**
 * 生成された画像のサムネイル表示
 */
export function Thumbnail({ image, onSelect, onClick }: ThumbnailProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(image.id);
  };

  return (
    <div
      className={`
        relative group rounded-lg overflow-hidden
        border-2 transition-all duration-200
        ${image.isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {/* 画像 */}
      <button
        type="button"
        onClick={() => onClick(image)}
        className="w-full aspect-square relative cursor-pointer"
      >
        <Image
          src={image.base64}
          alt="生成された画像"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </button>

      {/* チェックボックス */}
      <div className="absolute top-2 left-2">
        <input
          type="checkbox"
          checked={image.isSelected}
          onChange={() => {}}
          onClick={handleCheckboxClick}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          aria-label="画像を選択"
        />
      </div>

      {/* ダウンロード済みマーク */}
      {image.isDownloaded && (
        <div
          className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full"
          aria-label="ダウンロード済み"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
