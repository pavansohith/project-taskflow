import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function AuthMobileLogo() {
  return (
    <Link
      href="/login"
      className="mb-8 flex items-center justify-center gap-2 lg:hidden"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
        <LayoutDashboard className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-text-primary">
        TaskFlow
      </span>
    </Link>
  );
}
