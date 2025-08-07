import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionUser = {
  id?: string;
  name?: string;
  avatar?: string;
};

export type SessionPayload = {
  user: SessionUser;
  accessToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: SessionPayload) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax", // prevent CSRF attacks by restricting cross-site usage of the cookie
    path: "/", // cookie is valid for the entire site
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    redirect("/auth/signin");
  }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}
