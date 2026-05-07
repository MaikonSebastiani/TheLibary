"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApplicationError } from "@/lib/errors";
import { assuntoSchema } from "./schemas";
import {
  createAssuntoUseCase,
  deleteAssuntoUseCase,
  updateAssuntoUseCase,
} from "./service";

export type AssuntoFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    descricao?: string[];
  };
};

export type DeleteAssuntoState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function parseAssuntoFormData(formData: FormData) {
  return assuntoSchema.safeParse({
    descricao: formData.get("descricao"),
  });
}

function resolveActionError(error: unknown) {
  if (error instanceof ApplicationError) {
    return error.message;
  }

  return "Nao foi possivel concluir a operacao. Tente novamente.";
}

export async function createAssuntoAction(
  _previousState: AssuntoFormState,
  formData: FormData
): Promise<AssuntoFormState> {
  const parsed = parseAssuntoFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await createAssuntoUseCase(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/assuntos");
  redirect("/assuntos");
}

export async function updateAssuntoAction(
  id: number,
  _previousState: AssuntoFormState,
  formData: FormData
): Promise<AssuntoFormState> {
  const parsed = parseAssuntoFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos informados.",
    };
  }

  try {
    await updateAssuntoUseCase(id, parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/assuntos");
  redirect("/assuntos");
}

export async function deleteAssuntoAction(
  id: number,
  previousState: DeleteAssuntoState
): Promise<DeleteAssuntoState> {
  void previousState;

  try {
    await deleteAssuntoUseCase(id);
  } catch (error) {
    return {
      status: "error",
      message: resolveActionError(error),
    };
  }

  revalidatePath("/assuntos");

  return {
    status: "success",
    message: "Assunto excluido com sucesso.",
  };
}
