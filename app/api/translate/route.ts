/**
 * 翻訳API Route
 * 日本語プロンプトを英語に翻訳
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { text, apiKey } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'テキストが必要です' },
        { status: 400 }
      );
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'APIキーが必要です' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `以下の日本語テキストを、画像生成AIに適した英語プロンプトに翻訳してください。
翻訳のルール:
- 画像生成に適した、具体的で視覚的な表現を使う
- 曖昧な表現を避け、明確な描写にする
- 翻訳結果のみを出力し、説明は含めない

日本語テキスト:
${text}

英語翻訳:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const translatedText = response.text().trim();

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'APIキーが無効です' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'APIの利用制限に達しました。しばらく待ってから再試行してください。' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: '翻訳中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
