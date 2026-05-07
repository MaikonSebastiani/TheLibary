import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { findAllAssuntos } from "@/features/assuntos/service";
import { findAllAutores } from "@/features/autores/service";
import { updateLivroAction } from "@/features/livros/actions";
import { LivroForm } from "@/features/livros/components/livro-form";
import { findLivroById } from "@/features/livros/service";
import { NotFoundError } from "@/lib/errors";

export const dynamic = "force-dynamic";

type EditarLivroPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

async function findEditableLivro(id: number) {
  try {
    return await findLivroById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}

export default async function EditarLivroPage({
  params,
}: EditarLivroPageProps) {
  const { id } = await params;
  const livroId = Number(id);

  if (!Number.isInteger(livroId)) {
    notFound();
  }

  const [livro, autores, assuntos] = await Promise.all([
    findEditableLivro(livroId),
    findAllAutores(),
    findAllAssuntos(),
  ]);

  return (
    <PageShell
      title="Editar livro"
      description="Atualize os dados do livro e seus vinculos."
    >
      <LivroForm
        action={updateLivroAction.bind(null, livro.id)}
        assuntoOptions={assuntos.map((assunto) => ({
          id: assunto.id,
          label: assunto.descricao,
        }))}
        autorOptions={autores.map((autor) => ({
          id: autor.id,
          label: autor.nome,
        }))}
        defaultValues={{
          titulo: livro.titulo,
          editora: livro.editora,
          edicao: livro.edicao,
          anoPublicacao: livro.anoPublicacao,
          valor: livro.valor.toString(),
          autorIds: livro.autores.map((vinculo) => vinculo.autorId),
          assuntoIds: livro.assuntos.map((vinculo) => vinculo.assuntoId),
        }}
        description="As alteracoes serao aplicadas imediatamente apos salvar."
        title="Dados do livro"
      />
    </PageShell>
  );
}
