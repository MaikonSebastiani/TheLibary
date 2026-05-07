import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { AutorInput } from "./schemas";

function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      throw new ConflictError(
        "Nao foi possivel excluir o autor porque ele esta vinculado a um ou mais livros."
      );
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Autor nao encontrado.");
    }
  }

  throw error;
}

export async function listAutores() {
  return prisma.autor.findMany({
    orderBy: {
      nome: "asc",
    },
    include: {
      _count: {
        select: {
          livros: true,
        },
      },
    },
  });
}

export async function getAutorById(id: number) {
  return prisma.autor.findUnique({
    where: {
      id,
    },
  });
}

export async function createAutor(data: AutorInput) {
  try {
    return await prisma.autor.create({
      data,
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateAutor(id: number, data: AutorInput) {
  try {
    return await prisma.autor.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteAutor(id: number) {
  try {
    return await prisma.autor.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}
