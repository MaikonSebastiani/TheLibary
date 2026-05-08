import { prisma } from "@/lib/prisma";

export async function countLivros() {
  return prisma.livro.count();
}

export async function countAutores() {
  return prisma.autor.count();
}

export async function countAssuntos() {
  return prisma.assunto.count();
}

export async function sumLivrosValor() {
  const result = await prisma.livro.aggregate({
    _sum: {
      valor: true,
    },
  });

  return result._sum.valor;
}

export async function findTopAutores(limit: number) {
  return prisma.autor.findMany({
    take: limit,
    orderBy: [
      {
        livros: {
          _count: "desc",
        },
      },
      { nome: "asc" },
    ],
    select: {
      id: true,
      nome: true,
      _count: {
        select: { livros: true },
      },
    },
  });
}

export async function findTopAssuntos(limit: number) {
  return prisma.assunto.findMany({
    take: limit,
    orderBy: [
      {
        livros: {
          _count: "desc",
        },
      },
      { descricao: "asc" },
    ],
    select: {
      id: true,
      descricao: true,
      _count: {
        select: { livros: true },
      },
    },
  });
}

export async function findLivrosRecentes(limit: number) {
  return prisma.livro.findMany({
    take: limit,
    orderBy: { id: "desc" },
    select: {
      id: true,
      titulo: true,
      anoPublicacao: true,
      valor: true,
    },
  });
}

export async function findAnosPublicacao() {
  return prisma.livro.findMany({
    select: { anoPublicacao: true },
  });
}

export async function countLivrosCoautorados() {
  const livros = await prisma.livro.findMany({
    select: {
      _count: { select: { autores: true } },
    },
  });

  return livros.filter((livro) => livro._count.autores > 1).length;
}
