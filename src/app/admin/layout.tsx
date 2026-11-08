import type { ReactNode } from "react";
import "./admin.css";

/**
 * All /admin routes render inside this shell. The Enterprise design tokens and
 * component overrides are deliberately scoped to [data-admin-shell], keeping
 * the public marketing site untouched.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin-shell className="admin-shell">
      {children}
    </div>
  );
}
