import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, CircleAlert } from "lucide-react";
import OrbitNavbar from "@/components/orbit/OrbitNavbar";
import OrbitFooter from "@/components/orbit/OrbitFooter";
import { fetchAssessmentsForCourse, submitAssessmentAttempt, type Assessment, type AssessmentResult } from "@/lib/learning";
import { useLocale, useT } from "@/lib/i18n";

const AssessmentPage = () => {
  const { courseId, assessmentId } = useParams<{ courseId: string; assessmentId: string }>();
  const locale = useLocale();
  const t = useT();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !assessmentId) return;
    fetchAssessmentsForCourse(courseId).then((items) => setAssessment(items.find((item) => item.id === assessmentId) ?? null)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load this assessment.")).finally(() => setLoading(false));
  }, [courseId, assessmentId]);

  const answered = useMemo(() => assessment?.questions.filter((question) => answers[question.id]).length ?? 0, [assessment, answers]);
  const submit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await submitAssessmentAttempt(assessment.id, assessment.questions.map((question) => ({ question_id: question.id, choice_id: answers[question.id] })).filter((answer) => answer.choice_id));
      setResult(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit this assessment.");
    } finally { setSubmitting(false); }
  };

  return <div className="orbit min-h-screen flex flex-col"><OrbitNavbar /><main className="flex-1 pt-32 pb-20 px-6 md:px-10"><div className="max-w-[760px] mx-auto">
    {loading && <p style={{ color: "hsl(var(--foreground-subtle))" }}>{t("common.loading")}</p>}
    {error && <div role="alert" className="orbit-card p-4 mb-6" style={{ color: "hsl(var(--destructive))" }}>{error}</div>}
    {!loading && !assessment && !error && <div className="orbit-card p-8 text-center"><h1 className="text-2xl mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>Assessment unavailable</h1><Link to="/my-learning" className="orbit-btn orbit-btn-primary">{t("nav.dashboard")}</Link></div>}
    {assessment && <>
      <div className="orbit-eyebrow mb-2">{t("assessment.title")}</div>
      <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-3" style={{ fontFamily: "'Fraunces', serif", color: "hsl(var(--foreground))" }}>{locale === "bn" && assessment.title_bn ? assessment.title_bn : assessment.title}</h1>
      <p className="mb-8" style={{ color: "hsl(var(--foreground-muted))" }}>{locale === "bn" && assessment.description_bn ? assessment.description_bn : assessment.description}</p>
      {result ? <div className="orbit-card p-8 mb-8"><div className="flex items-center gap-3 mb-4">{result.passed ? <CheckCircle2 style={{ color: "hsl(var(--orbit-primary))" }} /> : <CircleAlert style={{ color: "hsl(var(--destructive))" }} />}<h2 className="text-xl" style={{ color: "hsl(var(--foreground))" }}>{result.passed ? t("assessment.passed") : t("assessment.review")}</h2></div><div className="text-4xl mb-2" style={{ color: "hsl(var(--foreground))" }}>{result.score}%</div><p className="text-sm" style={{ color: "hsl(var(--foreground-subtle))" }}>Passing score: {result.passing_score}%</p></div> : <>
        <div className="space-y-5">{assessment.questions.map((question, index) => <section key={question.id} className="orbit-card p-6"><div className="text-[12px] mb-3" style={{ color: "hsl(var(--foreground-subtle))" }}>Question {index + 1} · {question.points} point{question.points === 1 ? "" : "s"}</div><h2 className="text-[1.05rem] mb-4" style={{ color: "hsl(var(--foreground))" }}>{locale === "bn" && question.prompt_bn ? question.prompt_bn : question.prompt}</h2><div className="space-y-2">{question.choices.map((choice) => <label key={choice.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: answers[question.id] === choice.id ? "hsl(var(--surface-raised))" : "transparent", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground-muted))" }}><input type="radio" name={question.id} value={choice.id} checked={answers[question.id] === choice.id} onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice.id }))} />{locale === "bn" && choice.label_bn ? choice.label_bn : choice.label}</label>)}</div></section>)}</div><button onClick={submit} disabled={submitting || answered === 0} className="orbit-btn orbit-btn-primary mt-6" style={{ minHeight: 44 }}>{submitting ? t("common.loading") : `${t("assessment.submit")} (${answered}/${assessment.questions.length})`}</button>
      </>}
    </>}
  </div></main><OrbitFooter /></div>;
};
export default AssessmentPage;
