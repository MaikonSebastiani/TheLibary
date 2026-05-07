import { ensureAssuntosExist } from "@/features/assuntos/service";
import { ensureAutoresExist } from "@/features/autores/service";
import { NotFoundError } from "@/lib/errors";
import {
  createLivro,
  deleteLivro,
  getLivroById,
  listLivros,
  updateLivro,
  type LivroPersistenceInput,
} from "./repository";
import type { LivroInput } from "./schemas";

function toPersistenceInput(input: LivroInput): LivroPersistenceInput {
  return {
    titulo: input.titulo.trim(),
    editora: input.editora.trim(),
    edicao: input.edicao,
    anoPublicacao: input.anoPublicacao.trim(),
    valor: input.valor,
    autorIds: Array.from(new Set(input.autorIds)),
    assuntoIds: Array.from(new Set(input.assuntoIds)),
  };
}

async function ensureRelationshipsExist(persistence: LivroPersistenceInput) {
  await Promise.all([
    ensureAutoresExist(persistence.autorIds),
    ensureAssuntosExist(persistence.assuntoIds),
  ]);
}

export async function findAllLivros(search?: string) {
  return listLivros(search);
}

export async function findLivroById(id: number) {
  const livro = await getLivroById(id);

  if (!livro) {
    throw new NotFoundError("Livro nao encontrado.");
  }

  return livro;
}

export async function createLivroUseCase(input: LivroInput) {
  const persistence = toPersistenceInput(input);
  await ensureRelationshipsExist(persistence);

  return createLivro(persistence);
}

export async function updateLivroUseCase(id: number, input: LivroInput) {
  await findLivroById(id);

  const persistence = toPersistenceInput(input);
  await ensureRelationshipsExist(persistence);

  return updateLivro(id, persistence);
}

export async function deleteLivroUseCase(id: number) {
  await findLivroById(id);

  return deleteLivro(id);
}
