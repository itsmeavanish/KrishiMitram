// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();   // ✅ await here
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ token });
}
