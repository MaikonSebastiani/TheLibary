"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopBarChartItem = {
  id: number;
  label: string;
  total: number;
};

type TopBarChartProps = Readonly<{
  data: TopBarChartItem[];
  unit?: string;
}>;

export function TopBarChart({ data, unit = "livro" }: TopBarChartProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          barCategoryGap="22%"
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
        >
          <XAxis
            allowDecimals={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="label"
            fontSize={12}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
            type="category"
            width={150}
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
                `${total} ${total === 1 ? unit : `${unit}s`}`,
                "Total",
              ];
            }}
          />
          <Bar
            dataKey="total"
            fill="var(--color-primary)"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
