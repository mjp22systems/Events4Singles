import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function PortalSignIn() {
  return (
    <div className="p-auth-page">
      <Link className="p-auth-back-link" href="/">
        <span aria-hidden="true">←</span>
        Back to site
      </Link>
      <SignIn fallbackRedirectUrl="/portal/dashboard" />
    </div>
  );
}
