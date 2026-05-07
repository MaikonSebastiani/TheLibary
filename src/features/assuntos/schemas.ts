import { z } from "zod";

export const assuntoSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(1, "Informe a descricao do assunto.")
    .max(20, "A descricao deve ter no maximo 20 caracteres."),
});

export type AssuntoInput = z.infer<typeof assuntoSchema>;
