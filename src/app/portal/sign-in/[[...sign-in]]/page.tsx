import { SignIn } from "@clerk/nextjs";

export default function PortalSignIn() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafb" }}>
      <SignIn fallbackRedirectUrl="/portal/dashboard" />
    </div>
  );
}
