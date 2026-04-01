-- Migration: progression, gold economy, and habit pledge support
-- Date: 2026-03-31

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS inventory_gold INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.habits
  ADD COLUMN IF NOT EXISTS quest_type TEXT NOT NULL DEFAULT 'daily'
    CHECK (quest_type IN ('daily', 'epic')),
  ADD COLUMN IF NOT EXISTS pledge_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pledge_target_days INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tasks_user_created_at
  ON public.tasks(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_habits_user_created_at
  ON public.habits(user_id, created_at DESC);
