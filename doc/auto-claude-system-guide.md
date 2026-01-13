# Auto Claude システムガイド

Auto Claudeの仕組みと、普段のクロ（Claude Code CLI）との比較をまとめたドキュメント。

---

## 1. Auto Claudeと普段のクロ：同じワークフロー、違いは自動化

### 基本的な流れは同じ

| ステップ | 普段のクロ | Auto Claude |
|----------|-----------|-------------|
| 要件確認 | あおいさんと対話 | Discoveryフェーズ |
| 仕様書作成 | doc/にドキュメント | spec.md |
| 計画管理 | TodoWrite | implementation_plan.json |
| 実装 | コードを書く | Coder Agent |
| 品質検証 | Playwrightで確認 | QA Loop（自動） |
| 問題修正 | あおいさんの指摘で直す | QA Fixer（自動） |
| 記憶保存 | Graphiti MCP | Graphiti Memory |

### 本質的な違いは「自動化の度合い」

```
┌─────────────────────────────────────────────────────────────┐
│                    普段のクロ（半自動）                      │
│                                                             │
│  あおいさん ←→ クロ ←→ あおいさん ←→ クロ ←→ ...         │
│      │           │          │           │                  │
│    要件確認    実装      確認依頼     修正                  │
│                                                             │
│  ※ 各ステップであおいさんとの対話が入る                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Auto Claude（全自動）                      │
│                                                             │
│  あおいさん → [Discovery → Spec → Plan → Code → QA Loop]   │
│      │                        │                             │
│   最初の指示               自律実行（最大50回ループ）        │
│                                                             │
│  ※ 最初の入力後は自律的に進行                               │
└─────────────────────────────────────────────────────────────┘
```

### やっていることは同じ

- **ドキュメント作成**: クロもdoc/に仕様書を作る、Auto Claudeもspec.mdを作る
- **品質検証**: クロもPlaywright MCPでブラウザ確認できる、Auto CloudeもElectron MCPで自動テスト
- **記憶システム**: 両方ともGraphitiを使える

違いは「対話しながら進める」か「自律的に最後まで進む」か、という点だけ。

---

## 2. 記憶システム：GUIとCLIで設定場所が違う

### 2つのモデルが必要

| 役割 | 担当 | 説明 |
|------|------|------|
| **Embedding** | Ollama（ローカル） | テキストをベクトル（数値配列）に変換 |
| **LLM（検索結果の活用）** | Claude Agent SDK | 検索結果を使って回答を生成 |

```
【記憶を保存するとき】
  「認証機能を実装した」
         │
         ▼ Embedding Model（Ollama）
  [0.12, -0.34, 0.56, ...] ← 2560次元のベクトル
         │
         ▼
    グラフDBに保存

【記憶を検索・活用するとき】
  「認証について教えて」
         │
         ▼ Embedding Model（Ollama）
  [0.11, -0.33, 0.55, ...] ← クエリをベクトル化
         │
         ▼
    類似ベクトルを検索（コサイン類似度）
         │
         ▼
    関連する記憶がヒット！
         │
         ▼ LLM（Claude Agent SDK）
  「認証機能は〇〇で実装されています」← 回答生成
```

### Embeddingの設定（Ollama）

| 項目 | 値 |
|------|-----|
| プロバイダー | Ollama（ローカル・無料） |
| モデル | qwen3-embedding:4b |
| 次元数 | 2560 |
| URL | http://localhost:11434 |

### LLM（検索結果の活用）

Claude Agent SDK（サブスク範囲内）が担当。
Graphiti側でLLMプロバイダーを設定する必要はない。

### 設定ファイルの場所が異なる

#### GUI（Electron）の設定
```
~/.config/auto-claude-ui/settings.json
```

```json
{
  "memoryEnabled": true,
  "memoryEmbeddingProvider": "ollama",
  "memoryOllamaEmbeddingModel": "qwen3-embedding:4b",
  "memoryOllamaEmbeddingDim": 2560,
  "ollamaBaseUrl": "http://localhost:11434"
}
```

#### CLI（Python）の設定
```
apps/backend/.env
```

```bash
GRAPHITI_ENABLED=true
GRAPHITI_EMBEDDER_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:4b
OLLAMA_EMBEDDING_DIM=2560
```

**重要**: GUIとCLIで設定場所が別なので、両方使う場合は両方に設定が必要。

---

## 3. サーバー構成：2つの異なるサービス

### ポートの役割

| ポート | サービス | 役割 |
|--------|---------|------|
| **11434** | Ollama | Embedding計算のAPIサーバー |
| **8000** | Graphiti MCP Server | 記憶システムのメインAPI |

### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                Auto Claude / クロ（エージェント）            │
│                                                             │
│    「この情報を記憶して」「〇〇について検索して」            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ MCP経由でアクセス
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Graphiti MCP Server（ポート8000）               │
│                                                             │
│    記憶システムの「窓口」                                    │
│    - 記憶の保存                                             │
│    - 記憶の検索                                             │
│    - グラフ構造の管理                                       │
│                                                             │
│    ※ stdioモードで動作時はポート不使用                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Embedding計算を依頼
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Ollama（ポート11434）                       │
│                                                             │
│    Embedding計算の「裏方」                                   │
│    - テキスト → ベクトル変換                                │
│    - qwen3-embedding:4b（2560次元）                         │
│                                                             │
│    http://localhost:11434 にアクセスすると                  │
│    「Ollama is running」と表示される（正常）                 │
└─────────────────────────────────────────────────────────────┘
```

### Graphiti MCP Serverの起動モード

| モード | 方式 | URL |
|--------|------|-----|
| **HTTP** | ポート8000でWebサーバー | `http://localhost:8000/mcp/` |
| **stdio** | 標準入出力で直接通信 | URLなし |

GUIが直接MCPサーバーと通信する場合は**stdioモード**で動作。
この場合、ポート8000は使用されない（ブラウザでアクセスしても接続拒否）。

### 各URLの確認方法

```bash
# Ollamaの動作確認
curl http://localhost:11434
# → "Ollama is running" と表示されればOK

# Graphiti MCP Server（HTTPモードの場合のみ）
curl http://localhost:8000/mcp/
# → stdioモードの場合は接続拒否（正常）

# ポートの状態確認
ss -tuln | grep -E ":(8000|11434)"
```

---

## まとめ

| 項目 | 内容 |
|------|------|
| **Auto Claudeとクロ** | 同じワークフロー、違いは自動化の度合い |
| **記憶システム** | GUIとCLIで設定場所が異なる |
| **Embedding** | Ollama（qwen3-embedding:4b, 2560次元） |
| **LLM** | Claude Agent SDK（サブスク範囲内） |
| **ポート11434** | Ollama（Embedding用） |
| **ポート8000** | Graphiti MCP Server（stdioモード時は不使用） |
