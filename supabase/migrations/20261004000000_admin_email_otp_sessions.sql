-- ==============================================================================
-- Migration: Admin Email OTP Approval, Active Sessions & Banned Users
-- Shared schema between DBST Solutions and GrowthMates
-- Project: qffesrikwlzsmgprrczq
-- ==============================================================================

-- 1. Table for Email Approval OTPs
CREATE TABLE IF NOT EXISTS public.admin_login_otp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  attempt_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Table for Active Sessions & Device Tracking
CREATE TABLE IF NOT EXISTS public.admin_active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  refresh_token_hash text NOT NULL, -- hash of the Supabase refresh token, so it can be revoked later
  device_label text,                -- parsed from User-Agent
  ip_address text,
  target_site text NOT NULL,        -- "growthmates" or "dbst"
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revoked_by text                   -- email of the admin who revoked it, or "self" on normal logout
);

-- 3. Table for Banned Users
CREATE TABLE IF NOT EXISTS public.admin_banned_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_at timestamptz NOT NULL DEFAULT now(),
  banned_by text NOT NULL,
  reason text
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.admin_login_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_banned_users ENABLE ROW LEVEL SECURITY;

-- 5. Strict Server-Only RLS Policies
-- All three tables: no client access at all. Every read/write goes through server routes
-- using the service key. Do not add any policy granting anon/authenticated access.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_login_otp' AND policyname = 'No direct access'
  ) THEN
    CREATE POLICY "No direct access" ON public.admin_login_otp FOR ALL USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_active_sessions' AND policyname = 'No direct access'
  ) THEN
    CREATE POLICY "No direct access" ON public.admin_active_sessions FOR ALL USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_banned_users' AND policyname = 'No direct access'
  ) THEN
    CREATE POLICY "No direct access" ON public.admin_banned_users FOR ALL USING (false);
  END IF;
END $$;

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_admin_login_otp_user_id ON public.admin_login_otp (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_login_otp_expires_at ON public.admin_login_otp (expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_login_otp_code_hash ON public.admin_login_otp (code_hash);
CREATE INDEX IF NOT EXISTS idx_admin_active_sessions_user_id ON public.admin_active_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_active_sessions_revoked_at ON public.admin_active_sessions (revoked_at);
CREATE INDEX IF NOT EXISTS idx_admin_active_sessions_target_site ON public.admin_active_sessions (target_site);
CREATE INDEX IF NOT EXISTS idx_admin_active_sessions_last_seen_at ON public.admin_active_sessions (last_seen_at DESC);
