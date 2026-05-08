import type { Route } from "next";
import { InitialsAvatar } from "@/components/shared/initials-avatar";
import { ListSearch } from "@/components/shared/list-search";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
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
import { deleteAutorAction } from "../actions";

type AutorTableItem = {
  id: number;
  nome: string;
  _count: {
    livros: number;
  };
};

type AutoresTableProps = Readonly<{
  autores: AutorTableItem[];
  searchTerm?: string;
}>;

function pluralizarLivros(total: number) {
  return total === 1 ? "livro vinculado" : "livros vinculados";
}

export function AutoresTable({ autores, searchTerm }: AutoresTableProps) {
  const isSearching = Boolean(searchTerm && searchTerm.length > 0);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <CardTitle>Lista de autores</CardTitle>
        <ListSearch placeholder="Buscar autores..." />
      </CardHeader>

      <CardContent className="px-0">
        {autores.length === 0 ? (
          <div className="mx-4 rounded-xl border border-dashed border-border px-4 py-10 text-center sm:mx-6 sm:px-6">
            <p className="text-sm font-medium text-foreground">
              {isSearching
                ? "Nenhum autor encontrado para esta busca."
                : "Nenhum autor cadastrado."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSearching
                ? "Ajuste o termo informado ou limpe o campo de busca."
                : "Crie o primeiro autor para vincula-lo aos livros."}
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-3 px-4 sm:px-6 lg:hidden">
              {autores.map((autor) => {
                const editHref = `/autores/${autor.id}/editar` as Route;

                return (
                  <li
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 shadow-xs"
                    key={autor.id}
                  >
                    <InitialsAvatar text={autor.nome} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {autor.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{autor.id} · {autor._count.livros}{" "}
                        {pluralizarLivros(autor._count.livros)}
                      </p>
                    </div>
                    <RowActionsMenu
                      deleteAction={deleteAutorAction.bind(null, autor.id)}
                      deleteDescription={`Esta acao removera o autor "${autor.nome}" do cadastro. Autores vinculados a livros nao poderao ser excluidos.`}
                      deleteTitle="Excluir autor?"
                      editHref={editHref}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Autor
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Codigo
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Livros vinculados
                    </TableHead>
                    <TableHead className="px-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Acoes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autores.map((autor) => {
                    const editHref = `/autores/${autor.id}/editar` as Route;

                    return (
                      <TableRow
                        className="border-border/60 hover:bg-muted/40"
                        key={autor.id}
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar text={autor.nome} />
                            <span className="font-medium text-foreground">
                              {autor.nome}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          #{autor.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {autor._count.livros}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            <RowActionsMenu
                              deleteAction={deleteAutorAction.bind(
                                null,
                                autor.id
                              )}
                              deleteDescription={`Esta acao removera o autor "${autor.nome}" do cadastro. Autores vinculados a livros nao poderao ser excluidos.`}
                              deleteTitle="Excluir autor?"
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
