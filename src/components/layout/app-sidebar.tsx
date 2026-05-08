import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex print:hidden">
      <SidebarNav />
    </aside>
  );
}
