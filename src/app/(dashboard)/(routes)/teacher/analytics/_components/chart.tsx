"use client"

import {
  Bar,
  BarChart,
	ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/components/ui/card";

interface ChartProps {
	data: { name: string; total: number }[]
}

export const Chart = ({
	data
}: ChartProps) => {
	return (
		<Card className="py-4">
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={data}>
					<XAxis 
						dataKey="name"
						tickLine={false}
						axisLine={false}
						fontSize={12}
						stroke="#888"
					/>
					<YAxis 
						tickLine={false}
						axisLine={false}
						fontSize={12}
						stroke="#888"
						tickFormatter={(value) => `$${value}`}
					/>
					<Bar 
						dataKey="total"
						fill="#0369a1"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Card>
	)
}