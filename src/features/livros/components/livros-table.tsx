import type { Route } from "next";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { ListSearch } from "@/components/shared/list-search";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
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
import { deleteLivroAction } from "../actions";

export type LivroTableItem = {
  id: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: string;
  autores: ReadonlyArray<{ autor: { id: number; nome: string } }>;
  assuntos: ReadonlyArray<{ assunto: { id: number; descricao: string } }>;
};

type LivrosTableProps = Readonly<{
  livros: LivroTableItem[];
  searchTerm?: string;
}>;

export function LivrosTable({ livros, searchTerm }: LivrosTableProps) {
  const isSearching = Boolean(searchTerm && searchTerm.length > 0);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <CardTitle>Lista de livros</CardTitle>
        <ListSearch placeholder="Buscar livros..." />
      </CardHeader>

      <CardContent className="px-0">
        {livros.length === 0 ? (
          <div className="mx-4 rounded-xl border border-dashed border-border px-4 py-10 text-center sm:mx-6 sm:px-6">
            <p className="text-sm font-medium text-foreground">
              {isSearching
                ? "Nenhum livro encontrado para esta busca."
                : "Nenhum livro cadastrado."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSearching
                ? "Ajuste o termo informado ou limpe o campo de busca."
                : "Cadastre o primeiro livro para iniciar o catalogo."}
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-3 px-4 sm:px-6 lg:hidden">
              {livros.map((livro) => {
                const editHref = `/livros/${livro.id}/editar` as Route;

                return (
                  <li
                    className="rounded-xl border border-border/60 bg-background p-4 shadow-xs"
                    key={livro.id}
                  >
                    <div className="flex items-start gap-3">
                      <InitialsAvatar text={livro.titulo} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {livro.titulo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {livro.editora} - {livro.edicao}
                          {"a"} edicao
                        </p>
                      </div>
                      <RowActionsMenu
                        deleteAction={deleteLivroAction.bind(null, livro.id)}
                        deleteDescription={`Esta acao removera o livro "${livro.titulo}" do catalogo. Os vinculos com autores e assuntos tambem serao removidos.`}
                        deleteTitle="Excluir livro?"
                        editHref={editHref}
                      />
                    </div>

                    {livro.autores.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {livro.autores.map(({ autor }) => (
                          <Badge key={autor.id} variant="outline">
                            {autor.nome}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {livro.assuntos.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {livro.assuntos.map(({ assunto }) => (
                          <Badge key={assunto.id} variant="secondary">
                            {assunto.descricao}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                      <span className="text-xs text-muted-foreground">
                        Ano {livro.anoPublicacao}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(livro.valor)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Livro
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Autores
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Assuntos
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ano
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Valor
                    </TableHead>
                    <TableHead className="px-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Acoes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livros.map((livro) => {
                    const editHref = `/livros/${livro.id}/editar` as Route;

                    return (
                      <TableRow
                        className="border-border/60 hover:bg-muted/40"
                        key={livro.id}
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar text={livro.titulo} />
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {livro.titulo}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {livro.editora} - {livro.edicao}
                                {"a"} edicao
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex max-w-[260px] flex-wrap gap-1.5">
                            {livro.autores.length === 0 ? (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            ) : (
                              livro.autores.map(({ autor }) => (
                                <Badge key={autor.id} variant="outline">
                                  {autor.nome}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex max-w-[220px] flex-wrap gap-1.5">
                            {livro.assuntos.length === 0 ? (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            ) : (
                              livro.assuntos.map(({ assunto }) => (
                                <Badge key={assunto.id} variant="secondary">
                                  {assunto.descricao}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {livro.anoPublicacao}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {formatCurrency(livro.valor)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            <RowActionsMenu
                              deleteAction={deleteLivroAction.bind(
                                null,
                                livro.id
                              )}
                              deleteDescription={`Esta acao removera o livro "${livro.titulo}" do catalogo. Os vinculos com autores e assuntos tambem serao removidos.`}
                              deleteTitle="Excluir livro?"
                              editHref={editHref}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
