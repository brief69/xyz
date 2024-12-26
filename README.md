# XYZ

## XYZとは？

暗号資産、法定通貨、コモディティ、商品、サービスなどのあらゆる価格をリアルタイムで追跡し、xllという単一の単位で表示します。
常にxll全体の中央値を計算し、yllというに一つの中央値が導かれます。
yllは、常にxllの中央値であり、世界の経済活動全体の良し悪しを単一の指標で理解可能にしています。

## 主な機能

- 複数の資産カテゴリー（暗号資産、法定通貨、商品）の価格表示
- リアルタイムの価格更新
- カテゴリーによるフィルタリング
- 資産の検索機能
- レスポンシブデザイン対応
- 中央値（YLL）の自動計算

## 技術スタック

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/brief69/xyz.git

# プロジェクトディレクトリに移動
cd xyz

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ビルドと実行

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## プロジェクト構造

```bash
xyz/
├── src/
│   ├── components/     # UIコンポーネント
│   ├── hooks/         # カスタムフック
│   ├── lib/           # ユーティリティ関数
│   ├── types/         # 型定義
│   └── pages/         # ページコンポーネント
├── public/            # 静的ファイル
└── ...
```
