import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful farming assistant. Rephrase responses to be concise, polite, and professional while keeping all important details intact." },
        { role: "user", content: text },
      ],
    })

    const refined = completion.choices[0].message?.content || text
    return NextResponse.json({ answer: refined })
  } catch (err) {
    console.error("Refiner error:", err)
    return NextResponse.json({ answer: text })
  }
}
