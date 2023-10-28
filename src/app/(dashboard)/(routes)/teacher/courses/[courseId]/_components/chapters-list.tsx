"use client"

import { useHydration } from "@/hooks/use-hydration"
import { Chapter } from "@prisma/client"
import { useEffect, useId, useState } from "react"
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult
} from "@hello-pangea/dnd"
import { Grip, Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export const ChaptersList = ({
	onEdit,
	onReorder,
	items
}: {
	onEdit: (id: string) => void,
	onReorder: (updateData: { id: string, position: number }[]) => void,
	items: Chapter[]
}) => {
	const [chapters, setChapters] = useState(items)
	// Generate Unique ID
	const droppableId = useId()

	const { isMounted } = useHydration()

	useEffect(() => {
		setChapters(items)
	}, [items])

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(chapters)
		const [reorderItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderItem)

		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)

		const updated = items.slice(startIndex, endIndex + 1)

		setChapters(items)

		const updatedData = updated.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex(item => item.id === chapter.id)
		}))

		onReorder(updatedData)
	}

	if (!isMounted) {
		return null
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={droppableId}>
					{(provider) => (
						<div {...provider.droppableProps} ref={provider.innerRef}>
							{chapters.map((chapter, index) => (
								<Draggable 
									key={chapter.id}
									draggableId={chapter.id}
									index={index}
								>
									{(provider) => (
										<div 
											className={cn(
												"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mt-2 mb-4 text-sm",
												chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
											)}
											ref={provider.innerRef}
											{...provider.draggableProps}
										>
											<div
												className={cn(
													"px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
													chapter.isPublished && "border-r-sky-200 hover:bg-sky-200",
												)}
												{...provider.dragHandleProps}
											>
												<Grip
													className="w-4 h-4"
												/>
											</div>
											{chapter.title}
											<div className="ml-auto pr-2 flex items-center gap-x-2">
												{chapter.isFree && (
													<Badge>
														Free
													</Badge>
												)}
												<Badge
													className={cn(
														"bg-slate-500",
														chapter.isPublished && "bg-sky-700"
													)}
												>
													{chapter.isPublished ? "Published" : "Draft" }
												</Badge>
												<Pencil 
													onClick={() => onEdit(chapter.id)}
													className="w-4 h-4 hover:opacity-75 transition"
													role="button"
												/>
											</div>
										</div>
									)}
								</Draggable>
							))}
							{provider.placeholder}
						</div>
					)}
			</Droppable>
		</DragDropContext>
	)
}