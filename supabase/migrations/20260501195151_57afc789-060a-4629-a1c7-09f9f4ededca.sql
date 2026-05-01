CREATE TABLE public.club_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL,
  display_name text,
  club_slug text NOT NULL,
  quiz_match text,
  notes text
);

ALTER TABLE public.club_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join club waitlist"
ON public.club_waitlist
FOR INSERT
TO public
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND (display_name IS NULL OR length(display_name) <= 80)
  AND club_slug IN ('debate','science','writers','code','art','music')
  AND (quiz_match IS NULL OR quiz_match IN ('debate','science','writers','code','art','music'))
  AND (notes IS NULL OR length(notes) <= 500)
);

CREATE POLICY "Admins view club waitlist"
ON public.club_waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update club waitlist"
ON public.club_waitlist
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete club waitlist"
ON public.club_waitlist
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_club_waitlist_club_slug ON public.club_waitlist(club_slug);
CREATE INDEX idx_club_waitlist_created_at ON public.club_waitlist(created_at DESC);