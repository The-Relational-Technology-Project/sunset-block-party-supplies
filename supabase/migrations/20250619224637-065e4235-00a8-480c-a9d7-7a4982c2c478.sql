
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('member', 'steward');
CREATE TYPE public.join_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  vouched_at TIMESTAMP WITH TIME ZONE,
  vouched_by UUID REFERENCES public.profiles(id),
  join_request_status join_request_status,
  intro_text TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vouches table for tracking vouching relationships
CREATE TABLE public.vouches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vouched_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vouch_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(voucher_id, vouched_id)
);

-- Create join_requests table for new member applications
CREATE TABLE public.join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  intro TEXT NOT NULL,
  connection_context TEXT,
  status join_request_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is vouched
CREATE OR REPLACE FUNCTION public.is_user_vouched(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT vouched_at IS NOT NULL
  FROM public.profiles
  WHERE id = user_id;
$$;

-- Create security definer function to check if user is steward
CREATE OR REPLACE FUNCTION public.is_user_steward(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = 'steward'
  FROM public.profiles
  WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Stewards can update member vouching status"
  ON public.profiles FOR UPDATE
  USING (public.is_user_steward(auth.uid()));

-- RLS Policies for vouches
CREATE POLICY "Vouches are viewable by everyone"
  ON public.vouches FOR SELECT
  USING (true);

CREATE POLICY "Stewards can create vouches"
  ON public.vouches FOR INSERT
  WITH CHECK (public.is_user_steward(auth.uid()));

-- RLS Policies for join_requests
CREATE POLICY "Anyone can insert join requests"
  ON public.join_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Stewards can view all join requests"
  ON public.join_requests FOR SELECT
  USING (public.is_user_steward(auth.uid()));

CREATE POLICY "Stewards can update join requests"
  ON public.join_requests FOR UPDATE
  USING (public.is_user_steward(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
