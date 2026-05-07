"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDestructiveButton } from "./confirm-destructive-button";

type DeleteState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type RowActionsMenuProps = Readonly<{
  editHref: Route;
  editLabel?: string;
  deleteLabel?: string;
  deleteTitle: string;
  deleteDescription: string;
  deleteAction: (state: DeleteState) => Promise<DeleteState>;
}>;

const initialDeleteState: DeleteState = {
  status: "idle",
};

export function RowActionsMenu({
  editHref,
  editLabel = "Editar",
  deleteLabel = "Excluir",
  deleteTitle,
  deleteDescription,
  deleteAction,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteAction, initialDeleteState);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Acoes da linha"
            className="text-muted-foreground hover:text-foreground"
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Pencil className="size-4" />
              {editLabel}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setOpen} open={open}>
        <AlertDialogContent className="border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {deleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-6 text-muted-foreground">
              {deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {state.status === "error" && state.message ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <form action={formAction}>
              <ConfirmDestructiveButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
