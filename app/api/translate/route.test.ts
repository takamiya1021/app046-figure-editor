/**
 * 翻訳API Routeのテスト
 */

// NextResponse のモック
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

// GoogleGenerativeAI のモック
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Translated text for image generation',
        },
      }),
    }),
  })),
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('POST /api/translate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should translate Japanese text to English', async () => {
    const request = createMockRequest({
      text: '青い空と白い雲',
      apiKey: 'test-api-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.translatedText).toBe('Translated text for image generation');
  });

  it('should return 400 when text is missing', async () => {
    const request = createMockRequest({
      apiKey: 'test-api-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('テキストが必要です');
  });

  it('should return 400 when text is not a string', async () => {
    const request = createMockRequest({
      text: 123,
      apiKey: 'test-api-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('テキストが必要です');
  });

  it('should return 400 when apiKey is missing', async () => {
    const request = createMockRequest({
      text: 'テスト',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('APIキーが必要です');
  });

  it('should return 400 when apiKey is not a string', async () => {
    const request = createMockRequest({
      text: 'テスト',
      apiKey: 123,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('APIキーが必要です');
  });

  it('should return 401 when API key is invalid', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error('API_KEY invalid')),
      }),
    }));

    const request = createMockRequest({
      text: 'テスト',
      apiKey: 'invalid-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('APIキーが無効です');
  });

  it('should return 429 when rate limited', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error('quota exceeded 429')),
      }),
    }));

    const request = createMockRequest({
      text: 'テスト',
      apiKey: 'test-api-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('利用制限');
  });

  it('should return 500 on other errors', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error('Unknown error')),
      }),
    }));

    const request = createMockRequest({
      text: 'テスト',
      apiKey: 'test-api-key',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('翻訳中にエラーが発生しました');
  });
});
