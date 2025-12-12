import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'フィギュアエディタ - AI画像生成アプリ',
  description:
    'Gemini APIを使った高度なフィギュア画像生成アプリケーション。3Dフィギュア、三面図、アクリルスタンド、線画など様々なスタイルで画像を生成できます。',
  keywords: [
    'AI画像生成',
    'フィギュア',
    'Gemini API',
    '3Dフィギュア',
    '三面図',
    'アクリルスタンド',
    '線画',
    '画像生成',
  ],
  authors: [{ name: 'Hiroaki' }],
  creator: 'Hiroaki',
  publisher: 'Hiroaki',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'フィギュアエディタ - AI画像生成アプリ',
    description:
      'Gemini APIを使った高度なフィギュア画像生成アプリケーション。3Dフィギュア、三面図、アクリルスタンド、線画など様々なスタイルで画像を生成できます。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'フィギュアエディタ - AI画像生成アプリ',
    description:
      'Gemini APIを使った高度なフィギュア画像生成アプリケーション。3Dフィギュア、三面図、アクリルスタンド、線画など様々なスタイルで画像を生成できます。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification (必要に応じて設定)
    // google: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
