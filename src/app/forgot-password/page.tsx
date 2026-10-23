import type { Metadata } from "next";
import Container from "@/components/Container";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | StoriList",
  description: "Request a password reset link for your StoriList account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <ForgotPasswordForm />
      </Container>
    </div>
  );
}
