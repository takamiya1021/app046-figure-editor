/**
 * 自由生成スタイルオプションコンポーネント
 */

'use client';

import { useState } from 'react';

interface FreeStyleOptionsProps {
  /** カスタムプロンプト（日本語） */
  prompt: string;
  /** プロンプト変更時のコールバック */
  onPromptChange: (prompt: string) => void;
  /** 翻訳済みプロンプト（英語） */
  translatedPrompt?: string;
  /** 翻訳済みプロンプト変更時のコールバック */
  onTranslatedPromptChange?: (prompt: string) => void;
  /** 翻訳ボタンクリック時のコールバック */
  onTranslate?: () => void;
  /** 翻訳中状態 */
  isTranslating?: boolean;
  /** 無効化状態 */
  disabled?: boolean;
}

export default function FreeStyleOptions({
  prompt,
  onPromptChange,
  translatedPrompt = '',
  onTranslatedPromptChange,
  onTranslate,
  isTranslating = false,
  disabled = false,
}: FreeStyleOptionsProps) {
  const [showTranslated, setShowTranslated] = useState(false);

  const handleTranslate = () => {
    if (onTranslate && !isTranslating && !disabled) {
      onTranslate();
      setShowTranslated(true);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">自由生成プロンプト</h4>

      {/* 日本語プロンプト入力 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-600">プロンプト（日本語）</label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={disabled}
          placeholder="生成したい画像の説明を入力してください..."
          rows={4}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            text-sm text-gray-700 placeholder-gray-400
            resize-none
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
          `}
          aria-label="日本語プロンプト"
        />
        <div className="text-xs text-gray-500 text-right">
          {prompt.length} 文字
        </div>
      </div>

      {/* 翻訳ボタン */}
      {onTranslate && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={disabled || isTranslating || !prompt.trim()}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg
              transition-colors duration-200
              ${disabled || isTranslating || !prompt.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }
            `}
          >
            {isTranslating ? '翻訳中...' : '英訳する'}
          </button>
        </div>
      )}

      {/* 翻訳済みプロンプト表示 */}
      {showTranslated && translatedPrompt && (
        <div className="space-y-2">
          <label className="text-xs text-gray-600">翻訳済みプロンプト（英語）</label>
          <textarea
            value={translatedPrompt}
            onChange={(e) => onTranslatedPromptChange?.(e.target.value)}
            disabled={disabled}
            rows={4}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg
              text-sm text-gray-700 placeholder-gray-400
              resize-none
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
            `}
            aria-label="英語プロンプト"
          />
          <p className="text-xs text-gray-500">
            翻訳結果を編集できます。生成時は英語プロンプトが使用されます。
          </p>
        </div>
      )}

      {/* 生成モード説明 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>生成モード:</strong>
          {translatedPrompt ? (
            <span className="ml-1">英語プロンプトで生成されます</span>
          ) : (
            <span className="ml-1">日本語プロンプトでそのまま生成されます</span>
          )}
        </p>
      </div>
    </div>
  );
}
