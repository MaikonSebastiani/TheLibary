import { CalendarDays } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CurrentDateLabel } from "@/components/layout/current-date-label";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="min-h-screen lg:pl-64 print:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-8 print:hidden">
          <MobileSidebar />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            <CurrentDateLabel />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 print:px-0 print:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
