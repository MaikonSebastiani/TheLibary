import { cn } from "@/lib/utils";

type InitialsAvatarProps = Readonly<{
  text: string;
  className?: string;
}>;

function getInitials(text: string) {
  const parts = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function InitialsAvatar({ text, className }: InitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-foreground",
        className
      )}
    >
      {getInitials(text)}
    </span>
  );
}
