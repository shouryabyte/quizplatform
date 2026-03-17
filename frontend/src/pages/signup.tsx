import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { Layout } from "../components/Layout";
import { register } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <div className="card" style={{ maxWidth: 520 }}>
        <h1 className="h1">Create account</h1>
        <p className="p">Password must be at least 8 characters.</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              await register({ name, email, password });
              await router.push("/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "SIGNUP_FAILED");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />

          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

          <label className="label">Password</label>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            required
          />

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Sign up"}
            </button>
            <Link className="btn btnSecondary" href="/login">
              I already have an account
            </Link>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </form>
      </div>
    </Layout>
  );
}
