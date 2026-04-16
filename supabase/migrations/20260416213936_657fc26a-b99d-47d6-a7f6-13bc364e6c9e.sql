-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Friend',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SAVED WISHES
CREATE TABLE public.saved_wishes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wish_key TEXT NOT NULL,
  wish_type TEXT NOT NULL,
  wish_title TEXT NOT NULL,
  wish_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, wish_key)
);
ALTER TABLE public.saved_wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved wishes"
  ON public.saved_wishes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save own wishes"
  ON public.saved_wishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved wishes"
  ON public.saved_wishes FOR DELETE USING (auth.uid() = user_id);

-- MEMORIAL NOTES (public read, auth-only write)
CREATE TABLE public.memorial_notes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL CHECK (char_length(note) BETWEEN 1 AND 280),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memorial_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memorial notes are viewable by everyone"
  ON public.memorial_notes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post notes"
  ON public.memorial_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes"
  ON public.memorial_notes FOR DELETE USING (auth.uid() = user_id);

-- RESOURCE SUBMISSIONS
CREATE TABLE public.resource_submissions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  url TEXT NOT NULL CHECK (char_length(url) BETWEEN 5 AND 500),
  category TEXT NOT NULL CHECK (char_length(category) BETWEEN 2 AND 50),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resource_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions are viewable by everyone"
  ON public.resource_submissions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit"
  ON public.resource_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own submissions"
  ON public.resource_submissions FOR DELETE USING (auth.uid() = user_id);

-- Indexes for ordered reads
CREATE INDEX memorial_notes_created_at_idx ON public.memorial_notes (created_at DESC);
CREATE INDEX resource_submissions_created_at_idx ON public.resource_submissions (created_at DESC);
CREATE INDEX saved_wishes_user_idx ON public.saved_wishes (user_id, created_at DESC);