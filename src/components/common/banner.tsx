import { cva, type VariantProps } from "class-variance-authority"
import { AlertTriangle, CheckCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const bannerVatiants = cva(
	"border text-center flex items-center p-4 w-full",
	{
		variants: {
			variant: {
				warning: "border-yellow-30 bg-yellow-200/80 text-primary",
				success: "border-emerald-800 bg-emerald-700 text-secondary"
			}
		},
		defaultVariants: {
			variant: "warning"
		}
	}
)

interface BannerProps extends VariantProps<typeof bannerVatiants> {
	label: string
}

const iconMap = {
	warning: AlertTriangle,
	success: CheckCircleIcon
}

export const Banner = ({ label, variant }: BannerProps) => {
	const Icon = iconMap[variant || "warning"]

	return (
		<div className={cn(bannerVatiants({ variant }))}>
			<Icon className="w-4 h-4 mr-2" />
			{label}
		</div>
	)
}