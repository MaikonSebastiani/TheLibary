import { BarChart3, BookPlus, Tags } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type Acao = Readonly<{
  href: Route;
  label: string;
  description: string;
  icon: LucideIcon;
}>;

const acoes: ReadonlyArray<Acao> = [
  {
    href: "/livros/novo" as Route,
    label: "Cadastrar livro",
    description: "Adicione um novo titulo ao acervo.",
    icon: BookPlus,
  },
  {
    href: "/relatorios/livros-por-autor" as Route,
    label: "Ver relatorio",
    description: "Livros por autor com totais.",
    icon: BarChart3,
  },
  {
    href: "/assuntos" as Route,
    label: "Gerenciar assuntos",
    description: "Mantenha o catalogo de categorias.",
    icon: Tags,
  },
];

export function AcoesRapidas() {
  return (
    <div className="flex h-full flex-col gap-3">
      {acoes.map((acao) => {
        const Icon = acao.icon;

        return (
          <Link
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow-md"
            href={acao.href}
            key={acao.href}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground transition group-hover:text-primary">
                {acao.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {acao.description}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
