"use client";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignOutPage() {
  const { signOut } = useClerk();
  useEffect(() => { signOut({ redirectUrl: "/" }); }, [signOut]);
  return (
    <div className="p-sign-out-page">
      <p className="p-sign-out-page__message">Signing out…</p>
    </div>
  );
}
