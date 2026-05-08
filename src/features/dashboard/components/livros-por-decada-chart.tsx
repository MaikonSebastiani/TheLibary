"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LivrosPorDecadaChartItem = {
  decada: string;
  total: number;
};

type LivrosPorDecadaChartProps = Readonly<{
  data: LivrosPorDecadaChartItem[];
}>;

export function LivrosPorDecadaChart({ data }: LivrosPorDecadaChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem dados suficientes para gerar o grafico.
      </p>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="decada"
            fontSize={12}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.75rem",
              fontSize: "12px",
            }}
            cursor={{ fill: "var(--color-accent)", opacity: 0.4 }}
            formatter={(value) => {
              const total = Number(value);
              return [
                `${total} ${total === 1 ? "livro" : "livros"}`,
                "Total",
              ];
            }}
          />
          <Bar
            dataKey="total"
            fill="var(--color-primary)"
            maxBarSize={48}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
