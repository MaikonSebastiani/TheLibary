import { BookOpen, Tag, Users, Wallet } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AcoesRapidas } from "@/features/dashboard/components/acoes-rapidas";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { LivrosPorDecadaChart } from "@/features/dashboard/components/livros-por-decada-chart";
import { LivrosRecentesCard } from "@/features/dashboard/components/livros-recentes-card";
import { TopBarChart } from "@/features/dashboard/components/top-bar-chart";
import { getDashboardOverview } from "@/features/dashboard/service";
import { formatCurrency } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { kpis, topAutores, topAssuntos, livrosRecentes, distribuicaoPorDecada } =
    await getDashboardOverview();

  return (
    <PageShell
      title="Visao geral"
      description="Indicadores do acervo, principais autores e assuntos, e atalhos para as acoes mais comuns."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          hint={
            kpis.livrosCoautorados > 0
              ? `${kpis.livrosCoautorados} ${kpis.livrosCoautorados === 1 ? "obra" : "obras"} com co-autoria`
              : "Nenhuma obra com co-autoria"
          }
          icon={BookOpen}
          label="Livros"
          value={kpis.totalLivros.toString()}
        />
        <KpiCard
          hint="Total cadastrados"
          icon={Users}
          label="Autores"
          value={kpis.totalAutores.toString()}
        />
        <KpiCard
          hint="Categorias do acervo"
          icon={Tag}
          label="Assuntos"
          value={kpis.totalAssuntos.toString()}
        />
        <KpiCard
          hint={
            kpis.totalLivros > 0
              ? `Media: ${formatCurrency(kpis.valorMedioLivro)}`
              : "Sem livros cadastrados"
          }
          icon={Wallet}
          label="Acervo"
          value={formatCurrency(kpis.valorTotalAcervo)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top autores</CardTitle>
            <CardDescription>
              Autores com maior numero de livros no acervo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topAutores.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum autor cadastrado.
              </p>
            ) : (
              <TopBarChart data={topAutores} unit="livro" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top assuntos</CardTitle>
            <CardDescription>
              Categorias com maior numero de livros vinculados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topAssuntos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum assunto cadastrado.
              </p>
            ) : (
              <TopBarChart data={topAssuntos} unit="livro" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LivrosRecentesCard livros={livrosRecentes} />
        </div>
        <AcoesRapidas />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Livros por decada</CardTitle>
          <CardDescription>
            Distribuicao do acervo conforme o ano de publicacao.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LivrosPorDecadaChart data={distribuicaoPorDecada} />
        </CardContent>
      </Card>
    </PageShell>
  );
}
