"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type ConfirmDestructiveButtonProps = Readonly<{
  label?: string;
  pendingLabel?: string;
}>;

export function ConfirmDestructiveButton({
  label = "Confirmar exclusao",
  pendingLabel = "Excluindo...",
}: ConfirmDestructiveButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      {pending ? pendingLabel : label}
    </Button>
  );
}
