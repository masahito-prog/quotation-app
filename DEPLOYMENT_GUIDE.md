# Supabase 連携ガイド / デプロイ手順書

本アプリケーションは **Supabase (クラウドデータベース)** を使用して見積データを保存します。

## 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com) にアクセス＆ログイン。
2. 「New Project」でプロジェクト作成。

## 2. データベースの準備 (SQL実行)
Supabaseの **SQL Editor** で以下のSQLを実行してテーブルを作成してください。

```sql
create table if not exists public.quotes (
  id uuid default gen_random_uuid() primary key,
  quote_number text not null,
  status text not null default 'draft',
  customer_name text not null,
  honorific text not null default '御中',
  issue_date date,
  expiry_date date,
  tax_rate integer default 10,
  subtotal integer default 0,
  tax_amount integer default 0,
  total_amount integer default 0,
  items jsonb default '[]'::jsonb,
  remarks text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.quotes enable row level security;

create policy "Allow public read access" on public.quotes for select to anon using (true);
create policy "Allow public insert access" on public.quotes for insert to anon with check (true);
create policy "Allow public update access" on public.quotes for update to anon using (true);
create policy "Allow public delete access" on public.quotes for delete to anon using (true);
```

## 3. 環境変数の設定
**Project Settings > API** から `URL` と `anon public key` を取得し、環境変数に設定します。

### Vercelの場合
Settings > Environment Variables に以下を追加:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ローカルの場合
`.env.local` ファイルを作成:
```bash
NEXT_PUBLIC_SUPABASE_URL=あなたのURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのAnonKey
```
