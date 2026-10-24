import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              aria-label="Return to StoriList home"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/lettermark.png"
                alt="StoriList"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl object-contain shadow-xs"
                priority
              />
            </Link>
          </div>
          <ForgotPasswordForm />
        </div>
      </Container>
    </div>
  );
}
