/**
 * ユーティリティ関数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を結合し、Tailwindの重複クラスをマージする
 * @param inputs - クラス名（文字列、配列、オブジェクト、条件式など）
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * FileオブジェクトをBase64文字列に変換する
 * @param file - 変換するファイル
 * @returns Base64文字列（Data URL形式）
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Base64文字列をBlobに変換する
 * @param base64 - Base64文字列（Data URL形式または純粋なBase64）
 * @param mimeType - MIMEタイプ（Data URL形式でない場合に必要）
 * @returns Blob
 */
export function base64ToBlob(base64: string, mimeType?: string): Blob {
  let actualBase64 = base64;
  let actualMimeType = mimeType;

  // Data URL形式の場合、MIMEタイプとBase64部分を抽出
  if (base64.startsWith('data:')) {
    const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      actualMimeType = matches[1];
      actualBase64 = matches[2];
    }
  }

  // Base64をデコード
  const byteCharacters = atob(actualBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: actualMimeType || 'application/octet-stream' });
}

/**
 * ユニークなIDを生成する
 * @param prefix - ID のプレフィックス
 * @returns ユニークなID
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * ファイルサイズを人間が読める形式に変換
 * @param bytes - バイト数
 * @returns フォーマットされた文字列（例: "1.5 MB"）
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * ファイル名から拡張子を取得
 * @param filename - ファイル名
 * @returns 拡張子（小文字、ドットなし）
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * 画像ファイルかどうかを判定
 * @param file - ファイル
 * @returns 画像ファイルの場合true
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
