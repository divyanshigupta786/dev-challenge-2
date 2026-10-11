-- Mundane Optional Cloud Sync Migration
-- For users who opt-in to cross-device backup with Supabase

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id TEXT NOT NULL,
    quest_title TEXT NOT NULL,
    theme TEXT NOT NULL,
    observation_text TEXT NOT NULL,
    ai_reflection JSONB,
    place_label TEXT,
    photo_url TEXT,
    observed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own entries
CREATE POLICY "Users can select own entries"
    ON public.journal_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own entries
CREATE POLICY "Users can insert own entries"
    ON public.journal_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own entries
CREATE POLICY "Users can update own entries"
    ON public.journal_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own entries
CREATE POLICY "Users can delete own entries"
    ON public.journal_entries
    FOR DELETE
    USING (auth.uid() = user_id);
