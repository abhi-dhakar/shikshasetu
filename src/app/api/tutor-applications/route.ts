import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { tutorApplications } from "@/db/schema";
import { AREAS, BOARDS, MODES } from "@/lib/constants";
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
      .from(tutorApplications)
      .orderBy(desc(tutorApplications.createdAt))
      .limit(100);
    return NextResponse.json({ ok: true, data: rows });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not load tutor applications." },
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
  const subjects = Array.isArray(body.subjects)
    ? (body.subjects as unknown[]).map((s) => str(s)).filter(Boolean)
    : str(body.subjects)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const boards = Array.isArray(body.boards)
    ? (body.boards as unknown[]).map((s) => str(s)).filter(Boolean)
    : str(body.boards)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const value = {
    fullName: str(body.fullName),
    phone: str(body.phone).replace(/\D/g, ""),
    email: str(body.email),
    qualification: str(body.qualification),
    experience: str(body.experience),
    subjects: subjects.join(", ").slice(0, 300),
    classes: str(body.classes),
    boards: boards.join(", ").slice(0, 160),
    area: str(body.area),
    mode: str(body.mode),
    about: str(body.about),
  };

  required(errors, "fullName", value.fullName, "Full name", 160);
  required(errors, "qualification", value.qualification, "Highest qualification", 160);
  required(errors, "experience", value.experience, "Experience", 60);
  required(errors, "classes", value.classes, "Class range", 160);

  if (!isPhone(value.phone)) {
    errors.phone = "Please enter a valid phone number. Format: 0000000000.";
  }
  if (value.email && !isEmail(value.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (subjects.length === 0) errors.subjects = "Select at least one subject.";
  if (boards.length === 0) errors.boards = "Select at least one board.";
  if (!boards.every((b) => BOARDS.includes(b))) errors.boards = "Invalid board selected.";
  if (!AREAS.includes(value.area)) errors.area = "Please select your area in Surat.";
  if (!MODES.includes(value.mode)) errors.mode = "Please select a teaching mode.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const [row] = await db
      .insert(tutorApplications)
      .values({
        ...value,
        email: value.email || null,
        about: value.about || null,
      })
      .returning({ id: tutorApplications.id });

    return NextResponse.json({
      ok: true,
      data: { reference: `SST-${2000 + row.id}`, id: row.id },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong while saving your application." },
      { status: 500 },
    );
  }
}
