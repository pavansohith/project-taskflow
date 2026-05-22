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
        <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden bg-[#0a0f1e] px-4 py-8 sm:px-6 lg:px-10">
          {/* Grid background — visible on mobile/tablet where branding panel is hidden */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:32px_32px] lg:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-1/3 left-1/2 z-0 h-[min(420px,70vw)] w-[min(420px,70vw)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] lg:hidden"
            aria-hidden
          />

          <div className="relative z-[1] w-full max-w-sm">
            <AuthPageTransition>{children}</AuthPageTransition>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
