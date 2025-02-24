"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { source: "Direct", visits: 5400 },
  { source: "Search", visits: 4000 },
  { source: "Social", visits: 3200 },
  { source: "Email", visits: 2800 },
  { source: "Referral", visits: 2400 },
]

export function SourcesChart() {
  return (
    <ChartContainer
      config={{
        visits: {
          label: "Visits",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="w-full aspect-[2/1]"
    >
      <BarChart
        data={data}
        margin={{
          top: 16,
          right: 16,
          bottom: 16,
          left: 16,
        }}
      >
        <XAxis
          dataKey="source"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          stroke="hsl(var(--foreground))"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="hsl(var(--foreground))" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visits" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

