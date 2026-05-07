import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { AutoresTable } from "@/features/autores/components/autores-table";
import { findAllAutores } from "@/features/autores/service";

export const dynamic = "force-dynamic";

export default async function AutoresPage() {
  const autores = await findAllAutores();

  return (
    <PageShell
      title="Autores"
      description="Cadastre, consulte e mantenha os autores utilizados no cadastro de livros."
    >
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/autores/novo">
            <PlusCircle className="size-4" />
            Novo autor
          </Link>
        </Button>
      </div>

      <AutoresTable autores={autores} />
    </PageShell>
  );
}
