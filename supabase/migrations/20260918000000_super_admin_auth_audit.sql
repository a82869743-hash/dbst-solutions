-- ==============================================================================
-- Super Admin Auth, Durable Rate Limiting & Audit Log Optimization Migration
-- Project: qffesrikwlzsmgprrczq (Shared between GrowthMates and D-BST)
-- ==============================================================================

-- 1. Ensure app_role type exists without failing on databases where it was created earlier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- 2. Ensure user_roles table and has_role security definer function are defined
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Ensure RLS policies on user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can read own roles'
  ) THEN
    CREATE POLICY "Users can read own roles"
      ON public.user_roles FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins can insert roles'
  ) THEN
    CREATE POLICY "Admins can insert roles"
      ON public.user_roles FOR INSERT
      TO authenticated
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins can delete roles'
  ) THEN
    CREATE POLICY "Admins can delete roles"
      ON public.user_roles FOR DELETE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 4. Durable Serverless Rate Limiting Table
-- Backs attempt counting and lockout cooldown across all Vercel function instances
CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL UNIQUE, -- ip::email
  ip TEXT NOT NULL,
  email TEXT NOT NULL,
  attempt_count INT NOT NULL DEFAULT 0,
  first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
-- By default with no public policies, only service_role (bypassing RLS) can access admin_login_attempts

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_identifier ON public.admin_login_attempts (identifier);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_locked_until ON public.admin_login_attempts (locked_until);

-- 5. Optimize audit_log queries for target_site and created_at sorting
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_target_site ON public.audit_log (((details->>'target_site')));

-- 6. Canonical Super Admin Assignment template
-- Run in Supabase SQL Editor for project qffesrikwlzsmgprrczq to assign your canonical admin email:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::public.app_role
-- FROM auth.users
-- WHERE email = 'bimal.swaroop@gmail.com' -- or canonical admin email
-- ON CONFLICT (user_id, role) DO NOTHING;
