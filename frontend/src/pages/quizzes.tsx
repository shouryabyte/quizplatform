import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight, Layers, Clock3, ShieldCheck } from "lucide-react";

import { Layout } from "../components/Layout";
import { getCategories, getQuizzes, type CategorySummary, type QuizSummary } from "../lib/api";

export default function QuizzesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visibleQuizzes = useMemo(() => {
    if (!activeCategory) return quizzes;
    return quizzes.filter((q) => q.category === activeCategory);
  }, [activeCategory, quizzes]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [c, q] = await Promise.all([getCategories(), getQuizzes()]);
        if (!alive) return;
        setCategories(c.categories);
        setQuizzes(q.quizzes);
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
  }, [router]);

  return (
    <Layout>
      <section className="glass rounded-3xl p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Quizzes</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Choose a category, start a timed quiz, earn XP.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeCategory === null
                  ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
                  : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              All
            </button>

            {categories.map((c) => {
              const active = activeCategory === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActiveCategory(c.name)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
                      : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {c.name} <span className="text-white/50">({c.quizCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-white/70">Loading…</p> : null}
        {error ? <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {visibleQuizzes.map((q) => (
          <div key={q.id} className="glass group rounded-3xl p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {q.category}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {q.difficulty}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">{q.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{q.description}</p>
              </div>

              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Layers className="h-5 w-5 text-cyan-200" />
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2 text-white/70">
                  <ShieldCheck className="h-4 w-4" />
                  Questions
                </div>
                <div className="mt-1 text-lg font-extrabold text-white">{q.questionCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2 text-white/70">
                  <Clock3 className="h-4 w-4" />
                  Time
                </div>
                <div className="mt-1 text-lg font-extrabold text-white">{Math.round(q.timeLimitSec / 60)}m</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-white/70">XP</div>
                <div className="mt-1 text-lg font-extrabold text-white">Up to 250</div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/quiz/${q.id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500/90 via-fuchsia-500/80 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                Start quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {!loading && !error && visibleQuizzes.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-7">
          <p className="text-sm text-white/70">No quizzes found for this filter.</p>
        </div>
      ) : null}
    </Layout>
  );
}