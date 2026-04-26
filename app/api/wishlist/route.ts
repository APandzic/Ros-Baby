import { NextResponse } from "next/server"
import { sql, type WishListItem } from "@/lib/db"

export async function GET() {
  try {
    const items = (await sql`
      SELECT id, name, description, image_url, price_range, store_name, store_url,
             (claimed_by IS NOT NULL) AS claimed
      FROM wish_list_items
      ORDER BY id ASC
    `) as (Omit<WishListItem, "claimed_by" | "claimed_at"> & { claimed: boolean })[]
    return NextResponse.json(items)
  } catch (err) {
    console.error("Wishlist fetch error:", err)
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 })
  }
}
