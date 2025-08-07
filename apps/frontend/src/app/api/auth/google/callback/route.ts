import { BACKEND_URL } from "@/lib/constants";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const avatar = searchParams.get("avatar");
  const accessToken = searchParams.get("accessToken");

  if (!userId || !name || !avatar || !accessToken) {
    throw new Error("Google oauth failed: missing parameters");
  }

  const res = await fetch(`${BACKEND_URL}/auth/google/verfiy-token`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 401) {
    throw new Error("Google oauth failed: invalid token");
  }

  await createSession({
    user: {
      id: userId,
      name,
      avatar: avatar ?? undefined,
    },
    accessToken,
  });

  redirect("/");
}
