"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE, TIME_SLOTS } from "@/lib/constants";
import { toIsoDate } from "@/lib/validation";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type SlotInfo = { slot: string; remaining: number; available: boolean };

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function prettyTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${`${m}`.padStart(2, "0")} ${suffix}`;
}

export default function AppointmentScheduler({
  date,
  slot,
  onDateChange,
  onSlotChange,
  error,
}: {
  date: string;
  slot: string;
  onDateChange: (value: string) => void;
  onSlotChange: (value: string) => void;
  error?: string;
}) {
  const today = useMemo(() => startOfToday(), []);
  const initial = date ? new Date(`${date}T00:00:00`) : today;
  const [cursor, setCursor] = useState(
    () => new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [slots, setSlots] = useState<SlotInfo[]>(
    TIME_SLOTS.map((s) => ({ slot: s, remaining: 4, available: true })),
  );
  const [loading, setLoading] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const loadSlots = useCallback(async (iso: string) => {
    if (!iso) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/demo-requests/availability?date=${iso}`);
      const json = (await res.json()) as { slots?: SlotInfo[] };
      if (json.slots) setSlots(json.slots);
    } catch {
      setSlots(TIME_SLOTS.map((s) => ({ slot: s, remaining: 4, available: true })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlots(date);
  }, [date, loadSlots]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lead = first.getDay();
    const list: Array<{ day: number; iso: string; disabled: boolean } | null> = [];
    for (let i = 0; i < lead; i += 1) list.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      const dt = new Date(year, month, d);
      list.push({
        day: d,
        iso: toIsoDate(dt),
        disabled: dt < today,
      });
    }
    return list;
  }, [cursor, today]);

  const selectedLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "No date selected yet";

  const shift = (months: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + months, 1));
  const shiftYear = (years: number) =>
    setCursor((c) => new Date(c.getFullYear() + years, c.getMonth(), 1));

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white ${
        error ? "border-[#e5484d]" : "border-[#dfd7c9]"
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[1.25fr_1fr]">
        {/* calendar */}
        <div className="border-b border-[#efe8dc] p-5 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e3dccf] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                ‹
              </button>
              <span className="min-w-[6.5rem] text-center font-display text-[1.05rem] text-brand-900">
                {MONTHS[cursor.getMonth()]}
              </span>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e3dccf] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftYear(-1)}
                aria-label="Previous year"
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e3dccf] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                ‹
              </button>
              <span className="min-w-[3rem] text-center font-display text-[1.05rem] text-brand-900">
                {cursor.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => shiftYear(1)}
                aria-label="Next year"
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e3dccf] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {DAY_LABELS.map((d) => (
              <span
                key={d}
                className="py-1 text-[0.62rem] font-bold tracking-[0.08em] text-ink/40"
              >
                {d}
              </span>
            ))}
            {cells.map((cell, i) => {
              if (!cell) return <span key={`empty-${i}`} />;
              const isSelected = cell.iso === date;
              const isToday = cell.iso === toIsoDate(today);
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={cell.disabled}
                  onClick={() => {
                    onDateChange(cell.iso);
                    onSlotChange("");
                  }}
                  className={`relative aspect-square rounded-lg text-[0.84rem] font-semibold transition-all duration-200 ${
                    cell.disabled
                      ? "cursor-not-allowed text-ink/20"
                      : isSelected
                        ? "scale-[1.04] bg-brand-900 text-white shadow-[0_10px_20px_-10px_rgba(10,37,64,0.9)]"
                        : "text-ink/75 hover:bg-brand-50"
                  }`}
                >
                  {cell.day}
                  {isToday && !isSelected && (
                    <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-accent-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* slots */}
        <div className="flex flex-col p-5">
          <p className="font-display text-[1.02rem] text-brand-900">{selectedLabel}</p>
          <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/45">
            Appointment time
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {slots.map((s) => {
              const active = slot === s.slot;
              return (
                <button
                  key={s.slot}
                  type="button"
                  disabled={!date || !s.available || loading}
                  onClick={() => onSlotChange(s.slot)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-[0.88rem] font-semibold transition-all duration-250 ${
                    active
                      ? "border-brand-900 bg-brand-900 text-white"
                      : !date || !s.available
                        ? "cursor-not-allowed border-[#ece5d8] text-ink/30"
                        : "border-[#e3dccf] text-brand-900 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-[0_10px_20px_-14px_rgba(10,37,64,0.8)]"
                  }`}
                >
                  <span className="tabular-nums">{s.slot}</span>
                  <span
                    className={`text-[0.68rem] font-medium ${
                      active ? "text-white/70" : "text-ink/40"
                    }`}
                  >
                    {s.available ? `${prettyTime(s.slot)}` : "Full"}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-auto pt-4 text-[0.72rem] text-ink/45">
            {SITE.timezone} {clock && `(${clock})`}
          </p>
        </div>
      </div>

      {error && (
        <p className="border-t border-[#f4d5d6] bg-[#fdf1f1] px-5 py-2.5 text-[0.78rem] font-semibold text-[#c0343a]">
          {error}
        </p>
      )}
    </div>
  );
}
