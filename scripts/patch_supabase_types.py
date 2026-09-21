from pathlib import Path

path = Path('src/integrations/supabase/types.ts')
text = path.read_text()

new_tables = '''      assessment_answers: {
        Row: { answer_text: string | null; attempt_id: string; choice_id: string | null; id: string; is_correct: boolean | null; points_awarded: number; question_id: string }
        Insert: { answer_text?: string | null; attempt_id: string; choice_id?: string | null; id?: string; is_correct?: boolean | null; points_awarded?: number; question_id: string }
        Update: { answer_text?: string | null; attempt_id?: string; choice_id?: string | null; id?: string; is_correct?: boolean | null; points_awarded?: number; question_id?: string }
        Relationships: []
      }
      assessment_attempts: {
        Row: { assessment_id: string; feedback: string | null; id: string; passed: boolean | null; score: number | null; started_at: string; submitted_at: string | null; user_id: string }
        Insert: { assessment_id: string; feedback?: string | null; id?: string; passed?: boolean | null; score?: number | null; started_at?: string; submitted_at?: string | null; user_id: string }
        Update: { assessment_id?: string; feedback?: string | null; id?: string; passed?: boolean | null; score?: number | null; started_at?: string; submitted_at?: string | null; user_id?: string }
        Relationships: []
      }
      assessment_choices: {
        Row: { id: string; is_correct: boolean; label: string; label_bn: string | null; position: number; question_id: string }
        Insert: { id?: string; is_correct?: boolean; label: string; label_bn?: string | null; position?: number; question_id: string }
        Update: { id?: string; is_correct?: boolean; label?: string; label_bn?: string | null; position?: number; question_id?: string }
        Relationships: []
      }
      assessment_questions: {
        Row: { assessment_id: string; created_at: string; explanation: string | null; explanation_bn: string | null; id: string; points: number; position: number; prompt: string; prompt_bn: string | null }
        Insert: { assessment_id: string; created_at?: string; explanation?: string | null; explanation_bn?: string | null; id?: string; points?: number; position?: number; prompt: string; prompt_bn?: string | null }
        Update: { assessment_id?: string; created_at?: string; explanation?: string | null; explanation_bn?: string | null; id?: string; points?: number; position?: number; prompt?: string; prompt_bn?: string | null }
        Relationships: []
      }
      assessments: {
        Row: { course_id: string; created_at: string; description: string | null; description_bn: string | null; id: string; module_id: string | null; passing_score: number; status: string; title: string; title_bn: string | null; updated_at: string }
        Insert: { course_id: string; created_at?: string; description?: string | null; description_bn?: string | null; id?: string; module_id?: string | null; passing_score?: number; status?: string; title: string; title_bn?: string | null; updated_at?: string }
        Update: { course_id?: string; created_at?: string; description?: string | null; description_bn?: string | null; id?: string; module_id?: string | null; passing_score?: number; status?: string; title?: string; title_bn?: string | null; updated_at?: string }
        Relationships: []
      }
      certificates: {
        Row: { certificate_number: string; course_id: string; enrollment_id: string; id: string; issued_at: string; user_id: string }
        Insert: { certificate_number: string; course_id: string; enrollment_id: string; id?: string; issued_at?: string; user_id: string }
        Update: { certificate_number?: string; course_id?: string; enrollment_id?: string; id?: string; issued_at?: string; user_id?: string }
        Relationships: []
      }
'''

if '      assessment_answers: {' not in text:
    text = text.replace('    Tables: {\n', '    Tables: {\n' + new_tables, 1)

function_block = '''      enroll_in_course: {
        Args: { p_course_id: string }
        Returns: Database["public"]["Tables"]["enrollments"]["Row"]
      }
      get_course_progress_summary: {
        Args: { p_course_id: string }
        Returns: { course_id: string; completed_lessons: number; total_lessons: number; progress_percent: number; next_lesson_id: string | null; course_completed: boolean }[]
      }
      record_lesson_progress: {
        Args: { p_course_id: string; p_lesson_id: string; p_state: Database["public"]["Enums"]["progress_state"]; p_progress_value?: number; p_last_position?: number }
        Returns: Json
      }
      submit_assessment_attempt: {
        Args: { p_assessment_id: string; p_answers: Json }
        Returns: Json
      }
'''
if '      enroll_in_course: {' not in text:
    text = text.replace('    Functions: {\n', '    Functions: {\n' + function_block, 1)

path.write_text(text)
print(f'patched {path}')
