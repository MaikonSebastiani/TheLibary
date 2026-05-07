"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApplicationError } from "@/lib/errors";
import { livroSchema } from "./schemas";
import {
  createLivroUseCase,
  deleteLivroUseCase,
  updateLivroUseCase,
} from "./service";

export type LivroFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    titulo?: string[];
    editora?: string[];
    edicao?: string[];
    anoPublicacao?: string[];
    valor?: string[];
    autorIds?: string[];
    assuntoIds?: string[];
  };
};

export type DeleteLivroState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function parseLivroFormData(formData: FormData) {
  return livroSchema.safeParse({
    titulo: formData.get("titulo"),
    editora: formData.get("editora"),
    edicao: formData.get("edicao"),
    anoPublicacao: formData.get("anoPublicacao"),
    valor: formData.get("valor"),
    autorIds: formData.getAll("autorIds"),
    assuntoIds: formData.getAll("assuntoIds"),
  });
}

function resolveActionError(error: unknown) {
  if (error instanceof ApplicationError) {
    return error.message;
  }

  return "Nao foi possivel concluir a operacao. Tente novamente.";
}

export async function createLivroAction(
  _previousState: LivroFormState,
  formData: FormData
): Promise<LivroFormState> {
  const parsed = parseLivroFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await createLivroUseCase(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/livros");
  redirect("/livros");
}

export async function updateLivroAction(
  id: number,
  _previousState: LivroFormState,
  formData: FormData
): Promise<LivroFormState> {
  const parsed = parseLivroFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await updateLivroUseCase(id, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/livros");
  redirect("/livros");
}

export async function deleteLivroAction(
  id: number,
  previousState: DeleteLivroState
): Promise<DeleteLivroState> {
  void previousState;

  try {
    await deleteLivroUseCase(id);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/livros");

  return {
    status: "success",
    message: "Livro excluido com sucesso.",
  };
}
