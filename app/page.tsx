"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WishListItem } from "@/lib/db"

type WishListItemWithClaimed = Omit<WishListItem, "claimed_by" | "claimed_at"> & {
  claimed: boolean
}
import { Gift, CheckCircle2, ShoppingBag, Loader2, MapPin, CalendarDays, Clock } from "lucide-react"

// ─── Event info – uppdatera dessa ───────────────────────────
const EVENT = {
  date: "6 Juni 2026",
  dateEn: "June 6, 2026",
  time: "13:00",
  location: "Diavoxvägen 18A, Stockholm",
  rsvpDeadline: "20 Maj",
  rsvpDeadlineEn: "May 20",
}
// ────────────────────────────────────────────────────────────

const t = {
  sv: {
    invited: "Du är inbjuden",
    rsvpTab: "OSA",
    wishlistTab: "Önskelista",
    rsvpTitle: "OSA",
    rsvpDesc: (deadline: string) => `Vänligen anmäl dig senast ${deadline}.`,
    nameLabel: "Namn *",
    namePlaceholder: "Ditt namn",
    attendingLabel: "Kommer du? *",
    yes: "Ja, jag kommer!",
    no: "Tyvärr, jag kan inte",
    dietaryLabel: "Allergier / matpreferenser",
    dietaryPlaceholder: "Inga, vegansk, glutenfri…",
    submit: "Skicka anmälan",
    submitting: "Skickar…",
    successTitle: "Tack för din anmälan!",
    successAttending: "Vi ser fram emot att fira med dig!",
    successDeclined: "Tråkigt att du inte kan, men tack för att du meddelade!",
    submitAnother: "Skicka en ny anmälan",
    error: "Något gick fel. Försök igen.",
    wishlistTitle: "Önskelista",
    wishlistDesc: "Klicka på en present du vill köpa och skriv ditt namn.",
    allClaimed: "Alla presenter är bokade!",
    allClaimedSub: "Så generösa ni är.",
    available: "Tillgängliga",
    alreadyBooked: "Redan bokade",
    bookedBadge: "Bokad",
    claimTitle: "Boka present",
    claimDesc: "Du bokar:",
    claimerLabel: "Ditt namn *",
    claimerPlaceholder: "Skriv ditt namn",
    cancel: "Avbryt",
    book: "Boka present",
    booking: "Bokar…",
    claimError: "Något gick fel. Försök igen.",
    alreadyClaimed: "Presenten är redan tagen.",
    infoDate: "Datum",
    infoTime: "Tid",
    infoLocation: "Plats",

  },
  en: {
    invited: "You are invited",
    rsvpTab: "RSVP",
    wishlistTab: "Wish List",
    rsvpTitle: "RSVP",
    rsvpDesc: (deadline: string) => `Please respond by ${deadline}.`,
    nameLabel: "Name *",
    namePlaceholder: "Your name",
    attendingLabel: "Will you attend? *",
    yes: "Yes, I'll be there!",
    no: "Sorry, I can't make it",
    dietaryLabel: "Allergies / dietary preferences",
    dietaryPlaceholder: "None, vegan, gluten-free…",
    submit: "Send RSVP",
    submitting: "Sending…",
    successTitle: "Thank you!",
    successAttending: "We look forward to celebrating with you!",
    successDeclined: "Sorry you can't make it, but thank you for letting us know!",
    submitAnother: "Submit another RSVP",
    error: "Something went wrong. Please try again.",
    wishlistTitle: "Wish List",
    wishlistDesc: "Click a gift you'd like to buy and enter your name.",
    allClaimed: "All gifts have been claimed!",
    allClaimedSub: "How generous you all are.",
    available: "Available",
    alreadyBooked: "Already claimed",
    bookedBadge: "Claimed",
    claimTitle: "Claim gift",
    claimDesc: "You are claiming:",
    claimerLabel: "Your name *",
    claimerPlaceholder: "Enter your name",
    cancel: "Cancel",
    book: "Claim gift",
    booking: "Claiming…",
    claimError: "Something went wrong. Please try again.",
    alreadyClaimed: "This gift has already been claimed.",
    infoDate: "Date",
    infoTime: "Time",
    infoLocation: "Location",

  },
}

type Lang = "sv" | "en"
type RsvpState = "idle" | "loading" | "success" | "error"
type ClaimState = "idle" | "loading" | "error"

export default function Page() {
  const [lang, setLang] = useState<Lang>("sv")
  const tx = t[lang]

  // RSVP state
  const [rsvpName, setRsvpName] = useState("")
  const [attending, setAttending] = useState<boolean | null>(null)
  const [dietaryNotes, setDietaryNotes] = useState("")
  const [rsvpState, setRsvpState] = useState<RsvpState>("idle")

  // Wishlist state
  const [items, setItems] = useState<WishListItemWithClaimed[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [selectedItem, setSelectedItem] = useState<WishListItemWithClaimed | null>(null)
  const [claimerName, setClaimerName] = useState("")
  const [claimState, setClaimState] = useState<ClaimState>("idle")
  const [claimError, setClaimError] = useState("")

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoadingItems(true)
    try {
      const res = await fetch("/api/wishlist")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoadingItems(false)
    }
  }

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault()
    if (!rsvpName.trim() || attending === null) return

    setRsvpState("loading")
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName.trim(),
          attending,
          dietary_notes: dietaryNotes.trim() || null,
        }),
      })
      setRsvpState(res.ok ? "success" : "error")
    } catch {
      setRsvpState("error")
    }
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedItem || !claimerName.trim()) return

    setClaimState("loading")
    setClaimError("")
    try {
      const res = await fetch(`/api/wishlist/${selectedItem.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: claimerName.trim() }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === selectedItem.id ? { ...i, claimed: true } : i)),
        )
        setSelectedItem(null)
        setClaimerName("")
        setClaimState("idle")
      } else {
        const data = await res.json()
        setClaimError(data.error || tx.claimError)
        setClaimState("error")
      }
    } catch {
      setClaimError(tx.claimError)
      setClaimState("error")
    }
  }

  function selectItem(item: WishListItemWithClaimed) {
    setSelectedItem(selectedItem?.id === item.id ? null : item)
    setClaimerName("")
    setClaimState("idle")
    setClaimError("")
  }

  const activeRing = "ring-2 ring-stone-400 border-stone-400 bg-stone-50 text-stone-800"
  const inactiveBtn = "border-border bg-background hover:bg-muted text-foreground"

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Language toggle */}
      <div className="flex justify-end px-6 pt-4">
        <div className="inline-flex rounded-lg border border-stone-200 bg-white text-sm shadow-sm">
          <button
            onClick={() => setLang("sv")}
            className={`rounded-l-lg px-3 py-1.5 font-medium transition-colors ${
              lang === "sv"
                ? "bg-stone-800 text-white"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            SV
          </button>
          <button
            onClick={() => setLang("en")}
            className={`rounded-r-lg px-3 py-1.5 font-medium transition-colors ${
              lang === "en"
                ? "bg-stone-800 text-white"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="py-12 text-center">
        <h1 className="text-5xl font-light tracking-tight text-stone-800">
          Baby Shower
        </h1>
        <p className="mt-3 text-2xl font-semibold text-stone-700">Ros</p>
        <div className="mx-auto mt-6 h-px w-16 bg-stone-300" />
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 pb-16">

        {/* Event info box */}
        <div className="mb-8 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-stone-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {tx.infoDate}
                </p>
                <p className="mt-0.5 text-sm font-medium text-stone-800">
                  {lang === "sv" ? EVENT.date : EVENT.dateEn}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-stone-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {tx.infoTime}
                </p>
                <p className="mt-0.5 text-sm font-medium text-stone-800">
                  {EVENT.time}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-stone-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {tx.infoLocation}
                </p>
                <p className="mt-0.5 text-sm font-medium text-stone-800">
                  {EVENT.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="rsvp">
          <TabsList className="mb-8 w-full border border-stone-200 bg-white shadow-sm">
            <TabsTrigger
              value="rsvp"
              className="flex-1 gap-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white"
            >
              {tx.rsvpTab}
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex-1 gap-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white"
            >
              <Gift className="size-4" />
              {tx.wishlistTab}
            </TabsTrigger>
          </TabsList>

          {/* RSVP Tab */}
          <TabsContent value="rsvp">
            {rsvpState === "success" ? (
              <Card className="border-stone-200 bg-white text-center shadow-sm">
                <CardContent className="pb-10 pt-10">
                  <CheckCircle2 className="mx-auto mb-4 size-12 text-stone-400" />
                  <h2 className="mb-2 text-xl font-semibold text-stone-800">
                    {tx.successTitle}
                  </h2>
                  <p className="text-muted-foreground">
                    {attending ? tx.successAttending : tx.successDeclined}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-6 text-stone-500 hover:text-stone-800"
                    onClick={() => {
                      setRsvpState("idle")
                      setRsvpName("")
                      setAttending(null)
                      setDietaryNotes("")
                    }}
                  >
                    {tx.submitAnother}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-stone-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-stone-800">{tx.rsvpTitle}</CardTitle>
                  <CardDescription>
                    {tx.rsvpDesc(lang === "sv" ? EVENT.rsvpDeadline : EVENT.rsvpDeadlineEn)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRsvp} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">{tx.nameLabel}</Label>
                      <Input
                        id="name"
                        placeholder={tx.namePlaceholder}
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{tx.attendingLabel}</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAttending(true)}
                          className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-all ${
                            attending === true ? activeRing : inactiveBtn
                          }`}
                        >
                          {tx.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttending(false)}
                          className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-all ${
                            attending === false ? activeRing : inactiveBtn
                          }`}
                        >
                          {tx.no}
                        </button>
                      </div>
                    </div>

                    {attending === true && (
                      <div className="space-y-1.5">
                        <Label htmlFor="dietary">{tx.dietaryLabel}</Label>
                        <Textarea
                          id="dietary"
                          placeholder={tx.dietaryPlaceholder}
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                        />
                      </div>
                    )}

                    {rsvpState === "error" && (
                      <p className="text-sm text-destructive">{tx.error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={
                        !rsvpName.trim() ||
                        attending === null ||
                        rsvpState === "loading"
                      }
                      className="w-full bg-stone-800 text-white hover:bg-stone-700"
                    >
                      {rsvpState === "loading" ? (
                        <>
                          <Loader2 className="animate-spin" />
                          {tx.submitting}
                        </>
                      ) : (
                        tx.submit
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-stone-800">
                {tx.wishlistTitle}
              </h2>
              <p className="text-sm text-stone-800">{tx.wishlistDesc}</p>
            </div>

            {loadingItems ? (
              <div className="flex items-center justify-center py-20 text-stone-400">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                {/* Available gifts */}
                {items.filter((i) => !i.claimed).length === 0 ? (
                  <Card className="border-stone-200 bg-white text-center shadow-sm">
                    <CardContent className="py-14">
                      <ShoppingBag className="mx-auto mb-3 size-10 text-stone-300" />
                      <p className="font-medium text-stone-700">{tx.allClaimed}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tx.allClaimedSub}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {tx.available}
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {items
                        .filter((i) => !i.claimed)
                        .map((item) => {
                          const isSelected = selectedItem?.id === item.id
                          return (
                            <div
                              key={item.id}
                              className="rounded-xl border border-stone-200 bg-white shadow-sm transition-all"
                            >
                              <button
                                onClick={() => selectItem(item)}
                                className="group w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl"
                              >
                                <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-stone-200">
                                  <Gift className="size-4" />
                                </div>
                                <p className="font-semibold text-stone-800">{item.name}</p>
                                {item.description && (
                                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                                    {item.description}
                                  </p>
                                )}
                                {item.store_name && (
                                  <p className="mt-3 text-xs text-stone-400">
                                    {item.store_name}
                                  </p>
                                )}
                              </button>

                              {isSelected && (
                                <form
                                  onSubmit={handleClaim}
                                  className="border-t border-stone-100 px-5 pb-5 pt-4 space-y-3"
                                >
                                  <Input
                                    placeholder={tx.claimerPlaceholder}
                                    value={claimerName}
                                    onChange={(e) => setClaimerName(e.target.value)}
                                    required
                                    autoFocus
                                  />
                                  {claimError && (
                                    <p className="text-sm text-destructive">{claimError}</p>
                                  )}
                                  <Button
                                    type="submit"
                                    disabled={!claimerName.trim() || claimState === "loading"}
                                    className="w-full bg-stone-800 text-white hover:bg-stone-700"
                                  >
                                    {claimState === "loading" ? (
                                      <>
                                        <Loader2 className="animate-spin" />
                                        {tx.booking}
                                      </>
                                    ) : (
                                      tx.book
                                    )}
                                  </Button>
                                </form>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </>
                )}

                {/* Claimed gifts */}
                {items.filter((i) => i.claimed).length > 0 && (
                  <div className="mt-8">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {tx.alreadyBooked}
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {items
                        .filter((i) => i.claimed)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-5 py-4"
                          >
                            <p className="text-sm font-medium text-stone-400 line-through">
                              {item.name}
                            </p>
                            <span className="ml-3 shrink-0 rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                              {tx.bookedBadge}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

    </div>
  )
}
