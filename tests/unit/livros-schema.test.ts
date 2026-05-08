import { describe, expect, it } from "vitest";
import { livroSchema, type LivroInput } from "@/features/livros/schemas";

const validInput: LivroInput = {
  titulo: "Dom Casmurro",
  editora: "Garnier",
  edicao: 1,
  anoPublicacao: "1899",
  valor: 49.9,
  autorIds: [1],
  assuntoIds: [1],
};

function getFirstIssueMessage(input: unknown): string | undefined {
  const result = livroSchema.safeParse(input);
  if (result.success) {
    return undefined;
  }
  return result.error.issues[0]?.message;
}

describe("livroSchema", () => {
  it("aceita um livro com todos os campos preenchidos corretamente", () => {
    const result = livroSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejeita titulo vazio", () => {
    const message = getFirstIssueMessage({ ...validInput, titulo: "   " });
    expect(message).toBe("Informe o titulo do livro.");
  });

  it("rejeita titulo com mais de 40 caracteres", () => {
    const message = getFirstIssueMessage({
      ...validInput,
      titulo: "a".repeat(41),
    });
    expect(message).toBe("O titulo deve ter no maximo 40 caracteres.");
  });

  it("rejeita ano com menos de 4 digitos", () => {
    const message = getFirstIssueMessage({
      ...validInput,
      anoPublicacao: "99",
    });
    expect(message).toBe("Informe um ano com 4 digitos.");
  });

  it("rejeita ano com letras", () => {
    const message = getFirstIssueMessage({
      ...validInput,
      anoPublicacao: "abcd",
    });
    expect(message).toBe("Informe um ano com 4 digitos.");
  });

  it("rejeita valor zero", () => {
    const message = getFirstIssueMessage({ ...validInput, valor: 0 });
    expect(message).toBe("O valor deve ser maior que zero.");
  });

  it("rejeita valor negativo", () => {
    const message = getFirstIssueMessage({ ...validInput, valor: -10 });
    expect(message).toBe("O valor deve ser maior que zero.");
  });

  it("rejeita livro sem nenhum autor selecionado", () => {
    const message = getFirstIssueMessage({ ...validInput, autorIds: [] });
    expect(message).toBe("Selecione ao menos um autor.");
  });

  it("rejeita livro sem nenhum assunto selecionado", () => {
    const message = getFirstIssueMessage({ ...validInput, assuntoIds: [] });
    expect(message).toBe("Selecione ao menos um assunto.");
  });

  it("aceita ids duplicados (a deduplicacao acontece no service)", () => {
    const result = livroSchema.safeParse({
      ...validInput,
      autorIds: [1, 1, 2],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.autorIds).toEqual([1, 1, 2]);
    }
  });
});
