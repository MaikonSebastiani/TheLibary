import { PageShell } from "@/components/layout/page-shell";
import { createAutorAction } from "@/features/autores/actions";
import { AutorForm } from "@/features/autores/components/autor-form";

export default function NovoAutorPage() {
  return (
    <PageShell
      title="Novo autor"
      description="Informe os dados do autor para utiliza-lo no cadastro de livros."
    >
      <AutorForm
        action={createAutorAction}
        description="O nome do autor e obrigatorio e deve respeitar o limite do modelo de dados."
        title="Dados do autor"
      />
    </PageShell>
  );
}
