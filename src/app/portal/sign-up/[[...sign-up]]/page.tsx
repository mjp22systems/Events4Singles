import { SignUp } from "@clerk/nextjs";

export default function PortalSignUp() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafb" }}>
      <SignUp />
    </div>
  );
}
