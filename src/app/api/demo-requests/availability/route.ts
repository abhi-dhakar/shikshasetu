import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { demoRequests } from "@/db/schema";
import { SLOT_CAPACITY, TIME_SLOTS } from "@/lib/constants";
import { isIsoDate } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";

  if (!isIsoDate(date)) {
    return NextResponse.json({ ok: false, error: "Invalid date." }, { status: 400 });
  }

  try {
    const rows = await db
      .select({
        slot: demoRequests.preferredSlot,
        taken: sql<number>`count(*)::int`,
      })
      .from(demoRequests)
      .where(sql`${demoRequests.preferredDate} = ${date}`)
      .groupBy(demoRequests.preferredSlot);

    const takenMap = new Map(rows.map((r) => [r.slot, r.taken]));

    return NextResponse.json({
      ok: true,
      date,
      capacity: SLOT_CAPACITY,
      slots: TIME_SLOTS.map((slot) => {
        const taken = takenMap.get(slot) ?? 0;
        return {
          slot,
          taken,
          remaining: Math.max(SLOT_CAPACITY - taken, 0),
          available: taken < SLOT_CAPACITY,
        };
      }),
    });
  } catch {
    return NextResponse.json({
      ok: true,
      date,
      capacity: SLOT_CAPACITY,
      slots: TIME_SLOTS.map((slot) => ({
        slot,
        taken: 0,
        remaining: SLOT_CAPACITY,
        available: true,
      })),
    });
  }
}
