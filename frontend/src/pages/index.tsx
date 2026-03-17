import Link from "next/link";
import { Layout } from "../components/Layout";
import { oauthUrl } from "../lib/api";

export default function HomePage() {
  return (
    <Layout>
      <div className="card">
        <h1 className="h1">Advanced Online Quiz Platform</h1>
        <p className="p">
          Day 1 demo: authentication + user dashboard shell. Quiz engine, leaderboard, and analytics come next.
        </p>
        <div className="row">
          <Link className="btn" href="/signup">
            Create account
          </Link>
          <Link className="btn btnSecondary" href="/login">
            Login
          </Link>
          <a className="btn btnSecondary" href={oauthUrl("google")}>
            Continue with Google
          </a>
          <a className="btn btnSecondary" href={oauthUrl("github")}>
            Continue with GitHub
          </a>
        </div>
      </div>
    </Layout>
  );
}
