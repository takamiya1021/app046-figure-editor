/**
 * 画像生成API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from '@/lib/prompt-builder';
import type { GenerationStyle, AspectRatio } from '@/lib/types';

interface GenerateImageRequest {
  /** APIキー */
  apiKey: string;
  /** 画像のBase64データ（Data URL形式なし） */
  imageBase64: string;
  /** 画像のMIMEタイプ */
  mimeType: string;
  /** 生成スタイル */
  style: GenerationStyle;
  /** カスタムプロンプト */
  customPrompt?: string;
  /** アスペクト比 */
  aspectRatio?: AspectRatio;
}

interface GenerateImageResponse {
  /** 成功フラグ */
  success: boolean;
  /** 生成された画像のBase64データ */
  imageBase64?: string;
  /** エラーメッセージ */
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    const body: GenerateImageRequest = await request.json();
    const { apiKey, imageBase64, mimeType, style, customPrompt, aspectRatio } = body;

    // バリデーション
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'APIキーが必要です' },
        { status: 400 }
      );
    }

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { success: false, error: '画像データが必要です' },
        { status: 400 }
      );
    }

    // プロンプト構築
    const prompt = buildPrompt({
      style,
      customPrompt,
      aspectRatio,
    });

    // Gemini APIクライアント初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as never,
    });

    // 画像生成リクエスト
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const response = result.response;
    const candidate = response.candidates?.[0];

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: '画像の生成に失敗しました' },
        { status: 500 }
      );
    }

    // レスポンスから画像データを探す
    for (const part of candidate.content.parts) {
      if ('inlineData' in part && part.inlineData?.data) {
        return NextResponse.json({
          success: true,
          imageBase64: part.inlineData.data,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: '画像データが見つかりませんでした' },
      { status: 500 }
    );
  } catch (error) {
    console.error('画像生成エラー:', error);

    const message = error instanceof Error ? error.message : '不明なエラーが発生しました';

    // レート制限エラーの判定
    if (message.includes('429') || message.includes('quota')) {
      return NextResponse.json(
        { success: false, error: 'APIの利用制限に達しました。しばらく待ってから再試行してください。' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
