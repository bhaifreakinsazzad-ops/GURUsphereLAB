WITH course AS (SELECT id FROM public.courses WHERE slug = 'digital-essentials-2026' LIMIT 1), inserted AS (
  INSERT INTO public.assessments(course_id, title, title_bn, description, description_bn, passing_score, status)
  SELECT id, 'Digital Essentials Check-in', 'ডিজিটাল এসেনশিয়ালস যাচাই', 'A short check to reinforce safe, confident digital habits.', 'নিরাপদ ও আত্মবিশ্বাসী ডিজিটাল অভ্যাস যাচাইয়ের ছোট পরীক্ষা।', 70, 'published'
  FROM course
  WHERE NOT EXISTS (SELECT 1 FROM public.assessments a WHERE a.course_id = course.id AND a.title = 'Digital Essentials Check-in')
  RETURNING id
)
INSERT INTO public.assessment_questions(assessment_id, prompt, prompt_bn, explanation, explanation_bn, position, points)
SELECT inserted.id, q.prompt, q.prompt_bn, q.explanation, q.explanation_bn, q.position, 1
FROM inserted
CROSS JOIN (VALUES
  ('What is the safest response to an unexpected link in an email?', 'ইমেইলে আসা অপ্রত্যাশিত লিংকের ক্ষেত্রে সবচেয়ে নিরাপদ কাজ কোনটি?', 'Check the sender and destination before opening it.', 'লিংক খোলার আগে প্রেরক ও গন্তব্য যাচাই করুন।', 1),
  ('Which habit makes a password stronger?', 'কোন অভ্যাস পাসওয়ার্ডকে আরও শক্তিশালী করে?', 'Use a unique, long password for each important account.', 'প্রতিটি গুরুত্বপূর্ণ অ্যাকাউন্টে আলাদা ও দীর্ঘ পাসওয়ার্ড ব্যবহার করুন।', 2),
  ('What is a good first step when organizing files?', 'ফাইল সাজানোর প্রথম ভালো পদক্ষেপ কোনটি?', 'Create clear folders and use meaningful names.', 'পরিষ্কার ফোল্ডার তৈরি করে অর্থপূর্ণ নাম ব্যবহার করুন।', 3)
) AS q(prompt, prompt_bn, explanation, explanation_bn, position)
WHERE NOT EXISTS (SELECT 1 FROM public.assessment_questions aq WHERE aq.assessment_id = inserted.id);

WITH assessment AS (SELECT id FROM public.assessments WHERE title = 'Digital Essentials Check-in' LIMIT 1), questions AS (SELECT id, position FROM public.assessment_questions WHERE assessment_id = (SELECT id FROM assessment))
INSERT INTO public.assessment_choices(question_id, label, label_bn, position, is_correct)
SELECT questions.id, choice.label, choice.label_bn, choice.choice_position, choice.is_correct
FROM questions
CROSS JOIN LATERAL (VALUES
  (1, 'Open it immediately', 'সঙ্গে সঙ্গে খুলুন', 1, false),
  (1, 'Check the sender and destination first', 'আগে প্রেরক ও গন্তব্য যাচাই করুন', 2, true),
  (1, 'Forward it to everyone', 'সবার কাছে ফরওয়ার্ড করুন', 3, false),
  (2, 'Reuse one short password', 'একটি ছোট পাসওয়ার্ড বারবার ব্যবহার করুন', 1, false),
  (2, 'Use a unique, long password for each account', 'প্রতিটি অ্যাকাউন্টে আলাদা ও দীর্ঘ পাসওয়ার্ড ব্যবহার করুন', 2, true),
  (2, 'Write it in a public post', 'পাবলিক পোস্টে লিখে রাখুন', 3, false),
  (3, 'Put every file on the desktop', 'সব ফাইল ডেস্কটপে রাখুন', 1, false),
  (3, 'Create clear folders and meaningful names', 'পরিষ্কার ফোল্ডার ও অর্থপূর্ণ নাম ব্যবহার করুন', 2, true),
  (3, 'Delete files without checking', 'যাচাই না করে ফাইল মুছে ফেলুন', 3, false)
) AS choice(question_position, label, label_bn, choice_position, is_correct)
WHERE questions.position = choice.question_position
  AND NOT EXISTS (SELECT 1 FROM public.assessment_choices ac WHERE ac.question_id = questions.id);
