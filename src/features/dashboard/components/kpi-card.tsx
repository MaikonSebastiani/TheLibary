import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type KpiCardProps = Readonly<{
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}>;

export function KpiCard({ label, value, hint, icon: Icon }: KpiCardProps) {
  return (
    <Card className="gap-3 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
