/**
 * メインページのテスト
 */

import { render, screen } from '@testing-library/react';
import Home from './page';

// useAPIKeyフックのモック
jest.mock('@/hooks/useAPIKey', () => ({
  useAPIKey: () => ({
    apiKey: null,
    saveApiKey: jest.fn(),
    removeApiKey: jest.fn(),
  }),
}));

describe('Home', () => {
  it('アプリのタイトルが表示される', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /フィギュアエディタ/i })).toBeInTheDocument();
  });

  it('APIキー設定ボタンが表示される', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: /APIキー設定/i })).toBeInTheDocument();
  });

  it('画像アップロードエリアが表示される', () => {
    render(<Home />);
    expect(screen.getByText(/ドラッグ&ドロップで画像をアップロード/i)).toBeInTheDocument();
  });

  it('スタイル選択が表示される', () => {
    render(<Home />);
    expect(screen.getByText('スタイル')).toBeInTheDocument();
  });

  it('生成コントロールが表示される', () => {
    render(<Home />);
    expect(screen.getByText('生成枚数')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /生成する/i })).toBeInTheDocument();
  });
});
