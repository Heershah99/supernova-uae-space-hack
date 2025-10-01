-- Step 1: Create role enum
-- This defines the three levels of access in the system
CREATE TYPE public.app_role AS ENUM ('admin', 'operator', 'viewer');

-- Step 2: Create user_roles table
-- CRITICAL: This is separate from profiles to prevent privilege escalation attacks
-- Users cannot modify their own roles since this table has strict RLS
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role)
);

-- Step 3: Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function FIRST (before policies that use it)
-- This function checks if a user has a specific role
-- SECURITY DEFINER allows it to bypass RLS and prevent infinite recursion
-- The fixed search_path prevents SQL injection attacks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create policies for user_roles table
-- Only admins can view roles (prevents users from discovering who has admin access)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can assign roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can modify roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Step 6: Drop existing overly permissive satellite policies
DROP POLICY IF EXISTS "Authenticated users can insert satellites" ON public.satellites;
DROP POLICY IF EXISTS "Authenticated users can update satellites" ON public.satellites;
DROP POLICY IF EXISTS "Authenticated users can view satellites" ON public.satellites;

-- Step 7: Create new role-based satellite policies
-- Anyone authenticated can view satellites (for monitoring dashboards)
CREATE POLICY "All authenticated users can view satellites"
ON public.satellites
FOR SELECT
TO authenticated
USING (true);

-- Only operators and admins can add new satellites
CREATE POLICY "Operators and admins can insert satellites"
ON public.satellites
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'operator') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Only operators and admins can modify satellite data
CREATE POLICY "Operators and admins can update satellites"
ON public.satellites
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'operator') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete satellites (destructive action)
CREATE POLICY "Admins can delete satellites"
ON public.satellites
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 8: Fix collision_predictions missing UPDATE policy
CREATE POLICY "Operators and admins can update collision predictions"
ON public.collision_predictions
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'operator') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Step 9: Add DELETE policies for other critical tables
CREATE POLICY "Admins can delete collision predictions"
ON public.collision_predictions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete alerts"
ON public.alerts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete threats"
ON public.threats
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));