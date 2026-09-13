import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { CONTACT_TOPICS } from "@/lib/constants";
import { isEmail, isPhone, required, str, type FieldErrors } from "@/lib/validation";

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
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(100);
    return NextResponse.json({ ok: true, data: rows });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not load messages." },
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
    name: str(body.name),
    phone: str(body.phone).replace(/\D/g, ""),
    email: str(body.email),
    topic: str(body.topic),
    message: str(body.message),
  };

  required(errors, "name", value.name, "Name", 160);
  required(errors, "message", value.message, "Message", 2000);
  if (!isPhone(value.phone)) {
    errors.phone = "Please enter a valid phone number. Format: 0000000000.";
  }
  if (value.email && !isEmail(value.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!CONTACT_TOPICS.includes(value.topic)) errors.topic = "Please select a topic.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    await db.insert(contactMessages).values({
      ...value,
      email: value.email || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send your message right now." },
      { status: 500 },
    );
  }
}
