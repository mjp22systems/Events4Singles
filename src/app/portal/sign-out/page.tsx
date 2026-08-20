"use client";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignOutPage() {
  const { signOut } = useClerk();
  useEffect(() => { signOut({ redirectUrl: "/" }); }, [signOut]);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafb" }}>
      <p style={{ color: "#647887", fontFamily: "sans-serif" }}>Signing out…</p>
    </div>
  );
}
