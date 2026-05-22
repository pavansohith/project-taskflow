"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotFoundContent() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0f1e] px-6">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)]"
        aria-hidden
      />
      <p className="text-8xl font-bold text-white/10">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-white/40">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Go to Dashboard
        </Link>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
