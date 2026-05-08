import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { LivroRecente } from "../service";

type LivrosRecentesCardProps = Readonly<{
  livros: LivroRecente[];
}>;

export function LivrosRecentesCard({ livros }: LivrosRecentesCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Acervo recente</CardTitle>
            <CardDescription>Ultimos livros cadastrados.</CardDescription>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            href={"/livros" as Route}
          >
            Ver todos
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {livros.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum livro cadastrado ainda.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {livros.map((livro) => (
              <li key={livro.id}>
                <Link
                  className="flex items-center justify-between gap-4 py-3 text-sm transition hover:text-primary"
                  href={`/livros/${livro.id}/editar` as Route}
                >
                  <span className="flex flex-1 items-baseline gap-3 truncate">
                    <span className="truncate font-medium text-foreground">
                      {livro.titulo}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {livro.anoPublicacao}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">
                    {formatCurrency(livro.valor)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
