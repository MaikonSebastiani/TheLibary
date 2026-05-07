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
import type { AutorFormState } from "../actions";

const initialState: AutorFormState = {
  status: "idle",
};

type AutorFormProps = Readonly<{
  title: string;
  description: string;
  action: (
    state: AutorFormState,
    formData: FormData
  ) => Promise<AutorFormState>;
  defaultValues?: {
    nome?: string;
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

export function AutorForm({
  title,
  description,
  action,
  defaultValues,
}: AutorFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const nomeError = state.fieldErrors?.nome?.[0];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              aria-invalid={Boolean(nomeError)}
              defaultValue={defaultValues?.nome}
              id="nome"
              maxLength={40}
              name="nome"
              placeholder="Ex.: Machado de Assis"
            />
            {nomeError ? (
              <p className="text-sm text-destructive">{nomeError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Maximo de 40 caracteres.
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
            <Link href="/autores">Cancelar</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
