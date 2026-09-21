-- Trustworthy learner loop and assessment foundation
-- All learner mutations validate ownership and course/lesson relationships server-side.

CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_bn text,
  description text,
  description_bn text,
  passing_score numeric(5,2) NOT NULL DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  prompt_bn text,
  explanation text,
  explanation_bn text,
  position int NOT NULL DEFAULT 0,
  points numeric(6,2) NOT NULL DEFAULT 1 CHECK (points > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, position)
);

CREATE TABLE IF NOT EXISTS public.assessment_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  label_bn text,
  position int NOT NULL DEFAULT 0,
  is_correct boolean NOT NULL DEFAULT false,
  UNIQUE (question_id, position)
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  score numeric(5,2),
  passed boolean,
  feedback text,
  UNIQUE (assessment_id, user_id, started_at)
);

CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  choice_id uuid REFERENCES public.assessment_choices(id) ON DELETE SET NULL,
  answer_text text,
  is_correct boolean,
  points_awarded numeric(6,2) NOT NULL DEFAULT 0,
  UNIQUE (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_number text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON public.assessment_questions(assessment_id, position);
CREATE INDEX IF NOT EXISTS idx_assessment_choices_question ON public.assessment_choices(question_id, position);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id, assessment_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_attempt ON public.assessment_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id, issued_at DESC);

GRANT SELECT ON public.assessments, public.assessment_questions, public.assessment_choices TO anon, authenticated;
GRANT SELECT, INSERT ON public.assessment_attempts, public.assessment_answers TO authenticated;
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.assessments, public.assessment_questions, public.assessment_choices, public.assessment_attempts, public.assessment_answers, public.certificates TO service_role;

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "published assessments read" ON public.assessments;
CREATE POLICY "published assessments read" ON public.assessments FOR SELECT TO anon, authenticated
  USING (status = 'published' AND EXISTS (
    SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.status = 'published' AND c.visibility = 'public'
  ));
DROP POLICY IF EXISTS "published assessment questions read" ON public.assessment_questions;
CREATE POLICY "published assessment questions read" ON public.assessment_questions FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.assessments a WHERE a.id = assessment_id AND a.status = 'published'));
DROP POLICY IF EXISTS "published assessment choices read" ON public.assessment_choices;
CREATE POLICY "published assessment choices read" ON public.assessment_choices FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.assessment_questions q
    JOIN public.assessments a ON a.id = q.assessment_id
    WHERE q.id = question_id AND a.status = 'published'
  ));
DROP POLICY IF EXISTS "attempts own read" ON public.assessment_attempts;
CREATE POLICY "attempts own read" ON public.assessment_attempts FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "answers own read" ON public.assessment_answers;
CREATE POLICY "answers own read" ON public.assessment_answers FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.assessment_attempts x WHERE x.id = attempt_id AND x.user_id = auth.uid())
);
DROP POLICY IF EXISTS "certificates own read" ON public.certificates;
CREATE POLICY "certificates own read" ON public.certificates FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.enroll_in_course(p_course_id uuid)
RETURNS public.enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result public.enrollments;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND status = 'published' AND visibility = 'public'
  ) THEN RAISE EXCEPTION 'Course is not available for enrollment'; END IF;
  INSERT INTO public.enrollments(user_id, course_id, status, last_activity_at)
  VALUES (auth.uid(), p_course_id, 'active', now())
  ON CONFLICT (user_id, course_id) DO UPDATE SET
    status = CASE WHEN public.enrollments.status = 'completed' THEN 'completed' ELSE 'active' END,
    last_activity_at = now()
  RETURNING * INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_lesson_progress(
  p_course_id uuid,
  p_lesson_id uuid,
  p_state public.progress_state,
  p_progress_value numeric DEFAULT 0,
  p_last_position int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment public.enrollments;
  v_lesson public.lessons;
  v_completed int;
  v_total int;
  v_certificate public.certificates;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_lesson FROM public.lessons WHERE id = p_lesson_id AND course_id = p_course_id AND status = 'published';
  IF NOT FOUND THEN RAISE EXCEPTION 'Lesson does not belong to this published course'; END IF;
  SELECT * INTO v_enrollment FROM public.enrollments WHERE user_id = auth.uid() AND course_id = p_course_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Enroll before recording progress'; END IF;
  IF p_progress_value < 0 OR p_progress_value > 100 THEN RAISE EXCEPTION 'Progress must be between 0 and 100'; END IF;

  INSERT INTO public.lesson_progress(user_id, course_id, lesson_id, state, progress_value, last_position, completed_at)
  VALUES (auth.uid(), p_course_id, p_lesson_id, p_state, p_progress_value, GREATEST(p_last_position, 0), CASE WHEN p_state = 'completed' THEN now() ELSE NULL END)
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    state = EXCLUDED.state,
    progress_value = EXCLUDED.progress_value,
    last_position = EXCLUDED.last_position,
    completed_at = EXCLUDED.completed_at,
    updated_at = now();

  UPDATE public.enrollments SET last_activity_at = now() WHERE id = v_enrollment.id;
  SELECT count(*)::int INTO v_total FROM public.lessons WHERE course_id = p_course_id AND status = 'published';
  SELECT count(*)::int INTO v_completed FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id AND l.course_id = p_course_id AND l.status = 'published'
    WHERE lp.user_id = auth.uid() AND lp.course_id = p_course_id AND lp.state = 'completed';

  IF v_total > 0 AND v_completed >= v_total THEN
    UPDATE public.enrollments
      SET status = 'completed', completed_at = COALESCE(completed_at, now()), last_activity_at = now()
      WHERE id = v_enrollment.id;
    INSERT INTO public.certificates(user_id, course_id, enrollment_id, certificate_number)
      VALUES (auth.uid(), p_course_id, v_enrollment.id, 'GS-' || upper(substr(md5(auth.uid()::text || p_course_id::text), 1, 12)))
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING * INTO v_certificate;
  END IF;

  RETURN jsonb_build_object('course_id', p_course_id, 'lesson_id', p_lesson_id, 'completed_lessons', v_completed, 'total_lessons', v_total, 'course_completed', v_total > 0 AND v_completed >= v_total, 'certificate_id', v_certificate.id);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_course_progress_summary(p_course_id uuid)
RETURNS TABLE(course_id uuid, completed_lessons int, total_lessons int, progress_percent numeric, next_lesson_id uuid, course_completed boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH published AS (
    SELECT l.id, l.position, l.module_id FROM public.lessons l
    WHERE l.course_id = p_course_id AND l.status = 'published'
  ), counts AS (
    SELECT count(*)::int AS total, count(*) FILTER (WHERE lp.state = 'completed')::int AS done
    FROM published p LEFT JOIN public.lesson_progress lp ON lp.lesson_id = p.id AND lp.course_id = p_course_id AND lp.user_id = auth.uid()
  ), next_lesson AS (
    SELECT p.id FROM published p LEFT JOIN public.lesson_progress lp ON lp.lesson_id = p.id AND lp.user_id = auth.uid()
    WHERE COALESCE(lp.state, 'not_started') <> 'completed' ORDER BY p.position LIMIT 1
  )
  SELECT p_course_id, counts.done, counts.total,
    CASE WHEN counts.total = 0 THEN 0 ELSE round((counts.done::numeric / counts.total::numeric) * 100, 2) END,
    next_lesson.id, counts.total > 0 AND counts.done >= counts.total
  FROM counts LEFT JOIN next_lesson ON true;
$$;

CREATE OR REPLACE FUNCTION public.submit_assessment_attempt(p_assessment_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assessment public.assessments;
  v_attempt public.assessment_attempts;
  v_answer jsonb;
  v_question public.assessment_questions;
  v_choice public.assessment_choices;
  v_total numeric := 0;
  v_awarded numeric := 0;
  v_score numeric := 0;
  v_passed boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_assessment FROM public.assessments WHERE id = p_assessment_id AND status = 'published';
  IF NOT FOUND THEN RAISE EXCEPTION 'Assessment is not available'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = v_assessment.course_id) THEN RAISE EXCEPTION 'Enroll before taking an assessment'; END IF;

  INSERT INTO public.assessment_attempts(assessment_id, user_id) VALUES (p_assessment_id, auth.uid()) RETURNING * INTO v_attempt;
  FOR v_answer IN SELECT * FROM jsonb_array_elements(COALESCE(p_answers, '[]'::jsonb)) LOOP
    SELECT * INTO v_question FROM public.assessment_questions WHERE id = (v_answer->>'question_id')::uuid AND assessment_id = p_assessment_id;
    IF NOT FOUND THEN CONTINUE; END IF;
    v_total := v_total + v_question.points;
    v_choice := NULL;
    IF v_answer ? 'choice_id' THEN SELECT * INTO v_choice FROM public.assessment_choices WHERE id = (v_answer->>'choice_id')::uuid AND question_id = v_question.id; END IF;
    INSERT INTO public.assessment_answers(attempt_id, question_id, choice_id, answer_text, is_correct, points_awarded)
    VALUES (v_attempt.id, v_question.id, v_choice.id, v_answer->>'answer_text', COALESCE(v_choice.is_correct, false), CASE WHEN COALESCE(v_choice.is_correct, false) THEN v_question.points ELSE 0 END);
    IF COALESCE(v_choice.is_correct, false) THEN v_awarded := v_awarded + v_question.points; END IF;
  END LOOP;
  v_score := CASE WHEN v_total = 0 THEN 0 ELSE round((v_awarded / v_total) * 100, 2) END;
  v_passed := v_score >= v_assessment.passing_score;
  UPDATE public.assessment_attempts SET submitted_at = now(), score = v_score, passed = v_passed, feedback = CASE WHEN v_passed THEN 'Strong work — you passed this assessment.' ELSE 'Review the explanations and try again.' END WHERE id = v_attempt.id;
  RETURN jsonb_build_object('attempt_id', v_attempt.id, 'score', v_score, 'passed', v_passed, 'passing_score', v_assessment.passing_score);
END;
$$;

REVOKE ALL ON FUNCTION public.enroll_in_course(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enroll_in_course(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.record_lesson_progress(uuid, uuid, public.progress_state, numeric, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_lesson_progress(uuid, uuid, public.progress_state, numeric, int) TO authenticated;
REVOKE ALL ON FUNCTION public.get_course_progress_summary(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_course_progress_summary(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.submit_assessment_attempt(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_assessment_attempt(uuid, jsonb) TO authenticated;
