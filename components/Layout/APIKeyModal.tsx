'use client';

import { useState, useEffect, useCallback } from 'react';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onDelete: () => void;
  initialValue?: string;
}

export default function APIKeyModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialValue = '',
}: APIKeyModalProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Update input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setError('APIキーを入力してください');
      return;
    }
    setError(null);
    onSave(trimmedValue);
  }, [inputValue, onSave]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 id="api-key-modal-title" className="text-lg font-semibold mb-4">
          API設定
        </h2>

        <div className="mb-4">
          <label
            htmlFor="api-key-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            APIキー
          </label>
          <input
            id="api-key-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Gemini APIキーを入力"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
          >
            削除
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            閉じる
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
