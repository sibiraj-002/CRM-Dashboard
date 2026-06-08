import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { AuthLayout } from "@/components/layout/AuthLayout";

export const metadata = {
  title: "Register | Intelligence CRM",
  description: "Create your Intelligence CRM account",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start managing your content in minutes."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
