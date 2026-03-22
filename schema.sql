-- Wudle word list table
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/<your-project>/sql

CREATE TABLE IF NOT EXISTS words (
  id         serial PRIMARY KEY,
  word       varchar(5) NOT NULL UNIQUE,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Row-level security: allow anyone to read active words (no auth required)
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active words"
  ON words FOR SELECT
  USING (active = true);

-- Optional: seed with some starter words
-- INSERT INTO words (word) VALUES ('slay'), ('vibe'), ('flex'), ('clout'), ('stan');
