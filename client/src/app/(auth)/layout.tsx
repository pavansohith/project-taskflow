import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthPageTransition } from "@/components/auth/AuthPageTransition";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard mode="guest">
      <div className="flex min-h-screen">
        <AuthBrandingPanel />
        <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#0a0f1e] px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-sm">
            <AuthPageTransition>{children}</AuthPageTransition>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
