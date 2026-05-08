import { PageShell } from "@/components/layout/page-shell";
import { LivrosPorAutorReport } from "@/features/relatorios/components/livros-por-autor-report";
import { findLivrosPorAutorRelatorio } from "@/features/relatorios/service";

export const dynamic = "force-dynamic";

export default async function LivrosPorAutorReportPage() {
  const data = await findLivrosPorAutorRelatorio();

  return (
    <PageShell
      title="Relatorio de livros por autor"
      description="Visao consolidada com os livros de cada autor, incluindo editora, edicao, ano, valor e assuntos vinculados. Os dados sao consumidos da view vw_livros_por_autor diretamente do banco."
    >
      <LivrosPorAutorReport data={data} />
    </PageShell>
  );
}
