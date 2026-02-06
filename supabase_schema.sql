-- Create quotes table
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
  items jsonb default '[]'::jsonb, -- Storing items array as JSONB
  remarks text,
  user_id uuid references auth.users not null default auth.uid(), -- Link to auth.users
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.quotes enable row level security;

-- Create policies for public access (No Login feature)
-- Allow Select (Only own records)
create policy "Users can read own quotes"
on public.quotes for select
to authenticated
using (auth.uid() = user_id);

-- Allow Insert (Associate with own UID)
create policy "Users can insert own quotes"
on public.quotes for insert
to authenticated
with check (auth.uid() = user_id);

-- Allow Update (Only own records)
create policy "Users can update own quotes"
on public.quotes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Allow Delete (Only own records)
create policy "Users can delete own quotes"
on public.quotes for delete
to authenticated
using (auth.uid() = user_id);
