import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { AuthLayout } from "@/components/layout/AuthLayout";

export const metadata = {
  title: "Login | Intelligence CRM",
  description: "Sign in to your Intelligence CRM workspace",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your dashboard."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
