"use client";

import { Loader2, Search } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type ListSearchProps = Readonly<{
  placeholder: string;
  paramName?: string;
  className?: string;
  debounceMs?: number;
}>;

export function ListSearch({
  placeholder,
  paramName = "q",
  className,
  debounceMs = 300,
}: ListSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(
    () => searchParams.get(paramName) ?? ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const trimmed = value.trim();
      const currentValue = params.get(paramName) ?? "";

      if (trimmed === currentValue) {
        return;
      }

      if (trimmed) {
        params.set(paramName, trimmed);
      } else {
        params.delete(paramName);
      }

      const queryString = params.toString();
      const url = (
        queryString ? `${pathname}?${queryString}` : pathname
      ) as Route;

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, debounceMs, paramName, pathname, router]);

  return (
    <div className={cn("relative w-full sm:w-72", className)}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Search className="size-4" />
        )}
      </span>
      <input
        aria-label={placeholder}
        className="h-10 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
