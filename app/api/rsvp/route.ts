import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, attending, dietary_notes } = body

    if (!name || typeof attending !== "boolean") {
      return NextResponse.json(
        { error: "Namn och närvaro krävs." },
        { status: 400 },
      )
    }

    await sql`
      INSERT INTO rsvp (name, email, attending, dietary_notes)
      VALUES (${name}, ${email || null}, ${attending}, ${dietary_notes || null})
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("RSVP error:", err)
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 })
  }
}
