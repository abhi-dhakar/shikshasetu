"use client";

import { useTransition } from "react";
import { Icon } from "@/components/icons";

export default function StatusSelect({
  id,
  status,
  options,
  action,
}: {
  id: number;
  status: string;
  options: readonly string[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form className="relative inline-flex items-center">
      <select
        defaultValue={status}
        disabled={pending}
        aria-label="Update status"
        onChange={(event) => {
          const data = new FormData();
          data.set("id", String(id));
          data.set("status", event.target.value);
          startTransition(async () => {
            await action(data);
          });
        }}
        className="appearance-none rounded-lg border border-brand-900/15 bg-white py-1.5 pl-3 pr-8 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-brand-900 transition-colors hover:border-brand-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12 disabled:opacity-50"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-brand-900/50">
        {pending ? (
          <Icon name="spinner" className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Icon name="filter" className="h-3 w-3" />
        )}
      </span>
    </form>
  );
}
