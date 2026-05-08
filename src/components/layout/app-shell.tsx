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

      <div className="min-h-screen pl-64 print:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 px-8 backdrop-blur print:hidden">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            <CurrentDateLabel />
          </div>
        </header>

        <main className="px-10 py-10 print:px-0 print:py-0">{children}</main>
      </div>
    </div>
  );
}
