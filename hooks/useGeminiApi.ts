'use client';

import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

// フィギュア化プロンプト
const FIGURE_PROMPT = `この画像をリアルなフィギュア・スタチュー風に変換してください。
以下の特徴を持つように生成してください：
- 実際のフィギュア製品のような質感
- PVCやレジン素材のような光沢感
- 立体的な造形を感じさせる陰影
- フィギュアの台座（ベース）を追加
- スタジオ撮影のような背景
- 高品質なフィギュア製品写真のような仕上がり`;

interface UseGeminiApiResult {
  generateFigure: (imageBase64: string, mimeType: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useGeminiApi = (apiKey: string | null): UseGeminiApiResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateFigure = useCallback(
    async (imageBase64: string, mimeType: string): Promise<string> => {
      if (!apiKey) {
        throw new Error('APIキーが設定されていません');
      }

      setIsLoading(true);
      setError(null);

      try {
        const genAI = new GoogleGenAI({ apiKey });

        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [
            {
              role: 'user',
              parts: [
                { text: FIGURE_PROMPT },
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['IMAGE'],
          },
        });

        // レスポンスから画像データを取得
        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.[0];

        if (part && 'inlineData' in part && part.inlineData?.data) {
          return part.inlineData.data;
        }

        throw new Error('画像の生成に失敗しました');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '不明なエラーが発生しました';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  return {
    generateFigure,
    isLoading,
    error,
    clearError,
  };
};
