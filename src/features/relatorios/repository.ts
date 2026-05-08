import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type LivroPorAutorRow = {
  autor_id: number;
  autor_nome: string;
  livro_id: number;
  livro_titulo: string;
  livro_editora: string;
  livro_edicao: number;
  ano_publicacao: string;
  valor: Prisma.Decimal | string | number;
  assuntos: string | null;
};

export async function listLivrosPorAutorView(): Promise<LivroPorAutorRow[]> {
  return prisma.$queryRaw<LivroPorAutorRow[]>`
    SELECT
      "autor_id",
      "autor_nome",
      "livro_id",
      "livro_titulo",
      "livro_editora",
      "livro_edicao",
      "ano_publicacao",
      "valor",
      "assuntos"
    FROM "vw_livros_por_autor"
    ORDER BY "autor_nome" ASC, "livro_titulo" ASC
  `;
}
