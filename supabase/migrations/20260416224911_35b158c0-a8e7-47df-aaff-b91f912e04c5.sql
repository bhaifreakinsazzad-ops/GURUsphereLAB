
-- 1. Roles enum + table (security best practice)
CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Roles viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign 'student' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Also ensure profile is created on signup (re-create trigger if missing)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Profile enhancements
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0;

-- 3. Research Archive
CREATE TABLE public.research_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  link TEXT,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.research_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research viewable by everyone" ON public.research_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users submit research" ON public.research_topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update own research" ON public.research_topics FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete own research" ON public.research_topics FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_research_category ON public.research_topics(category);
CREATE INDEX idx_research_created ON public.research_topics(created_at DESC);

CREATE TRIGGER set_research_updated_at BEFORE UPDATE ON public.research_topics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Team Projects + Kanban
CREATE TABLE public.team_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  category TEXT NOT NULL DEFAULT 'general',
  max_members INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects viewable by everyone" ON public.team_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users create projects" ON public.team_projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update projects" ON public.team_projects FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete projects" ON public.team_projects FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_team_projects_updated_at BEFORE UPDATE ON public.team_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.team_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks viewable by everyone" ON public.project_tasks FOR SELECT USING (true);
CREATE POLICY "Authenticated users create tasks" ON public.project_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Project owner or task creator update" ON public.project_tasks FOR UPDATE USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT owner_id FROM public.team_projects WHERE id = project_id)
);
CREATE POLICY "Project owner or task creator delete" ON public.project_tasks FOR DELETE USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT owner_id FROM public.team_projects WHERE id = project_id)
);

CREATE INDEX idx_tasks_project ON public.project_tasks(project_id);

-- 5. Mentor profiles
CREATE TABLE public.mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  expertise TEXT NOT NULL,
  bio TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT 'open',
  contact_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentor profiles viewable by everyone" ON public.mentor_profiles FOR SELECT USING (true);
CREATE POLICY "Users create own mentor profile" ON public.mentor_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own mentor profile" ON public.mentor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own mentor profile" ON public.mentor_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_mentor_profiles_updated_at BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Mentorship requests (private)
CREATE TABLE public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student and mentor view request" ON public.mentorship_requests FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = mentor_id);
CREATE POLICY "Students create requests" ON public.mentorship_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Mentor updates request status" ON public.mentorship_requests FOR UPDATE
  USING (auth.uid() = mentor_id);
CREATE POLICY "Either party deletes request" ON public.mentorship_requests FOR DELETE
  USING (auth.uid() = student_id OR auth.uid() = mentor_id);
