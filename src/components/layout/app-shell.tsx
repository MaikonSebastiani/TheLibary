import { Bell, CalendarDays, Search } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CurrentDateLabel } from "@/components/layout/current-date-label";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="min-h-screen pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 px-8 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            <CurrentDateLabel />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Buscar"
                className="h-10 w-72 rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="Buscar..."
                type="search"
              />
            </div>

            <button
              aria-label="Notificacoes"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
              type="button"
            >
              <Bell className="size-4" />
            </button>
          </div>
        </header>

        <main className="px-10 py-10">{children}</main>
      </div>
    </div>
  );
}
