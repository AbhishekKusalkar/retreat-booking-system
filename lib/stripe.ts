import Stripe from "stripe"

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20",
    })
  : null

export function validateStripeKey(): boolean {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("[v0] STRIPE_SECRET_KEY not configured")
    return false
  }
  return true
}
