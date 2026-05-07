import { PageShell } from "@/components/layout/page-shell";
import { findAllAssuntos } from "@/features/assuntos/service";
import { findAllAutores } from "@/features/autores/service";
import { createLivroAction } from "@/features/livros/actions";
import { LivroForm } from "@/features/livros/components/livro-form";

export const dynamic = "force-dynamic";

export default async function NovoLivroPage() {
  const [autores, assuntos] = await Promise.all([
    findAllAutores(),
    findAllAssuntos(),
  ]);

  return (
    <PageShell
      title="Novo livro"
      description="Cadastre um novo livro vinculando autores e assuntos."
    >
      <LivroForm
        action={createLivroAction}
        assuntoOptions={assuntos.map((assunto) => ({
          id: assunto.id,
          label: assunto.descricao,
        }))}
        autorOptions={autores.map((autor) => ({
          id: autor.id,
          label: autor.nome,
        }))}
        description="Preencha os dados do livro e selecione ao menos um autor e um assunto."
        title="Dados do livro"
      />
    </PageShell>
  );
}
