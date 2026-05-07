import { z } from "zod";

export const autorSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome do autor.")
    .max(40, "O nome deve ter no maximo 40 caracteres."),
});

export type AutorInput = z.infer<typeof autorSchema>;
