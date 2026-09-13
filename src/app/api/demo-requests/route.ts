import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { demoRequests } from "@/db/schema";
import {
  BOARDS,
  MODES,
  SLOT_CAPACITY,
  STANDARDS,
  TIME_SLOTS,
} from "@/lib/constants";
import {
  isEmail,
  isIsoDate,
  isPhone,
  required,
  str,
  type FieldErrors,
} from "@/lib/validation";

import { getAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  // Listing submissions is admin-only.
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(demoRequests)
      .orderBy(desc(demoRequests.createdAt))
      .limit(100);
    return NextResponse.json({ ok: true, data: rows });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not load demo requests." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const errors: FieldErrors = {};
  const value = {
    parentFirstName: str(body.parentFirstName),
    parentLastName: str(body.parentLastName),
    childFirstName: str(body.childFirstName),
    childLastName: str(body.childLastName),
    standard: str(body.standard),
    board: str(body.board),
    phone: str(body.phone).replace(/\D/g, ""),
    email: str(body.email),
    addressLine1: str(body.addressLine1),
    addressLine2: str(body.addressLine2),
    city: str(body.city),
    state: str(body.state),
    postalCode: str(body.postalCode),
    schoolName: str(body.schoolName),
    mode: str(body.mode),
    preferredDate: str(body.preferredDate),
    preferredSlot: str(body.preferredSlot),
    altDate: str(body.altDate),
    altTime: str(body.altTime),
    comments: str(body.comments),
  };

  required(errors, "parentFirstName", value.parentFirstName, "Parent first name", 120);
  required(errors, "parentLastName", value.parentLastName, "Parent last name", 120);
  required(errors, "childFirstName", value.childFirstName, "Child first name", 120);
  required(errors, "childLastName", value.childLastName, "Child last name", 120);
  required(errors, "addressLine1", value.addressLine1, "Street address");
  required(errors, "city", value.city, "City", 120);
  required(errors, "state", value.state, "State / Province", 120);

  if (!STANDARDS.includes(value.standard)) errors.standard = "Please select a standard.";
  if (!BOARDS.includes(value.board)) errors.board = "Please select a board.";
  if (!MODES.includes(value.mode)) errors.mode = "Please select a teaching mode.";
  if (!isPhone(value.phone)) {
    errors.phone = "Please enter a valid phone number. Format: 0000000000.";
  }
  if (value.email && !isEmail(value.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!/^[0-9]{6}$/.test(value.postalCode)) {
    errors.postalCode = "Enter a valid 6 digit postal code.";
  }
  if (!isIsoDate(value.preferredDate)) {
    errors.preferredDate = "Please choose a demo date.";
  }
  if (!TIME_SLOTS.includes(value.preferredSlot)) {
    errors.preferredSlot = "Please choose an appointment time.";
  }
  if (value.altDate && !isIsoDate(value.altDate)) {
    errors.altDate = "Alternate date is not valid.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(demoRequests)
      .where(
        sql`${demoRequests.preferredDate} = ${value.preferredDate} and ${demoRequests.preferredSlot} = ${value.preferredSlot}`,
      );

    if (count >= SLOT_CAPACITY) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            preferredSlot:
              "That slot just filled up. Please pick another appointment time.",
          },
        },
        { status: 409 },
      );
    }

    const [row] = await db
      .insert(demoRequests)
      .values({
        ...value,
        email: value.email || null,
        addressLine2: value.addressLine2 || null,
        schoolName: value.schoolName || null,
        altDate: value.altDate || null,
        altTime: value.altTime || null,
        comments: value.comments || null,
      })
      .returning({ id: demoRequests.id, createdAt: demoRequests.createdAt });

    return NextResponse.json({
      ok: true,
      data: { reference: `SSD-${1000 + row.id}`, id: row.id },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong while saving your request." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: number; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ ok: false, error: "Missing fields." }, { status: 400 });
    }
    await db
      .update(demoRequests)
      .set({ status: body.status })
      .where(eq(demoRequests.id, body.id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
}
