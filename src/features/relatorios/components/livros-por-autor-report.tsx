import { BookOpen, CalendarClock, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import type { LivrosPorAutorRelatorio } from "../service";
import { PrintReportButton } from "./print-report-button";

type LivrosPorAutorReportProps = Readonly<{
  data: LivrosPorAutorRelatorio;
}>;

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function LivrosPorAutorReport({ data }: LivrosPorAutorReportProps) {
  const { autores, geradoEm, totalAutores, totalLivros, valorTotal } = data;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Resumo do relatorio</CardTitle>
            <CardDescription>
              Dados consultados diretamente da view{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                vw_livros_por_autor
              </code>{" "}
              no banco de dados.
            </CardDescription>
          </div>
          <PrintReportButton />
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStat
            icon={<Users className="size-4" />}
            label="Autores"
            value={totalAutores.toString()}
          />
          <SummaryStat
            icon={<BookOpen className="size-4" />}
            label="Livros vinculados"
            value={totalLivros.toString()}
          />
          <SummaryStat
            icon={<Wallet className="size-4" />}
            label="Valor total catalogado"
            value={formatCurrency(valorTotal)}
          />
          <SummaryStat
            icon={<CalendarClock className="size-4" />}
            label="Gerado em"
            value={dateTimeFormatter.format(geradoEm)}
          />
        </CardContent>
      </Card>

      {autores.length === 0 ? (
        <Card className="border-dashed border-border bg-card shadow-none">
          <CardContent className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              Nenhum livro vinculado a autores ate o momento.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre livros e vincule-os a autores para gerar o relatorio.
            </p>
          </CardContent>
        </Card>
      ) : (
        autores.map((autor) => {
          const subtotalAutor = autor.livros.reduce(
            (acc, livro) => acc + Number(livro.valor),
            0
          );

          return (
            <Card
              className="break-inside-avoid border-border bg-card shadow-sm"
              key={autor.id}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{autor.nome}</CardTitle>
                  <CardDescription>
                    {autor.livros.length}{" "}
                    {autor.livros.length === 1 ? "livro" : "livros"} vinculados
                    {" - "}
                    Subtotal {formatCurrency(subtotalAutor)}
                  </CardDescription>
                </div>
                <Badge className="shrink-0" variant="outline">
                  #{autor.id}
                </Badge>
              </CardHeader>

              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Codigo
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Titulo
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Editora
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Edicao
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Ano
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Valor
                      </TableHead>
                      <TableHead className="px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Assuntos
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autor.livros.map((livro) => (
                      <TableRow
                        className="border-border/60 hover:bg-muted/30"
                        key={livro.id}
                      >
                        <TableCell className="px-6 py-3 text-muted-foreground">
                          #{livro.id}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {livro.titulo}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {livro.editora}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {livro.edicao}
                          {"a"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {livro.anoPublicacao}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {formatCurrency(livro.valor)}
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          {livro.assuntos.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          ) : (
                            <div className="flex max-w-[260px] flex-wrap gap-1.5">
                              {livro.assuntos.map((descricao) => (
                                <Badge key={descricao} variant="secondary">
                                  {descricao}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

type SummaryStatProps = Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>;

function SummaryStat({ icon, label, value }: SummaryStatProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}
