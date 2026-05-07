import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { updateAssuntoAction } from "@/features/assuntos/actions";
import { AssuntoForm } from "@/features/assuntos/components/assunto-form";
import { findAssuntoById } from "@/features/assuntos/service";
import { NotFoundError } from "@/lib/errors";

export const dynamic = "force-dynamic";

type EditarAssuntoPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function EditarAssuntoPage({
  params,
}: EditarAssuntoPageProps) {
  const { id } = await params;
  const assuntoId = Number(id);

  if (!Number.isInteger(assuntoId)) {
    notFound();
  }

  const assunto = await findEditableAssunto(assuntoId);

  return (
    <PageShell
      title="Editar assunto"
      description="Atualize os dados cadastrais do assunto selecionado."
    >
      <AssuntoForm
        action={updateAssuntoAction.bind(null, assunto.id)}
        defaultValues={{
          descricao: assunto.descricao,
        }}
        description="As alteracoes serao refletidas nos livros vinculados a este assunto."
        title="Dados do assunto"
      />
    </PageShell>
  );
}

async function findEditableAssunto(id: number) {
  try {
    return await findAssuntoById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
