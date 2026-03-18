import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Timer, Sparkles } from "lucide-react";

import { Layout } from "../../components/Layout";
import { getQuiz, submitQuiz, type QuizForPlay, type QuizResult } from "../../lib/api";

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function QuizPlayPage() {
  const router = useRouter();
  const quizId = typeof router.query.id === "string" ? router.query.id : "";

  const [quiz, setQuiz] = useState<QuizForPlay | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!quizId) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getQuiz(quizId);
        if (!alive) return;
        setQuiz(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(-1));
        setCurrent(0);
        setResult(null);
        setTimeLeft(data.quiz.timeLimitSec);
        startedAtRef.current = Date.now();
      } catch (err) {
        if (!alive) return;
        const message = err instanceof Error ? err.message : "LOAD_FAILED";
        if (message === "UNAUTHENTICATED") {
          await router.replace("/login");
          return;
        }
        setError(message);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [quizId, router]);

  useEffect(() => {
    if (!quiz || result) return;
    if (timeLeft <= 0) return;

    const t = setInterval(() => {
      setTimeLeft((x) => Math.max(0, x - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [quiz, result, timeLeft]);

  useEffect(() => {
    if (!quiz || result) return;
    if (timeLeft !== 0) return;
    void (async () => {
      await handleSubmit();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quiz, result]);

  const question = quiz?.questions[current];

  const progress = useMemo(() => {
    if (!quiz) return { answered: 0, percent: 0 };
    const answered = answers.filter((a) => a >= 0).length;
    const percent = Math.round((answered / quiz.questions.length) * 100);
    return { answered, percent };
  }, [answers, quiz]);

  async function handleSubmit() {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const timeTakenSec = Math.min(quiz.timeLimitSec, Math.floor((Date.now() - startedAtRef.current) / 1000));
      const data = await submitQuiz(quiz.id, { answers, timeTakenSec });
      setResult(data.result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "SUBMIT_FAILED";
      if (message === "UNAUTHENTICATED") {
        await router.replace("/login");
        return;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="glass rounded-3xl p-7">
        {loading ? <p className="text-sm text-white/70">Loading...</p> : null}
        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {quiz ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {quiz.category}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {quiz.difficulty}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {quiz.questions.length} questions
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">{quiz.title}</h1>
                {quiz.description ? <p className="mt-2 text-sm leading-relaxed text-white/70">{quiz.description}</p> : null}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-white/60">Time left</div>
                    <div className="mt-2 text-2xl font-extrabold text-white">{formatTime(timeLeft)}</div>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <Timer className="h-5 w-5 text-cyan-200" />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <progress
                value={progress.answered}
                max={quiz.questions.length}
                className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5
                [&::-webkit-progress-bar]:bg-white/5
                [&::-webkit-progress-value]:bg-gradient-to-r
                [&::-webkit-progress-value]:from-purple-500
                [&::-webkit-progress-value]:via-fuchsia-500
                [&::-webkit-progress-value]:to-cyan-400
                [&::-moz-progress-bar]:bg-gradient-to-r
                [&::-moz-progress-bar]:from-purple-500
                [&::-moz-progress-bar]:via-fuchsia-500
                [&::-moz-progress-bar]:to-cyan-400"
              />
              <div className="mt-2 text-xs font-semibold text-white/60">Progress: {progress.percent}%</div>
            </div>

            {!result && question ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-white/70">
                    Question <span className="text-white">{current + 1}</span> / {quiz.questions.length}
                    {question.topic ? <span className="text-white/50"> • {question.topic}</span> : null}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      answers[current] >= 0
                        ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                        : "border border-white/15 bg-white/5 text-white/70"
                    }`}
                  >
                    {answers[current] >= 0 ? "Answered" : "Unanswered"}
                  </span>
                </div>

                <div className="mt-4 text-lg font-extrabold text-white">{question.prompt}</div>

                <div className="mt-5 grid gap-3">
                  {question.options.map((opt, idx) => {
                    const active = answers[current] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[current] = idx;
                            return next;
                          });
                        }}
                        className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                          active
                            ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
                            : "border-white/12 bg-white/5 text-white/85 hover:bg-white/10"
                        }`}
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 font-extrabold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {active ? <Sparkles className="h-4 w-4 text-cyan-200" /> : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 disabled:opacity-40"
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 disabled:opacity-40"
                      onClick={() => setCurrent((c) => Math.min((quiz.questions.length || 1) - 1, c + 1))}
                      disabled={current >= quiz.questions.length - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500/90 via-fuchsia-500/80 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {result ? (
              <>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-white">Result</h2>
                      <p className="mt-2 text-sm text-white/70">Review your answers and explanations.</p>
                    </div>
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-extrabold text-cyan-100">
                      +{result.xpAwarded} XP
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs font-semibold tracking-wide text-white/60">Score</div>
                      <div className="mt-2 text-2xl font-extrabold text-white">
                        {result.correctCount}/{result.totalQuestions}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs font-semibold tracking-wide text-white/60">Accuracy</div>
                      <div className="mt-2 text-2xl font-extrabold text-white">
                        {Math.round((result.correctCount / result.totalQuestions) * 100)}%
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs font-semibold tracking-wide text-white/60">Time taken</div>
                      <div className="mt-2 text-2xl font-extrabold text-white">{formatTime(result.timeTakenSec)}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-xs font-semibold tracking-wide text-white/60">Category</div>
                      <div className="mt-2 text-lg font-extrabold text-white">{result.category}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/quizzes"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500/90 via-fuchsia-500/80 to-cyan-400/80 px-6 py-3 text-sm font-extrabold text-white shadow-glow transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Play another
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10"
                    >
                      Go to dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-6 glass rounded-3xl p-7">
                  <h2 className="text-xl font-extrabold tracking-tight text-white">Review</h2>
                  <p className="mt-2 text-sm text-white/70">Correct vs wrong with explanations.</p>

                  <div className="mt-6 grid gap-4">
                    {result.answers.map((a) => {
                      const selectedLabel = a.selectedIndex >= 0 ? String.fromCharCode(65 + a.selectedIndex) : "-";
                      const correctLabel = String.fromCharCode(65 + a.correctIndex);
                      return (
                        <div key={a.questionIndex} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm font-semibold text-white/70">
                              Q{a.questionIndex + 1}
                              {a.topic ? <span className="text-white/50"> • {a.topic}</span> : null}
                            </div>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${
                                a.isCorrect
                                  ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                                  : "border border-rose-400/30 bg-rose-500/10 text-rose-200"
                              }`}
                            >
                              {a.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              {a.isCorrect ? "Correct" : "Wrong"}
                            </span>
                          </div>

                          <div className="mt-4 text-base font-extrabold text-white">{a.prompt}</div>

                          <div className="mt-3 text-sm text-white/70">
                            Your answer: <b className="text-white">{selectedLabel}</b> • Correct: <b className="text-white">{correctLabel}</b>
                          </div>

                          {a.explanation ? <div className="mt-3 text-sm leading-relaxed text-white/65">{a.explanation}</div> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </section>

      {!loading && !quiz ? (
        <div className="mt-6 glass rounded-3xl p-7">
          <p className="text-sm text-white/70">
            Quiz not found. Go back to <Link href="/quizzes" className="font-semibold text-cyan-200">quizzes</Link>.
          </p>
        </div>
      ) : null}
    </Layout>
  );
}