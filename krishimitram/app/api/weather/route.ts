import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const res = await fetch(
    `https://api.ambeedata.com/weather/latest/by-lat-lng?lat=${lat}&lng=${lng}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "9af958a216825f6a3810788d07d313d8e4a92d1945b72669d84725154610eb25",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
