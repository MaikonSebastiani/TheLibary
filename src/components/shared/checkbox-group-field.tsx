"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type CheckboxGroupOption = {
  id: number;
  label: string;
};

type CheckboxGroupFieldProps = Readonly<{
  name: string;
  options: CheckboxGroupOption[];
  defaultValues?: number[];
  emptyMessage?: string;
  invalid?: boolean;
  className?: string;
}>;

export function CheckboxGroupField({
  name,
  options,
  defaultValues = [],
  emptyMessage = "Nenhuma opcao disponivel.",
  invalid,
  className,
}: CheckboxGroupFieldProps) {
  if (options.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  const selected = new Set(defaultValues);

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        "max-h-56 overflow-y-auto rounded-lg border border-border bg-background aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15",
        className
      )}
    >
      <ul className="divide-y divide-border/60">
        {options.map((option) => {
          const inputId = `${name}-${option.id}`;

          return (
            <li key={option.id}>
              <label
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-muted/40"
                htmlFor={inputId}
              >
                <Checkbox
                  defaultChecked={selected.has(option.id)}
                  id={inputId}
                  name={name}
                  value={String(option.id)}
                />
                <span>{option.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
