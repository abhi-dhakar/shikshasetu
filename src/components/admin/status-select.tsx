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
  const selectId = `admin-status-${id}`;

  return (
    <form className="admin-status-control" aria-busy={pending}>
      <label className="admin-visually-hidden" htmlFor={selectId}>
        Update status for record {id}
      </label>
      <select
        id={selectId}
        defaultValue={status}
        disabled={pending}
        onChange={(event) => {
          const data = new FormData();
          data.set("id", String(id));
          data.set("status", event.target.value);
          startTransition(async () => {
            await action(data);
          });
        }}
        className="admin-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="admin-status-control__icon" aria-hidden="true">
        {pending ? (
          <Icon name="spinner" className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Icon name="filter" className="h-3 w-3" />
        )}
      </span>
      <span className="admin-visually-hidden" role="status">
        {pending ? "Updating status" : "Status ready"}
      </span>
    </form>
  );
}
