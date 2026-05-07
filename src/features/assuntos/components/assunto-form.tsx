"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AssuntoFormState } from "../actions";

const initialState: AssuntoFormState = {
  status: "idle",
};

type AssuntoFormProps = Readonly<{
  title: string;
  description: string;
  action: (
    state: AssuntoFormState,
    formData: FormData
  ) => Promise<AssuntoFormState>;
  defaultValues?: {
    descricao?: string;
  };
}>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Salvando..." : "Salvar"}
    </Button>
  );
}

export function AssuntoForm({
  title,
  description,
  action,
  defaultValues,
}: AssuntoFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const descricaoError = state.fieldErrors?.descricao?.[0];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descricao *</Label>
            <Input
              aria-invalid={Boolean(descricaoError)}
              defaultValue={defaultValues?.descricao}
              id="descricao"
              maxLength={20}
              name="descricao"
              placeholder="Ex.: Romance"
            />
            {descricaoError ? (
              <p className="text-sm text-destructive">{descricaoError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Maximo de 20 caracteres.
              </p>
            )}
          </div>

          {state.message ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button asChild type="button" variant="outline">
            <Link href="/assuntos">Cancelar</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
