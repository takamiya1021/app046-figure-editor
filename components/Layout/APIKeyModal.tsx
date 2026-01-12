'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '../UI/Button';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onDelete: () => void;
  initialValue?: string;
}

// Validation function for API key input
function validateAPIKey(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'APIキーを入力してください';
  }

  if (trimmedValue.length < 10) {
    return 'APIキーは10文字以上である必要があります';
  }

  return null;
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
    const validationError = validateAPIKey(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSave(inputValue.trim());
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
          <Button variant="danger" onClick={onDelete}>
            削除
          </Button>
          <Button variant="secondary" onClick={onClose}>
            閉じる
          </Button>
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
