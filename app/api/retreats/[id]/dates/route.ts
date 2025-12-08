import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Date-only validation schema
const RetreatDateSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  capacity: z.coerce.number(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ⭐ FIX: await params

    const body = await req.json();
    console.log("Received Body:", body);

    const parsed = RetreatDateSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Validation Error:", parsed.error.format());
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const { startDate, endDate, capacity } = parsed.data;

    const newDate = await prisma.retreatDate.create({
      data: {
        retreatId: id, // ⭐ FIX: retreatId now valid
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        capacity,
      },
    });

    return NextResponse.json(newDate, { status: 201 });
  } catch (err: any) {
    console.error("Create Retreat Date Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⭐ FIX

  const dates = await prisma.retreatDate.findMany({
    where: { retreatId: id },
  });

  return NextResponse.json(dates);
}
