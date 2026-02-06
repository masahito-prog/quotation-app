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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.quotes enable row level security;

-- Create policies for public access (No Login feature)
-- Allow Select
create policy "Allow public read access"
on public.quotes for select
to anon
using (true);

-- Allow Insert
create policy "Allow public insert access"
on public.quotes for insert
to anon
with check (true);

-- Allow Update
create policy "Allow public update access"
on public.quotes for update
to anon
using (true);

-- Allow Delete
create policy "Allow public delete access"
on public.quotes for delete
to anon
using (true);
