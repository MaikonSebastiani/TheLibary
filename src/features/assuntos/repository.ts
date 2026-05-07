import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { AssuntoInput } from "./schemas";

function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      throw new ConflictError(
        "Nao foi possivel excluir o assunto porque ele esta vinculado a um ou mais livros."
      );
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Assunto nao encontrado.");
    }
  }

  throw error;
}

export async function countAssuntosByIds(ids: number[]) {
  if (ids.length === 0) {
    return 0;
  }

  return prisma.assunto.count({
    where: {
      id: { in: ids },
    },
  });
}

export async function listAssuntos(search?: string) {
  const term = search?.trim();

  return prisma.assunto.findMany({
    where: term
      ? {
          descricao: {
            contains: term,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      descricao: "asc",
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

export async function getAssuntoById(id: number) {
  return prisma.assunto.findUnique({
    where: {
      id,
    },
  });
}

export async function createAssunto(data: AssuntoInput) {
  try {
    return await prisma.assunto.create({
      data,
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateAssunto(id: number, data: AssuntoInput) {
  try {
    return await prisma.assunto.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteAssunto(id: number) {
  try {
    return await prisma.assunto.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}
