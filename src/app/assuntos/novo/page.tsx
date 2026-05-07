import { PageShell } from "@/components/layout/page-shell";
import { createAssuntoAction } from "@/features/assuntos/actions";
import { AssuntoForm } from "@/features/assuntos/components/assunto-form";

export default function NovoAssuntoPage() {
  return (
    <PageShell
      title="Novo assunto"
      description="Informe os dados do assunto para utiliza-lo na classificacao de livros."
    >
      <AssuntoForm
        action={createAssuntoAction}
        description="A descricao do assunto e obrigatoria e deve respeitar o limite do modelo de dados."
        title="Dados do assunto"
      />
    </PageShell>
  );
}
