import {
  countAssuntos,
  countAutores,
  countLivros,
  countLivrosCoautorados,
  findAnosPublicacao,
  findLivrosRecentes,
  findTopAssuntos,
  findTopAutores,
  sumLivrosValor,
} from "./repository";

export type DashboardKpis = {
  totalLivros: number;
  totalAutores: number;
  totalAssuntos: number;
  valorTotalAcervo: number;
  valorMedioLivro: number;
  livrosCoautorados: number;
};

export type TopCategoria = {
  id: number;
  label: string;
  total: number;
};

export type LivroRecente = {
  id: number;
  titulo: string;
  anoPublicacao: string;
  valor: string;
};

export type DistribuicaoDecada = {
  decada: string;
  total: number;
};

export type DashboardOverview = {
  kpis: DashboardKpis;
  topAutores: TopCategoria[];
  topAssuntos: TopCategoria[];
  livrosRecentes: LivroRecente[];
  distribuicaoPorDecada: DistribuicaoDecada[];
};

const TOP_LIMIT = 5;
const RECENTES_LIMIT = 5;

function calcularDistribuicaoPorDecada(
  anos: ReadonlyArray<{ anoPublicacao: string }>
): DistribuicaoDecada[] {
  const buckets = new Map<number, number>();

  for (const { anoPublicacao } of anos) {
    const ano = Number.parseInt(anoPublicacao, 10);
    if (!Number.isFinite(ano)) {
      continue;
    }
    const inicio = Math.floor(ano / 10) * 10;
    buckets.set(inicio, (buckets.get(inicio) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([inicio, total]) => ({
      decada: `${inicio}s`,
      total,
    }));
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [
    totalLivros,
    totalAutores,
    totalAssuntos,
    sumValor,
    topAutoresRaw,
    topAssuntosRaw,
    livrosRecentesRaw,
    anosPublicacao,
    livrosCoautorados,
  ] = await Promise.all([
    countLivros(),
    countAutores(),
    countAssuntos(),
    sumLivrosValor(),
    findTopAutores(TOP_LIMIT),
    findTopAssuntos(TOP_LIMIT),
    findLivrosRecentes(RECENTES_LIMIT),
    findAnosPublicacao(),
    countLivrosCoautorados(),
  ]);

  const valorTotalAcervo = sumValor ? Number(sumValor) : 0;
  const valorMedioLivro =
    totalLivros > 0 ? valorTotalAcervo / totalLivros : 0;

  return {
    kpis: {
      totalLivros,
      totalAutores,
      totalAssuntos,
      valorTotalAcervo,
      valorMedioLivro,
      livrosCoautorados,
    },
    topAutores: topAutoresRaw.map((autor) => ({
      id: autor.id,
      label: autor.nome,
      total: autor._count.livros,
    })),
    topAssuntos: topAssuntosRaw.map((assunto) => ({
      id: assunto.id,
      label: assunto.descricao,
      total: assunto._count.livros,
    })),
    livrosRecentes: livrosRecentesRaw.map((livro) => ({
      id: livro.id,
      titulo: livro.titulo,
      anoPublicacao: livro.anoPublicacao,
      valor: livro.valor.toString(),
    })),
    distribuicaoPorDecada: calcularDistribuicaoPorDecada(anosPublicacao),
  };
}
