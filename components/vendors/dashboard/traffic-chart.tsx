"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan 1", visitors: 1200 },
  { date: "Jan 8", visitors: 1800 },
  { date: "Jan 15", visitors: 1600 },
  { date: "Jan 22", visitors: 2200 },
  { date: "Jan 29", visitors: 2800 },
  { date: "Feb 5", visitors: 2400 },
  { date: "Feb 12", visitors: 2900 },
]

export function TrafficChart() {
  return (
    <ChartContainer
      config={{
        visitors: {
          label: "Visitors",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="w-full aspect-[2/1]"
    >
      <LineChart
        data={data}
        margin={{
          top: 16,
          right: 16,
          bottom: 16,
          left: 16,
        }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          stroke="hsl(var(--foreground))"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="hsl(var(--foreground))" />
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="visitors" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ChartContainer>
  )
}

