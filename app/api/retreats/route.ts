import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Zod schema that matches your Prisma model
const RetreatSchema = z.object({
  name: z.string(),
  description: z.string().optional().default(""),
  location: z.string(),
  basePrice: z.coerce.number(),
  images: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  maxCapacity: z.coerce.number().default(20),
  dates: z.array(
    z.object({
      startDate: z.string(),
      endDate: z.string(),
      capacity: z.coerce.number(),
    })
  ).optional().default([]),
});

export async function GET() {
  const retreats = await prisma.retreat.findMany({
    include: { retreatDates: true },
  });

  return NextResponse.json(retreats);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received Body:", body);

    const parsed = RetreatSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Validation Error:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const retreat = await prisma.retreat.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        location: data.location,
        basePrice: data.basePrice,
        images: data.images ?? [],
        amenities: data.amenities ?? [],
        maxCapacity: data.maxCapacity,
        retreatDates: {
          create: data.dates.map((d) => ({
            startDate: new Date(d.startDate),
            endDate: new Date(d.endDate),
            capacity: d.capacity,
          })),
        },
      },
      include: { retreatDates: true },
    });

    return NextResponse.json(retreat, { status: 201 });
  } catch (err: any) {
    console.error("Create Retreat Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
