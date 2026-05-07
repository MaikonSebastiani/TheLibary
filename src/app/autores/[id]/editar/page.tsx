import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { updateAutorAction } from "@/features/autores/actions";
import { AutorForm } from "@/features/autores/components/autor-form";
import { findAutorById } from "@/features/autores/service";
import { NotFoundError } from "@/lib/errors";

export const dynamic = "force-dynamic";

type EditarAutorPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function EditarAutorPage({
  params,
}: EditarAutorPageProps) {
  const { id } = await params;
  const autorId = Number(id);

  if (!Number.isInteger(autorId)) {
    notFound();
  }

  const autor = await findEditableAutor(autorId);

  return (
    <PageShell
      title="Editar autor"
      description="Atualize os dados cadastrais do autor selecionado."
    >
      <AutorForm
        action={updateAutorAction.bind(null, autor.id)}
        defaultValues={{
          nome: autor.nome,
        }}
        description="As alteracoes serao refletidas nos livros vinculados a este autor."
        title="Dados do autor"
      />
    </PageShell>
  );
}

async function findEditableAutor(id: number) {
  try {
    return await findAutorById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
