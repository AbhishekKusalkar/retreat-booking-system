"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Geist, Geist_Mono } from "next/font/google"

const _geistSans = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Book Your Perfect Retreat</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover luxurious wellness retreats and book your next escape with ease
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking/guest-info">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                Start Booking
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button variant="outline" className="px-8 py-6 text-lg bg-transparent">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple 4-step booking process with secure Stripe payments</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Management</h3>
              <p className="text-gray-600">Assign expert instructors to retreats with automated notifications</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Admin</h3>
              <p className="text-gray-600">Role-based access control with email confirmations</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
