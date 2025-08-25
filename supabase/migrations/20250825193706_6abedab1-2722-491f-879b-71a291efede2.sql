-- Fix security issue: Completely remove the policy that allows vouched members 
-- to access other users' profiles, since RLS cannot restrict column access
DROP POLICY IF EXISTS "Vouched members can view basic non-sensitive profile info" ON public.profiles;

-- The existing policies for users viewing their own profiles and stewards viewing all profiles remain:
-- - "Users can view their own profile" 
-- - "Stewards can view all profiles"
-- 
-- This means vouched members can only see:
-- 1. Their own profile (full access including email)
-- 2. Basic info through the supplies table relationship (name, zip_code only)
--
-- If the application needs vouched members to see other profiles, it should be done
-- through a dedicated view or function that explicitly excludes sensitive fields