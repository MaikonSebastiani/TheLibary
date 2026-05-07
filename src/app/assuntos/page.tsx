import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { AssuntosTable } from "@/features/assuntos/components/assuntos-table";
import { findAllAssuntos } from "@/features/assuntos/service";

export const dynamic = "force-dynamic";

type AssuntosPageProps = Readonly<{
  searchParams: Promise<{ q?: string }>;
}>;

export default async function AssuntosPage({
  searchParams,
}: AssuntosPageProps) {
  const { q } = await searchParams;
  const assuntos = await findAllAssuntos(q);

  return (
    <PageShell
      title="Assuntos"
      description="Cadastre, consulte e mantenha os assuntos utilizados na classificacao dos livros."
    >
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/assuntos/novo">
            <PlusCircle className="size-4" />
            Novo assunto
          </Link>
        </Button>
      </div>

      <AssuntosTable assuntos={assuntos} searchTerm={q} />
    </PageShell>
  );
}
