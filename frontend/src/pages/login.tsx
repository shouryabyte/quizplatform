import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { Layout } from "../components/Layout";
import { login, oauthUrl } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <div className="card" style={{ maxWidth: 520 }}>
        <h1 className="h1">Login</h1>
        <p className="p">Use email/password, or OAuth if configured.</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              await login({ email, password });
              await router.push("/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "LOGIN_FAILED");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

          <label className="label">Password</label>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
            <Link className="btn btnSecondary" href="/signup">
              Create account
            </Link>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <a className="btn btnSecondary" href={oauthUrl("google")}>
              Google
            </a>
            <a className="btn btnSecondary" href={oauthUrl("github")}>
              GitHub
            </a>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </form>
      </div>
    </Layout>
  );
}
