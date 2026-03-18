import Link from "next/link";
import { Sparkles, Timer, Trophy, ArrowRight } from "lucide-react";

import { Layout } from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 animate-floaty rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 animate-floatySlow rounded-full bg-gradient-to-br from-cyan-400/25 to-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            Premium quiz experience - Timed - Competitive
          </div>

          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="text-gradient">Advanced Online Quiz Platform</span>
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
            Browse category-based quizzes, play under time pressure, and climb the XP leaderboard. Built for speed,
            clarity, and consistency.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quizzes"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500/90 via-fuchsia-500/80 to-cyan-400/80 px-6 py-3 text-sm font-extrabold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_24px_90px_rgba(0,194,255,0.24)] active:scale-[0.99]"
            >
              Browse quizzes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            >
              Go to dashboard
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Timer className="h-5 w-5 text-cyan-200" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">Timed quizzes</div>
                  <div className="text-sm text-white/65">Progress + navigation + auto-submit.</div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Trophy className="h-5 w-5 text-purple-200" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">Leaderboard</div>
                  <div className="text-sm text-white/65">XP ranking with accuracy signals.</div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Sparkles className="h-5 w-5 text-pink-200" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">Detailed results</div>
                  <div className="text-sm text-white/65">Explanations + topic context.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="glass group rounded-3xl p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">Timed quizzes</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Clean question flow with next/previous navigation, progress tracking, and a strict timer.
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Timer className="h-5 w-5 text-cyan-200" />
            </span>
          </div>
          <div className="mt-6">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10"
            >
              Start a quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="glass group rounded-3xl p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">Compete & climb</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Earn XP with correct and fast answers. Track your rank and streak from your dashboard.
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Trophy className="h-5 w-5 text-purple-200" />
            </span>
          </div>
          <div className="mt-6">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10"
            >
              View leaderboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}