"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.get("password") }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const json = await res.json() as { error?: string };
        setError(json.error ?? "Invalid password");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong — try again");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-logo">
          <div className="admin-sidebar__logo-mark">e4s</div>
          <div className="admin-sidebar__logo-text">
            <span className="admin-sidebar__logo-name">Events4Singles</span>
            <span className="admin-sidebar__logo-sub">Admin</span>
          </div>
        </div>
        <h1 className="admin-login-title">Sign in</h1>
        <p className="admin-login-sub">Admin access only</p>
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}
          <div className="a-field">
            <label className="a-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="a-input"
              autoComplete="current-password"
              autoFocus
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="a-btn a-btn-primary a-inline-93473ca2"
            disabled={loading}
            
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
