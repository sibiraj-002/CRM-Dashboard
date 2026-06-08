import { ForgotPasswordForm } from "@/components/forms";
import { AuthLayout } from "@/components/layout/AuthLayout";

export const metadata = {
  title: "Forgot Password | Intelligence CRM",
  description: "Reset your Intelligence CRM password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password?"
      description="No worries — we'll send you reset instructions."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
