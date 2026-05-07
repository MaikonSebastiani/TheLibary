import { NotFoundError } from "@/lib/errors";
import {
  createAutor,
  deleteAutor,
  getAutorById,
  listAutores,
  updateAutor,
} from "./repository";
import type { AutorInput } from "./schemas";

export async function findAllAutores(search?: string) {
  return listAutores(search);
}

export async function findAutorById(id: number) {
  const autor = await getAutorById(id);

  if (!autor) {
    throw new NotFoundError("Autor nao encontrado.");
  }

  return autor;
}

export async function createAutorUseCase(input: AutorInput) {
  return createAutor({
    nome: input.nome.trim(),
  });
}

export async function updateAutorUseCase(id: number, input: AutorInput) {
  await findAutorById(id);

  return updateAutor(id, {
    nome: input.nome.trim(),
  });
}

export async function deleteAutorUseCase(id: number) {
  await findAutorById(id);

  return deleteAutor(id);
}
