
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'BDT',
  method TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are publicly viewable"
ON public.donations FOR SELECT
USING (true);

CREATE POLICY "Anyone can pledge a donation"
ON public.donations FOR INSERT
WITH CHECK (
  amount > 0
  AND amount <= 1000000
  AND method IN ('bkash','nagad','paypal','bmc','other')
  AND (donor_name IS NULL OR length(donor_name) <= 80)
  AND (message IS NULL OR length(message) <= 280)
);

CREATE INDEX idx_donations_created_at ON public.donations (created_at DESC);
