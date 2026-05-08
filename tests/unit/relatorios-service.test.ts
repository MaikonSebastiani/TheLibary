import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LivroPorAutorRow } from "@/features/relatorios/repository";
import * as repository from "@/features/relatorios/repository";
import { findLivrosPorAutorRelatorio } from "@/features/relatorios/service";

vi.mock("@/features/relatorios/repository", () => ({
  listLivrosPorAutorView: vi.fn(),
}));

const mockedListView = vi.mocked(repository.listLivrosPorAutorView);

function buildRow(overrides: Partial<LivroPorAutorRow>): LivroPorAutorRow {
  return {
    autor_id: 1,
    autor_nome: "Machado de Assis",
    livro_id: 100,
    livro_titulo: "Dom Casmurro",
    livro_editora: "Garnier",
    livro_edicao: 1,
    ano_publicacao: "1899",
    valor: "49.90",
    assuntos: "Romance",
    ...overrides,
  };
}

describe("findLivrosPorAutorRelatorio", () => {
  beforeEach(() => {
    mockedListView.mockReset();
  });

  it("retorna totais zerados quando a view nao tem linhas", async () => {
    mockedListView.mockResolvedValue([]);

    const relatorio = await findLivrosPorAutorRelatorio();

    expect(relatorio.totalAutores).toBe(0);
    expect(relatorio.totalLivros).toBe(0);
    expect(relatorio.valorTotal).toBe(0);
    expect(relatorio.autores).toEqual([]);
  });

  it("agrupa varios livros sob o mesmo autor", async () => {
    mockedListView.mockResolvedValue([
      buildRow({ livro_id: 100, livro_titulo: "Dom Casmurro", valor: "49.90" }),
      buildRow({ livro_id: 200, livro_titulo: "Memorias Postumas", valor: "59.90" }),
    ]);

    const relatorio = await findLivrosPorAutorRelatorio();

    expect(relatorio.totalAutores).toBe(1);
    expect(relatorio.totalLivros).toBe(2);
    expect(relatorio.valorTotal).toBeCloseTo(109.8, 2);
    expect(relatorio.autores).toHaveLength(1);
    expect(relatorio.autores[0].livros).toHaveLength(2);
  });

  it("nao duplica totalLivros nem valorTotal quando o mesmo livro aparece para mais de um autor", async () => {
    const livroCompartilhado = {
      livro_id: 500,
      livro_titulo: "Livro a quatro maos",
      valor: "100.00",
    };

    mockedListView.mockResolvedValue([
      buildRow({
        autor_id: 1,
        autor_nome: "Machado de Assis",
        ...livroCompartilhado,
      }),
      buildRow({
        autor_id: 2,
        autor_nome: "Clarice Lispector",
        ...livroCompartilhado,
      }),
    ]);

    const relatorio = await findLivrosPorAutorRelatorio();

    expect(relatorio.totalAutores).toBe(2);
    expect(relatorio.totalLivros).toBe(1);
    expect(relatorio.valorTotal).toBeCloseTo(100, 2);

    const titulosDoAutor1 = relatorio.autores[0].livros.map((l) => l.titulo);
    const titulosDoAutor2 = relatorio.autores[1].livros.map((l) => l.titulo);
    expect(titulosDoAutor1).toContain("Livro a quatro maos");
    expect(titulosDoAutor2).toContain("Livro a quatro maos");
  });

  it("transforma a string concatenada de assuntos em array", async () => {
    mockedListView.mockResolvedValue([
      buildRow({ assuntos: "Romance, Ficcao, Politica" }),
    ]);

    const relatorio = await findLivrosPorAutorRelatorio();

    expect(relatorio.autores[0].livros[0].assuntos).toEqual([
      "Romance",
      "Ficcao",
      "Politica",
    ]);
  });

  it("trata coluna assuntos nula como array vazio", async () => {
    mockedListView.mockResolvedValue([buildRow({ assuntos: null })]);

    const relatorio = await findLivrosPorAutorRelatorio();

    expect(relatorio.autores[0].livros[0].assuntos).toEqual([]);
  });
});
