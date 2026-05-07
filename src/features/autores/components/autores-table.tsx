import { Pencil } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
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
import { DeleteAutorButton } from "./delete-autor-button";

type AutorTableItem = {
  id: number;
  nome: string;
  _count: {
    livros: number;
  };
};

type AutoresTableProps = Readonly<{
  autores: AutorTableItem[];
}>;

export function AutoresTable({ autores }: AutoresTableProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Autores cadastrados</CardTitle>
        <CardDescription>
          Consulte, edite ou remova autores que ainda nao estejam bloqueados
          por relacionamento.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {autores.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              Nenhum autor cadastrado.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie o primeiro autor para vincula-lo aos livros.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Livros vinculados</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autores.map((autor) => {
                const editHref = `/autores/${autor.id}/editar` as Route;

                return (
                  <TableRow key={autor.id}>
                    <TableCell className="font-medium">{autor.id}</TableCell>
                    <TableCell>{autor.nome}</TableCell>
                    <TableCell>{autor._count.livros}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={editHref}>
                            <Pencil className="size-4" />
                            Editar
                          </Link>
                        </Button>
                        <DeleteAutorButton
                          autorId={autor.id}
                          autorNome={autor.nome}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
