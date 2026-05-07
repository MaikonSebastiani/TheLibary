"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApplicationError } from "@/lib/errors";
import {
  createAutorUseCase,
  deleteAutorUseCase,
  updateAutorUseCase,
} from "./service";
import { autorSchema } from "./schemas";

export type AutorFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    nome?: string[];
  };
};

export type DeleteAutorState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function parseAutorFormData(formData: FormData) {
  return autorSchema.safeParse({
    nome: formData.get("nome"),
  });
}

function resolveActionError(error: unknown) {
  if (error instanceof ApplicationError) {
    return error.message;
  }

  return "Nao foi possivel concluir a operacao. Tente novamente.";
}

export async function createAutorAction(
  _previousState: AutorFormState,
  formData: FormData
): Promise<AutorFormState> {
  const parsed = parseAutorFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await createAutorUseCase(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/autores");
  redirect("/autores");
}

export async function updateAutorAction(
  id: number,
  _previousState: AutorFormState,
  formData: FormData
): Promise<AutorFormState> {
  const parsed = parseAutorFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await updateAutorUseCase(id, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/autores");
  redirect("/autores");
}

export async function deleteAutorAction(
  id: number,
  previousState: DeleteAutorState
): Promise<DeleteAutorState> {
  void previousState;

  try {
    await deleteAutorUseCase(id);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/autores");

  return {
    status: "success",
    message: "Autor excluido com sucesso.",
  };
}
