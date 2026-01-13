/**
 * プロンプトビルダーのテスト
 */

import { buildPrompt, getBasePrompt } from './prompt-builder';
import type { GenerationStyle, PackageOptions, DisplayStandOptions, BackgroundOptions, ThreeViewOptions, AcrylicStandOptions, LineArtOptions } from './types';

describe('prompt-builder', () => {
  describe('getBasePrompt', () => {
    it('figureスタイルのベースプロンプトを返す', () => {
      const prompt = getBasePrompt('figure');
      expect(prompt).toContain('フィギュア');
      expect(prompt).toContain('PVC');
    });

    it('three-viewスタイルのベースプロンプトを返す', () => {
      const prompt = getBasePrompt('three-view');
      expect(prompt).toContain('三面図');
      expect(prompt).toContain('正面');
    });

    it('acrylic-standスタイルのベースプロンプトを返す', () => {
      const prompt = getBasePrompt('acrylic-stand');
      expect(prompt).toContain('アクリルスタンド');
    });

    it('line-artスタイルのベースプロンプトを返す', () => {
      const prompt = getBasePrompt('line-art');
      expect(prompt).toContain('線画');
    });

    it('freeスタイルは空文字を返す', () => {
      const prompt = getBasePrompt('free');
      expect(prompt).toBe('');
    });
  });

  describe('buildPrompt', () => {
    it('スタイルに基づいたプロンプトを構築する', () => {
      const prompt = buildPrompt({
        style: 'figure',
      });
      expect(prompt).toContain('フィギュア');
    });

    it('カスタムプロンプトを追加できる', () => {
      const prompt = buildPrompt({
        style: 'free',
        customPrompt: 'カスタムプロンプト',
      });
      expect(prompt).toContain('カスタムプロンプト');
    });

    it('アスペクト比を含める', () => {
      const prompt = buildPrompt({
        style: 'figure',
        aspectRatio: '1:1',
      });
      expect(prompt).toContain('1:1');
    });

    // パッケージオプションのテスト
    describe('packageOptions', () => {
      it('パッケージ配置がbesideの場合、プロンプトに含める', () => {
        const packageOptions: PackageOptions = {
          position: 'beside',
          hasTexture: false,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).toContain('パッケージ');
        expect(prompt).toContain('横に並べて');
      });

      it('パッケージ配置がinsideの場合、プロンプトに含める', () => {
        const packageOptions: PackageOptions = {
          position: 'inside',
          hasTexture: false,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).toContain('パッケージ');
        expect(prompt).toContain('中に');
      });

      it('パッケージ配置がnoneの場合、プロンプトに含めない', () => {
        const packageOptions: PackageOptions = {
          position: 'none',
          hasTexture: false,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).not.toContain('パッケージ');
      });

      it('パッケージテキストがある場合、プロンプトに含める', () => {
        const packageOptions: PackageOptions = {
          position: 'beside',
          text: 'Limited Edition',
          hasTexture: false,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).toContain('Limited Edition');
      });

      it('ロゴテキストがある場合、プロンプトに含める', () => {
        const packageOptions: PackageOptions = {
          position: 'beside',
          logoText: 'GOODSMILE',
          hasTexture: false,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).toContain('GOODSMILE');
      });

      it('テクスチャがある場合、プロンプトに含める', () => {
        const packageOptions: PackageOptions = {
          position: 'beside',
          hasTexture: true,
        };
        const prompt = buildPrompt({
          style: 'figure',
          packageOptions,
        });
        expect(prompt).toContain('テクスチャ');
      });
    });

    // 展示台オプションのテスト
    describe('displayStandOptions', () => {
      it('展示台が有効な場合、形状をプロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'hexagon',
          material: 'gaming',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('展示台');
        expect(prompt).toContain('六角形');
      });

      it('展示台が無効な場合、プロンプトに含めない', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: false,
          shape: 'circle',
          material: 'gaming',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).not.toContain('展示台');
      });

      it('ゲーミング材質でレインボーの場合、プロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'circle',
          material: 'gaming',
          isRainbow: true,
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('レインボー');
        expect(prompt).toContain('LED');
      });

      it('木材タイプの場合、プロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'square',
          material: 'wood',
          woodType: 'walnut',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('木材');
        expect(prompt).toContain('ウォールナット');
      });

      it('金属タイプの場合、プロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'circle',
          material: 'metal',
          metalType: 'gold',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('金属');
        expect(prompt).toContain('ゴールド');
      });

      it('鉱物タイプの場合、プロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'hexagon',
          material: 'mineral',
          mineralType: 'marble',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('鉱物');
        expect(prompt).toContain('大理石');
      });

      it('カスタム材質の場合、説明をプロンプトに含める', () => {
        const displayStandOptions: DisplayStandOptions = {
          enabled: true,
          shape: 'circle',
          material: 'custom',
          customDescription: '透明なガラス製の台座',
        };
        const prompt = buildPrompt({
          style: 'figure',
          displayStandOptions,
        });
        expect(prompt).toContain('透明なガラス製の台座');
      });
    });

    // 背景オプションのテスト
    describe('backgroundOptions', () => {
      it('背景が有効でスタジオの場合、プロンプトに含める', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: true,
          type: 'studio',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).toContain('背景');
        expect(prompt).toContain('スタジオ');
      });

      it('背景が無効な場合、プロンプトに含めない', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: false,
          type: 'studio',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).not.toContain('背景:');
      });

      it('ショップ背景の場合、プロンプトに含める', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: true,
          type: 'shop',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).toContain('ショップ');
      });

      it('デスクトップ背景の場合、プロンプトに含める', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: true,
          type: 'desktop',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).toContain('デスクトップ');
      });

      it('ジオラマ背景の場合、プロンプトに含める', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: true,
          type: 'diorama',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).toContain('ジオラマ');
      });

      it('カスタム背景の場合、説明をプロンプトに含める', () => {
        const backgroundOptions: BackgroundOptions = {
          enabled: true,
          type: 'custom',
          customDescription: '夕暮れの海辺',
        };
        const prompt = buildPrompt({
          style: 'figure',
          backgroundOptions,
        });
        expect(prompt).toContain('夕暮れの海辺');
      });
    });

    // 三面図オプションのテスト
    describe('threeViewOptions', () => {
      it('figurizeがtrueの場合、フィギュア化指示をプロンプトに含める', () => {
        const threeViewOptions: ThreeViewOptions = {
          figurize: true,
        };
        const prompt = buildPrompt({
          style: 'three-view',
          threeViewOptions,
        });
        expect(prompt).toContain('三面図');
        expect(prompt).toContain('フィギュア');
        expect(prompt).toContain('PVC');
      });

      it('figurizeがfalseの場合、通常の三面図プロンプトのみ', () => {
        const threeViewOptions: ThreeViewOptions = {
          figurize: false,
        };
        const prompt = buildPrompt({
          style: 'three-view',
          threeViewOptions,
        });
        expect(prompt).toContain('三面図');
        expect(prompt).not.toContain('フィギュア化');
      });

      it('threeViewOptionsがない場合、通常の三面図プロンプトを使用', () => {
        const prompt = buildPrompt({
          style: 'three-view',
        });
        expect(prompt).toContain('三面図');
        expect(prompt).not.toContain('フィギュア化');
      });

      it('三面図スタイル以外ではthreeViewOptionsを無視する', () => {
        const threeViewOptions: ThreeViewOptions = {
          figurize: true,
        };
        const prompt = buildPrompt({
          style: 'figure',
          threeViewOptions,
        });
        expect(prompt).not.toContain('フィギュア化して');
      });
    });

    // アクリルスタンドオプションのテスト
    describe('acrylicStandOptions', () => {
      it('hasOutlineがtrueの場合、縁取り指示をプロンプトに含める', () => {
        const acrylicStandOptions: AcrylicStandOptions = {
          hasOutline: true,
        };
        const prompt = buildPrompt({
          style: 'acrylic-stand',
          acrylicStandOptions,
        });
        expect(prompt).toContain('アクリルスタンド');
        expect(prompt).toContain('縁取り');
      });

      it('hasOutlineがfalseの場合、縁取り指示を含めない', () => {
        const acrylicStandOptions: AcrylicStandOptions = {
          hasOutline: false,
        };
        const prompt = buildPrompt({
          style: 'acrylic-stand',
          acrylicStandOptions,
        });
        expect(prompt).toContain('アクリルスタンド');
        expect(prompt).not.toContain('白い縁取り');
      });

      it('アクスタスタイル以外ではacrylicStandOptionsを無視する', () => {
        const acrylicStandOptions: AcrylicStandOptions = {
          hasOutline: true,
        };
        const prompt = buildPrompt({
          style: 'figure',
          acrylicStandOptions,
        });
        expect(prompt).not.toContain('白い縁取り');
      });
    });

    // 線画オプションのテスト
    describe('lineArtOptions', () => {
      it('線の太さがthinの場合、プロンプトに含める', () => {
        const lineArtOptions: LineArtOptions = {
          thickness: 'thin',
        };
        const prompt = buildPrompt({
          style: 'line-art',
          lineArtOptions,
        });
        expect(prompt).toContain('線画');
        expect(prompt).toContain('細め');
      });

      it('線の太さがmediumの場合、プロンプトに含める', () => {
        const lineArtOptions: LineArtOptions = {
          thickness: 'medium',
        };
        const prompt = buildPrompt({
          style: 'line-art',
          lineArtOptions,
        });
        expect(prompt).toContain('線画');
        expect(prompt).toContain('普通');
      });

      it('線の太さがthickの場合、プロンプトに含める', () => {
        const lineArtOptions: LineArtOptions = {
          thickness: 'thick',
        };
        const prompt = buildPrompt({
          style: 'line-art',
          lineArtOptions,
        });
        expect(prompt).toContain('線画');
        expect(prompt).toContain('太め');
      });

      it('線画スタイル以外ではlineArtOptionsを無視する', () => {
        const lineArtOptions: LineArtOptions = {
          thickness: 'thick',
        };
        const prompt = buildPrompt({
          style: 'figure',
          lineArtOptions,
        });
        expect(prompt).not.toContain('線の太さ');
      });
    });
  });
});
