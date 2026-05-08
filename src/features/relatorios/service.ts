import { listLivrosPorAutorView } from "./repository";

export type LivroDoRelatorio = {
  id: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: string;
  assuntos: string[];
};

export type AutorDoRelatorio = {
  id: number;
  nome: string;
  livros: LivroDoRelatorio[];
};

export type LivrosPorAutorRelatorio = {
  geradoEm: Date;
  totalAutores: number;
  totalLivros: number;
  valorTotal: number;
  autores: AutorDoRelatorio[];
};

function parseAssuntos(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((descricao) => descricao.trim())
    .filter((descricao) => descricao.length > 0);
}

export async function findLivrosPorAutorRelatorio(): Promise<LivrosPorAutorRelatorio> {
  const rows = await listLivrosPorAutorView();

  const autoresPorId = new Map<number, AutorDoRelatorio>();
  let valorTotal = 0;

  for (const row of rows) {
    const valorString = String(row.valor);
    valorTotal += Number(valorString);

    const livro: LivroDoRelatorio = {
      id: row.livro_id,
      titulo: row.livro_titulo,
      editora: row.livro_editora,
      edicao: row.livro_edicao,
      anoPublicacao: row.ano_publicacao,
      valor: valorString,
      assuntos: parseAssuntos(row.assuntos),
    };

    const existente = autoresPorId.get(row.autor_id);

    if (existente) {
      existente.livros.push(livro);
      continue;
    }

    autoresPorId.set(row.autor_id, {
      id: row.autor_id,
      nome: row.autor_nome,
      livros: [livro],
    });
  }

  const autores = Array.from(autoresPorId.values());

  return {
    geradoEm: new Date(),
    totalAutores: autores.length,
    totalLivros: rows.length,
    valorTotal,
    autores,
  };
}
