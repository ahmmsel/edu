import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatCurrency } from "@/lib/format-currency"

interface DataCardProps {
	label: string;
	value: number;
	format?: boolean;
}

export const DataCard = ({
	label,
	value,
	format
}: DataCardProps) => {
	return (
		<Card>
			<CardHeader className="flex flex-row space-y-0 items-center justify-between pb-4">
				<CardTitle className="font-medium text-sm">{label}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">
					{format ? formatCurrency(value) : value}
				</div>
			</CardContent>
		</Card>
	)
}