/**
 * ユーティリティ関数のテスト
 */

import { cn, fileToBase64, base64ToBlob, generateId } from './utils';

describe('ユーティリティ関数テスト', () => {
  describe('cn (classname utility)', () => {
    it('複数のクラス名を結合する', () => {
      const result = cn('foo', 'bar', 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('条件付きクラス名を処理する', () => {
      const result = cn('foo', false && 'bar', 'baz');
      expect(result).toBe('foo baz');
    });

    it('Tailwindの重複クラスをマージする', () => {
      const result = cn('p-4', 'p-8');
      // tailwind-mergeが最後のp-8を優先
      expect(result).toBe('p-8');
    });

    it('undefinedとnullを無視する', () => {
      const result = cn('foo', undefined, null, 'bar');
      expect(result).toBe('foo bar');
    });
  });

  describe('fileToBase64', () => {
    it('Fileオブジェクトをbase64文字列に変換する', async () => {
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });
      const result = await fileToBase64(file);
      expect(result).toMatch(/^data:text\/plain;base64,/);
    });

    it('画像ファイルを変換する', async () => {
      // 1x1の透明なPNG画像のバイナリデータ
      const pngData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      const file = new File([pngData], 'test.png', { type: 'image/png' });
      const result = await fileToBase64(file);
      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('base64ToBlob', () => {
    it('base64文字列をBlobに変換する', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgo=';
      const blob = base64ToBlob(base64);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });

    it('data URL prefixなしでも動作する', () => {
      const base64 = 'iVBORw0KGgo=';
      const blob = base64ToBlob(base64, 'image/png');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });
  });

  describe('generateId', () => {
    it('ユニークなIDを生成する', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('prefixを追加できる', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test-/);
    });
  });
});
