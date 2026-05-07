import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export type LivroPersistenceInput = {
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  autorIds: number[];
  assuntoIds: number[];
};

function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      throw new ConflictError(
        "Operacao bloqueada por restricao de integridade referencial."
      );
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Livro nao encontrado.");
    }
  }

  throw error;
}

export async function listLivros(search?: string) {
  const term = search?.trim();

  return prisma.livro.findMany({
    where: term
      ? {
          titulo: {
            contains: term,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      titulo: "asc",
    },
    include: {
      autores: {
        include: {
          autor: true,
        },
      },
      assuntos: {
        include: {
          assunto: true,
        },
      },
    },
  });
}

export async function getLivroById(id: number) {
  return prisma.livro.findUnique({
    where: {
      id,
    },
    include: {
      autores: {
        select: {
          autorId: true,
        },
      },
      assuntos: {
        select: {
          assuntoId: true,
        },
      },
    },
  });
}

export async function createLivro(input: LivroPersistenceInput) {
  try {
    return await prisma.livro.create({
      data: {
        titulo: input.titulo,
        editora: input.editora,
        edicao: input.edicao,
        anoPublicacao: input.anoPublicacao,
        valor: input.valor,
        autores: {
          create: input.autorIds.map((autorId) => ({ autorId })),
        },
        assuntos: {
          create: input.assuntoIds.map((assuntoId) => ({ assuntoId })),
        },
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateLivro(id: number, input: LivroPersistenceInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.livroAutor.deleteMany({ where: { livroId: id } });
      await tx.livroAssunto.deleteMany({ where: { livroId: id } });

      return tx.livro.update({
        where: { id },
        data: {
          titulo: input.titulo,
          editora: input.editora,
          edicao: input.edicao,
          anoPublicacao: input.anoPublicacao,
          valor: input.valor,
          autores: {
            create: input.autorIds.map((autorId) => ({ autorId })),
          },
          assuntos: {
            create: input.assuntoIds.map((assuntoId) => ({ assuntoId })),
          },
        },
      });
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deleteLivro(id: number) {
  try {
    return await prisma.livro.delete({
      where: { id },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}
