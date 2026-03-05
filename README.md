# Astro + shadcn/ui Demo

Astro 5 と shadcn/ui を使った社内弁当注文管理のデモアプリケーションです。管理者画面・ユーザー画面のロール切り替え、CRUD 操作、複雑なフォームを含みます。

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (SSR, Node adapter) |
| UI Library | React 19 (Islands) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Validation | Zod |
| Linter | Biome |
| Language | TypeScript (strict) |

## Getting Started

```bash
npm install
npm run dev
```

http://localhost:4321 で開きます。

## Pages

### User

| URL | Description |
|---|---|
| `/` | ホーム（お知らせ + メニュー一覧） |
| `/menu/lunch/` | お昼弁当一覧 |
| `/menu/snack/` | おやつ一覧 |
| `/menu/item/:id/` | メニュー詳細 + 注文フォーム |
| `/notices/` | お知らせ一覧 |
| `/register/` | ユーザー登録フォーム |

### Admin

| URL | Description |
|---|---|
| `/admin/` | ダッシュボード |
| `/admin/menu/lunch/` | お昼弁当メニュー管理 |
| `/admin/menu/snack/` | おやつメニュー管理 |
| `/admin/orders/` | 注文一覧 |
| `/admin/notices/` | お知らせ管理（CRUD） |
| `/admin/users/` | ユーザー一覧 |

画面右上でロール切り替え可能。Cookie + middleware でルーティングを制御しています。

## Project Structure

```
src/
├── components/ui/       # shadcn/ui (auto-generated)
├── features/
│   ├── menu/            # メニュー（型, データ, コンポーネント）
│   ├── order/           # 注文
│   ├── notice/          # お知らせ
│   ├── user/            # ユーザー
│   └── dashboard/       # ダッシュボード（集約ビュー）
├── pages/
│   ├── admin/           # 管理者ページ + 動的ルート
│   ├── menu/            # ユーザー向けメニューページ
│   ├── api/             # API endpoints
│   └── ...
├── shared/              # 共通レイアウト, 型, ユーティリティ
└── styles/              # Tailwind + shadcn テーマ
```

詳細は [AGENTS.md](./AGENTS.md) を参照。

## Commands

| Command | Action |
|---|---|
| `npm run dev` | 開発サーバー起動 (localhost:4321) |
| `npm run build` | ビルド |
| `npm run preview` | ビルド後プレビュー |
| `npx biome check --write .` | Lint + format |

## Data

データはインメモリで保持しています。API route 経由で CRUD 操作が可能で、管理者の変更はユーザー側に即反映されます。サーバー再起動で初期データに戻ります。

```
React Island → POST /api/* → In-memory store ← SSR read → Astro page
```
