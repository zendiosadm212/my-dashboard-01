"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Customer } from "@/modules/customers/services/types/customer-types"

interface CustomerDashboardChartsProps {
  customers: Customer[]
}

const GENDER_COLORS = {
  male: "var(--color-male)",
  female: "var(--color-female)",
}

const genderChartConfig = {
  count: {
    label: "Số lượng",
  },
  male: {
    label: "Nam",
    color: "hsl(217, 91%, 60%)",
  },
  female: {
    label: "Nữ",
    color: "hsl(330, 81%, 60%)",
  },
} satisfies ChartConfig

const CITY_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(330, 81%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(0, 84%, 60%)",
  "hsl(187, 85%, 43%)",
  "hsl(45, 93%, 47%)",
  "hsl(280, 65%, 60%)",
  "hsl(160, 60%, 45%)",
]

const extractCity = (address: string) => {
  if (!address || !address.trim()) return "Chưa cập nhật"
  const parts = address.split(",")
  return parts[parts.length - 1].trim()
}

export function CustomerDashboardCharts({
  customers,
}: CustomerDashboardChartsProps) {
  // Gender distribution data
  const genderData = useMemo(() => {
    const male = customers.filter((c) => c.gender === "male").length
    const female = customers.filter((c) => c.gender === "female").length
    return [
      { name: "Nam", value: male, fill: "var(--color-male)" },
      { name: "Nữ", value: female, fill: "var(--color-female)" },
    ]
  }, [customers])

  // City/Province distribution data
  const cityData = useMemo(() => {
    const cityMap: Record<string, number> = {}
    customers.forEach((c) => {
      const city = extractCity(c.address || "")
      cityMap[city] = (cityMap[city] || 0) + 1
    })
    return Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [customers])

  const cityChartConfig = useMemo(() => {
    const config: ChartConfig = {
      count: { label: "Số lượng" },
    }
    cityData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: CITY_COLORS[index % CITY_COLORS.length],
      }
    })
    return config
  }, [cityData])

  const totalCustomers = customers.length

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Gender Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Phân bố giới tính</CardTitle>
          <CardDescription>
            Tỷ lệ nam/nữ trong danh sách khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={genderChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {genderData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.name === "Nam"
                        ? GENDER_COLORS.male
                        : GENDER_COLORS.female
                    }
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCustomers}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Khách hàng
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            {genderData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      entry.name === "Nam"
                        ? genderChartConfig.male.color
                        : genderChartConfig.female.color,
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}: {entry.value} ({totalCustomers > 0 ? Math.round((entry.value / totalCustomers) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* City Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tỉnh / Thành phố</CardTitle>
          <CardDescription>
            Phân bố khách hàng theo khu vực
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={cityChartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart
              data={cityData}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fontSize: 12 }}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {cityData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      CITY_COLORS[index % CITY_COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
