
-- Promote a user to admin by email (callable only by existing admin)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  SELECT id INTO target_id FROM auth.users WHERE email = _email LIMIT 1;
  IF target_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _email;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Atomic upvote increment (any authenticated user)
CREATE OR REPLACE FUNCTION public.increment_research_upvote(_topic_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  UPDATE public.research_topics
  SET upvotes = upvotes + 1
  WHERE id = _topic_id
  RETURNING upvotes INTO new_count;
  RETURN new_count;
END;
$$;

-- Enable realtime for research upvote updates
ALTER TABLE public.research_topics REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.research_topics;
