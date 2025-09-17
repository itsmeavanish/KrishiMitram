import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ msg: "Logged out successfully" });

  // Clear the cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0), // expire immediately
  });

  return response;
}
