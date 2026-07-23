
CREATE TYPE public.educator_application_status AS ENUM ('pending','approved','rejected','changes_requested');

CREATE TABLE public.educator_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  headline text NOT NULL,
  expertise text[] NOT NULL DEFAULT '{}',
  credentials text NOT NULL,
  sample_work_url text,
  linkedin_url text,
  motivation text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  status public.educator_application_status NOT NULL DEFAULT 'pending',
  reviewer_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

GRANT SELECT, INSERT, UPDATE ON public.educator_applications TO authenticated;
GRANT ALL ON public.educator_applications TO service_role;

ALTER TABLE public.educator_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applicants read own" ON public.educator_applications
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "applicants insert own" ON public.educator_applications
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "applicants update pending" ON public.educator_applications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('pending','changes_requested'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending','changes_requested'));
CREATE POLICY "admins manage applications" ON public.educator_applications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER educator_applications_updated_at
  BEFORE UPDATE ON public.educator_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.on_educator_application_approved()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.user_id, 'educator')
      ON CONFLICT (user_id, role) DO NOTHING;
    NEW.reviewed_at = COALESCE(NEW.reviewed_at, now());
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.on_educator_application_approved() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_educator_application_approved
  BEFORE UPDATE ON public.educator_applications
  FOR EACH ROW EXECUTE FUNCTION public.on_educator_application_approved();

DROP POLICY IF EXISTS "courses educator write own" ON public.courses;
CREATE POLICY "courses educator write own" ON public.courses
  FOR ALL TO authenticated
  USING (
    educator_id = auth.uid()
    AND status IN ('draft','submitted','changes_requested')
    AND public.has_role(auth.uid(),'educator')
  )
  WITH CHECK (
    educator_id = auth.uid()
    AND status IN ('draft','submitted','changes_requested')
    AND public.has_role(auth.uid(),'educator')
  );
