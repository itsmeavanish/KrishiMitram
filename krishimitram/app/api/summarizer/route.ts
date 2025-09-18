import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set in .env.local
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, fast, professional
      messages: [
        {
          role: "system",
          content:
            "You are a professional agricultural advisor AI. Your job is to rephrase any text into a very clear, polished, and professional advisory message.",
        },
        { role: "user", content: text },
      ],
    })

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "Unable to generate a response."

    return NextResponse.json({ answer })
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 })
  }
}
