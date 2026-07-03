
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.course_status AS ENUM ('draft','submitted','changes_requested','approved','published','archived','rejected');
CREATE TYPE public.course_visibility AS ENUM ('public','unlisted','private');
CREATE TYPE public.course_difficulty AS ENUM ('beginner','intermediate','advanced');
CREATE TYPE public.lesson_status AS ENUM ('draft','ready','published','archived');
CREATE TYPE public.lesson_type AS ENUM ('text','video','link','embed');
CREATE TYPE public.enrollment_status AS ENUM ('active','completed','dropped');
CREATE TYPE public.progress_state AS ENUM ('not_started','in_progress','completed');
CREATE TYPE public.subject_status AS ENUM ('active','hidden','archived');

-- =========================
-- Reusable updated_at trigger (idempotent)
-- =========================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- =========================
-- learner_preferences
-- =========================
CREATE TABLE public.learner_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_goal text,
  interests text[] NOT NULL DEFAULT '{}',
  experience_level text CHECK (experience_level IN ('beginner','intermediate','advanced','unsure')),
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en','bn')),
  learning_style text,
  weekly_minutes int,
  career_objective text,
  onboarding_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_preferences TO authenticated;
GRANT ALL ON public.learner_preferences TO service_role;
ALTER TABLE public.learner_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prefs read"   ON public.learner_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own prefs insert" ON public.learner_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own prefs update" ON public.learner_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own prefs delete" ON public.learner_preferences FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_learner_prefs_updated BEFORE UPDATE ON public.learner_preferences FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- subjects
-- =========================
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  name_bn text,
  description text,
  icon text,
  status public.subject_status NOT NULL DEFAULT 'active',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects public read" ON public.subjects FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "subjects admin all"   ON public.subjects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_subjects_updated BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- courses
-- =========================
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  title_bn text,
  short_description text,
  description text,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  difficulty public.course_difficulty NOT NULL DEFAULT 'beginner',
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','bn','both')),
  thumbnail_url text,
  educator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  estimated_minutes int NOT NULL DEFAULT 0,
  outcomes text[] NOT NULL DEFAULT '{}',
  prerequisites text[] NOT NULL DEFAULT '{}',
  status public.course_status NOT NULL DEFAULT 'draft',
  visibility public.course_visibility NOT NULL DEFAULT 'public',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_subject ON public.courses(subject_id);
CREATE INDEX idx_courses_status  ON public.courses(status);
CREATE INDEX idx_courses_language ON public.courses(language);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses public read published" ON public.courses FOR SELECT TO anon, authenticated
  USING (status = 'published' AND visibility = 'public');
CREATE POLICY "courses educator read own" ON public.courses FOR SELECT TO authenticated
  USING (educator_id = auth.uid());
CREATE POLICY "courses educator write own" ON public.courses FOR ALL TO authenticated
  USING (educator_id = auth.uid() AND status IN ('draft','submitted','changes_requested'))
  WITH CHECK (educator_id = auth.uid() AND status IN ('draft','submitted','changes_requested'));
CREATE POLICY "courses admin all" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- course_modules
-- =========================
CREATE TABLE public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_modules_course ON public.course_modules(course_id, position);
GRANT SELECT ON public.course_modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules public read" ON public.course_modules FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.status='published' AND c.visibility='public'));
CREATE POLICY "modules educator manage" ON public.course_modules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.educator_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.educator_id = auth.uid()));
CREATE POLICY "modules admin all" ON public.course_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- lessons
-- =========================
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  lesson_type public.lesson_type NOT NULL DEFAULT 'text',
  content text,
  resource_url text,
  estimated_minutes int NOT NULL DEFAULT 5,
  position int NOT NULL DEFAULT 0,
  is_preview boolean NOT NULL DEFAULT false,
  status public.lesson_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, slug)
);
CREATE INDEX idx_lessons_module ON public.lessons(module_id, position);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons public read" ON public.lessons FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.status='published' AND c.visibility='public')
  );
CREATE POLICY "lessons educator manage" ON public.lessons FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.educator_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.educator_id = auth.uid()));
CREATE POLICY "lessons admin all" ON public.lessons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- enrollments
-- =========================
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status public.enrollment_status NOT NULL DEFAULT 'active',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments own read"   ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "enrollments own insert" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments own update" ON public.enrollments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments own delete" ON public.enrollments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "enrollments admin read" ON public.enrollments FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =========================
-- lesson_progress
-- =========================
CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  state public.progress_state NOT NULL DEFAULT 'not_started',
  progress_value numeric(5,2) NOT NULL DEFAULT 0,
  last_position int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX idx_progress_user_course ON public.lesson_progress(user_id, course_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress own read"   ON public.lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "progress own insert" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress own update" ON public.lesson_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress own delete" ON public.lesson_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_progress_updated BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- SEED DATA
-- =========================
INSERT INTO public.subjects (slug, name, name_bn, description, icon, display_order) VALUES
  ('digital-skills','Digital Skills','ডিজিটাল স্কিল','Practical computer, web, and productivity skills.','laptop',1),
  ('entrepreneurship','Entrepreneurship','উদ্যোক্তা','Build, launch, and grow a small business.','rocket',2),
  ('english-communication','English Communication','ইংরেজি যোগাযোগ','Speak, write, and present confidently in English.','message-circle',3),
  ('bangla-learning','Bangla Learning','বাংলা শিক্ষা','Read, write, and celebrate the Bangla language.','book-open',4),
  ('mathematics','Mathematics','গণিত','From arithmetic to problem-solving foundations.','sigma',5),
  ('career-development','Career Development','ক্যারিয়ার উন্নয়ন','Resumes, interviews, freelancing, and job readiness.','briefcase',6);

-- Course 1: Digital Skills
WITH s AS (SELECT id FROM public.subjects WHERE slug='digital-skills')
INSERT INTO public.courses (slug,title,short_description,description,subject_id,difficulty,language,estimated_minutes,outcomes,prerequisites,status,visibility,published_at)
SELECT 'digital-essentials-2026','Digital Essentials for Everyone',
  'Master the everyday digital tools that make modern work possible.',
  'A friendly, hands-on introduction to using the web, files, email, and productivity tools with confidence. No prior experience required.',
  s.id,'beginner','en',180,
  ARRAY['Navigate the web safely','Manage files and folders','Send professional emails','Use documents and spreadsheets'],
  ARRAY['A computer or smartphone with internet'],
  'published','public', now()
FROM s;

WITH c AS (SELECT id FROM public.courses WHERE slug='digital-essentials-2026')
INSERT INTO public.course_modules (course_id,title,description,position)
SELECT c.id, t.title, t.description, t.position FROM c,
(VALUES
  ('Getting Started Online','Understand the web, browsers, and staying safe.',1),
  ('Files, Folders & Cloud','Organize your digital life.',2),
  ('Working with Documents','Write, format, and collaborate.',3)
) AS t(title,description,position);

WITH c AS (SELECT id FROM public.courses WHERE slug='digital-essentials-2026'),
     m AS (SELECT id, position FROM public.course_modules WHERE course_id=(SELECT id FROM c))
INSERT INTO public.lessons (module_id,course_id,slug,title,lesson_type,content,estimated_minutes,position,is_preview,status)
SELECT m.id, (SELECT id FROM c), l.slug, l.title, 'text'::lesson_type, l.content, l.mins, l.pos, l.preview, 'published'::lesson_status
FROM m JOIN (VALUES
  (1,'welcome','Welcome & how this course works','This short course is designed to be finished in a weekend. Each lesson takes 5–10 minutes and finishes with one small practical action.',5,1,true),
  (1,'the-web','How the web actually works','A browser talks to servers using URLs. Every page you visit is a request and a response. Understanding this makes troubleshooting much easier.',8,2,false),
  (1,'staying-safe','Staying safe online','Use unique passwords, enable 2-factor authentication, and never share verification codes with anyone.',10,3,false),
  (2,'files-basics','Files, folders, and naming','Give files clear names, group them into folders by project, and back everything up to the cloud.',8,1,false),
  (2,'cloud-drives','Using cloud drives','Google Drive, OneDrive, and iCloud all follow the same idea: your files, everywhere.',10,2,false),
  (3,'docs-101','Documents 101','Headings, lists, and formatting make your writing easy to read.',10,1,false),
  (3,'sheets-101','Spreadsheets 101','Rows, columns, and simple formulas turn data into decisions.',12,2,false)
) AS l(pos_mod,slug,title,content,mins,pos,preview) ON m.position = l.pos_mod;

-- Course 2: English Communication
WITH s AS (SELECT id FROM public.subjects WHERE slug='english-communication')
INSERT INTO public.courses (slug,title,short_description,description,subject_id,difficulty,language,estimated_minutes,outcomes,status,visibility,published_at)
SELECT 'english-for-work','Everyday English for Work',
  'Speak and write clearly in professional English situations.',
  'Practical English focused on the real situations you meet at work: introductions, emails, meetings, and interviews.',
  s.id,'beginner','en',150,
  ARRAY['Introduce yourself professionally','Write short, clear emails','Speak in meetings without freezing','Answer common interview questions'],
  'published','public', now()
FROM s;

WITH c AS (SELECT id FROM public.courses WHERE slug='english-for-work')
INSERT INTO public.course_modules (course_id,title,description,position)
SELECT c.id, t.title, t.description, t.position FROM c,
(VALUES
  ('Introductions & Small Talk','Start conversations with confidence.',1),
  ('Professional Emails','Short, respectful, effective.',2),
  ('Meetings & Interviews','Speak up when it matters.',3)
) AS t(title,description,position);

WITH c AS (SELECT id FROM public.courses WHERE slug='english-for-work'),
     m AS (SELECT id, position FROM public.course_modules WHERE course_id=(SELECT id FROM c))
INSERT INTO public.lessons (module_id,course_id,slug,title,lesson_type,content,estimated_minutes,position,is_preview,status)
SELECT m.id, (SELECT id FROM c), l.slug, l.title, 'text'::lesson_type, l.content, l.mins, l.pos, l.preview, 'published'::lesson_status
FROM m JOIN (VALUES
  (1,'hello','A confident hello','"Hi, I''m [name]. I work on [what you do]. Nice to meet you." — practice this out loud five times.',5,1,true),
  (1,'small-talk','Small talk that isn''t small','Ask a question, listen, then share something short. Repeat.',8,2,false),
  (2,'email-structure','The 4-line email','Greeting → context → the ask → thank you. Almost every work email fits this shape.',10,1,false),
  (2,'tone','Tone without being cold','"Could you" and "would you mind" soften requests without weakening them.',8,2,false),
  (3,'meetings','Speaking in meetings','Prepare one sentence before the meeting. Say it in the first 10 minutes.',10,1,false),
  (3,'interview-answers','Answering interview questions','Structure: situation → task → action → result. Practice with 3 real examples from your life.',12,2,false)
) AS l(pos_mod,slug,title,content,mins,pos,preview) ON m.position = l.pos_mod;

-- Course 3: Entrepreneurship
WITH s AS (SELECT id FROM public.subjects WHERE slug='entrepreneurship')
INSERT INTO public.courses (slug,title,short_description,description,subject_id,difficulty,language,estimated_minutes,outcomes,status,visibility,published_at)
SELECT 'start-small-business','Start a Small Business This Month',
  'A practical starter kit for launching a small local or online business.',
  'A no-fluff guide to picking an idea, testing it with real people, taking your first orders, and getting paid.',
  s.id,'beginner','en',210,
  ARRAY['Pick a real, testable idea','Talk to 5 potential customers','Take your first order','Set up simple bookkeeping'],
  'published','public', now()
FROM s;

WITH c AS (SELECT id FROM public.courses WHERE slug='start-small-business')
INSERT INTO public.course_modules (course_id,title,description,position)
SELECT c.id, t.title, t.description, t.position FROM c,
(VALUES
  ('Find an Idea Worth Testing','Ideas are cheap. Testable ideas are gold.',1),
  ('Talk to Customers','The most-skipped, highest-leverage step.',2),
  ('Take Your First Order','Money changes everything.',3)
) AS t(title,description,position);

WITH c AS (SELECT id FROM public.courses WHERE slug='start-small-business'),
     m AS (SELECT id, position FROM public.course_modules WHERE course_id=(SELECT id FROM c))
INSERT INTO public.lessons (module_id,course_id,slug,title,lesson_type,content,estimated_minutes,position,is_preview,status)
SELECT m.id, (SELECT id FROM c), l.slug, l.title, 'text'::lesson_type, l.content, l.mins, l.pos, l.preview, 'published'::lesson_status
FROM m JOIN (VALUES
  (1,'idea-filter','The 3-question idea filter','Who has this problem? How painful is it? Would they pay today? If any answer is weak, keep looking.',10,1,true),
  (1,'niche','Pick a narrow niche','"Everyone" is not a market. "Working mothers in Dhaka who want home-cooked lunches" is.',10,2,false),
  (2,'five-calls','The 5-conversation rule','Talk to 5 potential customers before building anything. Ask about their last time solving this problem.',12,1,false),
  (2,'listen','Listen for the ache','If they don''t light up, the pain isn''t big enough. Keep asking.',10,2,false),
  (3,'first-order','Get your first paying order','Sell it before you build it. A screenshot, a message, a bank transfer — that''s a business.',12,1,false),
  (3,'bookkeeping','Simple bookkeeping','One spreadsheet: date, description, money in, money out. That''s enough for month one.',10,2,false)
) AS l(pos_mod,slug,title,content,mins,pos,preview) ON m.position = l.pos_mod;
