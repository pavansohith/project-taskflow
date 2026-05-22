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
      <div className="flex min-h-screen bg-bg-base">
        <AuthBrandingPanel />
        <div className="flex flex-1 flex-col items-center justify-center px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="w-full max-w-md">
            <AuthPageTransition>{children}</AuthPageTransition>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
