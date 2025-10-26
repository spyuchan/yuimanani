# いまなにしてる？

シンプルなタイムラインアプリ。今何をしているかを共有できます。

## 機能

- 名前入力でログイン（パスワード不要）
- クッキーによるログイン状態の保持
- タイムラインでの投稿閲覧
- リアルタイム更新（3秒ごとに自動チェック）
- ログアウト機能

## ファイル構成

```
.
├── api/              # Vercel Serverless Functions
│   └── posts.js      # 投稿の取得・作成API
├── src/              # フロントエンド
│   └── index.html    # メインHTML
├── server.js         # ローカル開発用サーバー
├── vercel.json       # Vercel設定
└── package.json      # プロジェクト設定
```

## デプロイ方法

### Vercelへのデプロイ

1. Vercelアカウントを作成（[vercel.com](https://vercel.com)）
2. GitHubリポジトリを接続
3. Vercelが自動的にデプロイ

または、CLIでデプロイ：

```bash
npm i -g vercel
vercel
```

## 注意事項

現在、データはメモリベースで保存されています（サーバー再起動でデータがリセットされます）。

本番環境で使用する場合は、以下のいずれかの外部データベースへの移行を推奨します：

- **Vercel KV**: VercelのKey-Valueストレージ
- **Airtable**: スプレッドシートのようなデータベース
- **Supabase**: Firebaseのオープンソース代替
- **Firebase**: Googleのリアルタイムデータベース

## ローカル開発

### 方法1: Node.jsで直接起動（推奨）

```bash
# ローカルサーバーを起動
node server.js
```

サーバーが起動すると、http://localhost:3000 でアクセスできます。

### 方法2: Vercel CLIで起動

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# ローカルサーバーを起動
vercel dev
```

### テスト方法

1. ブラウザで http://localhost:3000 を開く
2. 名前を入力してログイン
3. 投稿を作成
4. 別のブラウザタブで同じURLを開いて、リアルタイム更新を確認

### サーバーの停止・再起動

**サーバーを停止する場合：**
- ターミナルで `Ctrl+C` を押す
- または、別のターミナルで `pkill -f "node server.js"` を実行

**サーバーを再起動する場合：**
```bash
node server.js
```

**ポートが使用中のエラーが出た場合：**
```bash
# ポート3000を使用しているプロセスを確認
lsof -ti:3000

# プロセスを停止（PIDは上記のコマンドで取得した番号）
kill <PID>
```

## 仕様

- 最大投稿文字数: 50文字
- 自動更新間隔: 3秒
- ログイン状態保持期間: 30日間

