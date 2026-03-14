# Claude-postapp
Claude code の理解を深めるためにユーザー投稿型のアプリを作成しました。
Ruby on Rails + React + TypeScript で構築した投稿アプリです。

## 技術構成

| 役割 | 技術 |
|---|---|
| バックエンド | Ruby on Rails 8.1.2（API モード） |
| フロントエンド | React + TypeScript（Vite） |
| データベース | PostgreSQL 17 |
| 認証 | JWT（JSON Web Token） |
| API 通信 | axios |
| ルーティング | React Router v7 |

## ディレクトリ構成

```
Claude-postapp/
├── backend/          # Rails API サーバー
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   │   ├── auth_controller.rb   # 認証 API
│   │   │   └── posts_controller.rb  # 投稿 CRUD API
│   │   └── models/
│   │       ├── user.rb
│   │       └── post.rb
│   └── lib/
│       └── jwt_helper.rb            # JWT トークン生成・検証
└── frontend/         # React フロントエンド
    └── src/
        ├── api/          # API 通信関数
        ├── components/   # 共通コンポーネント
        ├── contexts/     # 認証コンテキスト
        ├── pages/        # 各画面
        └── types/        # 型定義
```

## 実装済み機能（MVP）

- ユーザー登録 / ログイン / ログアウト
- 投稿一覧表示
- 投稿詳細表示
- 投稿作成（ログイン必須）
- 投稿編集（投稿者本人のみ）
- 投稿削除（投稿者本人のみ）

## セットアップ

### 前提条件

- Ruby 3.3.10（rbenv 管理）
- Node.js v24
- PostgreSQL 17

### バックエンド

```bash
cd backend

# 依存パッケージのインストール
~/.rbenv/versions/3.3.10/bin/bundle install

# データベース作成 & マイグレーション
~/.rbenv/versions/3.3.10/bin/ruby bin/rails db:create db:migrate

# サーバー起動（3001番ポート）
~/.rbenv/versions/3.3.10/bin/ruby bin/rails server -p 3001
```

### フロントエンド

```bash
cd frontend

# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## API 一覧

### 認証

| メソッド | パス | 説明 | 認証 |
|---|---|---|---|
| POST | `/api/v1/signup` | ユーザー登録 | 不要 |
| POST | `/api/v1/login` | ログイン | 不要 |
| DELETE | `/api/v1/logout` | ログアウト | 必要 |

### 投稿

| メソッド | パス | 説明 | 認証 |
|---|---|---|---|
| GET | `/api/v1/posts` | 投稿一覧取得 | 不要 |
| GET | `/api/v1/posts/:id` | 投稿詳細取得 | 不要 |
| POST | `/api/v1/posts` | 投稿作成 | 必要 |
| PATCH | `/api/v1/posts/:id` | 投稿更新 | 必要（本人のみ） |
| DELETE | `/api/v1/posts/:id` | 投稿削除 | 必要（本人のみ） |

### 認証方式

リクエストヘッダーに JWT トークンを付与します。

```
Authorization: Bearer <token>
```

## DB 設計

### users

| カラム | 型 | 制約 |
|---|---|---|
| id | bigint | PK |
| name | string | NOT NULL |
| email | string | NOT NULL, UNIQUE |
| password_digest | string | NOT NULL |
| created_at | datetime | NOT NULL |
| updated_at | datetime | NOT NULL |

### posts

| カラム | 型 | 制約 |
|---|---|---|
| id | bigint | PK |
| user_id | bigint | FK, NOT NULL |
| title | string | NOT NULL |
| content | text | NOT NULL |
| created_at | datetime | NOT NULL |
| updated_at | datetime | NOT NULL |

## 追加予定機能

- 画像アップロード
- いいね機能
- コメント機能
- 検索機能
- タグ機能
