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
    <form action={action} method="get" className="admin-search" role="search">
      {hidden &&
        Object.entries(hidden).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      <label className="admin-visually-hidden" htmlFor={`admin-search-${action.replaceAll("/", "-")}`}>
        {placeholder ?? "Search records"}
      </label>
      <Icon
        name="search"
        className="admin-search__icon"
        aria-hidden="true"
      />
      <input
        id={`admin-search-${action.replaceAll("/", "-")}`}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder ?? "Search…"}
        className="admin-input"
      />
      <button
        type="submit"
        className="admin-search__submit"
        aria-label="Submit search"
      >
        <Icon name="arrowRight" className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
