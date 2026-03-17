import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicUser } from "../lib/api";

export function Layout(props: { children: ReactNode; user?: PublicUser | null; onLogout?: () => void }) {
  const { children, user, onLogout } = props;

  return (
    <div className="container">
      <div className="nav">
        <div className="row">
          <div className="brand">NexChakra Quiz</div>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className="row">
          {user?.name ? <span style={{ color: "var(--muted)" }}>Hi, {user.name}</span> : null}
          {user ? (
            <button className="btn btnDanger" onClick={onLogout} type="button">
              Logout
            </button>
          ) : (
            <>
              <Link className="btn btnSecondary" href="/login">
                Login
              </Link>
              <Link className="btn" href="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
