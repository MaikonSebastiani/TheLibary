"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckboxGroupField,
  type CheckboxGroupOption,
} from "@/components/shared/checkbox-group-field";
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
import type { LivroFormState } from "../actions";

const initialState: LivroFormState = {
  status: "idle",
};

type LivroFormProps = Readonly<{
  title: string;
  description: string;
  action: (
    state: LivroFormState,
    formData: FormData
  ) => Promise<LivroFormState>;
  autorOptions: CheckboxGroupOption[];
  assuntoOptions: CheckboxGroupOption[];
  defaultValues?: {
    titulo?: string;
    editora?: string;
    edicao?: number;
    anoPublicacao?: string;
    valor?: string;
    autorIds?: number[];
    assuntoIds?: number[];
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

function FieldHint({
  error,
  hint,
}: {
  error?: string;
  hint: string;
}) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return <p className="text-xs text-muted-foreground">{hint}</p>;
}

export function LivroForm({
  title,
  description,
  action,
  autorOptions,
  assuntoOptions,
  defaultValues,
}: LivroFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.fieldErrors;

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="titulo">Titulo *</Label>
              <Input
                aria-invalid={Boolean(errors?.titulo?.[0])}
                defaultValue={defaultValues?.titulo}
                id="titulo"
                maxLength={40}
                name="titulo"
                placeholder="Ex.: Dom Casmurro"
              />
              <FieldHint
                error={errors?.titulo?.[0]}
                hint="Maximo de 40 caracteres."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editora">Editora *</Label>
              <Input
                aria-invalid={Boolean(errors?.editora?.[0])}
                defaultValue={defaultValues?.editora}
                id="editora"
                maxLength={40}
                name="editora"
                placeholder="Ex.: Companhia das Letras"
              />
              <FieldHint
                error={errors?.editora?.[0]}
                hint="Maximo de 40 caracteres."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edicao">Edicao *</Label>
              <Input
                aria-invalid={Boolean(errors?.edicao?.[0])}
                defaultValue={defaultValues?.edicao}
                id="edicao"
                inputMode="numeric"
                min={1}
                name="edicao"
                placeholder="1"
                step={1}
                type="number"
              />
              <FieldHint
                error={errors?.edicao?.[0]}
                hint="Numero inteiro positivo."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anoPublicacao">Ano de publicacao *</Label>
              <Input
                aria-invalid={Boolean(errors?.anoPublicacao?.[0])}
                defaultValue={defaultValues?.anoPublicacao}
                id="anoPublicacao"
                inputMode="numeric"
                maxLength={4}
                name="anoPublicacao"
                placeholder="2024"
              />
              <FieldHint
                error={errors?.anoPublicacao?.[0]}
                hint="Quatro digitos."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                aria-invalid={Boolean(errors?.valor?.[0])}
                defaultValue={defaultValues?.valor}
                id="valor"
                inputMode="decimal"
                min={0}
                name="valor"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
              <FieldHint
                error={errors?.valor?.[0]}
                hint="Use ponto como separador decimal."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Autores *</Label>
            <CheckboxGroupField
              defaultValues={defaultValues?.autorIds}
              emptyMessage="Cadastre um autor antes de vincula-lo a um livro."
              invalid={Boolean(errors?.autorIds?.[0])}
              name="autorIds"
              options={autorOptions}
            />
            <FieldHint
              error={errors?.autorIds?.[0]}
              hint="Selecione ao menos um autor responsavel pela obra."
            />
          </div>

          <div className="space-y-2">
            <Label>Assuntos *</Label>
            <CheckboxGroupField
              defaultValues={defaultValues?.assuntoIds}
              emptyMessage="Cadastre um assunto antes de classificar livros."
              invalid={Boolean(errors?.assuntoIds?.[0])}
              name="assuntoIds"
              options={assuntoOptions}
            />
            <FieldHint
              error={errors?.assuntoIds?.[0]}
              hint="Selecione ao menos um assunto que classifique a obra."
            />
          </div>

          {state.message ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button asChild type="button" variant="outline">
            <Link href="/livros">Cancelar</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
