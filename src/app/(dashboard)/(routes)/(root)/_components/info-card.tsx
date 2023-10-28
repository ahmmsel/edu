import { LucideIcon } from "lucide-react";

import { Badge } from "@/components/common/badge";

interface InfoCardProps {
	label: string;
	count: number;
	icon: LucideIcon;
	variant?: "default" | "success"
}

export const InfoCard = ({
	count,
	icon: Icon,
	label,
	variant
}: InfoCardProps) => {
	return (
		<div className="border rounded-md flex items-center gap-x-2 p-3">
			<Badge icon={Icon} variant={variant} />
			<div>
				<p className="font-medium">{label}</p>
				<p className="text-sm text-muted-foreground">{count} {count === 1 ? "Course" : "Courses"}</p>
			</div>
		</div>
	)
}