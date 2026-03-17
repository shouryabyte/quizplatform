import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "../components/Layout";
import { logout, me, type PublicUser } from "../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await me();
        if (!alive) return;
        setUser(data.user);
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
    <Layout
      user={user}
      onLogout={async () => {
        try {
          await logout();
        } finally {
          await router.push("/login");
        }
      }}
    >
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <p className="p">Core stats today are placeholders. Day 2 adds quizzes + scoring.</p>

        {loading ? <p className="p">Loading…</p> : null}
        {error ? <div className="error">{error}</div> : null}

        {user ? (
          <>
            <div className="grid" style={{ marginTop: 14 }}>
              <div className="kpi">
                <p className="kpiTitle">XP</p>
                <p className="kpiValue">{user.xp}</p>
              </div>
              <div className="kpi">
                <p className="kpiTitle">Streak</p>
                <p className="kpiValue">{user.streak} days</p>
              </div>
              <div className="kpi">
                <p className="kpiTitle">Accuracy</p>
                <p className="kpiValue">{user.accuracy}%</p>
              </div>
              <div className="kpi">
                <p className="kpiTitle">Quizzes taken</p>
                <p className="kpiValue">{user.quizzesTaken}</p>
              </div>
            </div>

            <div style={{ marginTop: 16, color: "var(--muted)" }}>
              Signed in with <b>{user.provider}</b>
              {user.email ? ` as ${user.email}` : ""}.
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
