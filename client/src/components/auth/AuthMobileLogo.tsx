import Link from "next/link";

export function AuthMobileLogo() {
  return (
    <Link
      href="/login"
      className="mb-6 flex flex-col items-center text-center lg:hidden"
    >
      <h1
        className="font-extrabold tracking-[-0.04em] text-white"
        style={{
          fontSize: "clamp(2.75rem, 12vw, 4.5rem)",
          lineHeight: 1.05,
        }}
      >
        TaskFlow
      </h1>
      <p className="mt-2 text-base font-light text-white/50 sm:text-lg">
        Manage tasks smarter.
      </p>
    </Link>
  );
}
