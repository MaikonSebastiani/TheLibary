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
import { deleteAssuntoAction } from "../actions";

type AssuntoTableItem = {
  id: number;
  descricao: string;
  _count: {
    livros: number;
  };
};

type AssuntosTableProps = Readonly<{
  assuntos: AssuntoTableItem[];
  searchTerm?: string;
}>;

function pluralizarLivros(total: number) {
  return total === 1 ? "livro vinculado" : "livros vinculados";
}

export function AssuntosTable({ assuntos, searchTerm }: AssuntosTableProps) {
  const isSearching = Boolean(searchTerm && searchTerm.length > 0);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <CardTitle>Lista de assuntos</CardTitle>
        <ListSearch placeholder="Buscar assuntos..." />
      </CardHeader>

      <CardContent className="px-0">
        {assuntos.length === 0 ? (
          <div className="mx-4 rounded-xl border border-dashed border-border px-4 py-10 text-center sm:mx-6 sm:px-6">
            <p className="text-sm font-medium text-foreground">
              {isSearching
                ? "Nenhum assunto encontrado para esta busca."
                : "Nenhum assunto cadastrado."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSearching
                ? "Ajuste o termo informado ou limpe o campo de busca."
                : "Crie o primeiro assunto para classificar livros."}
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-3 px-4 sm:px-6 lg:hidden">
              {assuntos.map((assunto) => {
                const editHref = `/assuntos/${assunto.id}/editar` as Route;

                return (
                  <li
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 shadow-xs"
                    key={assunto.id}
                  >
                    <InitialsAvatar text={assunto.descricao} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {assunto.descricao}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{assunto.id} · {assunto._count.livros}{" "}
                        {pluralizarLivros(assunto._count.livros)}
                      </p>
                    </div>
                    <RowActionsMenu
                      deleteAction={deleteAssuntoAction.bind(null, assunto.id)}
                      deleteDescription={`Esta acao removera o assunto "${assunto.descricao}" do cadastro. Assuntos vinculados a livros nao poderao ser excluidos.`}
                      deleteTitle="Excluir assunto?"
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
                      Assunto
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
                  {assuntos.map((assunto) => {
                    const editHref = `/assuntos/${assunto.id}/editar` as Route;

                    return (
                      <TableRow
                        className="border-border/60 hover:bg-muted/40"
                        key={assunto.id}
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar text={assunto.descricao} />
                            <span className="font-medium text-foreground">
                              {assunto.descricao}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          #{assunto.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {assunto._count.livros}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            <RowActionsMenu
                              deleteAction={deleteAssuntoAction.bind(
                                null,
                                assunto.id
                              )}
                              deleteDescription={`Esta acao removera o assunto "${assunto.descricao}" do cadastro. Assuntos vinculados a livros nao poderao ser excluidos.`}
                              deleteTitle="Excluir assunto?"
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
