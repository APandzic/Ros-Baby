import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.POSTGRES_URL!)

export type RsvpRow = {
  id: number
  name: string
  email: string | null
  attending: boolean
  dietary_notes: string | null
  created_at: string
}

export type WishListItem = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  price_range: string | null
  store_name: string | null
  store_url: string | null
  claimed_by: string | null
  claimed_at: string | null
}
