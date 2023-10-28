"use client"

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Badge } from "./badge";
import { formatCurrency } from "@/lib/format-currency";
import { CourseProgress } from "@/components/common/course-progress";

interface CourseItemProps {
	id: string;
	title: string;
	imageUrl: string;
	price: number;
	progress: number | null;
	chaptersCount: number;
	category: string;

}

export const CourseItem = ({
	id,
	title,
	imageUrl,
	price,
	progress,
	category,
	chaptersCount
}: CourseItemProps) => {
	return (
		<Link href={`/courses/${id}`}>
			<div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
				<div className="relative w-full aspect-video rounded-md overflow-hidden">
					<Image 
						fill
						className="object-cover"
						src={imageUrl}
						alt={title}
					/>
				</div>
				<div className="flex flex-col pt-2">
					<div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
						{title}
					</div>
					<p className="text-xs text-muted-foreground">{category}</p>
					<div className="my-4 flex items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<Badge icon={BookOpen} size="sm" />
							<span>{chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}</span>
						</div>
					</div>
					{progress !== null ? (
						<CourseProgress value={progress} size="sm" variant={progress === 100 ? "success" : "default"} />
					): (
						<p>{formatCurrency(price)}</p>
					)}
				</div>
			</div> 
		</Link>
	)
}