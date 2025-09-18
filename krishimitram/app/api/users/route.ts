// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // call your backend API (adjust port if needed)
    const res = await fetch("https://krishimitram-server.onrender.com/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // important to always get fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users from backend");
    }

    const users = await res.json();

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error in Next.js API route:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
