import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) {
    redirect("/login");
  }

  let authenticated = false;

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Cookie: `token=${token.value}`,
      },
      cache: "no-store",
    });
    authenticated = res.ok;
  } catch {
    authenticated = false;
  }

  redirect(authenticated ? "/dashboard" : "/login");
}
