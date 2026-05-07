"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { deleteAutorAction, type DeleteAutorState } from "../actions";

const initialState: DeleteAutorState = {
  status: "idle",
};

type DeleteAutorButtonProps = Readonly<{
  autorId: number;
  autorNome: string;
}>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="sm" type="submit" variant="destructive">
      <Trash2 className="size-4" />
      {pending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}

export function DeleteAutorButton({
  autorId,
  autorNome,
}: DeleteAutorButtonProps) {
  const [state, formAction] = useActionState(
    deleteAutorAction.bind(null, autorId),
    initialState
  );

  return (
    <ConfirmationDialog
      description={`Esta acao removera o autor "${autorNome}" do cadastro. Autores vinculados a livros nao poderao ser excluidos.`}
      title="Excluir autor?"
      trigger={
        <Button size="sm" type="button" variant="destructive">
          <Trash2 className="size-4" />
          Excluir
        </Button>
      }
    >
      <form action={formAction}>
        <SubmitButton />
      </form>
      {state.status === "error" && state.message ? (
        <p className="col-span-full max-w-80 text-right text-xs text-destructive">
          {state.message}
        </p>
      ) : null}
    </ConfirmationDialog>
  );
}
