import { Icon } from "@/components/icons";

export default function AdminSearch({
  action,
  defaultValue,
  placeholder,
  hidden,
}: {
  action: string;
  defaultValue?: string;
  placeholder?: string;
  hidden?: Record<string, string>;
}) {
  return (
    <form action={action} className="relative w-full max-w-xs">
      {hidden &&
        Object.entries(hidden).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <Icon
        name="search"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
      />
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder ?? "Search…"}
        className="w-full rounded-full border border-brand-900/12 bg-white py-2.5 pl-10 pr-4 text-[0.85rem] text-brand-900 transition-all placeholder:text-ink/35 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12"
      />
    </form>
  );
}
