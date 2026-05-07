import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  countAutoresByIds,
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

export async function ensureAutoresExist(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids));

  if (uniqueIds.length === 0) {
    throw new ConflictError(
      "Selecione ao menos um autor cadastrado para vincular ao livro."
    );
  }

  const found = await countAutoresByIds(uniqueIds);

  if (found !== uniqueIds.length) {
    throw new ConflictError(
      "Um ou mais autores selecionados nao foram encontrados. Atualize a pagina e revise a selecao."
    );
  }
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
