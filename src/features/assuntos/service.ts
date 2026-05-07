import { NotFoundError } from "@/lib/errors";
import {
  createAssunto,
  deleteAssunto,
  getAssuntoById,
  listAssuntos,
  updateAssunto,
} from "./repository";
import type { AssuntoInput } from "./schemas";

export async function findAllAssuntos(search?: string) {
  return listAssuntos(search);
}

export async function findAssuntoById(id: number) {
  const assunto = await getAssuntoById(id);

  if (!assunto) {
    throw new NotFoundError("Assunto nao encontrado.");
  }

  return assunto;
}

export async function createAssuntoUseCase(input: AssuntoInput) {
  return createAssunto({
    descricao: input.descricao.trim(),
  });
}

export async function updateAssuntoUseCase(id: number, input: AssuntoInput) {
  await findAssuntoById(id);

  return updateAssunto(id, {
    descricao: input.descricao.trim(),
  });
}

export async function deleteAssuntoUseCase(id: number) {
  await findAssuntoById(id);

  return deleteAssunto(id);
}
