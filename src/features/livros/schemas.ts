import { z } from "zod";

const idSchema = z.coerce
  .number()
  .int("Identificador invalido.")
  .positive("Identificador invalido.");

export const livroSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Informe o titulo do livro.")
    .max(40, "O titulo deve ter no maximo 40 caracteres."),
  editora: z
    .string()
    .trim()
    .min(1, "Informe a editora.")
    .max(40, "A editora deve ter no maximo 40 caracteres."),
  edicao: z.coerce
    .number()
    .int("A edicao deve ser um numero inteiro.")
    .positive("A edicao deve ser maior que zero."),
  anoPublicacao: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Informe um ano com 4 digitos."),
  valor: z.coerce
    .number()
    .positive("O valor deve ser maior que zero.")
    .max(99999999.99, "O valor informado excede o limite suportado."),
  autorIds: z
    .array(idSchema)
    .min(1, "Selecione ao menos um autor."),
  assuntoIds: z
    .array(idSchema)
    .min(1, "Selecione ao menos um assunto."),
});

export type LivroInput = z.infer<typeof livroSchema>;
