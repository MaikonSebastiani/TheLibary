import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  LivrosTable,
  type LivroTableItem,
} from "@/features/livros/components/livros-table";
import { findAllLivros } from "@/features/livros/service";

export const dynamic = "force-dynamic";

type LivrosPageProps = Readonly<{
  searchParams: Promise<{ q?: string }>;
}>;

export default async function LivrosPage({ searchParams }: LivrosPageProps) {
  const { q } = await searchParams;
  const livros = await findAllLivros(q);

  const items: LivroTableItem[] = livros.map((livro) => ({
    id: livro.id,
    titulo: livro.titulo,
    editora: livro.editora,
    edicao: livro.edicao,
    anoPublicacao: livro.anoPublicacao,
    valor: livro.valor.toString(),
    autores: livro.autores.map(({ autor }) => ({
      autor: { id: autor.id, nome: autor.nome },
    })),
    assuntos: livro.assuntos.map(({ assunto }) => ({
      assunto: { id: assunto.id, descricao: assunto.descricao },
    })),
  }));

  return (
    <PageShell
      title="Livros"
      description="Catalogo de livros com autores, assuntos e valor em reais."
    >
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/livros/novo">
            <PlusCircle className="size-4" />
            Novo livro
          </Link>
        </Button>
      </div>

      <LivrosTable livros={items} searchTerm={q} />
    </PageShell>
  );
}
