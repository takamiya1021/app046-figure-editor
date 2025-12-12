/**
 * Root Layoutのテスト
 */

import { render } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('正しくレンダリングされる', () => {
    const { container } = render(
      <RootLayout>
        <div>テストコンテンツ</div>
      </RootLayout>
    );

    const html = container.querySelector('html');
    const body = container.querySelector('body');

    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute('lang', 'ja');
    expect(body).toBeInTheDocument();
  });

  it('子要素が正しくレンダリングされる', () => {
    const { getByText } = render(
      <RootLayout>
        <div>テストコンテンツ</div>
      </RootLayout>
    );

    expect(getByText('テストコンテンツ')).toBeInTheDocument();
  });

  describe('metadata', () => {
    it('正しいタイトルが設定されている', () => {
      expect(metadata.title).toBe('フィギュアエディタ - AI画像生成アプリ');
    });

    it('正しいdescriptionが設定されている', () => {
      expect(metadata.description).toBe(
        'Gemini APIを使った高度なフィギュア画像生成アプリケーション。3Dフィギュア、三面図、アクリルスタンド、線画など様々なスタイルで画像を生成できます。'
      );
    });

    it('keywordsが設定されている', () => {
      expect(metadata.keywords).toContain('AI画像生成');
      expect(metadata.keywords).toContain('フィギュア');
      expect(metadata.keywords).toContain('Gemini API');
    });

    it('OGP設定が正しい', () => {
      expect(metadata.openGraph?.title).toBe(
        'フィギュアエディタ - AI画像生成アプリ'
      );
      expect(metadata.openGraph?.type).toBe('website');
    });
  });
});
