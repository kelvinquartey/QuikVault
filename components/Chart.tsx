"use client";

import {
  Label,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";

import { convertFileSize } from "@/lib/utils";

const chartConfig = {
  used: {
    label: "Used",
    color: "#ffffff",
  },
  remaining: {
    label: "Remaining",
    color: "rgba(255,255,255,0.18)",
  },
} satisfies ChartConfig;

interface ChartProps {
  used?: number;
  available?: number;
}

export const Chart = ({
  used = 0,
  available = 2 * 1024 * 1024 * 1024,
}: ChartProps) => {
  const percentage = Math.min(
    Number(((used / available) * 100).toFixed(1)),
    100
  );

  const chartData = [
    {
      name: "storage",
      used: percentage,
      remaining: 100 - percentage,
    },
  ];

  return (
    <Card className="chart">
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="chart-container"
        >
          <RadialBarChart
            data={chartData}
            innerRadius="99%"
            outerRadius="88%"
            startAngle={90}
            endAngle={-270}
            barSize={12}
            className="overflow-visible"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            <RadialBar
              dataKey="used"
              stackId="a"
              cornerRadius={0}
              fill="#ffffff" 
            />

            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={0}
              fill="rgba(255,255,255,0.3)"        
            />

            <Label
              content={({ viewBox }) => {
                if (
                  viewBox &&
                  "cx" in viewBox &&
                  "cy" in viewBox
                ) {
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
                        className="chart-total-percentage"
                      >
                        {percentage}%
                      </tspan>

                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="chart-subtitle"
                      >
                        Space used
                      </tspan>
                    </text>
                  );
                }

                return null;
              }}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title">
          Available Storage
        </CardTitle>

        <CardDescription className="chart-description">
          {convertFileSize(used)} /{" "}
          {convertFileSize(available)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};