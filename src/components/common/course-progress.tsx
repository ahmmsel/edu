import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
	value: number;
	variant?: "default" | "success";
	size?: "default" | "sm";
}

const colors = {
	default: "text-sky-700",
	success: "text-emerald-700"
}

const sizes = {
	default: "text-sm",
	sm: "text-xs"
}

export const CourseProgress = ({
	value,
	size,
	variant
}: CourseProgressProps) => {
	return (
		<div>
			<Progress value={value} className="h-2" variant={variant} />
			<p
				className={cn(
					"font-medium mt-2 text-sky-700",
					colors[variant || "default"],
					sizes[size || "default"]
				)}
			>
				{Math.round(value)} % Completed
			</p>
		</div>
	)
}