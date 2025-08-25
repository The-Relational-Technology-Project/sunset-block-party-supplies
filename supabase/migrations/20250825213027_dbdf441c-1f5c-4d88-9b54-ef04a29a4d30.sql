-- First create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create supply_requests table to track all contact requests
CREATE TABLE public.supply_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supply_id UUID NOT NULL,
  supply_name TEXT NOT NULL,
  supply_owner_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_contact TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.supply_requests ENABLE ROW LEVEL SECURITY;

-- Allow supply owners to view requests for their supplies
CREATE POLICY "Supply owners can view requests for their supplies" 
ON public.supply_requests 
FOR SELECT 
USING (auth.uid() = supply_owner_id);

-- Allow anyone to create supply requests (for now - could be restricted to vouched members later)
CREATE POLICY "Anyone can create supply requests" 
ON public.supply_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow stewards to view all supply requests for moderation
CREATE POLICY "Stewards can view all supply requests" 
ON public.supply_requests 
FOR SELECT 
USING (is_user_steward(auth.uid()));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_supply_requests_updated_at
BEFORE UPDATE ON public.supply_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();