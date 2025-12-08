import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Luxury Wellness Retreats",
  description: "Book your perfect wellness retreat experience",
}

export default function Home() {
  return <ClientPage />
}
