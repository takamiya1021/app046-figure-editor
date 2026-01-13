/**
 * APIキー設定モーダルコンポーネント
 */

'use client';

import { useState, useCallback } from 'react';
import Modal from '@/components/UI/Modal';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

interface APIKeyModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 閉じる際のコールバック */
  onClose: () => void;
  /** 保存時のコールバック */
  onSave: (apiKey: string) => void;
  /** 削除時のコールバック */
  onRemove: () => void;
  /** 現在のAPIキー */
  currentApiKey: string;
}

/**
 * APIキーをマスク表示する
 */
function maskApiKey(key: string): string {
  if (key.length <= 8) {
    return '*'.repeat(key.length);
  }
  return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
}

export default function APIKeyModal({
  isOpen,
  onClose,
  onSave,
  onRemove,
  currentApiKey,
}: APIKeyModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const hasExistingKey = currentApiKey.length > 0;

  const handleSave = useCallback(() => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('APIキーを入力してください');
      return;
    }

    if (trimmedValue.length < 10) {
      setError('APIキーは10文字以上で入力してください');
      return;
    }

    setError('');
    onSave(trimmedValue);
    setInputValue('');
    onClose();
  }, [inputValue, onSave, onClose]);

  const handleRemove = useCallback(() => {
    onRemove();
    setInputValue('');
    setError('');
  }, [onRemove]);

  const handleClose = useCallback(() => {
    setInputValue('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="APIキー設定">
      <div className="space-y-4">
        {/* 説明テキスト */}
        <p className="text-sm text-gray-600">
          Gemini APIキーを入力してください。APIキーは
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>
          から取得できます。
        </p>

        {/* 既存APIキー表示 */}
        {hasExistingKey && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600 mb-1">現在のAPIキー:</p>
            <p className="font-mono text-sm">{maskApiKey(currentApiKey)}</p>
          </div>
        )}

        {/* 入力フォーム */}
        <Input
          label={hasExistingKey ? '新しいAPIキー' : 'APIキー'}
          type="password"
          placeholder="AIzaSy..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          error={error}
        />

        {/* ボタン */}
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            保存
          </Button>
          {hasExistingKey && (
            <Button variant="danger" onClick={handleRemove}>
              削除
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
