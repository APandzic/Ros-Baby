import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Namn krävs." }, { status: 400 })
    }

    const result = await sql`
      UPDATE wish_list_items
      SET claimed_by = ${name.trim()}, claimed_at = NOW()
      WHERE id = ${id} AND claimed_by IS NULL
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Presenten är redan tagen." },
        { status: 409 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Claim error:", err)
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 })
  }
}
