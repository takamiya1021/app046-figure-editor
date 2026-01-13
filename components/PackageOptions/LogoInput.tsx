/**
 * ロゴ入力コンポーネント
 */

'use client';

import { useRef } from 'react';
import { fileToBase64 } from '@/lib/utils';

interface LogoInputProps {
  /** ロゴテキスト */
  textValue: string;
  /** ロゴ画像（Base64） */
  imageValue?: string;
  /** テキスト変更時のコールバック */
  onTextChange: (text: string) => void;
  /** 画像変更時のコールバック */
  onImageChange: (base64: string | undefined) => void;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function LogoInput({
  textValue,
  imageValue,
  onTextChange,
  onImageChange,
  disabled = false,
}: LogoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageChange(base64);
      } catch {
        console.error('ロゴ画像の読み込みに失敗しました');
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">ロゴ設定</h3>

      {/* ロゴテキスト */}
      <div>
        <label
          htmlFor="logo-text"
          className="block text-xs text-gray-600 mb-1"
        >
          ロゴテキスト
        </label>
        <input
          type="text"
          id="logo-text"
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
          placeholder="ブランド名やロゴテキスト..."
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
      </div>

      {/* ロゴ画像 */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id="logo-image-input"
        />

        {imageValue ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageValue}
              alt="ロゴプレビュー"
              className="w-12 h-12 object-contain border rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className={`
                text-sm text-red-600 hover:text-red-800
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              削除
            </button>
          </div>
        ) : (
          <label
            htmlFor="logo-image-input"
            className={`
              inline-flex items-center gap-2
              px-4 py-2 border border-gray-300 rounded-lg
              text-sm text-gray-700 bg-white
              hover:bg-gray-50 cursor-pointer
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            ロゴ画像をアップロード
          </label>
        )}
      </div>
    </div>
  );
}
